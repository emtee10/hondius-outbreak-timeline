import { useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import "./styles.css";

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/mv-hondius.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load timeline: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formatted = data.map((item) => ({
          title: item.title,
          cardTitle: item.cardTitle,
          cardSubtitle: item.cardSubtitle,
          cardDetailedText: [
            item.cardDetailedText,
            item.sourceUrl
              ? `Source: ${item.sourceLabel || item.sourceUrl} — ${item.sourceUrl}`
              : ""
          ].filter(Boolean)
        }));

        setItems(formatted);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="app">
      <header className="header">
        <h1>MV Hondius Outbreak Timeline</h1>
        <p>
          A community-maintained timeline of key events, public health actions,
          and source documents.
        </p>
      </header>

      <section className="timeline-wrapper">
        <Chrono
          items={items}
          mode="vertical"
          disableToolbar
          layout={{
            cardWidth: 650,
            cardHeight: 220
          }}
        />
      </section>
    </main>
  );
}