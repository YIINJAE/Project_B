# Order State Machine (Draft)

## Purpose
This document defines the draft order lifecycle state machine for MVP.

## State Constants
- `pending_payment` (initial)
- `paid`
- `preparing_shipment`
- `shipped`
- `delivered`
- `canceled`
- `refunded`

Source of truth: `apps/web/lib/order-state.js`

## Transition Table
| From | Allowed To |
| --- | --- |
| `pending_payment` | `paid`, `canceled` |
| `paid` | `preparing_shipment`, `refunded` |
| `preparing_shipment` | `shipped`, `canceled` |
| `shipped` | `delivered`, `refunded` |
| `delivered` | `refunded` |
| `canceled` | _(none, terminal)_ |
| `refunded` | _(none, terminal)_ |

## Validation Helper
Use `canTransition(fromState, toState)` to validate whether a state change is allowed.

```js
import { canTransition } from "@/lib/order-state";

canTransition("pending_payment", "paid");
// true

canTransition("delivered", "paid");
// false
```

## API Integration Note
`POST /api/v1/orders` route (`apps/web/app/api/v1/orders/route.js`) sets newly created orders to `ORDER_INITIAL_STATE` so API behavior stays aligned with the state machine constants.
