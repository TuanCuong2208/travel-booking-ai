'use client';

import React, { useEffect, useRef } from 'react';
import { Tour } from '../types/travel';

const CITY_COORDINATES: Record<string, [number, number]> = {
  'Hà Nội': [21.0285, 105.8542],
  'Sa Pa': [22.3364, 103.8438],
  'Hạ Long': [20.9599, 107.0425],
  'Hà Giang': [22.8233, 104.9839],
  'Ninh Bình': [20.2506, 105.9745],
  'Mộc Châu': [20.8437, 104.6469],
  'Cao Bằng': [22.6657, 106.2625],
  'Quy Nhơn': [13.7830, 109.2197],
  'Đà Nẵng': [16.0544, 108.2022],
  'Hội An': [15.8801, 108.3380],
  'Huế': [16.4637, 107.5909],
  'Đà Lạt': [11.9404, 108.4583],
  'Nha Trang': [12.2388, 109.1967],
  'Phú Yên': [13.0882, 109.3082],
  'Buôn Ma Thuột': [12.6667, 108.0500],
  'Phú Quốc': [10.2899, 103.9840],
  'Côn Đảo': [8.6948, 106.6083],
  'Cần Thơ': [10.0452, 105.7469],
  'Tây Ninh': [11.3101, 106.0983],
  'Vũng Tàu': [10.3460, 107.0843],
};

interface TourRouteMapProps {
  tour: Tour;
}

export default function TourRouteMap({ tour }: TourRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const renderMap = async () => {
      const L = (await import('leaflet')).default;

      if (!mapContainerRef.current || !isMounted) return;

      // Xóa instance cũ nếu có
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const center = CITY_COORDINATES[tour.destination] || [21.0285, 105.8542];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 12,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      // Cụm Server Esri WorldStreetMap: Sắc nét, không chặn localhost, không watermark
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Street Map Vietnam',
        maxZoom: 18,
      }).addTo(map);

      // Icon Ghim
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: #0284c7; color: white; border: 2px solid white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.35);">📍</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const latlngs: [number, number][] = [];

      tour.itinerary.forEach((item, index) => {
        const offsetLat = (index - 1) * 0.025;
        const offsetLng = (index % 2 === 0 ? 1 : -1) * 0.028;
        const pointCoord: [number, number] = [center[0] + offsetLat, center[1] + offsetLng];
        latlngs.push(pointCoord);

        L.marker(pointCoord, { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <strong style="color: #0284c7;">Ngày ${item.day}</strong>
              <div style="font-weight: bold; margin-top: 2px; color: #1e293b;">${item.title}</div>
              <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">${item.detail.slice(0, 90)}...</p>
            </div>
          `);
      });

      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: '#0284c7',
          weight: 3.5,
          dashArray: '6, 8',
          opacity: 0.9,
        }).addTo(map);
      }

      // Ép bản đồ tính toán lại kích thước hiển thị ngay sau khi render
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 500);
    };

    renderMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tour]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Bản đồ hành trình tại <strong>{tour.destination}</strong>:</span>
        <span className="text-[11px] text-sky-600 font-bold">* Bấm vào ghim để xem lịch trình buổi</span>
      </div>
      <div
        ref={mapContainerRef}
        className="w-full h-80 rounded-2xl border border-slate-200 shadow-inner z-0 overflow-hidden bg-slate-100"
      />
    </div>
  );
}