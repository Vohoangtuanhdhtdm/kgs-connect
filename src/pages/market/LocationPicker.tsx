import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  position: [number, number] | null;
  onChange: (pos: [number, number]) => void;
}

// 1. Component bắt sự kiện click trên bản đồ
function MapEvents({
  onChange,
}: {
  onChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// 2. Component giúp bản đồ tự động "bay" đến vị trí mới khi prop position thay đổi
function MapUpdater({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // Zoom level 16 để nhìn rõ đường phố
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export function LocationPicker({ position, onChange }: LocationPickerProps) {
  const defaultCenter: [number, number] = [11.1683, 106.5986];

  return (
    <div className="overflow-hidden rounded-xl border shadow-sm relative z-0">
      <MapContainer
        center={position || defaultCenter}
        zoom={13}
        className="h-[300px] w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onChange={onChange} />
        {/* Đưa MapUpdater vào trong MapContainer */}
        <MapUpdater position={position} />
        {position && <Marker position={position} />}
      </MapContainer>

      {!position && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/90 px-4 py-2 rounded-full shadow-md text-sm font-medium text-primary pointer-events-none transition-opacity">
          Nhấp vào bản đồ hoặc dùng chức năng tìm kiếm
        </div>
      )}
    </div>
  );
}
