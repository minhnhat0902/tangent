import { Expression } from "./types/math";

export const latexInvisibleString = "\\vphantom{\\text{I}}";
export const latexCursorString = `\\class{math-cursor}{${latexInvisibleString}}`;
export const latexEntryPointString = `\\class{entry-point}{${latexInvisibleString}}`;
export const latexWrapString = "\\class{drag-button}";

export function toLatex(expr: Expression): string {
  if (typeof expr == "string") return expr;

  return expr.operator + "{".concat(...expr.expr.map(toLatex)) + "}";
}

export function toStrippedLatex(expr: Expression): string {
  if (typeof expr == "string") {
    if (expr == latexCursorString || expr == latexEntryPointString) return " ";
    return expr;
  }
  if (expr.operator == latexWrapString)
    return "".concat(...expr.expr.map(toStrippedLatex));

  return expr.operator + "{".concat(...expr.expr.map(toStrippedLatex)) + "}";
}
