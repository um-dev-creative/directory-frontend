---
name: commit-msg
description: Generate a short, concise commit message based on staged or unstaged changes. Use when asked to "write a commit message", "suggest a commit", "what should I commit?", or "commit message for these changes".
model: claude-haiku-4-5-20251001
---

Run `git diff --staged` (and `git diff` if nothing is staged) to see what changed. Then generate a commit message following these rules:

## Rules

- **One line only** — no body, no bullet points, no explanation
- **50 chars or fewer** — hard limit
- **Imperative mood** — "Add", "Fix", "Remove", "Update", "Refactor" (not "Added" or "Adds")
- **No period at the end**
- **No ticket numbers, no co-authors, no metadata** unless the user asks
- **In the same language as the repo's existing commit history** — check with `git log --oneline -5`

## Output format

Print only the full git command, ready to copy-paste. No explanation, no labels, nothing else:

```
git commit -m "Verb what changed"
```

## How to pick the verb

| Change type | Verb |
|---|---|
| New file / feature | `Add` |
| Bug fix | `Fix` |
| Delete code/file | `Remove` |
| Update existing behavior | `Update` |
| Rename / move | `Rename` / `Move` |
| Refactor (no behavior change) | `Refactor` |
| Config / env / infra | `Configure` |
| Docs / README | `Document` |
| Dependencies | `Bump` |

## Steps

1. `git log --oneline -5` — check the language and style of existing commits
2. `git diff --staged` — see staged changes; if empty, run `git diff` instead
3. Identify the single most important change (not a list of everything)
4. Output one line: `git commit -m "<Verb> <what changed>"`

If the diff is empty (nothing staged, nothing modified), say: "No changes detected — nothing to commit."
