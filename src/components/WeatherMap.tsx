import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icône Leaflet par défaut
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Composant pour recentrer la carte quand les coords changent
function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 10, { animate: true });
  }, [lat, lon, map]);
  return null;
}

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  city: string;
  temperature: number;
}

export default function WeatherMap({ latitude, longitude, city, temperature }: WeatherMapProps) {
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
        Localisation
      </h3>
      <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", height: "250px" }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[latitude, longitude]} icon={defaultIcon}>
            <Popup>
              <strong>{city}</strong><br />
              {temperature}°C
            </Popup>
          </Marker>
          <RecenterMap lat={latitude} lon={longitude} />
        </MapContainer>
      </div>
    </div>
  );
}
