import React from "react";
import { useTranslation } from "react-i18next";

type Post = { id: number; title: string };

export function App(): React.ReactElement {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setPosts(data);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, Arial, sans-serif",
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>{t("title")}</h2>
        <label style={{ marginLeft: "auto" }}>
          {t("language")}:&nbsp;
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </label>
      </div>

      <button onClick={load} disabled={loading}>
        {loading ? t("loading") : t("load")}
      </button>

      {error && (
        <div role="alert" style={{ color: "crimson", marginTop: 12 }}>
          {t("error")}: {error}
        </div>
      )}

      <ul style={{ marginTop: 12 }}>
        {posts?.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
