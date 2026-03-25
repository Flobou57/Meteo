import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
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

export default function RainRadar({ latitude, longitude }: RainRadarProps) {
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
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
          {/* Overlay de précipitations Open-Meteo */}
          <TileLayer
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo"
            opacity={0.6}
          />
          <RecenterMap lat={latitude} lon={longitude} />
        </MapContainer>
      </div>
      <div style={{ marginTop: "8px", fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center" }}>
        Zone dézoomée pour voir les précipitations régionales
      </div>
    </div>
  );
}
