import { createAssign } from "robodux";
import { select } from "saga-query";
import { createSelector } from "reselect";
import { thunks } from "../apis";

import type { Next } from "saga-query"; 
import type { RootState } from "../rootState";
import type { TCounterPayload, ThunkCtx } from "../../types";

type TCounter = {
  count: number;
};

const COUNTER_REPO_NAME = "counter";
export const counterRepo = createAssign<any>({
  name: COUNTER_REPO_NAME,
  initialState: {
    count: 0
  }
});

const counterSelectors = (state: RootState) => state[COUNTER_REPO_NAME];
export const selectCounter = createSelector(counterSelectors, (v) => v.count);

export const counterOp = thunks.create<TCounterPayload>(
  `counterOperations`,
  function* (ctx:ThunkCtx, next:Next) {
    const { type, payload } = ctx.payload;
    const currentCount = yield* select(selectCounter);
    console.log("currentCount", currentCount);
    switch (type) {
      case "increment":
        ctx.actions.push(counterRepo.actions.set({ count: currentCount + 1 }));
        break;
      case "decrement":
        ctx.actions.push(counterRepo.actions.set({ count: currentCount - 1 }));
        break;
      case "reset":
        ctx.actions.push(counterRepo.actions.set({ count: 0 }));
        break;
      case "set":
        ctx.actions.push(counterRepo.actions.set({ count: payload as number }));
        break;
      default:
        break;
    }
    yield next();
  }
);
