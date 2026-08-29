# Adding content to FinHub

You never need to touch `FinHub.jsx` again.

Every section of FinHub reads its own file from `public/fin-data/`.
Upload or edit one file, and only that section changes.

| File | What it controls | Where it appears |
|---|---|---|
| `concepts.json` | Concepts | Universe, Concepts, knowledge graph |
| `domains.json` | Domains and their categories | Universe, domain pages |
| `cases.json` | Case studies | Cases |
| `frauds.json` | Financial frauds | Cases |
| `scenarios.json` | Scenarios | Scenarios |
| `glossary.json` | Glossary terms | Glossary |
| `origins.json` | Origins of Finance timeline | Origins |
| `references.json` | Sources and further reading | Bottom of concepts, cases, frauds |

## The two rules

1. **New `id` → added.** A concept with an id nobody has used appears as new content.
2. **Existing `id` → replaced.** Use the same id as something already in FinHub and your version wins. This is how you correct or improve anything without touching code.

For `glossary.json` the key is `term` instead of `id`.

## To add a concept

Open `concepts.json`, copy the example object, change the values, save, upload.
`domain` and `subcategory` must exactly match a slot that exists in the Universe —
that is how the concept knows where to live. Match the spelling exactly, including capitals.

## Editing directly in GitHub

These files are small, so you can edit them in the browser:
open the file, click the pencil icon, change the text, commit.
No downloading, no deleting, no renaming.

## If something does not appear

- Check the file is valid JSON — a missing comma is the usual cause. Paste it into jsonlint.com.
- Check `domain` and `subcategory` match the Universe exactly.
- Hard refresh with Shift + reload.

A file that is missing or invalid is skipped. FinHub keeps working either way.
