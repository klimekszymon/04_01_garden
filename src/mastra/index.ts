
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, DefaultExporter, SensitiveDataFilter } from '@mastra/observability';
import { resolve } from 'node:path'
import { Workspace, LocalFilesystem, LocalSandbox } from '@mastra/core/workspace'
import { devAssistant } from './agents/dev-assistant.js'
import { backendAgent } from './agents/backend-agent.js'
import { frontendAgent } from './agents/frontend-agent.js'
import { devopsAgent } from './agents/devops-agent.js'
import { prReviewAgent } from './agents/pr-review-agent.js'
import { featureDevWorkflow } from './workflows/feature-dev-workflow.js'

const workspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: resolve(import.meta.dirname, '../../workspace') }),
  sandbox: new LocalSandbox({ workingDirectory: resolve(import.meta.dirname, '../../workspace') }),
  skills: ['skills'],
  bm25: true,
  autoIndexPaths: ['docs', 'src'],
})

export const mastra = new Mastra({
  workspace,
  // workflows: { weatherWorkflow },
  // weatherAgent,
  agents: { devAssistant, backendAgent, frontendAgent, devopsAgent, prReviewAgent },
  workflows: { featureDevWorkflow },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db",
    }),
    domains: {
      observability: await new DuckDBStore().getStore('observability'),
    }
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new DefaultExporter(), // Persists traces to storage for Mastra Studio
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});
