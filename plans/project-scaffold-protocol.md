# Project Scaffold Protocol

Reference document for AI-forward project initialization. Intended for implementation as a claude-prompts-mcp command/template.

---

## Protocol Overview

```
Phase 0: AI Development Setup
    ├── Create project directory structure
    ├── Write CLAUDE.md (project instructions)
    ├── Create docs/ with architecture diagrams
    └── Create .claude/rules/ with domain-specific rules

Phase 1: Framework Initialization
    ├── Initialize framework (Next.js, Python, Node, etc.)
    ├── Configure build tools and linting
    ├── Set up testing infrastructure
    └── Configure project-specific tooling

Phase 2: Core Systems Setup
    ├── Create foundational components/modules
    ├── Set up state management
    ├── Configure styling/theming
    └── Initialize git with clean commit

Phase 3: Content Preparation (User)
    ├── Prepare content/copy
    ├── Gather assets
    └── Define branding/messaging
```

---

## Phase 0: AI Development Setup

### 0.1 Directory Structure

```
project/
├── .claude/
│   └── rules/           # Project-specific rules
├── content/             # Content files (if applicable)
├── docs/
│   ├── ARCHITECTURE.md  # System diagrams and data flows
│   └── [SYSTEM].md      # Domain-specific docs (animation, color, etc.)
├── public/              # Static assets
└── CLAUDE.md            # Project instructions (root)
```

### 0.2 CLAUDE.md Template

```markdown
# [Project Name] - Development Standards

Brief description of what the project does.

**Extends**: `~/Applications/CLAUDE.md` (if applicable)

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development |
| `npm run build` | Production build |
| `npm run validate` | Full validation |

---

## Project Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | [Framework] | [Purpose] |
| Styling | [Tool] | [Purpose] |
| State | [Library] | [Purpose] |

### Directory Structure

[Project-specific structure]

---

## Key Patterns

[Document 2-3 critical patterns unique to this project]

---

## File Size Limits

| Type | Target | Max |
|------|--------|-----|
| Components | <200 | 300 |
| Utilities | <100 | 150 |

---

## Skill Invocation

| Context | Skill |
|---------|-------|
| [Language] work | `/[skill]` |
```

### 0.3 Rules Templates

**Component/Module Patterns** (`.claude/rules/component-patterns.md`):
- File structure conventions
- Naming conventions
- Size limits
- Import ordering

**Domain-Specific Rules** (e.g., `animation-rules.md`, `api-rules.md`):
- Tool/library usage patterns
- Performance requirements
- Required patterns and forbidden anti-patterns

**Content Rules** (if content-driven):
- Schema definitions
- Asset requirements
- Validation checklists

### 0.4 Documentation Templates

**ARCHITECTURE.md**:
- ASCII system diagrams
- Data flow diagrams
- Technology table
- Directory structure

**[SYSTEM].md** (domain-specific):
- Setup/configuration
- Usage patterns (with code examples)
- Best practices
- Common pitfalls

---

## Phase 1: Framework Initialization

### 1.1 Pre-Initialization Checklist

- [ ] Target framework identified
- [ ] Dependencies researched (compatibility verified)
- [ ] Build tooling decided
- [ ] Testing framework chosen

### 1.2 Framework Commands

| Framework | Init Command |
|-----------|--------------|
| Next.js | `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir` |
| Vite React | `npm create vite@latest . -- --template react-ts` |
| Node.js | `npm init -y && npm install typescript @types/node -D` |
| Python | `python -m venv .venv && pip install -r requirements.txt` |

### 1.3 Conflict Resolution

If init command conflicts with existing files:
1. Create in temp directory: `[framework]-temp/`
2. Merge framework files to project
3. Preserve: `.claude/`, `CLAUDE.md`, `docs/`, `content/`
4. Remove temp directory

### 1.4 Post-Init Configuration

- [ ] TypeScript strict mode enabled (if applicable)
- [ ] Linting configured
- [ ] Formatting configured (Prettier, Black, etc.)
- [ ] Path aliases set up

---

## Phase 2: Core Systems

### 2.1 Foundational Setup

| System | Priority | Description |
|--------|----------|-------------|
| Layout/Structure | P0 | Root layout, navigation, footer |
| Theming | P1 | Colors, typography, spacing |
| Animation | P2 | Motion system (if applicable) |
| State | P1 | Context/store setup |

### 2.2 Git Initialization

```bash
git init
git add .
git commit -m "feat: initialize [project] with [framework]

- Set up [framework] with TypeScript
- Configure [tooling]
- Add AI development documentation

🤖 Generated with Claude Code"
```

---

## Phase 3: Content Preparation

### 3.1 User Tasks (Parallel to Development)

| Task | Description |
|------|-------------|
| Bio/Copy | Short descriptions, taglines |
| Assets | Screenshots, images, videos |
| Branding | Colors, logos, messaging |
| Content | Blog posts, project descriptions |

### 3.2 Content Schema Checklist

- [ ] Frontmatter fields defined
- [ ] Asset paths established
- [ ] Validation rules documented

---

## Validation Checkpoints

### Checkpoint 0: AI Setup Complete

- [ ] CLAUDE.md written and comprehensive
- [ ] Rules created for key domains
- [ ] Architecture documented
- [ ] Directory structure established

### Checkpoint 1: Framework Ready

- [ ] `npm run dev` / equivalent works
- [ ] No TypeScript/lint errors
- [ ] Build completes successfully

### Checkpoint 2: Core Systems Ready

- [ ] Layout renders correctly
- [ ] Theming applies
- [ ] Navigation works
- [ ] Git repo initialized with clean history

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Dependency incompatibility | Research before install, have fallbacks |
| Init conflicts with existing files | Use temp directory merge strategy |
| SSR issues with client libraries | Ensure 'use client' directives |
| Large context / scope creep | Break into phases, validate each checkpoint |

---

## MCP Command Integration Notes

When implementing as claude-prompts-mcp command:

1. **Prompt should gather**:
   - Project name and location
   - Framework choice
   - Key features (theming, animation, content, etc.)
   - Target audience/purpose

2. **Chain structure**:
   ```
   >>scaffold_init --> >>scaffold_docs --> >>scaffold_framework --> >>scaffold_validate
   ```

3. **Variables to inject**:
   - `{{project_name}}`
   - `{{framework}}`
   - `{{location}}`
   - `{{features}}` (array)

4. **Gate conditions**:
   - After docs: Validate CLAUDE.md exists
   - After framework: Validate dev server starts
   - After validate: All checkpoints pass
