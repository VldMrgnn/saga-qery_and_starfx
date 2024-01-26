import { put, select } from "saga-query";
import { createTable } from "robodux";
import { createSelector } from "reselect";
import { api, thunks } from "../apis";
import { service } from "../../service";

import type { ApiCtx, Next } from "saga-query";
import type { RootState } from "../rootState";
import type { ThunkCtx, TPost } from "../../types";

const REPO_NAME = "posts";
export const postsRepo = createTable<TPost>({
  name: REPO_NAME,
  initialState: {},
});

const postSelectors = postsRepo.getSelectors(
  (state: RootState) => state[REPO_NAME]
);
export const postList = createSelector(
  postSelectors.selectTableAsList,
  (table) => table
);
const postIds = createSelector(postSelectors.selectTable, (pMap) =>
  Object.keys(pMap)
);

export const loadPosts = api.get<{ id: number }>(
  `/load-posts`,
  function* (ctx: ApiCtx, next: Next) {
    ctx.request = ctx.req({
      url: `/posts/${ctx.payload.id}`,
    });
    yield next();
    const { data, ok } = yield ctx.json;
    if (!ok || !data) {
      throw new Error("failed to fetch posts");
    }
    const posts = Array.isArray(data) ? data : [data];
    const postsMap = posts.reduce((acc, post) => {
      acc[post.id] = post;
      return acc;
    }, {});
    yield* put(postsRepo.actions.add(postsMap));
  }
);

export const removePosts = thunks.create("removePosts", 
function* (_ctx:ThunkCtx, next:Next) {
  
  const ids = yield* select(postIds);
  yield* put(postsRepo.actions.remove(ids));
  yield next();
});
