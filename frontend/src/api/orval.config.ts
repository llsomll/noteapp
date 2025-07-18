import { defineConfig } from 'orval'

export default defineConfig({
  medictemplate: {
    input: {
      target: 'http://localhost:8000/openapi.json', // FastAPI OpenAPI schema URL
    },
    output: {
      mode: 'tags', // Organize output by OpenAPI tags (e.g., note.ts, user.ts)
      workspace: './api-client', // Folder for all generated files
      target: './template.ts', // where the main API client will go
      schemas: './model', // Where to put shared TS types
      client: 'react-query', // Generate React Query hooks
      prettier: true,
      override: {
        mutator: {
          path: '../api-config.ts', // Relative path to axios instance
          name: 'customInstance',
        },
      },
    },
  },
})
