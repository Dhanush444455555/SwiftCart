---
description: Pull from remote, resolve any conflicts, then push to origin
---

# Git Push Workflow (always pull first)

Run from the SwiftCart repo root: `c:\Users\dhanu\OneDrive\Documents\SwiftCart\SwiftCart`

1. Stage all local changes
```powershell
git add .
```

2. Commit if there are staged changes (use a descriptive message)
```powershell
git commit -m "<your message here>"
```

3. Pull from remote (may cause conflicts)
```powershell
git pull
```

4. If there are merge conflicts:
   - For auto-generated files like `package-lock.json`, accept the remote version:
     ```powershell
     git checkout --theirs <conflicting-file>
     git add <conflicting-file>
     ```
   - For source files, manually resolve conflicts (fix `<<<<<<`, `=======`, `>>>>>>>` markers), then `git add` them.
   - Commit the merge:
     ```powershell
     git commit -m "Merge remote changes: resolve conflicts"
     ```

5. Push to remote
```powershell
git push
```
