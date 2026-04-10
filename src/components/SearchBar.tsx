import { useState } from "react";
import { Search, MapPin, Navigation, Star, StarOff, Sun, Moon } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  currentCity: string;
  favorites: string[];
  onAddFavorite: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function SearchBar({
  onSearch,
  onGeolocate,
  currentCity,
  favorites,
  onAddFavorite,
  onRemoveFavorite,
  theme,
  onToggleTheme,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const isFav = favorites.includes(currentCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  const btnStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px",
    cursor: "pointer",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <div className="header-row" style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Ville + favori */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MapPin size={18} color="var(--accent)" />
          <span className="city-name" style={{ fontSize: "1.15rem", fontWeight: 700 }}>{currentCity}</span>
          <button
            onClick={() => isFav ? onRemoveFavorite(currentCity) : onAddFavorite(currentCity)}
            style={{ ...btnStyle, padding: "4px", background: "transparent", border: "none" }}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isFav
              ? <Star size={18} color="var(--warm)" fill="var(--warm)" />
              : <StarOff size={18} color="var(--text-muted)" />
            }
          </button>
        </div>

        {/* Recherche + boutons */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", flex: "1 1 280px", minWidth: 0 }}>
          <form className="search-form" onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", flex: "1 1 200px", minWidth: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0,
              background: "var(--bg-input)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "8px 14px",
            }}>
              <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                className="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une ville..."
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "var(--text)", fontSize: "16px", fontFamily: "var(--font)",
                  width: "100%", minWidth: 0,
                }}
              />
            </div>
            <button type="submit" style={{
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: "var(--radius-sm)", padding: "8px 16px",
              fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)",
              flexShrink: 0,
            }}>
              OK
            </button>
          </form>

          <button onClick={onGeolocate} style={btnStyle} title="Ma position">
            <Navigation size={16} />
          </button>

          <button onClick={onToggleTheme} style={btnStyle} title="Changer le thème">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Favoris */}
      {favorites.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {favorites.map((fav) => (
            <button
              key={fav}
              onClick={() => onSearch(fav.split(",")[0].trim())}
              style={{
                background: fav === currentCity ? "var(--accent-glow)" : "var(--bg-card)",
                border: `1px solid ${fav === currentCity ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "0.75rem",
                color: fav === currentCity ? "var(--accent-light)" : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "var(--font)",
                transition: "all 0.2s",
              }}
            >
              <Star size={10} style={{ marginRight: "4px", verticalAlign: "middle" }} />
              {fav.split(",")[0].trim()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
