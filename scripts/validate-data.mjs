import fs from "fs";

const filePath = "public/data/mv-hondius.json";
const raw = fs.readFileSync(filePath, "utf8");

let events;

try {
  events = JSON.parse(raw);
} catch (error) {
  console.error("JSON is not valid:", error.message);
  process.exit(1);
}

if (!Array.isArray(events)) {
  console.error("Timeline data must be an array.");
  process.exit(1);
}

let hasErrors = false;

function error(index, message) {
  hasErrors = true;
  console.error(`Event ${index + 1}: ${message}`);
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

for (let i = 0; i < events.length; i++) {
  const event = events[i];

  if (!event.date) {
    error(i, "Missing date.");
  } else if (!isIsoDate(event.date)) {
    error(i, `Invalid date format "${event.date}". Use YYYY-MM-DD.`);
  }

  if (!event.cardTitle) {
    error(i, "Missing cardTitle.");
  }

  if (!event.category) {
    error(i, "Missing category.");
  }

  if (!Array.isArray(event.tags)) {
    error(i, "tags must be an array.");
  }

  if (!Array.isArray(event.sources)) {
    error(i, "sources must be an array.");
  } else {
    event.sources.forEach((source, sourceIndex) => {
      if (!source.label) {
        error(i, `Source ${sourceIndex + 1} is missing label.`);
      }

      if (!source.url) {
        error(i, `Source ${sourceIndex + 1} is missing url.`);
      }
    });
  }

  if (i > 0 && event.date && events[i - 1].date) {
    const previousDate = events[i - 1].date;

    if (event.date < previousDate) {
      error(
        i,
        `Chronological order violation: ${event.date} comes after ${previousDate} in the file.`
      );
    }
  }
}

if (hasErrors) {
  console.error("\nValidation failed.");
  process.exit(1);
}

console.log(`Validation passed: ${events.length} events checked.`);