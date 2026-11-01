# Project Rules — Keep Project Folders Small

**Personal reference.** Copy this into each new project (or keep it outside git) as a
checklist for AI assistants and yourself. Goal: every project root stays lean —
source code only, no 5 GB build folders inside it.

---

## 1. Package Manager: pnpm (standard)

Always use **pnpm** for Node.js projects. Never `npm install` or `yarn install` by default.

### Why
- pnpm uses a global content-addressable store (`%LOCALAPPDATA%\pnpm\store` on Windows).
- Shared dependencies across projects are stored **once**, not copied into every `node_modules`.
- On Windows, enable **Developer Mode** so pnpm creates symlinks instead of file copies.

### One-time Windows setup

```powershell
# 1. Install pnpm globally
npm install -g pnpm

# 2. Enable Windows Developer Mode (Settings → System → For developers → On)
#    Required for pnpm symlinks on Windows without admin rights.

# 3. Verify
pnpm --version
```

### Per-project install

```powershell
pnpm install
```

If you get `ERR_PNPM_IGNORED_BUILDS`:

```powershell
pnpm approve-builds <package-names>
```

---

## 2. Rust / Tauri Builds (only when using Tauri)

Not every project uses Tauri. When it does, redirect the Rust build cache out of the project folder.

### Global Cargo target dir

Set once on the machine (Windows PowerShell profile `$PROFILE`):

```powershell
$env:CARGO_TARGET_DIR = "$env:USERPROFILE\.cargo-build-cache"
```

Then create the base folder:

```powershell
mkdir $env:USERPROFILE\.cargo-build-cache
```

### Effect
- `src-tauri/target/` is **not created inside the project**.
- Rust artifacts go to `~/.cargo-build-cache\` (shared across all Tauri projects).
- Project folder stays small.

### To clean Rust cache globally (rarely needed)

```powershell
cargo clean
# or
Remove-Item -Recurse -Force $env:USERPROFILE\.cargo-build-cache -ErrorAction SilentlyContinue
```

---

## 3. .gitignore (always include)

Commit this to every project so build output never enters version control:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*

# next.js
/.next/
/out/

# tauri (only if using Tauri)
/src-tauri/target/
/src-tauri/gen/schemas

# misc
*.log
.env*
*.tsbuildinfo
next-env.d.ts
```

---

## 4. Recommended `package.json` scripts

Add these cleanup scripts by default (optional but recommended):

```json
{
  "scripts": {
    "clean:node": "Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue",
    "clean:rust": "cd src-tauri && cargo clean",
    "clean:all": "Remove-Item -Recurse -Force node_modules, .next, out, src-tauri\\target -ErrorAction SilentlyContinue"
  }
}
```

> Note: `clean:node` / `clean:all` use PowerShell syntax. Adjust if you switch shells.

---

## 5. Lockfile

**Commit `pnpm-lock.yaml` to version control.**  
This ensures reproducible installs across machines and CI.

---

## 6. Per-Project New-Project Checklist

When starting a new project:

1. [ ] Initialize with `pnpm init` or your framework scaffold (Next.js, etc.)
2. [ ] Install deps with `pnpm install` (never `npm install`)
3. [ ] Add the `.gitignore` above
4. [ ] Commit `pnpm-lock.yaml`
5. [ ] If Tauri: set `$env:CARGO_TARGET_DIR` globally (one-time machine setup)
6. [ ] If Tauri: never `cargo build` inside the project expecting `src-tauri/target/` to stay there
7. [ ] Verify project root size stays under ~200 MB (source + lockfile only)

---

## 7. What AI Assistants Should NOT Do

- Do **not** suggest `npm install` unless the project specifically uses npm.
- Do **not** create `src-tauri/target/` inside the project folder.
- Do **not** commit `node_modules/`, `.next/`, `out/`, or `src-tauri/target/` to git.
- Do **not** suggest deleting `pnpm-lock.yaml` to "fix" install issues.

---

## 8. Maintenance (run occasionally)

```powershell
# Prune unused packages from the global pnpm store
pnpm store prune

# Clean Rust build cache (frees several GB, forces next build to recompile)
cargo clean
```

---

## 9. Example: Fresh Tauri + Next.js Project

```powershell
# 1. Scaffold
npx create-next-app@latest my-app --typescript
cd my-app

# 2. Switch to pnpm
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
pnpm install

# 3. Add Tauri (if needed)
npx tauri init

# 4. Set global Cargo target (one-time machine setup, not per-project)
$env:CARGO_TARGET_DIR = "$env:USERPROFILE\.cargo-build-cache"

# 5. Build desktop — Rust goes to global cache, not the project
npm run desktop:build
```

---

**Result:** Your project folder contains only source code, config, and lockfile (~100–200 MB). All build artifacts live in shared global caches outside the project.