import { MathJaxInputQuestionButton } from "@/components/math/input/MathJaxInputQuestion";
import { latexCursorString, latexEntryPointString, latexWrapString } from "./serialize";
import { NestedIndex } from "./types/math";

export const specialButtons = {
  "\\frac{\\square}{\\square}": {
    latex: "\\frac{\\square}{\\square}",
    insertedExpr: [
      latexEntryPointString,
      {
        operator: latexWrapString,
        expr: [
          { operator: "\\frac", expr: [latexCursorString] },
          { operator: "", expr: [latexEntryPointString] },
        ],
      },
      latexEntryPointString,
    ],
    newCursor: (cursorIndex: NestedIndex) => [
      ...cursorIndex.slice(0, -1),
      cursorIndex.at(-1)! + 1,
      0,
      0,
    ],
  },
  "\\square^{\\square}": {
    latex: "\\square^{\\square}",
    insertedExpr: [
      latexEntryPointString,
      {
        operator: latexWrapString,
        expr: [{ operator: "^", expr: [latexCursorString] }],
      },
      latexEntryPointString,
    ],
    newCursor: (cursorIndex: NestedIndex) => [
      ...cursorIndex.slice(0, -1),
      cursorIndex.at(-1)! + 1,
      0,
      0,
    ],
  },
};

export function basicButton(value: string): MathJaxInputQuestionButton {
  return {
    latex: value,
    insertedExpr: [
      latexEntryPointString,
      {
        operator: latexWrapString,
        expr: [value],
      },
      latexCursorString,
    ],
    newCursor: (cursorIndex: NestedIndex) => [
      ...cursorIndex.slice(0, -1),
      cursorIndex.at(-1)! + 2,
    ],
  };
}