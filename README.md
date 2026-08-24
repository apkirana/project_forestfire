# Indonesia Forest Fire Map 2023

An interactive web map of **active fire detections across Indonesia for the whole of 2023**, built on
NASA FIRMS satellite thermal-anomaly data. Pick a date and the map redraws the hotspots detected that
day, with the underlying detection records listed beneath it.

Indonesia's peatland and forest fires are a recurring transboundary haze and carbon-emission problem.
This is a lightweight, dependency-free way to look at where and when the satellites saw fire — the kind
of exploratory view that comes before any modelling.

## The data

`assets/data/indonesia2023.csv` (4 MB) and `assets/data/indonesia_fires_2023.geojson` (8.5 MB) hold a
full year of detections in the standard NASA FIRMS active-fire schema:

| Field | Meaning |
| --- | --- |
| `latitude`, `longitude` | Centre of the ~1 km detection pixel |
| `brightness`, `bright_t31` | Brightness temperature (K), channel 21/22 and channel 31 |
| `frp` | Fire Radiative Power (MW) — a proxy for fire intensity |
| `acq_date`, `acq_time` | Acquisition date and UTC time of the overpass |
| `satellite`, `instrument` | e.g. `Aqua` / `MODIS` |
| `confidence` | Detection confidence, 0–100 |
| `scan`, `track` | Pixel footprint size — grows toward the edge of the swath |
| `daynight` | `D` daytime or `N` night-time overpass |

> **A caveat worth stating.** These are *thermal anomalies*, not confirmed forest fires. Volcanoes, gas
> flares and industrial heat sources also trigger detections, cloud cover hides fires entirely, and a
> low `confidence` value means what it says. Filter on `confidence` and cross-check before drawing any
> conclusion from a hotspot count.

## Features

- **Leaflet map** over OpenStreetMap tiles, centred on Indonesia
- **Date filter** across the full 2023 range — the map and table update together
- **Detection table** showing latitude, longitude, brightness, date, FRP, satellite and instrument
- **No build step and no API key** — plain HTML, CSS and JavaScript

## Running it

The GeoJSON is fetched with `fetch()`, so it needs to be served over HTTP rather than opened as a
`file://` path:

```bash
git clone https://github.com/apkirana/project_forestfire.git
cd project_forestfire
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The first load pulls the 8.5 MB GeoJSON, so give it a moment.

## Repository structure

```text
index.html                            - the map application
js/main.js                            - Leaflet setup, date filtering, table rendering
css/styles.css                        - layout and map styling
assets/data/indonesia_fires_2023.geojson - full-year detections as GeoJSON features
assets/data/indonesia2023.csv         - the same detections in FIRMS CSV form
all_data.html, simple_table.html      - standalone table views of the dataset
apps.ipynb                            - notebook used to prepare and inspect the data
```

## Data source and attribution

Active fire data from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) (Fire Information for Resource
Management System), MODIS collection aboard Aqua/Terra. NASA FIRMS data is in the public domain; please
credit NASA FIRMS if you reuse it. Basemap tiles © OpenStreetMap contributors.

## Related work

- [project_polusikalimantan](https://github.com/apkirana/project_polusikalimantan) — PM2.5 across Kalimantan, the region these fires most affect
- [project_eucairpollution](https://github.com/apkirana/project_eucairpollution) — agentic multi-agent air-quality forecasting

My published work on peatland hotspots takes the same data further:
*Hotspot pattern distribution in peatland area in Sumatera based on spatio-temporal clustering*
(Procedia Environmental Sciences, 2016) and *Poisson clustering process on hotspot in peatland area using
Kulldorff's Scan Statistics* (TELKOMNIKA, 2015).

## Licence

MIT — see [LICENSE](LICENSE). The FIRMS data retains its original NASA terms.

---

## Author

**Annisa Puspa Kirana** — PhD researcher, Faculty of Geo-Information Science and Earth Observation (ITC),
University of Twente. Research on agentic AI and LLM-driven workflows for Earth observation.

[Google Scholar](https://scholar.google.com/citations?user=BQl6KOsAAAAJ&hl=en) ·
[ORCID](https://orcid.org/0000-0002-4622-1445) ·
[LinkedIn](https://www.linkedin.com/in/annisapuspakirana) ·
[GitHub](https://github.com/apkirana)
