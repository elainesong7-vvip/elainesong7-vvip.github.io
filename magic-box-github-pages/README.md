# Magic Box H5 — GitHub Pages Ready

A static, mobile-first H5 prototype. No npm, framework, backend or build step is required.

## Structure

```text
magic-box-github-pages/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── favicon.svg
├── .nojekyll
└── assets/
    ├── backgrounds/
    │   ├── home-bg.webp
    │   └── home-bg.jpg
    ├── sprites/
    │   ├── magic-box.webp
    │   └── magic-box.png
    └── ui/
        ├── orb.svg
        └── icons/*.svg
```

## GitHub Pages deployment

1. Create a new GitHub repository, for example `magic-box`.
2. Upload **all files and folders in this directory to the repository root**.
3. Commit and push to the `main` branch.
4. Go to **Repository → Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch **main** and folder **/(root)**, then Save.
7. GitHub will publish it at a URL similar to:
   `https://YOUR-USERNAME.github.io/magic-box/`

All asset URLs are relative (`./assets/...`), so the app works correctly under a GitHub Pages repository subpath.

## Responsive background strategy

`home-bg.webp` is composed with a safe central focal area. CSS uses `background-size: cover` and responsive `background-position` so it can adapt to narrow mobile screens, taller phones, landscape devices, tablets and desktop previews without placing UI-critical detail near the crop edges.

The actual UI is HTML/CSS rather than baked into the background image, so it remains sharp and reflows at different resolutions.

## Local preview

You can double-click `index.html`, or run a static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Current prototype features

- Responsive minimalist lobby
- Separate Magic Box transparent sprite
- Separate reusable background image
- Separate SVG UI/icon assets
- Wish notes and photo upload
- 15-minute meditation timer
- Gratitude journal
- Golden orb / monthly star counters
- Notice preference toggle
- Browser `localStorage` persistence

`localStorage` is device/browser-local only. Account sync can be added later with a backend such as Supabase or Firebase.
