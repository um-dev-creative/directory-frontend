---
name: pr-description
description: Generate a clear PR description with summary, changes, motivation, and test plan. Use when asked to "write a PR description", "describe this PR", "generate PR body", or before creating a pull request.
model: claude-haiku-4-5-20251001
---

## Steps

Run these commands **in parallel**:
- `git log development..HEAD --oneline`
- `git diff --stat development...HEAD`

If no commits appear, say: "No commits detected on this branch relative to development." and stop.

If there are commits, read only the files that changed (use `git show <file>` or Read) — **do not run `git diff` without `--stat`**.

## Output

Write a PR description with exactly these three sections:

```
## Summary
[2 sentences max: what changed and why — fold motivation into this]

## Changes
- [3–5 bullets grouping related changes, not listing every file]

## Test Plan
- [3 bullets: what to verify, how, and one edge case]
```

Rules: conversational tone, no fluff, no ticket numbers, imperative verbs in bullets.

Save the result to `.pr-description.md` using the Write tool.
