# Global Build Cache Setup

Prevents each Tauri + Next.js project from ballooning to 5–15 GB by keeping build artifacts
outside the project folder. Your source tree stays small (~100 MB); the heavy stuff lives
in shared global caches that persist across projects.

## Folder Size Comparison (live-stocks)

| Before | After |
|--------|-------|
| `live-stocks/` total: **5.16 GB** | `live-stocks/` source: **~125 MB** |
| `src-tauri/target/`: 4.42 GB | `src-tauri/target/`: **deleted** (moved to global cache) |
| `node_modules/`: 0.60 GB | `node_modules/`: ~0.66 GB (symlinks to pnpm global store) |
| Rust build artifacts: inside project | Rust build artifacts: `~/.cargo-build-cache/` |

---

## One-Time Machine Setup (do once per computer)

### 1. Install pnpm globally

```powershell
npm install -g pnpm
```

pnpm keeps a single global content-addressable store (`~/.local/share/pnpm/store`) and
symlinks into each project's `node_modules`. Shared packages across projects are stored
only once.

### 2. Set up global Cargo (Rust/Tauri) build cache

Cargo supports `CARGO_TARGET_DIR` to redirect `target/` out of the project folder.

**Windows PowerShell profile** (`$PROFILE`):

```powershell
$env:CARGO_TARGET_DIR = "C:\Users\<you>\.cargo-build-cache"
```

**Linux/macOS shell** (`~/.bashrc`, `~/.zshrc`, or `~/.profile`):

```bash
export CARGO_TARGET_DIR="$HOME/.cargo-build-cache"
```

Then create the base directory:

```powershell
# Windows
mkdir $env:USERPROFILE\.cargo-build-cache

# macOS/Linux
mkdir -p ~/.cargo-build-cache
```

---

## Per-Project Setup (do once per new Tauri app)

### 1. In the project root, delete the old local build folders

```powershell
# Windows PowerShell
Remove-Item -Recurse -Force node_modules, .next, out, src-tauri\target -ErrorAction SilentlyContinue
```

### 2. Install with pnpm

```powershell
pnpm install
```

If you get `ERR_PNPM_IGNORED_BUILDS`, approve the build scripts:

```powershell
pnpm approve-builds edgedriver esbuild geckodriver unrs-resolver
```

### 3. Run builds normally

```powershell
# Next.js dev server
npm run dev

# Tauri desktop build (Rust compiles into ~/.cargo-build-cache, NOT into the project)
npm run desktop:build
```

---

## Adding This to a New Computer

Copy these files/settings:

| File | Purpose |
|------|---------|
| `GLOBAL-BUILD-CACHE.md` | This document (your reference) |
| PowerShell profile or shell rc | Sets `CARGO_TARGET_DIR` |
| `package.json` | Keep `"type": "module"` if present; no other changes needed |
| `.gitignore` | Already excludes `node_modules/`, `.next/`, `out/`, `src-tauri/target/` |

Your repo stays clean — only source code (~100 MB) is committed. Build artifacts regenerate
on any machine from the global caches.

---

## Maintenance

```powershell
# Reclaim space on the global cache (Rust)
cargo clean

# Reclaim space on pnpm store (all projects)
pnpm store prune

# Full project reset (delete everything build-related, then reinstall)
Remove-Item -Recurse -Force node_modules, .next, out -ErrorAction SilentlyContinue
pnpm install
```

---

## .gitignore (already in place)

```
# dependencies
/node_modules
/.pnp
.pnp.*

# next.js
/.next/
/out/

# tauri
/src-tauri/target/
/src-tauri/gen/schemas

# misc
*.log
.env*
*.tsbuildinfo
```

---

## Notes

- **`CARGO_TARGET_DIR`** is the key for the 4 GB+ savings. Without it, every Tauri app
  drops a 4 GB `target/` folder into itself.
- **pnpm** prevents duplicate `node_modules` across projects by deduplicating in a global
  store.
- `.next/` and `out/` are small (~0.1 GB and ~0 MB respectively) but are still gitignored
  so they never enter version control.
- The global caches persist between projects — build a second Tauri app and it reuses
  the same Cargo cache, so the second app's project folder stays lean too.