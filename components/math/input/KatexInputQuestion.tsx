"use client";

import { BoxedExpression, ComputeEngine } from "@cortex-js/compute-engine";
import katex from "katex";
import "katex/dist/katex.min.css";
import { createRef, useEffect, useState } from "react";
import MathDragButton from "../DragButton";
import { MoveRight, MoveLeft, Delete } from "lucide-react";
import { Button } from "../../ui/button";
import MathKatexButton from "./KatexButton";
import { start } from "repl";

const latexCursorString = "\\htmlClass{math-cursor}{\\text{\\textbar}}";
const latexEntryPointString = "\\htmlClass{entry-point}{}";
const latexWrapString = "\\htmlClass{drag-button}";
const latexWrapDelim = "\\vphantom{\\text{\\textbar}}";

const ce = new ComputeEngine();

// ce.latexDictionary = [
//   ...ce.latexDictionary,
//   {
//     latexTrigger: "\\htmlClass",
//     kind: "expression",
//     parse: (parser) => {
//       const className = parser.parseStringGroup();

//       // parser.match("{");
//       const content = parser.parseExpression();
//       // parser.match("}");

//       console.log(className, content);

//       return className == "drag-button" ? content : null;
//     },
//   },
// ];

// interface LatexGroup {
//   latex: string,
//   precedence: number,
// }

// enum Precedence {
//   Comparison = 0,
//   Add = 1,
//   Unary = 2,
//   Multiply = 3,
//   Function = 4,
//   Exponent = 5,
// }

// export interface AnswerRackProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   latex: string;
// }

const dragButtonTwClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border !border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-auto mx-1 px-1 py-1".split(
    " "
  );

