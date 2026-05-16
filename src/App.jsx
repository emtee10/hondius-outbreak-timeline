import { useEffect, useMemo, useState } from "react";
import { Chrono } from "react-chrono";
import "./styles.css";

export default function App() {
  const [rawItems, setRawItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

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
        item.title?.toLowerCase().includes(search) ||
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

  const chronoItems = filteredItems.map((item) => ({
    title: item.title,
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

        <div className="filter-group">
          <span className="filter-label">Tags</span>

          <div className="chip-row">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  selectedTags.includes(tag)
                    ? "chip chip-active"
                    : "chip"
                }
                onClick={() => toggleTag(tag)}
              >
                {tag === "all" ? "All" : tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchText("");
            setSelectedCategory("all");
            setSelectedTags([]);
          }}
        >
          Reset
        </button>
        <p className="count">
          Showing {filteredItems.length} of {rawItems.length} events
        </p>
      </section>

      <section className="timeline-list">
        {filteredItems.map((item) => (
          <article className="event-card" key={`${item.title}-${item.cardTitle}`}>
            <div className="event-date">{item.title}</div>

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

              {item.sourceUrl && (
                <a
                  className="source-link"
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.sourceLabel || "View source"}
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}