"use client";

import { ComputeEngine } from "@cortex-js/compute-engine";
// import katex from "katex";
// import "katex/dist/katex.min.css";
import "mathlive";
import { MathfieldElement } from "mathlive";
import { createRef, useEffect, useState } from "react";
import MathDragButton from "../DragButton";
import { MoveRight, MoveLeft, Delete } from "lucide-react";
import { Button } from "../../ui/button";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}

const ce = new ComputeEngine();

ce.latexDictionary = [
  ...ce.latexDictionary,
  {
    latexTrigger: "\\htmlClass",
    kind: "expression",
    parse: (parser) => {
      parser.parseGroup();
      return parser.parseGroup();
    },
  },
];

// export interface AnswerRackProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   latex: string;
// }

export default function MathInputAnswer() {
  const mfRef = createRef<MathfieldElement>();
  const [latex, setLatex] = useState("3x^5 - {2x^2} + x + 4");

  useEffect(() => {
    if (!mfRef.current) return;

    // Disable Mathlive menu and virtual keyboard.
    mfRef.current.menuItems = [];
    mfRef.current.mathVirtualKeyboardPolicy = "manual";
    mfRef.current.focus();
  }, [mfRef]);

  return (
    <div>
      <math-field
        ref={mfRef}
        onKeyDownCapture={(e) => {
          e.preventDefault();
        }}
      >
        {latex}
      </math-field>
      <div>
        <MathDragButton
          latex={"\\placeholder{x}^{2}"}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            mfRef.current?.executeCommand(["insert", "#@^{2}"]);
            mfRef.current?.focus();
          }}
        ></MathDragButton>
        <MathDragButton
          latex={"3x+4"}
          onClick={() => {
            mfRef.current?.executeCommand(["insert", "3x+4"]);
            mfRef.current?.focus();
          }}
        ></MathDragButton>
        <Button
          onClick={() => {
            mfRef.current?.executeCommand(["moveToGroupStart"]);
            mfRef.current?.focus();
          }}
          variant={"outline"}
          size={"icon"}
        >
          <MoveLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            mfRef.current?.executeCommand(["moveToGroupEnd"]);
            mfRef.current?.focus();
          }}
          variant={"outline"}
          size={"icon"}
        >
          <MoveRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            mfRef.current?.executeCommand(["deleteBackward"]);
            mfRef.current?.focus();
          }}
          variant={"outline"}
          size={"icon"}
        >
          <Delete className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
