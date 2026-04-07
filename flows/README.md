# NRF User Journeys

This folder contains end-to-end flow descriptions for every user journey in the NRF service. Each file covers one complete journey — all branches, entry paths, page detail, and test scope — with status markers indicating what is currently implemented and testable.

## Status key

| Status              | Meaning                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `[IMPLEMENTED]`     | Feature exists in nrf-frontend; E2E tests written or ready to write   |
| `[PLANNED]`         | Journey known but nrf-frontend implementation not started             |
| `[BLOCKED: reason]` | nrf-frontend implementation exists but E2E is blocked — reason stated |

## Journey map

| Journey            | File                                 | Status                           | Entry point |
| ------------------ | ------------------------------------ | -------------------------------- | ----------- |
| Quote              | [quote-journey.md](quote-journey.md) | Partially implemented — see file | `/`         |
| Apply              | _(not yet created)_                  | `[PLANNED]`                      | TBD         |
| Verify (LPA staff) | _(not yet created)_                  | `[PLANNED]`                      | TBD         |

## How agents should use these files

- **Before writing any test:** read the relevant journey file to understand the full flow, entry paths, and what is in/out of scope for E2E.
- **On every session:** cross-reference flow files against `../nrf-frontend/src` routes and templates. If a route exists in the source but its branch is still marked `[BLOCKED]` or `[PLANNED]`, flag it to the user and ask whether to update the flow and write the test.
- **When the application changes:** update the relevant branch status and page detail in the journey file before touching any test code.
- **Never derive flow content from memory** — always read the current nrf-frontend source to verify headings, field names, and routing.
