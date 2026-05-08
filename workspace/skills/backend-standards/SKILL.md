# Backend Standards

You are a backend engineering expert. Apply these standards whenever writing or reviewing backend code.

## Runtime & Language
- Target: **Bun** (primary) or **Node.js 24**
- Language: **TypeScript** with `strict: true`
- Module system: ESM (`"type": "module"`, `.js` extensions in imports)
- Use top-level `await` where appropriate

## HTTP Server (Hono)
- Use **Hono** for HTTP servers — prefer `@hono/node-server` for Node.js 24
- Validate all request bodies with **Zod** before processing
- Return consistent error shapes: `{ error: string }` with appropriate status codes
- Use `streamSSE` from `hono/streaming` for server-sent events
- Apply CORS middleware at the top level

## Code Structure
- One responsibility per file — route handlers, business logic, and tools are separate
- Export a named `app` or router from each route file; import in `server.ts`
- Keep route files thin — delegate to service functions for anything beyond I/O

## Error Handling
- Always validate external input (request bodies, env vars) at the boundary
- Throw typed errors; catch at the route level and return structured responses
- Never leak stack traces to the client

## Environment Variables
- Read all config from `process.env` at startup
- Document every required variable in `.env.example`
- Fail fast with a clear message if a required variable is missing

## Testing
- Use **Bun's built-in test runner** (`bun test`)
- Test route handlers by calling `app.fetch()` directly — no server needed
- Cover: success path, validation errors, missing agent/workflow (503), auth failures
- Keep tests co-located in `src/tests/`

## References
- [testing-patterns.md](./references/testing-patterns.md)
