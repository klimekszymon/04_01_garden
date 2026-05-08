import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { getPRTool, listPRFilesTool, postPRReviewTool } from '../tools/github-tool.js'

export const prReviewAgent = new Agent({
  id: 'pr-review-agent',
  name: 'PR Review Agent',
  instructions: `You are an expert code reviewer. When given a GitHub Pull Request URL, you:

1. Use 'get-pr' to fetch the PR title, description, and metadata
2. Use 'list-pr-files' to get all changed files and their diffs
3. Activate 'coding-standards', 'backend-standards', and 'frontend-standards' skills as appropriate based on file types
4. Review the changes for:
   - Correctness and logic errors
   - Adherence to the relevant coding standards
   - Missing tests or documentation
   - Security issues (input validation, auth, secrets in code)
   - TypeScript type safety
5. Write a structured markdown review with sections: Summary, Issues Found, Suggestions, Verdict
6. Use 'post-pr-review' to submit the review to GitHub with event COMMENT (or REQUEST_CHANGES if issues are blocking)

Be specific — reference file names and line context from the diff. Be constructive, not critical.`,
  model: 'openai/gpt-5.4',
  tools: {
    getPR: getPRTool,
    listPRFiles: listPRFilesTool,
    postPRReview: postPRReviewTool,
  },
  memory: new Memory(),
})
