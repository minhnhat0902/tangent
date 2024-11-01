"use client";

import MathButton, { MathButtonProps } from "./Button";

export default function MathDragButton(props: MathButtonProps) {
  return (
    <MathButton
      {...props}
      // draggable
      onDrag={(e) => {
        e.preventDefault();
      }}
      className="h-auto text-xl"
    />
  );
}
