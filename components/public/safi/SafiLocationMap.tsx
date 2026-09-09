"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { useMemo } from "react";

const SAFI_COORDINATES: [number, number] = [32.2994, -9.2372];

export default function SafiLocationMap() {
  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "amore-map-marker",
        html: '<span class="amore-map-marker__pulse"></span><span class="amore-map-marker__pin"><span>A</span></span>',
        iconSize: [48, 58],
        iconAnchor: [24, 58],
        popupAnchor: [0, -54],
      }),
    [],
  );

  return (
    <MapContainer
      center={SAFI_COORDINATES}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging
      className="h-full min-h-[360px] w-full"
      aria-label="Carte indiquant Amore Italiano à Safi"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomright" />
      <Marker position={SAFI_COORDINATES} icon={markerIcon}>
        <Popup>
          <strong>Amore Italiano Safi</strong>
          <br />
          Label Gallery · Centre-ville
        </Popup>
      </Marker>
    </MapContainer>
  );
}
