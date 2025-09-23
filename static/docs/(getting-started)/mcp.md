MCP is an open protocol that standardizes how applications provide context to LLMs.

## Installation

### 1.

### 2. Configure MCP

Windsurf
Cursor
Claude
Cline

Add the following code to your `mcp_config.json` file:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://reui.io/r/registry.json"
      }
    }
  }
}
```

Add the following code to your `mcp.json` file:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://reui.io/r/registry.json"
      }
    }
  }
}
```

Add the following code to your MCP config file:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://reui.io/r/registry.json"
      }
    }
  }
}
```

Add the following code to your MCP config file:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://reui.io/r/registry.json"
      }
    }
  }
}
```

### 3. Restart IDE

Restart your IDE to apply the changes.

## Usage

You can now ask your IDE to use any Magic UI component. Here are some examples:

- "Add address form"
- "Add accordion menu"
- "Add alert with close button"
- "Add button with icon"
- "Add card with image and title"
- "Add checkbox with label"
