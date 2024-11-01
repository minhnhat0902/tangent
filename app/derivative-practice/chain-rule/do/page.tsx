"use client";

import { MathJaxContext } from "better-react-mathjax";
import MathJaxInputQuestion from "@/components/math/input/MathJaxInputQuestion";
import { latexCursorString } from "@/utils/serialize";
import InputQuestionSubmitButton from "@/components/math/input/InputQuestionSubmit";
import randomCompositionExpression from "@/utils/problem_generator";
import { InputQuestionProvider } from "@/components/math/input/InputQuestionContext";
import Text from "@/components/lesson/Text";
import Question from "@/components/math/Question";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function Page() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }

  return (
    <MathJaxContext
      hideUntilTypeset="first"
      config={{ options: { enableMenu: false } }}
    >
      <InputQuestionProvider
        initial={{
          ...randomCompositionExpression(),
          answerState: "pending",
          initialCursorIndex: [0],
          cursorIndex: [0],
          currentAnswer: {
            operator: "",
            expr: [latexCursorString],
          },
          initialAnswer: {
            operator: "",
            expr: [latexCursorString],
          },
        }}
      >
        <header>
          <Link href="/" className="flex items-center space-x-2">
            <Icon />
            <h1 className="text-2xl font-semibold">Tangent</h1>
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center">
          <Text>
            What&apos;s the derivative of
            <Question />?
          </Text>
          <div className="flex flex-wrap gap-4 h-fit">
            <MathJaxInputQuestion />
          </div>
          <div className="mt-4 w-full">
            <InputQuestionSubmitButton
              onNext={{ type: "set-random-question" }}
            />
          </div>
        </div>
        <div></div>
      </InputQuestionProvider>
    </MathJaxContext>
  );
}
