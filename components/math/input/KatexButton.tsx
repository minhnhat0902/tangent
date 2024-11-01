"use client";

import { createRef, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Button, ButtonProps } from "@/components/ui/button";

export interface MathButtonProps extends ButtonProps {
  latex: string;
  displayStyle?: "display" | "text" | "script" | "scriptscript";
}

export default function MathKatexButton({
  latex,
  displayStyle = "display",
  ...props
}: MathButtonProps) {
  const buttonRef = createRef<HTMLButtonElement>();

  useEffect(() => {
    if (buttonRef.current) {
      katex.render(`\\${displayStyle}style ` + latex, buttonRef.current, {
        trust: (context) => context.command === "\\htmlClass",
      });
    }
  }, [buttonRef, displayStyle, latex]);

  return <Button ref={buttonRef} variant="outline" {...props} className="h-auto text-xl" />;
}
