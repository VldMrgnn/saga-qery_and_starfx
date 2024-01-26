import { take, put, spawn } from "saga-query";
import { createAction } from "@reduxjs/toolkit";

import type { PersistConfig } from "redux-persist";
import type { Reducer } from "@reduxjs/toolkit";
import type { Action, AppState } from "../types";

export const resetStore = createAction("RESET_STORE");

const ALLOW_LIST: (keyof AppState)[] = [];

const keepState = (
  state: AppState | undefined
): Partial<AppState> | undefined => {
  if (!state) {
    return state;
  }

  return ALLOW_LIST.reduce<Partial<AppState>>((acc, slice) => {
    (acc as any)[slice] = state[slice];
    return acc;
  }, {});
};

export const resetReducer =
  (rootReducer: Reducer, persistConfig: PersistConfig<any>) =>
  (state: AppState | undefined, action: Action<any>) => {
    if (action.type === `${resetStore}`) {
      const { storage, key } = persistConfig;
      storage.removeItem(`persist:${key}`);
      const nextState = keepState(state);
      return rootReducer(nextState, action);
    }
    return rootReducer(state, action);
  };

function* watchResetToken() {
  while (true) {
    yield* take(`${resetStore}`);
    yield* put(resetStore());
  }
}

export function* resetStoreSaga() {
  yield* spawn(watchResetToken);
}