export default function MathKatexInputQuestion() {
  const ref = createRef<HTMLDivElement>();
  const [latex, setLatex] = useState(latexCursorString);
  const [expr, setExpr] = useState<BoxedExpression | null>(null);
  // const [recentGroup, setRecentGroup] = useState<LatexGroup>({
  //   latex: "",
  //   precedence: 0,
  // });

  function pressLeft() {
    const cursorIndex = latex.indexOf(latexCursorString);

    const newCursorIndex = latex
      .slice(0, cursorIndex)
      .lastIndexOf(latexEntryPointString);

    if (newCursorIndex == -1) return;

    setLatex(
      latex.slice(0, newCursorIndex) +
        latexCursorString +
        latex.slice(
          newCursorIndex + latexEntryPointString.length,
          cursorIndex
        ) +
        latexEntryPointString +
        latex.slice(cursorIndex + latexCursorString.length)
    );
  }

  function pressRight() {
    const cursorIndex = latex.indexOf(latexCursorString);

    const newCursorIndex = latex.indexOf(latexEntryPointString, cursorIndex);

    if (newCursorIndex == -1) return;

    setLatex(
      latex.slice(0, cursorIndex) +
        latexEntryPointString +
        latex.slice(cursorIndex + latexCursorString.length, newCursorIndex) +
        latexCursorString +
        latex.slice(newCursorIndex + latexEntryPointString.length)
    );
  }

  function pressDelete() {
    const cursorIndex = latex.indexOf(latexCursorString);
    const newCursorIndex = latex
      .slice(0, cursorIndex)
      .lastIndexOf(latexEntryPointString);

    // Cursor is at the beginning.
    if (newCursorIndex == -1) return;

    const left = latex.slice(0, newCursorIndex);
    const right = latex.slice(cursorIndex + latexCursorString.length);
    const inBetween = latex.slice(
      newCursorIndex + latexEntryPointString.length,
      cursorIndex
    );

    if (
      inBetween.startsWith(latexWrapString + "{" + latexWrapDelim) &&
      inBetween.endsWith(latexWrapDelim + "}")
    ) {
      // Delete a single drag button.
      setLatex(left + latexCursorString + right);
      return;
    } else if (inBetween.endsWith("{")) {
      let content = latexCursorString;
      let leftEnd = cursorIndex;
      let rightEnd = cursorIndex + latexCursorString.length;
      let justAddedEntryPoint = false;

      while (true) {
        const leftString = latex.slice(0, leftEnd);
        const startWrapIndex = leftString.lastIndexOf(latexWrapString);
        const endWrapDelimIndex = leftString.lastIndexOf(latexWrapDelim + "}");
        const entryPointIndex = leftString.lastIndexOf(latexEntryPointString);

        if (
          entryPointIndex > endWrapDelimIndex &&
          entryPointIndex > startWrapIndex
        ) {
          // Prepend an entry point if haven't.
          if (!justAddedEntryPoint) {
            content = latexEntryPointString + content;
            justAddedEntryPoint = true;
          }
          leftEnd = entryPointIndex;
        } else if (startWrapIndex > endWrapDelimIndex) {
          // No more wrap to add.
          leftEnd = startWrapIndex;
          break;
        } else {
          // Add last wrap to content;
          leftEnd = endWrapDelimIndex;

          for (let depth = 1; depth > 0; ) {
            const leftString = latex.slice(0, leftEnd);
            const endWrapDelimIndex = leftString.lastIndexOf(
              latexWrapDelim + "}"
            );
            const startWrapIndex = leftString.lastIndexOf(latexWrapString);

            if (startWrapIndex > endWrapDelimIndex) {
              depth--;
              leftEnd = startWrapIndex;
            } else {
              leftEnd = endWrapDelimIndex;
              depth++;
            }
          }

          content = latex.slice(leftEnd, endWrapDelimIndex + 1) + content;
          justAddedEntryPoint = false;
        }
      }

      justAddedEntryPoint = false;

      while (true) {
        const startWrapIndex = latex.indexOf(latexWrapString, rightEnd);
        const endWrapDelimIndex = latex.indexOf(latexWrapDelim + "}", rightEnd);
        const entryPointIndex = latex.indexOf(latexEntryPointString, rightEnd);

        if (
          entryPointIndex < endWrapDelimIndex &&
          entryPointIndex < startWrapIndex
        ) {
          // Append an entry point if haven't.
          if (!justAddedEntryPoint) {
            content += latexEntryPointString;
            justAddedEntryPoint = true;
          }
          rightEnd = entryPointIndex + latexEntryPointString.length;
        } else if (endWrapDelimIndex < startWrapIndex) {
          // No more wrap to add.
          rightEnd = endWrapDelimIndex + latexWrapDelim.length + 1;
          break;
        } else {
          // Add next wrap to content;
          rightEnd = startWrapIndex + latexWrapString.length;

          for (let depth = 1; depth > 0; ) {
            const startWrapIndex = latex.indexOf(latexWrapString, rightEnd);
            const endWrapDelimIndex = latex.indexOf(
              latexWrapDelim + "}",
              rightEnd
            );

            if (startWrapIndex < endWrapDelimIndex) {
              depth++;
              rightEnd = startWrapIndex + latexWrapString.length;
            } else {
              depth--;
              rightEnd = endWrapDelimIndex + latexWrapDelim.length + 1;
            }
          }

          content += latex.slice(startWrapIndex, rightEnd);
          justAddedEntryPoint = false;
        }
      }

      console.log(latex.slice(rightEnd));

      setLatex(latex.slice(0, leftEnd) + content + latex.slice(rightEnd));
    }

    // if (newCur)
    //   if (
    //     latex.charAt(cursorIndex - 1) == "{" ||
    //     latex.charAt(newCursorIndex + latexCursorString.length - 1) ==
    //       "}"
    //   ) {
    //     setLatex(
    //       latex.slice(0, newCursorIndex) +
    //         latexCursorString +
    //         latex.slice(
    //           newCursorIndex + latexEntryPointString.length,
    //           cursorIndex
    //         ) +
    //         latexEntryPointString +
    //         latex.slice(cursorIndex + latexCursorString.length)
    //     );
    //     return;
    //   }
  }

  useEffect(() => {
    if (!ref.current) return;

    const formatted = latex.replaceAll(
      "{" + latexEntryPointString + "}",
      "{\\square}"
    );

    katex.render(`\\displaystyle ` + formatted, ref.current, {
      trust: (context) => context.command === "\\htmlClass",
    });

    ref.current.querySelectorAll("span.enclosing.drag-button").forEach((el) => {
      el.classList.add(...dragButtonTwClasses);
    });
  }, [ref, latex]);

  useEffect(() => {
    const strippedLatex = latex
      .replaceAll(latexCursorString, "")
      .replaceAll(latexEntryPointString, "")
      .replaceAll("\\htmlClass{drag-button}{\\vphantom{\\text{\\textbar}}", "")
      .replaceAll("\\vphantom{\\text{\\textbar}}}", "");

    setExpr(ce.parse(strippedLatex));
  }, [latex]);

  return (
    <div>
      <div ref={ref}></div>
      <div>
        <MathKatexButton
          latex={"\\square^{2}"}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            setLatex(
              latex.replace(
                latexCursorString,
                "\\htmlClass{entry-point}{}\\htmlClass{drag-button}{\\vphantom{\\text{\\textbar}}^{2}\\vphantom{\\text{\\textbar}}}" +
                  latexCursorString
              )
            );
          }}
        ></MathKatexButton>
        <MathKatexButton
          latex={"3x+4"}
          onClick={() => {
            setLatex(
              latex.replace(
                latexCursorString,
                "\\htmlClass{entry-point}{}\\htmlClass{drag-button}{\\vphantom{\\text{\\textbar}}3x+4\\vphantom{\\text{\\textbar}}}" +
                  latexCursorString
              )
            );
          }}
        ></MathKatexButton>
        <MathKatexButton
          latex={"\\frac{\\square}{\\square}"}
          onClick={() => {
            setLatex(
              latex.replace(
                latexCursorString,
                "\\htmlClass{entry-point}{}\\htmlClass{drag-button}{\\vphantom{\\text{\\textbar}}\\frac{" +
                  latexCursorString +
                  "}{\\htmlClass{entry-point}{}}\\vphantom{\\text{\\textbar}}}\\htmlClass{entry-point}{}"
              )
            );
          }}
        ></MathKatexButton>
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
