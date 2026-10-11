# Surf Weather App — Idea Memo

_Created 2026-10-11_

## Idea

A surf forecast app that recommends **where and when to surf, ranked by the user's experience level**, instead of showing raw charts.

> "Beginner? Go to Praia do Norte at 8–11 — waist-high, clean, offshore wind."

## Why not ads on the current weather app

- Display ads pay roughly **€1–5 per 1,000 page views** (RPM); weather sites sit at the low end because visits are short.

  | Monthly page views | Rough monthly income |
  | ------------------ | -------------------- |
  | 1,000              | €1–5                 |
  | 10,000             | €10–50               |
  | 100,000            | €100–500             |

- Blockers before monetising anything:
  - **Open-Meteo free API is non-commercial only** — ads or payments require the paid plan or another provider.
  - Check **OpenWeather** terms and rate limits for commercial use.
  - **GDPR**: cookie consent (Google-certified CMP for personalised ads) and a privacy policy.
  - Ads hurt performance and UX.
- Conclusion: general-purpose weather is a crowded market (phone apps, Foreca, Yr, Ilmatieteen laitos). Revenue comes from a **niche where weather drives a decision**.

## Niches considered

| Niche               | Paid feature                                | Model                                   |
| ------------------- | ------------------------------------------- | --------------------------------------- |
| Outdoor sports      | Best activity window, wind/rain timing      | Freemium €2–4/mo                        |
| Sailing / boating   | Wind, gusts, waves on route                 | Subscription + affiliates               |
| Gardening / farming | Frost alerts, watering advice               | Subscription + affiliates               |
| Skiing              | Snow and resort conditions                  | Resort sponsorship                      |
| Photographers       | Golden hour, clouds, aurora                 | Subscription                            |
| **Surfing** ✅      | **Best spot + time window per skill level** | **Freemium + surf school partnerships** |

Key insight: people pay for **alerts**, not for looking at weather.

## Competition and opening

- **Surfline** (absorbed Magicseaweed in 2023), **Surf-forecast.com**, **Windguru**, **Windy** — powerful but chart-heavy, aimed at experienced surfers.
- **Opening:** plain-language, level-aware recommendations. Turn data into a decision.

## Data sources

| Data                                  | Source                          | Notes                                    |
| ------------------------------------- | ------------------------------- | ---------------------------------------- |
| Wave height, period, direction, swell | Open-Meteo Marine API           | Paid plan for commercial use             |
| Wind speed and direction              | Open-Meteo Forecast API         | Wind relative to beach facing is crucial |
| Tides                                 | WorldTides or Stormglass (paid) | Many spots are tide-dependent            |
| Water temperature                     | Open-Meteo Marine API           | Also useful for wetsuit suggestions      |
| **Surf spots**                        | **Self-built database**         | **The core asset / moat**                |

### Spot model

```ts
interface SurfSpot {
  id: string
  name: string
  lat: number
  lon: number
  facing: number
  breakType: 'beach' | 'reef' | 'point'
  idealSwellDirection: [number, number]
  bestTide: 'low' | 'mid' | 'high' | 'any'
  hazards: string[]
}
```

- `facing`: compass direction the beach faces (degrees). Determines offshore vs onshore wind.
- `idealSwellDirection`: `[min, max]` in degrees.
- `hazards`: rocks, currents, crowds, etc.
- Start with **one region, 20–30 spots**, done well.

## Scoring by experience level

| Level        | Wave height | Period | Wind                          | Break               |
| ------------ | ----------- | ------ | ----------------------------- | ------------------- |
| Beginner     | 0.5–1.2 m   | 6–10 s | Light or offshore, < 15 km/h  | Beach only          |
| Intermediate | 1–2 m       | 8–12 s | Offshore or light cross-shore | Beach, point        |
| Advanced     | 1.5–3.5 m+  | 10 s+  | Offshore                      | Any, including reef |

Each hour per spot gets a **0–10 score** from:

1. Wave height and period fit for the level
2. Wind angle relative to `facing` (offshore good, onshore bad) and wind speed
3. Swell direction within the spot's ideal range
4. Tide match

Output: **best spots and best time window today** for the selected level. Pure logic, so ideal for unit tests (add Vitest, per the audit).

## Reuse from the current weather app

| Current                        | Surf app                                   |
| ------------------------------ | ------------------------------------------ |
| Location context + geolocation | Spots near me                              |
| `/api/[lat]/[lon]/...` routes  | `/api/spots/[id]/forecast` (marine + wind) |
| Search combo box               | Spot search                                |
| Forecast cards                 | Hourly spot cards with score + summary     |
| —                              | Filters: level, board type, max distance   |

## Revenue model

1. **Freemium**
   - Free: today's best spots near you
   - Premium (~€3–5/mo): 7-day best windows, saved spots, **alerts** ("Good beginner waves at X tomorrow 8–10")
2. **Surf schools and rentals (strongest channel)** — "Book a lesson" on beginner-friendly spots; commission or listing fees.
3. **Gear affiliates** — wetsuits matched to water temperature, boards for level.

## Technical needs beyond the MVP

- Paid API plans (budget roughly €20–100/month once live)
- Accounts (e.g. Auth.js), payments (Stripe)
- Push notifications for alerts — **PWA** first, avoids native apps
- Scheduled job to check forecasts and trigger alerts

## Market caution

Finland's surf scene (Baltic, autumn/winter storms) is small and inconsistent. Bigger markets: **Portugal, Spain, France, Morocco, Canary Islands** — both travellers and locals. Pick one of these for the first spot set.

## First milestone

1. Hard-coded spot list (JSON) for one region
2. `/api/spots/[id]/forecast` using Open-Meteo Marine + wind
3. `scoreSpot(conditions, spot, level)` with unit tests
4. Page with a level selector and spots ranked by today's best score

## Validation path

1. Pick one region and one level-aware feature
2. Launch free as a PWA, share in surf communities
3. Measure whether people return
4. Add the paid tier only once there is regular use

## Open questions

- Which region first?
- Build inside this repo or start a new one?
- Tide provider and pricing
- How to source and verify spot data (local surfers, schools)
