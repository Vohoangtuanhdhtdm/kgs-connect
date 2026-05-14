import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UserAsset } from "@/types/asset";
import L from "leaflet";

// Fix icon mặc định của Leaflet bị mất trong React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Hook sửa lỗi bản đồ bị xám một nửa
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
};

interface AssetMapProps {
  assets: UserAsset[];
}

export const AssetMap: React.FC<AssetMapProps> = ({ assets }) => {
  // Tâm bản đồ mặc định (Ví dụ: TP.HCM)
  const defaultCenter: [number, number] = [10.762622, 106.660172];
  const validAssets = assets.filter((a) => a.latitude && a.longitude);

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative z-0">
      <MapContainer
        center={
          validAssets.length > 0
            ? [validAssets[0].latitude, validAssets[0].longitude]
            : defaultCenter
        }
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validAssets.map((asset) => (
          <Marker key={asset.id} position={[asset.latitude, asset.longitude]}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{asset.name}</p>
                <p className="text-xs text-slate-500 mt-1">{asset.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
