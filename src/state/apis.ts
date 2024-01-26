import {
  createApi,
  fetcher,
  requestMonitor,
  createPipe,
  errorHandler,
  dispatchActions,
  ApiCtx,
  Next,
} from "saga-query";
import { service } from "../service";
import type { ThunkCtx } from "../types";

export const thunks = createPipe<ThunkCtx>();
thunks.use(errorHandler);
thunks.use(function* (ctx, next) {
  ctx.json = null;
  yield next();
});
thunks.use(dispatchActions);
thunks.use(thunks.routes());

// const errMessageMiddleware = function* (ctx: ApiCtx, next: Next) {
//   yield next();
//   const { ok, status, statusText } = yield ctx.response;
//   if (ctx.bodyType === "text" && ctx.json.data.includes("NOMESSAGE")) {
//     return;
//   }
//   if (!ok) {
//     // use your own error handling logic here
//     alert(`${status} ${statusText}`);
//   }
// };

export const api = createApi();
api.use(requestMonitor());
api.use(api.routes());
api.use(fetcher({ baseUrl: service }));
