"use client";

import { useEffect } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import darkStyle from "../dark-map-style.json";
import type { Location } from "../types";

const US_CENTER = { lat: 39.5, lng: -98.35 };
const BRAND = "#fa4515";

/**
 * Shows the quoted route. Draws the backend's encoded polyline with a short "drawing"
 * animation; before a quote exists it just frames the picked points.
 */
export function RouteMap({ points, polyline }: { points: Location[]; polyline?: string }) {
  const { resolvedTheme } = useTheme();
  return (
    <Map
      defaultCenter={US_CENTER}
      defaultZoom={4}
      gestureHandling="cooperative"
      disableDefaultUI
      zoomControl
      styles={resolvedTheme === "dark" ? (darkStyle as google.maps.MapTypeStyle[]) : undefined}
      className="size-full"
    >
      <RouteLayer points={points} polyline={polyline} />
    </Map>
  );
}

function RouteLayer({ points, polyline }: { points: Location[]; polyline?: string }) {
  const map = useMap();
  const geometry = useMapsLibrary("geometry");
  const key = points.map((p) => `${p.lat},${p.lng}`).join("|");

  useEffect(() => {
    if (!map) return;
    const coords = points
      .filter((p) => p.lat != null && p.lng != null)
      .map((p) => ({ lat: p.lat!, lng: p.lng! }));
    const path = polyline && geometry ? geometry.encoding.decodePath(polyline) : [];

    const markers = coords.map(
      (position, i) =>
        new google.maps.Marker({
          map,
          position,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: i === 0 ? BRAND : "#e4e835",
            fillOpacity: 1,
            strokeColor: "#242424",
            strokeWeight: 2,
          },
        }),
    );

    const bounds = new google.maps.LatLngBounds();
    [...coords, ...path.map((p) => p.toJSON())].forEach((c) => bounds.extend(c));
    if (!bounds.isEmpty()) {
      if (coords.length + path.length > 1) {
        map.fitBounds(bounds, 64);
      } else {
        map.setCenter(bounds.getCenter());
        map.setZoom(9);
      }
    }

    // Animated route
    const line = new google.maps.Polyline({ map, path: [], strokeColor: BRAND, strokeWeight: 4, strokeOpacity: 0.95 });
    let frame = 0;
    if (path.length) {
      const start = performance.now();
      const duration = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        line.setPath(path.slice(0, Math.max(2, Math.floor(eased * path.length))));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      line.setMap(null);
      markers.forEach((m) => m.setMap(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures the points
  }, [map, geometry, key, polyline]);

  return null;
}
