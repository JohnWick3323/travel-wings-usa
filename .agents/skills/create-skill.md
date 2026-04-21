---
name: create-skill
description: Guide for creating new agent skills in this project. Load when asked to create, add, or write a skill file.
---
# Creating Skills

Skills are Markdown files with YAML frontmatter that give agents specialized, reusable instructions for a specific domain or task.

## File Location

Place skill files in:

```
.agents/skills/<skill-name>.md
```

The filename should match the `name` field in the frontmatter (e.g., for `name: my-skill` file name should be `my-skill.md`).

## Frontmatter Schema

Every skill file must begin with a YAML frontmatter block containing exactly these two fields:

```yaml
---
name: <skill-name>
description: <skill-description>
---
```

### `name`

- **Max length:** 64 characters
- **Allowed characters:** lowercase letters (`a-z`), numbers (`0-9`), and hyphens (`-`)
- **Must not** start or end with a hyphen
- Examples: `styling`, `create-skill`, `react-router`

### `description`

- **Max length:** 1024 characters
- **Must not** be empty
- Describe what domain or task the skill covers and the conditions under which an agent should load it
- Start with the skill's purpose, then list the specific triggers (e.g., file types, user actions, topics)
- Example: `"Guidelines for styling and theming. Load when working on CSS variables, design tokens, or CSS Module files."`

## Body

The body is plain Markdown that follows the frontmatter block. It should contain the actual instructions, rules, patterns, and examples the agent needs to follow when the skill is active.

Guidelines for the body:

- Use `#` headings to organize sections
- Keep instructions specific and actionable; avoid vague advice
- Include code samples in fenced code blocks with a language tag when helpful
- Do not repeat information already covered by other skills; cross-reference them instead
