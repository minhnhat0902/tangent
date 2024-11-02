"use client";

import Slide from "@/components/lesson/Slide";
import Text from "@/components/lesson/Text";
import InputQuestionSubmitButton from "@/components/math/input/InputQuestionSubmit";
import MultipleChoice from "@/components/math/mcq/MultipleChoice";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useState } from "react";
import MultipleChoiceSubmit from "@/components/math/mcq/MultipleChoiceSubmit";
import { MultipleChoiceProvider } from "@/components/math/mcq/MultipleChoiceContext";
import { InputQuestionProvider } from "@/components/math/input/InputQuestionContext";
import MathJaxInputQuestion from "@/components/math/input/MathJaxInputQuestion";
import { latexCursorString, latexEntryPointString } from "@/utils/serialize";
import ce from "@/utils/compute-engine/custom-engine";
import { basicButton, specialButtons } from "@/utils/buttons";
import Icon from "@/components/Icon";
import Link from "next/link";

export default function Page() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <MathJaxContext
      hideUntilTypeset="first"
      config={{ options: { enableMenu: false } }}
    >
      <header>
        <Link href="/" className="flex items-center space-x-2">
          <Icon />
          <h1 className="text-2xl font-semibold">Tangent</h1>
        </Link>
      </header>
      {
        [
          <Slide key={0}>
            <MultipleChoiceProvider
              initial={{
                options: ["\\sin", "\\square^{2}"],
                correctAnswer: 0,
                currentAnswer: null,
                answerState: "pending",
              }}
            >
              <Text>
                What&rsquo;s the outer function for{" "}
                <MathJax dynamic inline>
                  {"\\(\\sin(x^2)" + latexEntryPointString + "\\)"}
                </MathJax>
                ?
              </Text>
              <MultipleChoice />
              <MultipleChoiceSubmit onNext={() => setCurrentSlide(1)} />
            </MultipleChoiceProvider>
          </Slide>,
          <Slide key={1}>
            <MultipleChoiceProvider
              initial={{
                options: ["-\\cos", "\\cos", "\\tan", "\\cot"],
                correctAnswer: 1,
                currentAnswer: null,
                answerState: "pending",
              }}
            >
              <Text>
                To use the chain rule, we will have to differentiate the outer
                function first, while leaving the inner function unchanged.
              </Text>
              <Text>
                What&rsquo;s the derivative of{" "}
                <MathJax inline>\(\sin\)</MathJax>?
              </Text>
              <MultipleChoice />
              <MultipleChoiceSubmit onNext={() => setCurrentSlide(2)} />
            </MultipleChoiceProvider>
          </Slide>,
          <Slide key={2}>
            <InputQuestionProvider
              initial={{
                questionLatex: "",
                options: [
                  basicButton("x"),
                  basicButton("2"),
                  specialButtons["\\square^{\\square}"],
                ],
                correctAnswer: ce.parse("\\cos(x^2)"),
                initialAnswer: {
                  operator: "",
                  expr: ["\\cos(", latexCursorString, ")"],
                },
                currentAnswer: {
                  operator: "",
                  expr: ["\\cos(", latexCursorString, ")"],
                },
                initialCursorIndex: [1],
                cursorIndex: [1],
                answerState: "pending",
              }}
            >
              <Text>
                Now let&rsquo;s put the inner function of{" "}
                <MathJax inline>{"\\(\\sin(x^2)\\)"}</MathJax>
                inside the derivative we just found.
              </Text>
              <MathJaxInputQuestion />
              <InputQuestionSubmitButton onNext={() => setCurrentSlide(3)} />
            </InputQuestionProvider>
          </Slide>,
          <Slide key={3}>
            <InputQuestionProvider
              initial={{
                questionLatex: "",
                options: [
                  basicButton("x"),
                  basicButton("2"),
                  specialButtons["\\square^{\\square}"],
                ],
                correctAnswer: ce.parse("2x"),
                initialAnswer: {
                  operator: "",
                  expr: [latexCursorString],
                },
                currentAnswer: {
                  operator: "",
                  expr: [latexCursorString],
                },
                initialCursorIndex: [0],
                cursorIndex: [0],
                answerState: "pending",
              }}
            >
              <Text>
                There&rsquo;s just one more step we need to do, which is to
                multiply what we just got by the derivative of the inner
                function.
              </Text>
              <Text>
                First up, do you remember what the derivative of{" "}
                <MathJax inline>{"\\(x^2\\)"}</MathJax> is?
              </Text>
              <MathJaxInputQuestion />
              <InputQuestionSubmitButton onNext={() => setCurrentSlide(4)} />
            </InputQuestionProvider>
          </Slide>,
          <Slide key={4}>
            <InputQuestionProvider
              initial={{
                questionLatex: "",
                options: [
                  basicButton("x"),
                  basicButton("2"),
                  specialButtons["\\square^{\\square}"],
                ],
                correctAnswer: ce.parse("2x \\cos(x^2)"),
                initialAnswer: {
                  operator: "",
                  expr: ["\\cos(x^2)\\cdot", latexCursorString],
                },
                currentAnswer: {
                  operator: "",
                  expr: ["\\cos(x^2)\\cdot", latexCursorString],
                },
                initialCursorIndex: [1],
                cursorIndex: [1],
                answerState: "pending",
              }}
            >
              <Text>
                Now, let&rsquo;s multiply that with{" "}
                <MathJax inline>{"\\(\\cos(x^2)\\)"}</MathJax> to get our
                derivative for <MathJax inline>{"\\(\\sin(x^2)\\)"}</MathJax>.
              </Text>
              <MathJaxInputQuestion />
              <InputQuestionSubmitButton
                nextText="Practice"
                onNext={() => {
                  window.location.href = "/derivative-practice/chain-rule/do";
                }}
              />
            </InputQuestionProvider>
          </Slide>,
        ][currentSlide]
      }
      <div></div>
    </MathJaxContext>
  );
}
