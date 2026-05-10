import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Cấu hình icon chuẩn để tránh lỗi mất icon của Leaflet trong React
const DefaultIcon = L.icon({
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// HOOK "THẦN THÁNH" SỬA LỖI BẢN ĐỒ XÁM MÀN HÌNH
function AutoResizeMap() {
  const map = useMap();
  useEffect(() => {
    // Chờ DOM dựng xong (100ms) rồi ép Leaflet tính toán lại kích thước và báo resize
    const timer = setTimeout(() => {
      map.invalidateSize();
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

interface LocationDisplayProps {
  position: [number, number];
  title: string;
  address: string;
}

export function LocationDisplay({
  position,
  title,
  address,
}: LocationDisplayProps) {
  // Chặn render nếu tọa độ không hợp lệ
  if (!position || isNaN(position[0]) || isNaN(position[1])) return null;

  return (
    // Bọc chiều cao cứng h-[350px] ở div cha
    <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm relative z-0 h-[350px] w-full bg-muted/20">
      <MapContainer
        key={`${position[0]}-${position[1]}`} // Ép render lại nếu đổi tin đăng khác
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full" // MapContainer sẽ full 100% của 350px
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Kích hoạt cơ chế sửa lỗi hiển thị */}
        <AutoResizeMap />

        <Marker position={position}>
          <Popup>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground mt-1">{address}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
