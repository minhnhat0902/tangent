"use client";

import { createRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { MathJax } from "better-react-mathjax";

export interface MathButtonProps extends ButtonProps {
  latex: string;
}

export default function MathJaxButton({
  latex,
  ...props
}: MathButtonProps) {
  const buttonRef = createRef<HTMLButtonElement>();

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      {...props}
      className="h-auto text-lg"
    >
      <MathJax>{"\\(" + latex + "\\)"}</MathJax>
    </Button>
  );
}
