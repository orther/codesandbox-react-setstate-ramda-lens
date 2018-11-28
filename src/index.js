import React from "react";
import ReactDOM from "react-dom";
import R from "ramda";

import App from "./App";

// A lens focuses on a specific prop/path within an object used for getting or setting
// the value. The main benefit of using a lens in place of the standard functions Ramda
// provides for interacting with Objects is it allows you to define the focal point
// (think R.prop or R.path) completely decoupled from the operations that will be used.
// The below code should help illustrate what I mean by decoupled from the operation:

const data = { one: 1, nest: { two: 2 } };

// ----------------------
// --- withOUT Lenses ---
// ----------------------
// :: 0) Define Focal Points
const onePath = ["one"];
const twoPath = ["nest", "two"];
// :: 1) Reading Values
R.path(onePath, data); // => 1
R.path(twoPath, data); // => 2
// :: 2) Setting Values
R.assocPath(onePath, "Uno", data); // => { one: 'Uno', nest: { two: 2 } }
R.assocPath(twoPath, "Dos", data); // => { one: 1, nest: { two: 'Dos' } }
// :: 3) Updating Values
//    3a - R.converge + R.assocPath + R.path = verbose & convoluted
const updateConverge = (path, updateFn) =>
  R.converge(
    // converging fn           :: <- (1) R.assocPath(onePath)
    R.assocPath(path),
    [
      // branch fn => newValue :: <- (2) R.assocPath(onePath)(newValue)
      R.pipe(
        R.path(path),
        updateFn,
      ),
      // branch fn => data     :: <- (3) R.assocPath(onePath)(newValue)(data)
      R.identity, // (=> data)
    ],
  );

updateConverge(onePath, R.negate);
const twoNegate = updateConverge(twoPath, R.negate);
console.log(oneNegate(data));
console.log(twoNegate(data));

const lens3a1Out = R.converge(
  R.assocPath(onePath), //   <- (1) R.assocPath(onePath)
  [
    R.pipe(
      R.path(onePath),
      R.negate,
    ), // => newValue        <- (2) R.assocPath(onePath)(newValue)
    R.identity, // => data   <- (3) R.assocPath(onePath)(newValue)(data)
  ],
)(data);
R.evolve({ one: R.negate }, data); // => { one: -1, nest: { two: 2 } }
R.evolve({ nest: { two: R.negate } }, data); // => { one: 1, nest: { two: -2 } }
// NOTE: R,assocPath composed w/ R.path could be used instead of R.evolve
//       but it's verbose. Obvious disadvantage Evolve is you can use the standard array of strings path format
//       (e.g. onePath/twoPath) and it is less performant.

// -------------------
// === WITH Lenses ===
// -------------------
// 0) Define Focal Points
const oneLens = R.lensPath(["one"]);
const twoLens = R.lensPath(["nest", "two"]);
// 1) Reading Values
R.view(oneLens, data); // => 1
R.view(twoLens, data); // => 2
// 2) Setting Values
R.set(oneLens, "Uno", data); // => { one: 'Uno', nest: { two: 2 } }
R.set(twoLens, "Dos", data); // => { one: 1, nest: { two: 'Dos' } }
// 3) Updating Values
R.over(oneLens, R.negate, data); // => { one: -1, nest: { two: 2 } }
R.over(twoLens, R.negate, data); // => { one: 1, nest: { two: -2 } }

// separate  (a lens) completely separate from the data operation.
// A lens, allowing lenses to be built from less specific lenses, and also com
// completely decoupled from data operation to be applied.

// R.set  - updates the value the lesnse focuses on with the value passed in

// R.over - updates the value the lens focuses on by applying a function to it

// R.lensPath returns a lens that is focused on the path provided
const nameLens = R.lensPath(["person", "name"]);
const ageLens = R.lensPath(["person", "age"]);
const isActiveLens = R.lensPath(["user", "isActive"]);
const userIdLens = R.lensPath(["user", "id"]);

// -----------------------
// -- Render App to DOM --
// -----------------------
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
