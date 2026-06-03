Summarize the current branch changes for this ticketing app.

1. Run `git diff main...HEAD --stat` and `git log main...HEAD --oneline` to see what changed.
2. Read the changed files to understand what was modified.
3. Write a short summary (3-5 bullet points) covering:
   - What feature or fix was implemented
   - Which layers were touched (frontend / backend / DB)
   - Any notable decisions or trade-offs visible in the diff
4. End with a one-sentence description suitable for a PR title.
