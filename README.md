## CoreMedia Frontend Workspace

# Teaser Layout Exercise

This implementation introduces a configurable teaser layout with a clear separation of responsibilities between layout orchestration and content rendering.

## Overview

The solution is composed of three main FreeMarker components:

1. **Container.asTeaser[jorgeTestLayout].ftl**
2. **CMTeasable.asjorgeTestLayout.ftl**
3. **CMTeasable.asjorgeHighlight.ftl**

Each component has a well-defined role to keep the implementation modular, readable, and easy to extend.

---

## 1. Container.asTeaser[jorgeTestLayout]

The container acts as the **layout orchestrator**.

### Responsibilities

- Reads layout-related settings:
  - `layout.columns` (default: 2)
  - `max.items` (default: 6)
- Builds a Bootstrap-based grid (rows and columns).
- Iterates over container items and decides which view to render:
  - The first item is rendered as a highlight (`asjorgeHighlight`).
  - Remaining items use the standard teaser view (`asjorgeTestLayout`).
- Handles empty containers and invalid settings safely.

The container does **not** render content itself — it only organizes structure and delegates rendering to the views.

---

## 2. CMTeasable.asjorgeTestLayout

This template represents the **standard teaser view**.

### Responsibilities

- Renders image, title, teaser text, and optional CTA.
- Uses `cm.getLink(self)` and `utils.optionalLink` to make image and title clickable when applicable.
- Truncates teaser text using a page-level setting:
  - `teaser.max.length` (default: 140)
- Provides fallbacks for missing image, title, or teaser text.

This view has no knowledge of grid or layout logic.

---

## 3. CMTeasable.asjorgeHighlight

This template represents the **highlight teaser variant**, used for the first item in the container.

### Responsibilities

- Renders the same base content as the standard teaser, with a stronger visual emphasis.
- Supports dedicated settings:
  - `highlight.teaser.max.length` (default: 260)
  - `highlight.teaser.label`
  - `highlight.teaser.picture.view`
- Uses a larger heading level and dedicated CSS classes for styling.
- Keeps layout concerns outside of the view.

---

## Design Principles

- Clear separation of responsibilities between container and views
- Configuration-driven behavior via CoreMedia settings
- Safe defaults and fallbacks to avoid rendering errors
- Modular structure that allows easy extension (e.g. additional teaser variants)

---

## Possible Next Steps

- Extract shared logic (media block, headline, CTA) into small FreeMarker macros to reduce duplication between teaser views.
- Align CSS class naming between standard and highlight teasers if needed.
- Add additional teaser variants without changing container logic.

---

This setup demonstrates a scalable and maintainable approach to rendering teaser-based layouts in CoreMedia.
