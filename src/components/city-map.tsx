'use client';

import { useEffect, useRef, useState } from 'react';

// Module-level mapbox reference (singleton pattern)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg';

// City coordinates
const CITY_COORDINATES: Record<string, { lng: number; lat: number; zoom: number }> = {
  casablanca: { lng: -7.5898, lat: 33.5731, zoom: 12 },
  rabat: { lng: -6.8498, lat: 34.0209, zoom: 12 },
  marrakech: { lng: -7.9811, lat: 31.6295, zoom: 12 },
  tangier: { lng: -5.8326, lat: 35.7595, zoom: 12 },
  fes: { lng: -5.0003, lat: 34.0331, zoom: 12 },
  fez: { lng: -5.0003, lat: 34.0331, zoom: 12 },
  agadir: { lng: -9.5981, lat: 30.4278, zoom: 12 },
  ouarzazate: { lng: -6.9063, lat: 30.9189, zoom: 12 },
};

interface CityMapProps {
  city: string;
  className?: string;
}

export function CityMap({ city, className = '' }: CityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const cityKey = city.toLowerCase().replace(/[^a-z]/g, '');
  const coords = CITY_COORDINATES[cityKey];

  useEffect(() => {
    if (map.current || !mapContainer.current || !coords) return;

    const initMap = async () => {
      try {
        // Dynamically import mapbox-gl (singleton)
        if (!mapboxgl) {
          const mb = await import('mapbox-gl');
          mapboxgl = mb.default;
          mapboxgl.accessToken = MAPBOX_TOKEN;

          // Add CSS dynamically
          if (!document.getElementById('mapbox-gl-css')) {
            const link = document.createElement('link');
            link.id = 'mapbox-gl-css';
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
          }
        }

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [coords.lng, coords.lat],
          zoom: coords.zoom,
          pitch: 45,
          bearing: -17.6,
          antialias: true,
          interactive: false,
          attributionControl: false,
        });

        map.current.on('error', () => {
          setMapError(true);
          setIsLoading(false);
        });

        map.current.on('load', () => {
          if (!map.current) return;

          // Add 3D buildings
          const layers = map.current.getStyle()?.layers;
          const labelLayerId = layers?.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (layer: any) => layer.type === 'symbol' && layer.layout?.['text-field']
          )?.id;

          if (labelLayerId) {
            map.current.addLayer(
              {
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 10,
                paint: {
                  'fill-extrusion-color': '#C4A052',
                  'fill-extrusion-height': ['get', 'height'],
                  'fill-extrusion-base': ['get', 'min_height'],
                  'fill-extrusion-opacity': 0.6,
                },
              },
              labelLayerId
            );
          }

          // Add fog
          map.current.setFog({
            color: 'rgb(20, 20, 22)',
            'high-color': 'rgb(36, 36, 40)',
            'horizon-blend': 0.08,
            'space-color': 'rgb(10, 10, 12)',
            'star-intensity': 0.2,
          });

          // Add city marker
          const markerEl = document.createElement('div');
          markerEl.innerHTML = `
            <div style="
              width: 20px;
              height: 20px;
              background: #C4A052;
              border-radius: 50%;
              border: 3px solid rgba(196, 160, 82, 0.3);
              box-shadow: 0 0 20px rgba(196, 160, 82, 0.5);
            "></div>
          `;

          new mapboxgl.Marker({ element: markerEl })
            .setLngLat([coords.lng, coords.lat])
            .addTo(map.current);

          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error initializing city map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [coords, cityKey]);

  // Fallback for missing coordinates or error
  if (!coords || mapError) {
    return (
      <div className={`bg-[#1C1917] flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id={`grid-${cityKey}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#C4A052" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#grid-${cityKey})`} />
            <circle cx="50" cy="50" r="3" fill="#C4A052" opacity="0.8"/>
          </svg>
        </div>
        <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-white/30">
          {city}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#1C1917] flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-[#C4A052]/20 border-t-[#C4A052] rounded-full animate-spin" />
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-40" />
    </div>
  );
}

// Morocco overview map component
export function MoroccoOverviewMap({ className = '' }: { className?: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initMap = async () => {
      try {
        // Dynamically import mapbox-gl (singleton)
        if (!mapboxgl) {
          const mb = await import('mapbox-gl');
          mapboxgl = mb.default;
          mapboxgl.accessToken = MAPBOX_TOKEN;

          // Add CSS dynamically
          if (!document.getElementById('mapbox-gl-css')) {
            const link = document.createElement('link');
            link.id = 'mapbox-gl-css';
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
          }
        }

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-7.0926, 31.7917],
          zoom: 5,
          pitch: 30,
          bearing: 0,
          antialias: true,
          interactive: false,
          attributionControl: false,
        });

        map.current.on('error', () => {
          setMapError(true);
          setIsLoading(false);
        });

        map.current.on('load', () => {
          if (!map.current) return;

          // Add fog
          map.current.setFog({
            color: 'rgb(20, 20, 22)',
            'high-color': 'rgb(36, 36, 40)',
            'horizon-blend': 0.1,
            'space-color': 'rgb(10, 10, 12)',
            'star-intensity': 0.15,
          });

          // Add markers for all major cities
          Object.entries(CITY_COORDINATES).forEach(([cityName, coords]) => {
            if (cityName === 'fez') return; // Skip duplicate

            const markerEl = document.createElement('div');
            markerEl.innerHTML = `
              <div style="
                width: 12px;
                height: 12px;
                background: #C4A052;
                border-radius: 50%;
                box-shadow: 0 0 15px rgba(196, 160, 82, 0.6);
              "></div>
            `;

            new mapboxgl.Marker({ element: markerEl })
              .setLngLat([coords.lng, coords.lat])
              .addTo(map.current);
          });

          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error initializing overview map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  if (mapError) {
    return (
      <div className={`bg-[#1C1917] flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid-morocco" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#C4A052" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-morocco)" />
            <circle cx="50" cy="50" r="3" fill="#C4A052" opacity="0.8"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#1C1917] flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-[#C4A052]/20 border-t-[#C4A052] rounded-full animate-spin" />
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50 opacity-70" />
    </div>
  );
}
