"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type GeoPoint = { lat: number; lng: number; label: string };

export function TrackingMap({
  origin,
  destination,
  progress = 0.62,
}: {
  origin: GeoPoint;
  destination: GeoPoint;
  progress?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    let map: import("leaflet").Map | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !node || node.dataset.init) return;
      node.dataset.init = "1";

      map = L.map(node, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const o = L.latLng(origin.lat, origin.lng);
      const d = L.latLng(destination.lat, destination.lng);

      // Tüm rota (kesikli)
      L.polyline([o, d], {
        color: "#a8781f",
        weight: 3,
        opacity: 0.45,
        dashArray: "2 8",
      }).addTo(map);

      // Uç noktalar
      const pin = (color: string) =>
        L.divIcon({
          className: "",
          html: `<div class="go-pin" style="background:${color}"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
      L.marker(o, { icon: pin("#2e3a2b") })
        .addTo(map)
        .bindPopup(`<b>Çıkış</b><br>${origin.label}`);
      L.marker(d, { icon: pin("#3f6b43") })
        .addTo(map)
        .bindPopup(`<b>Teslimat</b><br>${destination.label}`);

      // Kargo işaretçisi
      const courierIcon = L.divIcon({
        className: "",
        html: `<div class="go-courier"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const at = (t: number) =>
        L.latLng(o.lat + (d.lat - o.lat) * t, o.lng + (d.lng - o.lng) * t);

      const courier = L.marker(at(progress), { icon: courierIcon })
        .addTo(map)
        .bindPopup("Kargonuz yolda");

      // Kat edilen yol (dolu)
      const traveled = L.polyline([o, at(progress)], {
        color: "#a8781f",
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      map.fitBounds(L.latLngBounds([o, d]).pad(0.25));

      // Canlı simülasyon: işaretçi rota üzerinde yavaşça ilerler (gidip gelir)
      let t = progress;
      let dir = 1;
      const tick = () => {
        t += dir * 0.0018;
        if (t > 0.78) dir = -1;
        if (t < 0.5) dir = 1;
        const p = at(t);
        courier.setLatLng(p);
        traveled.setLatLngs([o, p]);
        raf = window.setTimeout(() => requestAnimationFrame(tick), 60);
      };
      tick();
    })();

    return () => {
      cancelled = true;
      if (raf) clearTimeout(raf);
      if (map) map.remove();
      if (node) delete node.dataset.init;
    };
  }, [origin, destination, progress]);

  return <div ref={ref} className="h-full w-full" />;
}
