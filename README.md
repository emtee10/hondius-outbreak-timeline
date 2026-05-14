# Hondius Outbreak Timeline

This repository hosts an interactive timeline of the MV Hondius outbreak.

The live site is published with GitHub Pages.

## Editing the timeline

Timeline events live in:

`public/data/mv-hondius.json`

Each event should include:

- `title`: date or date range shown on the timeline
- `cardTitle`: short event title
- `cardSubtitle`: optional category or context
- `cardDetailedText`: factual description
- `sourceUrl`: link to supporting source
- `sourceLabel`: readable source name
- `category`: case, response, media, laboratory, travel, etc.
- `location`: relevant location

Submit changes by pull request.