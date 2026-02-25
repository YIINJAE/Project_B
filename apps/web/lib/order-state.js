export const ORDER_STATES = Object.freeze({
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  PREPARING_SHIPMENT: "preparing_shipment",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELED: "canceled",
  REFUNDED: "refunded"
});

export const ORDER_INITIAL_STATE = ORDER_STATES.PENDING_PAYMENT;

export const ORDER_TRANSITIONS = Object.freeze({
  [ORDER_STATES.PENDING_PAYMENT]: [ORDER_STATES.PAID, ORDER_STATES.CANCELED],
  [ORDER_STATES.PAID]: [ORDER_STATES.PREPARING_SHIPMENT, ORDER_STATES.REFUNDED],
  [ORDER_STATES.PREPARING_SHIPMENT]: [ORDER_STATES.SHIPPED, ORDER_STATES.CANCELED],
  [ORDER_STATES.SHIPPED]: [ORDER_STATES.DELIVERED, ORDER_STATES.REFUNDED],
  [ORDER_STATES.DELIVERED]: [ORDER_STATES.REFUNDED],
  [ORDER_STATES.CANCELED]: [],
  [ORDER_STATES.REFUNDED]: []
});

export function isValidOrderState(state) {
  return Object.values(ORDER_STATES).includes(state);
}

export function getAllowedTransitions(state) {
  if (!isValidOrderState(state)) return [];
  return ORDER_TRANSITIONS[state] || [];
}

export function canTransition(fromState, toState) {
  if (!isValidOrderState(fromState) || !isValidOrderState(toState)) {
    return false;
  }

  return getAllowedTransitions(fromState).includes(toState);
}
