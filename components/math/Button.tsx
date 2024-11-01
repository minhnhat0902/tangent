"use client";

import { createRef, useEffect } from "react";
import "mathlive";
import { MathfieldElement, renderMathInElement } from "mathlive";
// import katex from "katex";
import "katex/dist/katex.min.css";
import { Button, ButtonProps } from "@/components/ui/button";

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

export interface MathButtonProps extends ButtonProps {
  latex: string;
  displayStyle?: "display" | "text" | "script" | "scriptscript";
}

export default function MathButton({
  latex,
  displayStyle = "display",
  ...props
}: MathButtonProps) {
  const buttonRef = createRef<HTMLButtonElement>();

  useEffect(() => {
    if (buttonRef.current) {
      // katex.render(`\\${displayStyle}style ` + latex, buttonRef.current, {
      //   trust: (context) => context.command === "\\htmlClass",
      // });
      renderMathInElement(
        buttonRef.current,)
    }
  }, [buttonRef, displayStyle, latex]);

  // return <Button ref={buttonRef} variant="outline" {...props}  className="h-auto text-xl" />;
  return (
    <Button variant="outline" ref={buttonRef} {...props} className="h-auto text-xl">
      {/* <math-field read-only className="h-auto text-xl" onClick={(e) => e.preventDefault()}>
        {`\\${displayStyle}style ` + latex}
      </math-field> */}
      {`\\[\\${displayStyle}style ${latex}\\]` }
    </Button>
  );
}
