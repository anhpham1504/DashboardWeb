type WebMcpTool = { name: string; title?: string; description: string; inputSchema: object; execute(input: unknown): unknown | Promise<unknown>; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean } };
interface Document { modelContext?: { registerTool(tool: WebMcpTool, options?: { signal?: AbortSignal }): void | Promise<void> } }
