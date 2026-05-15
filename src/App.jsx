import { useEffect, useMemo, useState } from "react";
import { Chrono } from "react-chrono";
import "./styles.css";

export default function App() {
  const [rawItems, setRawItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

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
        selectedTag === "all" || item.tags?.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [rawItems, searchText, selectedCategory, selectedTag]);

  const chronoItems = filteredItems.map((item) => ({
    title: item.title,
  }));

  return (
    <main className="app">
      <header className="header">
        <h1>MV Hondius Outbreak Timeline</h1>
        <p>
          A community-maintained timeline of key events, public health actions,
          and source documents.
        </p>
      </header>

      <section className="controls">
        <input
          type="search"
          placeholder="Search timeline..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All categories" : category}
            </option>
          ))}
        </select>

        <select
          value={selectedTag}
          onChange={(event) => setSelectedTag(event.target.value)}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag === "all" ? "All tags" : tag}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchText("");
            setSelectedCategory("all");
            setSelectedTag("all");
          }}
        >
          Reset
        </button>
      </section>

      <p className="count">
        Showing {filteredItems.length} of {rawItems.length} events
      </p>
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