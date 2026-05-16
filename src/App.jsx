import { useEffect, useMemo, useState } from "react";
import { Chrono } from "react-chrono";
import "./styles.css";

export default function App() {
  const [rawItems, setRawItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/mv-hondius.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load timeline: ${response.status}`);
        }
        return response.json();
      })
      .then(setRawItems)
      .catch(console.error);
  }, []);

  const categories = useMemo(() => {
    return ["all", ...new Set(rawItems.map((item) => item.category).filter(Boolean))];
  }, [rawItems]);

  const tags = useMemo(() => {
    return [
      "all",
      ...new Set(rawItems.flatMap((item) => item.tags || []))
    ];
  }, [rawItems]);

  function toggleTag(tag) {
    if (tag === "all") {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag]
    );
  }

  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        !search ||
        item.date?.toLowerCase().includes(search) ||
        item.cardTitle?.toLowerCase().includes(search) ||
        item.cardSubtitle?.toLowerCase().includes(search) ||
        item.cardDetailedText?.toLowerCase().includes(search) ||
        item.location?.toLowerCase().includes(search) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(search));

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesTag =
        selectedTags.length === 0 ||
        item.tags?.some((tag) => selectedTags.includes(tag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [rawItems, searchText, selectedCategory, selectedTags]);

  const groupedItems = filteredItems.reduce((groups, item) => {
    const date = item.date;

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(item);

    return groups;
  }, {});

  const chronoItems = filteredItems.map((item) => ({
    title: item.date,
  }));

  return (
    <main className="app">
      <header className="header">
        <h1>MV Hondius Outbreak Timeline</h1>
      </header>

      <section className="controls">
        <input
          type="search"
          placeholder="Search timeline..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <div className="filter-group">
          <span className="filter-label">Category</span>

          <div className="chip-row">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "chip chip-active"
                    : "chip"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group tag-filter">
          <button
            type="button"
            className="filter-label"
            onClick={() => setShowTags((current) => !current)}
          >
            <span>
              Tags
              {selectedTags.length > 0 && ` (${selectedTags.length} selected)`}
            </span>

            <span>{showTags ? "▲" : "▼"}</span>
          </button>

          {showTags && (
            <div className="chip-row tag-chip-row">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={
                    tag === "all"
                      ? selectedTags.length === 0
                        ? "chip chip-active"
                        : "chip"
                      : selectedTags.includes(tag)
                        ? "chip chip-active"
                        : "chip"
                  }
                  onClick={() => toggleTag(tag)}
                >
                  {tag === "all" ? "All tags" : tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="filter-label"
          onClick={() => {
            setSearchText("");
            setSelectedCategory("all");
            setSelectedTags([]);
          }}
        >
          Reset (Showing {filteredItems.length} of {rawItems.length} events)
        </button>
      </section>

      <section className="timeline-list">
        {filteredItems.map((item) => (
          <article className="event-card" key={`${item.date}-${item.cardTitle}`}>
            <div className="event-date">{item.date}</div>

            <div className="event-content">
              <h2>{item.cardTitle}</h2>

              {item.cardSubtitle && (
                <p className="event-subtitle">{item.cardSubtitle}</p>
              )}

              <p className="event-description">{item.cardDetailedText}</p>

              <div className="event-meta">
                {item.location && (
                  <div>
                    <span className="meta-label">Location</span>
                    <span>{item.location}</span>
                  </div>
                )}

                {item.category && (
                  <div>
                    <span className="meta-label">Category</span>
                    <span>{item.category}</span>
                  </div>
                )}
              </div>

              {item.tags?.length > 0 && (
                <div className="tag-list">
                  {item.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              )}

              {item.sources?.length > 0 && (
                <div className="source-list">
                  <span className="meta-label">Sources</span>

                  <ul>
                    {item.sources.map((source) => (
                      <li key={source.url}>
                        <a
                          className="source-link"
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


            </div>
          </article>
        ))}
      </section>
    </main>
  );
}