---
name: styling
description: Guidelines for styling and theming in this project. Load when working on styles, CSS variables, design tokens, fonts, light/dark theme, or creating/modifying CSS Module files or `app/styles/theme.css`.
---
# Styling

## Theme

- Define global theme and design tokens in `app/styles/theme.css`.
- Use semantic CSS variable names rather than names based on appearance. For example, use `--color-primary` instead of `--color-blue`.

### Required CSS variables

These CSS variables are mandatory and must be included in `theme.css` with the specified naming conventions:

- Color: `--color-{word}-{*}` (e.g., `--color-primary`, `--color-secondary`, `--color-text-muted`, etc.).
- Font Family: `--family-{*}` (e.g., `--family-display`, `--family-body`, etc.).

### Optional CSS variables

These variables are not required, but if you choose to include them, they must follow the specified naming conventions:

- Spacing: `--space-{*}`
- Font Size: `--text-{*}`
- Font (shorthand): `--font-{*}`
- Border Radius: `--radius-{*}`
- Shadow: `--shadow-{*}` and `--inner-shadow-{*}`

If needed, you may add additional CSS variables or rules to `theme.css`.

# Light/Dark theme support

- If the user explicitly requests light/dark theme support, use `@dazl/color-scheme`. Refer to the Dazl documentation for up-to-date information about this library.
- Do not remove `@dazl/color-scheme` from the project or its initialization script from `app/root.tsx`, even if only one theme is implemented. Dazl relies on its presence to detect missing theme support.

## Initial app generation

When generating a new application, remember to:

- Define one theme only: either light or dark. Define both themes only if the user explicitly requests them.
- Use Google Fonts unless explicitly instructed otherwise.
- Load external fonts by adding links to the `links` export in `app/root.tsx`. Avoid using CSS `@import` to load fonts.
- Choose fonts that best fit the application, but avoid overused font families, such as Inter, Roboto, Open Sans, Poppins, etc.; opt instead for distinctive font choices that elevate the frontend's aesthetics.
- Ensure that you do not duplicate any "reset" styles in `global.css` that are already defined in `reset.css`. Read `reset.css` first to avoid this.