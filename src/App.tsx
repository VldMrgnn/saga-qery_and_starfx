import { useMemo, useState } from 'react';
import { useLoader } from 'saga-query/react';

import './App.scss';
import {
    counterOp, loadPosts, postList, removePosts, selectCounter, useAppDispatch, useAppSelector
} from './state';

import type { TPost } from "./types";

function App() {
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(0);
  const [postsToFetch, setPostsToFetch] = useState(1);
  const counter = useAppSelector(selectCounter);
  const posts: TPost[] = useAppSelector(postList);
  const loader = useLoader(loadPosts);
  const buttonLabel = useMemo(() => {
    switch (loader?.status) {
      case "loading":
        return "≋";
      case "success":
        return '⟳';
      default:
        return "⩗";
    }
  }, [loader?.status]);
  return (
    <div id={"containerMain"}>
      <div id={"containerHeader"}>
        <h1>Webpack + React + Redux-Saga</h1>
        <h2>with saga-query</h2>
      </div>
      <div id="local-pane">
        <div className="card">
          <h2>Local State</h2>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
      <div id="thunk-pane">
        <div className="card">
          <h2>Redux Saga</h2>
          <h3>saga-query / thunk</h3>
          <p>{`Store counter is ${counter}`}</p>
          <button
            onClick={() => dispatch(counterOp({ type: "set", payload: 42 }))}
          >
            set 42
          </button>
          <button onClick={() => dispatch(counterOp({ type: "decrement" }))}>
            decrement
          </button>
          <button onClick={() => dispatch(counterOp({ type: "increment" }))}>
            increment
          </button>
          <button onClick={() => dispatch(counterOp({ type: "reset" }))}>
            reset
          </button>
        </div>
      </div>
      <div id="api-pane">
        <div className="card">
          <h2>Redux Saga</h2>
          <h3>saga-query / api</h3>
          <button
            onClick={() =>
              setPostsToFetch((postsToFetch) => {
                if (postsToFetch === 1) return 1;
                return postsToFetch - 1;
              })
            }
            disabled={postsToFetch === 1}
          >
            -
          </button>
          <button onClick={() => dispatch(loadPosts({ id: postsToFetch }))}>
            Fetch post id:{postsToFetch}&nbsp;&nbsp;
            <span style={{color:'#DA5359'}}>{buttonLabel}</span>
          </button>
          <button
            onClick={() =>
              setPostsToFetch((postsToFetch) => {
                if (postsToFetch === 100) return 100;
                return postsToFetch + 1;
              })
            }
            disabled={postsToFetch === 10}
          >
            +
          </button>

          <button onClick={() => dispatch(removePosts())}>
            Remove all posts
          </button>
          {posts.map((post) => ({ ...post, id: post.id.toString() })).map((post) => {
            return (
              <div key={post.id} style={{ textAlign: "left" }}>
                <h4>{post.title}{'  [#'}{post.id}{']'}</h4>
                <p>{post.body}</p>
              </div>
            );
          })}
        </div>
       
      </div>
      <div id="containerFooter">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
