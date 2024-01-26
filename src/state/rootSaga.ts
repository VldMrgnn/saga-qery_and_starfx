import { all, spawn, put } from "saga-query";
import { resetStoreSaga } from "./resetStore";

function* startUpLog() {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  yield console.log(
    `YOU \u00A9 ${new Date().getFullYear()}| Your app | run. ${formattedDate} ${formattedTime} | ${
      process.env.NODE_ENV
    }`
  );
  //do not change, see prebuild script//
  yield console.log("build id: 01/2023-06-11 22:56:05");
}

export default function* rootSaga() {
  yield* put({ type: "RESET_STORE" });
  yield* all([spawn(startUpLog), spawn(resetStoreSaga)]);
}
