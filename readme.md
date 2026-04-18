# Molies Kafe

A small, slow café website. Single-page site with About, History, Menu, and Contact sections.

## Files

- `index.html` — Page structure and content
- `styles.css` — All styling, type system, layout, responsive rules
- `script.js` — Sticky header behavior + mobile nav

No build step. No dependencies. Just open it.

## Run locally

Open `index.html` directly in a browser, or serve it for cleaner reload behavior:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000.

## Edit the content

Copy and prices live in `index.html`. Each menu item follows this pattern:

```html
<div class="menu-item">
  <div class="menu-item-name">
    <span>Espresso</span>
    <span class="dots"></span>
    <span class="menu-price">8</span>
  </div>
  <div class="menu-item-desc">Single origin, rotating monthly.</div>
</div>
```

## Edit the look

Colors, fonts and spacing are CSS variables at the top of `styles.css`:

```css
:root {
  --bg:        #F4EEE3;   /* warm cream */
  --ink:       #1F1208;   /* near-black coffee */
  --accent:    #C8552B;   /* terracotta */
  --font-display: 'Fraunces', serif;
  --font-body:    'Manrope', sans-serif;
  /* ... */
}
```

Change those and the whole site reskins.

## Deploy

Push to GitHub, then connect the repo to one of:

- **Cloudflare Pages** — fast, free, global edge
- **Netlify** — drag-and-drop or Git connect
- **Vercel** — Git connect, instant deploys
- **GitHub Pages** — Settings → Pages → deploy from `main` branch

For all of them, the build command is empty and the publish directory is `/` (root).

## Next iterations to ask Claude Code for

- "Add a photo gallery between Menu and Contact, masonry layout."
- "Replace the contact section with a Google Maps embed of our address."
- "Add a sticky 'Order on Grab' button visible only on mobile."
- "Create an admin-free way to update menu items from a JSON file."
- "Convert this to a Next.js project with the same design and add an MDX blog."