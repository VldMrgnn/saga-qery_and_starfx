import { prepareStore } from "saga-query";
import { createReducerMap } from "robodux";
import { api, thunks } from "./apis";
import { counterRepo, postsRepo } from "./units";
import rootSaga from "./rootSaga";

export const reducers = createReducerMap(
  counterRepo,
  postsRepo
  //other: e.g. { name: "loadingBar", reducer: loadingBar }
);

export const apiStore = prepareStore({
  reducers,
  sagas: {
    0: api.saga(),
    1: thunks.saga(),
    2: rootSaga,
  },
});

export const rootReducer = apiStore.reducer;
export type RootReducer = ReturnType<typeof rootReducer>;
