---
topic: webapplications-weather-widget
description: Real weather widget — Open-Meteo, useWeather hook, dashboard card
---

# Weather widget (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`) for relevant guidance when implementing.

Use this knowledge when adding a **real weather widget** to a Salesforce React BYO webapp (e.g. dashboard, sidebar).

## Data source: Open-Meteo

- **Open-Meteo** (https://open-meteo.com) is free, requires **no API key**, and supports **CORS** from the browser.
- Endpoint: `GET https://api.open-meteo.com/v1/forecast` with query params.
- Use for non-commercial use; no registration. Data under CC BY 4.0.

## API parameters (forecast)

- **latitude**, **longitude** — required. Use a default (e.g. San Francisco: 37.7749, -122.4194) or pass from geolocation.
- **current** — comma-separated: `temperature_2m`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m` (units: °C, %, WMO code, km/h).
- **hourly** — e.g. `temperature_2m` for today’s hourly temps.
- **timezone** — e.g. `America/Los_Angeles` so times are local.
- **forecast_days** — `1` for current + one day of hourly.

## Structure

| Concern | Where |
|--------|--------|
| Hook: fetch + state | e.g. `src/hooks/useWeather.ts` — `useWeather(lat?, lng?)` → `{ data, loading, error }` |
| UI | Dashboard or any page: Card with current conditions + optional hourly strip |

## Hook: useWeather

- **Signature:** `useWeather(lat?: number | null, lng?: number | null)`.
- **Returns:** `{ data: WeatherData | null, loading: boolean, error: string | null }`.
- **Default location** when lat/lng omitted: e.g. San Francisco so the widget works without geolocation.
- **Effect:** Single fetch on mount (and when lat/lng change); cancel on unmount to avoid setState after unmount.
- **Data shape:** Current (description, temp °F, humidity, wind mph) and optional array of hourly slots (time label, temp °F).

## Converting API values

- **Temperature:** API returns °C; convert to °F for display: `Math.round((c * 9) / 5 + 32)`.
- **Wind:** `wind_speed_10m` is km/h; convert to mph: `windKmh * 0.621371`.
- **Weather description:** Map **weather_code** (WMO) to a short label (e.g. 0 → "Clear", 1 → "Mainly clear", 3 → "Overcast", 61–65 → Rain, 95 → "Thunderstorm"). Use a small lookup table; default "Unknown" for unmapped codes.

## UI patterns

- **Loading:** Show a short message (e.g. "Loading weather…") while `loading` is true.
- **Error:** Show `error` in a visible, accessible way (e.g. `role="alert"`, destructive text style).
- **Success:** Show current description, large temp °F, then wind and humidity; optionally a row of next few hours (time + temp) for “Today”.
- **Date:** Use `new Date().toLocaleDateString(...)` for “today” in the card header so it stays current.

## Optional: user location

- To use the user’s location, call `navigator.geolocation.getCurrentPosition`, then pass `coords.latitude` and `coords.longitude` into `useWeather(lat, lng)`.
- Handle permission denied and errors; fall back to default lat/lng so the widget still works.

## Verification

- Run the app and open the page with the weather widget; confirm loading → current conditions and (if applicable) hourly strip.
- Confirm error state if the API is unreachable (e.g. block network and reload).
- If using a default city, confirm values look reasonable for that location.
