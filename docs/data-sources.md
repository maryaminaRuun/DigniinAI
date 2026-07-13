# Data sources and disclosure policy

## Prototype status

The current flood alert, locations, reach statistics, map zones, SMS delivery and voice delivery are **demonstration data**. They are not live forecasts or operational ICPAC statistics.

## Intended authoritative references

- ICPAC climate products: https://www.icpac.net/
- ICPAC Hazard Watch: https://hazardwatch.icpac.net/
- East Africa Drought Watch: https://droughtwatch.icpac.net/
- HUSIKA: https://husika.icpac.net/
- ICPAC Thresholds and Triggers: https://eatriggersthresholds.icpac.net/
- OpenStreetMap map data: https://www.openstreetmap.org/copyright

## Integration rules

1. Use only documented APIs or downloadable datasets whose licenses allow reuse.
2. Do not scrape ICPAC interfaces or imply official ICPAC endorsement.
3. Store source name, URL and source timestamp with every alert.
4. Apply deterministic, documented threshold rules before AI processing.
5. Use AI only to simplify, translate and adapt an approved message.
6. Require an authorized human reviewer before operational publication.
7. Clearly label simulated, delayed or unavailable data.
