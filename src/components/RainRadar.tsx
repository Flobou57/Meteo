import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface RainRadarProps {
  latitude: number;
  longitude: number;
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 7, { animate: true });
  }, [lat, lon, map]);
  return null;
}

// Récupère le dernier timestamp radar depuis RainViewer (gratuit, sans clé)
function useRainViewerTimestamp() {
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((r) => r.json())
      .then((data) => {
        const frames = data?.radar?.past;
        if (frames?.length) {
          setTimestamp(frames[frames.length - 1].path);
        }
      })
      .catch(() => {});
  }, []);

  return timestamp;
}

export default function RainRadar({ latitude, longitude }: RainRadarProps) {
  const radarPath = useRainViewerTimestamp();

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>
        Radar de pluie
      </h3>
      <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", height: "250px" }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {radarPath && (
            <TileLayer
              url={`https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.7}
            />
          )}
          <RecenterMap lat={latitude} lon={longitude} />
        </MapContainer>
      </div>
      <div style={{ marginTop: "8px", fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center" }}>
        {radarPath ? "Radar en temps réel — RainViewer" : "Chargement du radar..."}
      </div>
    </div>
  );
}
