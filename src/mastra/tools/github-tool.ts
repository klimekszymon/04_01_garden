import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

const GITHUB_API = 'https://api.github.com'

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN environment variable is required')
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function parsePRUrl(url: string): { owner: string; repo: string; number: number } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) throw new Error(`Invalid GitHub PR URL: ${url}`)
  return { owner: match[1], repo: match[2], number: Number(match[3]) }
}

export const getPRTool = createTool({
  id: 'get-pr',
  description: 'Fetches pull request metadata (title, body, author, base/head branches)',
  inputSchema: z.object({
    prUrl: z.string().url().describe('Full GitHub PR URL'),
  }),
  outputSchema: z.object({
    title: z.string(),
    body: z.string().nullable(),
    author: z.string(),
    baseBranch: z.string(),
    headBranch: z.string(),
    state: z.string(),
    url: z.string(),
  }),
  execute: async ({ context }) => {
    const { owner, repo, number } = parsePRUrl(context.prUrl)
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${number}`, {
      headers: githubHeaders(),
    })
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    const data = await res.json() as Record<string, unknown>
    return {
      title: data.title as string,
      body: (data.body as string | null) ?? null,
      author: (data.user as { login: string }).login,
      baseBranch: (data.base as { ref: string }).ref,
      headBranch: (data.head as { ref: string }).ref,
      state: data.state as string,
      url: data.html_url as string,
    }
  },
})

export const listPRFilesTool = createTool({
  id: 'list-pr-files',
  description: 'Lists all files changed in a pull request with their diffs',
  inputSchema: z.object({
    prUrl: z.string().url().describe('Full GitHub PR URL'),
  }),
  outputSchema: z.object({
    files: z.array(z.object({
      filename: z.string(),
      status: z.string(),
      additions: z.number(),
      deletions: z.number(),
      patch: z.string().optional(),
    })),
  }),
  execute: async ({ context }) => {
    const { owner, repo, number } = parsePRUrl(context.prUrl)
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${number}/files`, {
      headers: githubHeaders(),
    })
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    const data = await res.json() as Array<Record<string, unknown>>
    return {
      files: data.map((f) => ({
        filename: f.filename as string,
        status: f.status as string,
        additions: f.additions as number,
        deletions: f.deletions as number,
        patch: f.patch as string | undefined,
      })),
    }
  },
})

export const postPRReviewTool = createTool({
  id: 'post-pr-review',
  description: 'Posts a review comment on a GitHub pull request',
  inputSchema: z.object({
    prUrl: z.string().url(),
    body: z.string().describe('The review comment text (markdown supported)'),
    event: z.enum(['COMMENT', 'APPROVE', 'REQUEST_CHANGES']).default('COMMENT'),
  }),
  outputSchema: z.object({ reviewId: z.number(), submitted: z.boolean() }),
  execute: async ({ context }) => {
    const { owner, repo, number } = parsePRUrl(context.prUrl)
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${number}/reviews`, {
      method: 'POST',
      headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: context.body, event: context.event }),
    })
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    const data = await res.json() as Record<string, unknown>
    return { reviewId: data.id as number, submitted: true }
  },
})
