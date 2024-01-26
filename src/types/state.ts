import type { PipeCtx, LoaderCtx } from "saga-query";

export interface AppState {
  [key: string]: any;
}
export interface Action<T extends string = string> {
  type: T;
}

export interface ThunkCtx<P = any, D = any> extends PipeCtx<P>, LoaderCtx<P> {
  actions: Action[];
  json: D | null;
}
