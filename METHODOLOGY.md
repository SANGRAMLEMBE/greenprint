# Methodology

All emissions are **CO₂-equivalent (CO₂e)** using **IPCC AR6 GWP100** characterisation
factors. The engine computes in kg CO₂e and converts to tonnes only for display.

## Categories & factors

| Category | Basis | Source (year) |
|---|---|---|
| Transport — car | kg CO₂e/km × weekly km × 52, by fuel | DEFRA/DESNZ (2023) |
| Transport — transit | kg CO₂e/passenger-km × weekly km × 52 | DEFRA/DESNZ (2023) |
| Home — electricity | region grid intensity (kg CO₂e/kWh) × kWh/yr ÷ household | DEFRA / EPA eGRID / IEA (2022–23) |
| Home — gas | 0.183 kg CO₂e/kWh × kWh/yr ÷ household | DEFRA/DESNZ (2023) |
| Diet | annual kg CO₂e by dietary pattern | Poore & Nemecek, *Science* (2018) |
| Flights | kg CO₂e per return flight by haul, incl. radiative forcing | DEFRA/DESNZ (2023) |
| Shopping & goods | tiered annual estimate (EEIO-derived) | EEIO estimate (2023) |

Country/world per-capita averages for the "where you stand" comparison come from
**Our World in Data — CO₂ & Greenhouse Gas Emissions** (CC BY). The Paris-aligned
target is ~**2 tCO₂e per person per year**.

## Key assumptions
- Household energy is divided equally across `householdSize` so each person carries their share.
- Flight factors are return trips and include a radiative-forcing uplift.
- Shopping is a coarse lifestyle tier; it is the least precise category and is labelled as such in-app.
- Electric-vehicle and electricity factors are grid-dependent and approximate the regional average.

## Honesty & limits
This is an **estimate**, not an audit. Factors are averages; individual circumstances vary.
The in-app results screen links back to this document and shows the source + year behind every number.

## Attributions
- UK GHG conversion factors © Crown copyright, Open Government Licence v3.0.
- Our World in Data, CC BY 4.0.
- Poore, J., & Nemecek, T. (2018). *Reducing food's environmental impacts through producers and consumers.* Science.
