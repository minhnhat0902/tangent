"use client";

import { InnerExpression, Expression, NestedIndex } from "@/utils/types/math";
import { useMemo } from "react";
import { MoveRight, MoveLeft, Delete } from "lucide-react";
import { Button } from "../../ui/button";
import { MathJax } from "better-react-mathjax";
import MathJaxButton from "./MathJaxButton";
import { Separator } from "@/components/ui/separator";
import {
  latexCursorString,
  latexEntryPointString,
  latexWrapString,
  toLatex,
} from "@/utils/serialize";
import {
  useInputQuestion,
  useInputQuestionDispatch,
} from "./InputQuestionContext";

export interface MathJaxInputQuestionButton {
  latex: string;
  insertedExpr: Expression[];
  newCursor: (cursorIndex: NestedIndex) => NestedIndex;
}

export default function MathJaxInputQuestion() {
  const { options, currentAnswer, cursorIndex } = useInputQuestion();
  const dispatch = useInputQuestionDispatch();

  function setCurrentAnswer(value: InnerExpression) {
    dispatch({ type: "set-answer", value });
  }
  function setCursorIndex(value: NestedIndex) {
    dispatch({ type: "set-cursor-index", value });
  }

  const latex = useMemo(() => {
    console.log(
      "\\(" +
        toLatex(currentAnswer).replaceAll(
          "{" + latexEntryPointString + "}",
          "{\\square}"
        ) +
        "\\)"
    );
    return (
      "\\(" +
      toLatex(currentAnswer).replaceAll(
        "{" + latexEntryPointString + "}",
        "{\\square}"
      ) +
      "\\)"
    );
  }, [currentAnswer]);

  function indexIsZero(index: NestedIndex): boolean {
    return index.length == 0 || index.every((i) => i == 0);
  }

  function indexIsFinal(index: NestedIndex): boolean {
    if (index.length == 0) return true;

    function rec(arr: InnerExpression, index: NestedIndex): boolean {
      if (index[0] != arr.expr.length - 1) return false;
      if (index.length == 1) return true;

      return rec(arr.expr[index[0]] as InnerExpression, index.slice(1));
    }

    return rec(currentAnswer, index);
  }

  function exprAt(index: NestedIndex): Expression {
    return deepIndexing(currentAnswer, index);
  }

  function deepIndexing(arr: InnerExpression, index: NestedIndex): Expression {
    if (index.length == 0) return arr;

    return deepIndexing(arr.expr[index[0]] as InnerExpression, index.slice(1));
  }

  function changeExprAt(
    expr: InnerExpression,
    index: NestedIndex,
    delCount: number,
    ...values: Expression[]
  ): InnerExpression {
    const newExpr = structuredClone(expr);
    (deepIndexing(newExpr, index.slice(0, -1)) as InnerExpression).expr.splice(
      index.at(-1)!,
      delCount,
      ...values
    );
    return newExpr;
  }

  // Assuming that the index is not fully zero.
  function decrementIndex(index: NestedIndex): number[] {
    if (index.at(-1) == 0) return decrementIndex(index.slice(0, -1));

    const outerIndex = [...index.slice(0, -1)!, index.at(-1)! - 1];
    let currentExpr = exprAt(outerIndex);
    while (typeof currentExpr != "string") {
      const lastIndex = currentExpr.expr.length - 1;
      outerIndex.push(lastIndex);
      currentExpr = currentExpr.expr[lastIndex];
    }

    return outerIndex;
  }

  function incrementIndex(index: NestedIndex): number[] {
    if (
      index.at(-1) ==
      (exprAt(index.slice(0, -1)) as InnerExpression).expr.length - 1
    )
      return incrementIndex(index.slice(0, -1));

    const outerIndex = [...index.slice(0, -1)!, index.at(-1)! + 1];
    let currentExpr = exprAt(outerIndex);
    while (typeof currentExpr != "string") {
      outerIndex.push(0);
      currentExpr = currentExpr.expr[0];
    }

    return outerIndex;
  }

  function pressLeft() {
    if (typeof currentAnswer == "string") return;
    if (indexIsZero(cursorIndex)) return;

    let currentIndex = [...cursorIndex];
    let newCursorIndex: NestedIndex | null = null;

    while (true) {
      if (exprAt(currentIndex) == latexEntryPointString) {
        newCursorIndex = [...currentIndex];
        break;
      }

      if (indexIsZero(currentIndex)) break;
      currentIndex = decrementIndex(currentIndex);
    }

    if (newCursorIndex == null) return;

    setCurrentAnswer(
      changeExprAt(
        changeExprAt(currentAnswer, newCursorIndex, 1, latexCursorString),
        cursorIndex,
        1,
        latexEntryPointString
      )
    );
    setCursorIndex(newCursorIndex);
  }

  function pressRight() {
    if (typeof currentAnswer == "string") return;
    if (indexIsFinal(cursorIndex)) return;

    let currentIndex = [...cursorIndex];
    let newCursorIndex: number[] | null = null;

    while (true) {
      if (exprAt(currentIndex) == latexEntryPointString) {
        newCursorIndex = [...currentIndex];
        break;
      }

      if (indexIsFinal(currentIndex)) break;
      currentIndex = incrementIndex(currentIndex);
    }

    if (newCursorIndex == null) return;

    setCurrentAnswer(
      changeExprAt(
        changeExprAt(currentAnswer, newCursorIndex, 1, latexCursorString),
        cursorIndex,
        1,
        latexEntryPointString
      )
    );
    setCursorIndex(newCursorIndex);
  }

  function pressDelete() {
    if (typeof currentAnswer == "string") return;
    if (indexIsZero(cursorIndex)) return;

    if (cursorIndex.at(-1) != 0) {
      const prevIndex = [...cursorIndex.slice(0, -1), cursorIndex.at(-1)! - 1];
      const prevExpr = exprAt(prevIndex);

      if (typeof prevExpr != "string" && prevExpr.operator == latexWrapString) {
        setCurrentAnswer(
          changeExprAt(currentAnswer, decrementIndex(prevIndex), 2)
        );
        setCursorIndex([...cursorIndex.slice(0, -1), cursorIndex.at(-1)! - 2]);
        return;
      }
    }

    let i = cursorIndex.length - 1;
    for (; i >= 1; i--) {
      const parentExpr = exprAt(cursorIndex.slice(0, i));
      if (
        typeof parentExpr != "string" &&
        parentExpr.operator == latexWrapString
      ) {
        break;
      }
    }

    if (i == 0) return;

    const parentIndex = cursorIndex.slice(0, i);
    const parentExpr = exprAt(parentIndex) as InnerExpression;
    const strippedExpr: Expression[] = [latexEntryPointString];

    function dfs(expr: Expression) {
      if (expr == latexCursorString) {
        if (strippedExpr.at(-1) == latexEntryPointString) strippedExpr.pop();
        strippedExpr.push(latexCursorString);
        setCursorIndex([
          ...parentIndex.slice(0, -1),
          parentIndex.at(-1)! + strippedExpr.length - 2,
        ]);
        return;
      }
      if (typeof expr == "string") return;
      if (expr.operator == latexWrapString) {
        strippedExpr.push(expr, latexEntryPointString);
        return;
      }
      for (let i = 0; i < expr.expr.length; i++) {
        dfs(expr.expr[i]);
      }
    }

    parentExpr.expr.forEach(dfs);
    setCurrentAnswer(
      changeExprAt(
        currentAnswer,
        [...parentIndex.slice(0, -1), parentIndex.at(-1)! - 1],
        3,
        ...strippedExpr
      )
    );
  }

  return (
    <div className="flex flex-col gap-4 w-60 md:w-80">
      <Separator />
      <div className="h-10">
        <MathJax inline dynamic className="text-lg">
          {latex}
        </MathJax>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-4 h-fit">
        {options.map((button) => (
          <MathJaxButton
            key={button.latex}
            latex={button.latex}
            onClick={() => {
              setCurrentAnswer(
                changeExprAt(
                  currentAnswer,
                  cursorIndex,
                  1,
                  ...button.insertedExpr
                )
              );
              setCursorIndex(button.newCursor(cursorIndex));
            }}
          />
        ))}
      </div>
      <div className="flex gap-4 justify-center mt-8">
        <Button onClick={pressLeft} variant={"outline"} size={"icon"}>
          <MoveLeft className="h-4 w-4" />
        </Button>
        <Button onClick={pressRight} variant={"outline"} size={"icon"}>
          <MoveRight className="h-4 w-4" />
        </Button>
        <Button onClick={pressDelete} variant={"outline"} size={"icon"}>
          <Delete className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
