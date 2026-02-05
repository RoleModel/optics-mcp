interface ToolMetadata {
  name: string
  title: string
  description: string
  uri?: string
  mimeType?: string
  role?: string
}

interface ToolInputSchema {
  [key: string]: any
}

class Tool {
  name: string = '';
  title: string = '';
  description: string = '';
  uri?: string;
  mimeType?: string;
  role?: string;

  /**
   * Example:
   * { tokenName: z.string().describe('The name of the design token (e.g., "color-primary", "spacing-md")') }
   */
  inputSchema: ToolInputSchema = {};

  get metadata(): ToolMetadata {
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      ...(this.uri !== undefined && { uri: this.uri }),
      ...(this.mimeType !== undefined && { mimeType: this.mimeType }),
      ...(this.role !== undefined && { role: this.role }),
    }
  }

  async handler(args: any): Promise<string> {
    throw new Error('Subclass should override')
  }
}

export default Tool

export { ToolMetadata, ToolInputSchema }
