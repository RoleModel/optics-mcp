# Contributing to Optics MCP Server

Thank you for your interest in contributing to the Optics MCP Server! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the GitHub issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node version, OS, etc.)

### Adding Design Tokens

To add new design tokens from the Optics design system:

1. Fork the repository
2. Edit `src/optics-data.ts`
3. Add tokens to the `designTokens` array following this structure:

```typescript
{
  name: 'token-name',
  value: 'token-value',
  category: 'category-name',
  description: 'Clear, concise description'
}
```

4. Ensure the category is one of: `color`, `spacing`, `typography`, `border`, `shadow`
5. Run tests: `npm test`
6. Build: `npm run build`
7. Submit a pull request

### Adding Components

To add a new component:

1. Edit `src/optics-data.ts`
2. Add to the `components` array:

```typescript
{
  name: 'ComponentName',
  description: 'Component description',
  tokens: ['token-1', 'token-2', ...],
  usage: 'Usage guidelines',
  examples: ['<example code>']
}
```

3. Ensure all referenced tokens exist
4. Run tests and build
5. Submit a pull request

### Adding Documentation

To add or update documentation sections:

1. Edit `src/optics-data.ts`
2. Add/update in the `documentation` array:

```typescript
{
  section: 'section-id',
  title: 'Section Title',
  content: 'Detailed content...',
  tokens: ['related-token-1', ...]
}
```

3. Update resource handlers if adding new URI patterns
4. Submit a pull request

### Adding New Tools

To add a new MCP tool:

1. Edit `src/index.ts`
2. Add tool definition in `ListToolsRequestSchema` handler
3. Implement tool logic in `CallToolRequestSchema` handler
4. Add examples to `EXAMPLES.md`
5. Update README if necessary
6. Submit a pull request

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/optics-mcp.git
   cd optics-mcp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Test**
   ```bash
   npm test
   ```

5. **Watch Mode** (for development)
   ```bash
   npm run watch
   ```

## Code Style

- Use TypeScript for all code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

## Testing

Before submitting a PR:

1. Run existing tests: `npm test`
2. Manually test any new functionality
3. Verify the server starts: `npm start`
4. Test with an MCP client if possible

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code style guidelines
   - Add/update tests as needed
   - Update documentation

3. **Commit**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use a clear title
   - Describe what changes were made and why
   - Reference any related issues
   - Ensure CI checks pass

## Code Review

- Be patient and respectful during review
- Address feedback constructively
- Make requested changes in new commits
- Once approved, your PR will be merged

## Documentation

When adding features:

- Update README.md if user-facing
- Add examples to EXAMPLES.md
- Update ARCHITECTURE.md for structural changes
- Add inline code comments for complex logic

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with your question

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on what's best for the community
- Show empathy towards others

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- Git commit history
- Release notes (for significant contributions)
- Project documentation (for major features)

Thank you for contributing to Optics MCP Server!
