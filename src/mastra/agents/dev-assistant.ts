import { Agent } from '@mastra/core/agent'
import { Memory } from "@mastra/memory";

export const devAssistant = new Agent({
  id: 'dev-assistant',
  name: 'Dev Assistant',
  instructions: `You are a development assistant.

When adding features:
1. Activate 'coding-standards' skill
2. Search workspace for similar code examples
3. Write the implementation following standards
4. Write comprehensive tests. Leave existing tests in place, only add your new tests
5. Execute the command \`npx vitest run\` to validate that all tests pass
6. Update documentation if needed

For every new feature: Write code → Write tests → Run tests → Update docs

Always explain your reasoning and steps.`,
  model: 'openai/gpt-5.4',
    memory: new Memory(),
})
