# *MV Hondius* Outbreak Timeline

An interactive, community-maintained timeline documenting the 2026 *MV Hondius* hantavirus outbreak and related public health response activities.

**Live timeline:**
[https://emtee10.github.io/hondius-outbreak-timeline/](https://emtee10.github.io/hondius-outbreak-timeline/)

---

## About

This project aims to create a structured, source-based chronology of events related to the *MV Hondius* outbreak, including:

* passenger and crew illness events
* travel and itinerary milestones
* laboratory findings
* outbreak reporting
* contact tracing activities
* public health response actions
* international coordination

The timeline is intended to support:

* public health analysis
* historical reconstruction
* outbreak investigation review
* educational use
* and general public understanding

Although the timeline includes global events and contributions are welcome from anyone, the project is maintained from an Ontario/Canadian public health perspective. As a result, events involving Ontario, Canada, or Canadian public health systems may be represented in greater detail or granularity.

---

## Principles

This timeline aims to be:

* **Source-based** — events should be traceable to cited sources
* **Chronological** — events are organized by when they occurred, not when they were reported
* **Non-speculative** — event descriptions should avoid unsupported inference or retrospective interpretation
* **Transparent** — sources and uncertainties should be visible where possible
* **Collaborative** — contributions and corrections are encouraged

---

## Repository Structure

```text
public/
  data/
    mv-hondius.json

src/
  ...
```

### Key Data File

The main timeline dataset is:

```text
public/data/mv-hondius.json
```

This file contains an array of timeline events.

---

## Event Structure

Each event follows this structure:

```json
{
  "date": "2026-05-02",
  "cardTitle": "WHO is Notified",
  "cardSubtitle": "",
  "cardDetailedText": "WHO receives notification regarding a cluster of severe acute respiratory illness aboard the MV Hondius.",
  "location": "",
  "category": "outbreak",
  "tags": ["who"],
  "sources": [
    {
      "label": "WHO Disease Outbreak Notification",
      "url": "https://example.com"
    }
  ]
}
```

---

## Field Definitions

### `date`

The date on which the event occurred.

Format:

```text
YYYY-MM-DD
```

Example:

```json
"date": "2026-05-02"
```

---

### `cardTitle`

A short title describing the event.

Examples:

```json
"cardTitle": "Case 4 Passes Away"
```

```json
"cardTitle": "WHO Reports 8 Cases"
```

---

### `cardSubtitle`

Optional secondary context.

May include:

* event type
* organization
* phase
* operational context

Can be left blank.

---

### `cardDetailedText`

A concise factual description of the event.

Descriptions should:

* remain faithful to cited sources
* avoid speculation
* avoid unsupported causal inference
* avoid retrospective interpretation unless explicitly sourced

Good examples:

* symptom onset
* evacuation details
* laboratory confirmation
* reported case counts
* operational actions

---

### `location`

Optional geographic context associated with the event.

Examples:

```json
"location": "Johannesburg, South Africa"
```

```json
"location": "Canary Islands, Spain"
```

---

### `category`

A broad event grouping used for visualization and filtering.

Current categories include:

* `cases`
* `contacts`
* `itinerary`
* `outbreak`

New categories should only be introduced when:

* existing categories are clearly insufficient
* the distinction is conceptually meaningful
* the category will likely recur across multiple events

Contributors are encouraged to discuss proposed new categories before widespread use.

---

### `tags`

Tags provide flexible cross-cutting metadata.

Tags may represent:

* geography
* case identifiers
* operational themes
* epidemiologic concepts
* travel locations
* public health activities

Examples:

```json
"tags": ["case-003", "south-africa"]
```

```json
"tags": ["onset", "death"]
```

Contributors should:

* prefer lowercase kebab-case formatting
* reuse existing tags where appropriate
* avoid creating near-duplicate tags
* avoid overly broad or ambiguous tags

Preferred:

```text
south-africa
```

Avoid:

```text
SouthAfrica
south_africa
sa
```

---

### `sources`

A list of source documents supporting the event.

Each source includes:

```json
{
  "label": "WHO Disease Outbreak Notification",
  "url": "https://example.com"
}
```

Multiple sources are encouraged where appropriate.

---

## Contributing

Contributions are welcome.

Examples include:

* adding new events
* correcting dates or details
* improving source references
* adding additional public health documentation
* improving geographic specificity
* clarifying chronology

Please see:

```text
CONTRIBUTING.md
```

for contribution guidance.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Disclaimer

This project is an independent public health and historical documentation effort.

Inclusion of events or interpretations does not imply official attribution or endorsement by any public health authority or organization.

Contributors should strive for accuracy and transparency, but errors may occur.

Users should consult original sources where appropriate.

---

## License

This project is licensed under the MIT License.

See:

```text
LICENSE
```
