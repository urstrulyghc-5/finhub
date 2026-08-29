# FinHub

**The financial universe, clearly connected.**

FinHub is a structured financial knowledge platform. It organises finance into one
connected hierarchy — domain, category, concept — and makes the relationships between
concepts visible, so ideas are learned in context rather than in isolation.

Live site: `https://<your-username>.github.io/finhub/`

---

## What is inside

- **The Finance Universe** — an interactive map. Choose a domain, open a category,
  open a concept. Every node is a control.
- **Concept Explorer** — each concept runs from definition through mechanism, formula,
  worked example, application, limits and common misconceptions.
- **Knowledge graph** — relationships are declared in the content and drawn from it,
  never hand-maintained.
- **Case studies, frauds and scenarios** — how the concepts behave in reality.
- **Glossary, tools and a guide** — supporting layers, all reading the same data.

## Principles

- Complexity inside, clarity outside.
- Simplify the explanation, never the financial truth.
- Nothing presented as functional that does not work.
- Light-first, spacious, responsive by design, reduced-motion respected.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL.

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  FinHub.jsx    # content data layer + design system + all views
  main.jsx      # entry point
  index.css     # page reset
```

The content data layer at the top of `FinHub.jsx` holds domains, concepts, case studies,
frauds, scenarios, glossary entries and tools. Adding a concept means adding one object —
the views, search index and knowledge graph pick it up automatically.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.
The `base` in `vite.config.js` must match the repository name.

---

Idea & design curated by **G. Hari Charan** — [LinkedIn](https://www.linkedin.com/in/gharicharan/)

Educational content only. Nothing here is investment advice.
