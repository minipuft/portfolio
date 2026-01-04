# Content Rules

Standards for MDX content and frontmatter in this portfolio.

## Project Frontmatter Schema

Every project MDX file MUST include:

```yaml
---
title: "Project Name"                    # Required
description: "One-line description"      # Required
slug: "project-slug"                     # Required, URL-safe
featured: true                           # Required, boolean
order: 1                                 # Required, display order
heroImage: "/projects/project-hero.jpg"  # Required, 16:9 ratio preferred
accentColor: "#7aa2f7"                   # Required, hex color for theming
technologies: ["React", "TypeScript"]    # Required, array of tech used
githubUrl: "https://github.com/..."      # Optional
liveUrl: "https://..."                   # Optional
status: "active"                         # Required: active | archived | wip
---
```

## Blog Post Frontmatter Schema

Every blog post MDX file MUST include:

```yaml
---
title: "Post Title"                      # Required
description: "One-line summary"          # Required
slug: "post-slug"                        # Required, URL-safe
publishedAt: "2024-01-15"                # Required, ISO date
updatedAt: "2024-01-20"                  # Optional, ISO date
tags: ["claude-code", "ai"]              # Required, for filtering
featured: false                          # Required, boolean
draft: false                             # Required, hides from listing if true
readingTime: 5                           # Optional, minutes (auto-calculated if omitted)
---
```

## Content Organization

```
content/
├── projects/
│   ├── claude-prompts-mcp.mdx
│   ├── mediaflow.mdx
│   └── spicetify-theme.mdx
└── blog/
    ├── building-mcp-server.mdx
    └── claude-code-setup.mdx
```

## Image Requirements

### Project Hero Images

| Property | Requirement |
|----------|-------------|
| Location | `/public/projects/{slug}/hero.{jpg,png,webp}` |
| Aspect ratio | 16:9 preferred |
| Minimum size | 1200x675px |
| Format | WebP preferred, fallback to JPG |

### Blog Images

| Property | Requirement |
|----------|-------------|
| Location | `/public/blog/{slug}/` |
| Alt text | Always required |
| Size | Optimize before commit |

## Accent Color Guidelines

Each project should have a distinct accent color:

| Project | Suggested Color | Notes |
|---------|-----------------|-------|
| claude-prompts-mcp | `#7aa2f7` | Blue, matches Claude branding |
| MediaFlow | `#9ece6a` | Green, suggests media/flow |
| Spicetify | `#1ed760` | Spotify green |

## Writing Style

### Project Descriptions

1. **First paragraph**: What it does (user benefit)
2. **Second paragraph**: Technical highlights (for devs)
3. **Third paragraph**: Challenges solved or learnings

### Blog Posts

1. **Hook**: Why should reader care?
2. **Problem**: What we're solving
3. **Solution**: How we solved it
4. **Takeaways**: What reader can apply

## MDX Components Available

Use these custom components in MDX:

```mdx
<Callout type="info">Important note here</Callout>

<CodeBlock language="typescript" filename="example.ts">
  // code here
</CodeBlock>

<ProjectLink href="/projects/other">Related Project</ProjectLink>

<TechStack technologies={["React", "TypeScript", "Node.js"]} />
```

## Validation Checklist

Before committing content:

- [ ] All required frontmatter fields present
- [ ] Slug is URL-safe (lowercase, hyphens only)
- [ ] Hero image exists at correct path
- [ ] Accent color is valid hex
- [ ] No draft posts accidentally published
- [ ] Images optimized (<200KB each)
