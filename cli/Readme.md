# Simple PulkitXM CLI Setup Guide

This guide explains how to set up and use the simple CLI tool.

## Quick Setup

1. Create a directory for your CLI:
```bash
mkdir pulkitxm-cli
cd pulkitxm-cli
```

2. Create the two required files:
   - Save the CLI code as `cli.js`
   - Save the package.json content as `package.json`

3. Make the CLI script executable (on Linux/Mac):
```bash
chmod +x cli.js
```

4. Test the CLI locally:
```bash
node cli.js
```

## Testing with npx

To test as if it were installed with npx:

1. Link the package locally:
```bash
npm link
```

2. Run the command:
```bash
pulkitxm
```

3. When you're done testing, unlink:
```bash
npm unlink pulkitxm
```

## Publishing

When you're ready to publish:

```bash
npm login
npm publish
```

After publishing, users can run:
```bash
npx pulkitxm
```

## Notes

- No external dependencies are used in this version
- Only Node.js built-in modules are used:
  - `https` for API requests
  - `readline` for interactive CLI
- The CLI will display all profile information in plain text
- Simple error handling is included

This minimal approach avoids any potential package compatibility issues and makes the CLI extremely portable.