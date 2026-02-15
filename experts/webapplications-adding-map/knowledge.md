---
topic: webapplications-adding-map
description: Adding a map (Leaflet, geocoding, markers) to a webapp
---

# Adding a map (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`) for relevant guidance when implementing.

Use this knowledge when adding an interactive map to a Salesforce React BYO webapp (e.g. property locations, store locator).

## Stack

- **Leaflet** + **react-leaflet** for the map UI (tiles, markers, popups).
- **OpenStreetMap** tiles (no API key); or use another tile provider if needed.
- **Geocoding:** address → lat/lng. Example: OpenStreetMap Nominatim (free, no key); optional concurrency limit and in-memory cache.

## Dependencies

Add to the app's `package.json` (or feature dependencies):

- `leaflet`
- `react-leaflet`
- `@types/leaflet` (dev)

Import Leaflet CSS in the map component or root: `import "leaflet/dist/leaflet.css";`

## Structure

| Concern | Where |
|--------|--------|
| Map component | e.g. `src/components/PropertyMap.tsx` (or `Map.tsx`) |
| Geocoding util | e.g. `src/utils/geocode.ts` (pure function `geocodeAddress(address) → { lat, lng } \| null`) |
| Hook: one address → coords | e.g. `src/hooks/useGeocode.ts` (returns `{ coords, loading }`) |
| Hook: list of results → markers | e.g. `src/hooks/usePropertyMapMarkers.ts` (fetches addresses, geocodes in parallel, returns `{ markers, loading }`) |

## Map component (Leaflet)

- Use **MapContainer**, **TileLayer**, **Marker**, **Popup** from `react-leaflet`.
- **Center:** accept `center: [lat, lng]` and optional `zoom`; use a small component with `useMap()` + `useEffect` to call `map.setView(center, zoom)` when center/zoom change (e.g. `MapCenterUpdater`).
- **Markers:** accept `markers: Array<{ lat, lng, label? }>`. Use **L.divIcon** for a custom pin (no external image) so the pin works without extra assets; set `iconSize`, `iconAnchor`, `popupAnchor`.
- **SSR/hydration:** wrap the map in a component that only renders Leaflet after mount (`useState(false)` + `useEffect(() => setMounted(true), [])`) to avoid "window is not defined" or hydration mismatches; render a placeholder (e.g. empty div with same height) when `!mounted`.
- **Accessibility:** use `aria-hidden="true"` on decorative pin shapes; ensure popup content is readable by screen readers.

## Geocoding

- **Cache:** in-memory `Map<addressKey, { lat, lng }>` to avoid repeated requests for the same address.
- **Concurrency:** limit parallel requests (e.g. queue with `maxConcurrent`) to avoid rate limits (e.g. Nominatim).
- **User-Agent:** set a descriptive `User-Agent` header (e.g. `"YourApp/1.0 (contact@example.com)"`) when calling Nominatim.
- **Result:** return `{ lat, lng }` or `null`; normalize address to a cache key (trim, collapse spaces, lowercase).

## Markers from search/list data

- From list/search results, derive a list of entity IDs (e.g. property IDs).
- Fetch addresses for those IDs (e.g. via GraphQL or REST) in one or batched calls; build `Record<id, address>`.
- For each address, call geocode (use the cached util); collect `{ lat, lng, label }` (label = name/title for popup).
- Handle loading and empty state: show loading until first batch of markers is ready; show map with center when no markers (e.g. default city center).

## Patterns

- **Center when no markers:** use a default center (e.g. city) and fixed zoom.
- **Center when has markers:** e.g. centroid of marker positions, or first marker; same zoom.
- **Popup content:** keep minimal (e.g. label + link to detail page).
- **Container class:** use a fixed height (e.g. `h-[400px]`) and `rounded-xl overflow-hidden` so the map doesn’t collapse and stays clipped.

## Verification

- Run `npm i && npm run build && npm run dev`; open the page that shows the map.
- Confirm tiles load, markers appear, popups open, and center/zoom update when data changes.
- If using Nominatim, respect usage policy (e.g. one request per second for bulk); use cache and concurrency limit.
