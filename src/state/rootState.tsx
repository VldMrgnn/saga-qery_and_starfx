import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore, persistReducer } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // or localforage //
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

import { resetReducer } from "./resetStore";
import { rootReducer, apiStore } from "./rootStore";

import type { Store, AnyAction } from "redux";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: hardSet,
  blacklist: ["counter", "posts"],
};
const rootReducer_super = resetReducer(rootReducer, persistConfig);
const rootReducer_super_super = persistReducer<RootState>(
  persistConfig,
  rootReducer_super
);

export function setupStore(): Store {
  const store = configureStore({
    reducer: rootReducer_super_super,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          warnAfter: 105,
        },
      }).concat(apiStore.middleware),
    devTools:
      process.env.NODE_ENV !== "production" ? { name: "devTools" } : false,
    enhancers: (defaultEnhancers) => [...defaultEnhancers],
  });
  apiStore.run();
  return store;
}
const store = setupStore();
const persistor = persistStore(store);

export function Store({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}

export type PersistorState = ReturnType<typeof persistor.getState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ((actions: AnyAction[]) => AnyAction[]);
