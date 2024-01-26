export type TCounterOperation = "increment" | "decrement" | "reset" | "set";
export type TCounterPayload = {
  type: TCounterOperation;
  payload?: number;
};
