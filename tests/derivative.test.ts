// import { describe, expect, test } from "@jest/globals";
// import { ComputeEngine, BoxedExpression } from "@cortex-js/compute-engine";

// const ce = new ComputeEngine();

// function differentiate(expr: BoxedExpression): BoxedExpression {
//   return ce.box(["D", expr, "x"]).evaluate();
// }

// describe("ceDerivative", () => {
//   test("polynomial", () => {
//     expect(
//       differentiate(ce.parse("3x^5 - 2x^2 + x + 4")).isSame(
//         ce.parse("12x^4 - 4x + 1")
//       )
//     ).toBeTruthy();
//   });
// });
