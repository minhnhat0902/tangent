"use client";

import Icon from "@/components/Icon";
import Hint from "@/components/lesson/Hint";
import Slide from "@/components/lesson/Slide";
import Text from "@/components/lesson/Text";
import { InputQuestionProvider } from "@/components/math/input/InputQuestionContext";
import InputQuestionSubmitButton from "@/components/math/input/InputQuestionSubmit";
import MathJaxInputQuestion from "@/components/math/input/MathJaxInputQuestion";
import MultipleChoice from "@/components/math/mcq/MultipleChoice";
import { MultipleChoiceProvider } from "@/components/math/mcq/MultipleChoiceContext";
import MultipleChoiceSubmit from "@/components/math/mcq/MultipleChoiceSubmit";
import { Button } from "@/components/ui/button";
import { basicButton } from "@/utils/buttons";
import ce from "@/utils/compute-engine/custom-engine";
import { latexCursorString, latexEntryPointString } from "@/utils/serialize";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Link from "next/link";
import { useState } from "react";

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
            <Text>
              The chain rule is much easier to understand when we write
              derivatives in the{" "}
              <MathJax dynamic inline>
                {"\\(\\frac{\\mathrm{d}y}{\\mathrm{d}x}" +
                  latexEntryPointString +
                  "\\)"}
              </MathJax>{" "}
              way. It shows us that the derivative is really just a ratio
              between two tiny tiny changes.
            </Text>
            <div className="flex justify-end">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSlide(1);
                }}
              >
                Next
              </Button>
            </div>
          </Slide>,
          <Slide key={1}>
            <InputQuestionProvider
              initial={{
                questionLatex: "",
                options: [basicButton("g"), basicButton("t")],
                correctAnswer: ce.parse("\\frac{\\mathrm{d}g}{\\mathrm{d}t}"),
                initialAnswer: {
                  operator: "",
                  expr: [
                    {
                      operator: "\\frac",
                      expr: [
                        "\\mathrm{d}",
                        { operator: "", expr: [latexCursorString] },
                      ],
                    },
                    {
                      operator: "",
                      expr: [
                        "\\mathrm{d}",
                        { operator: "", expr: [latexEntryPointString] },
                      ],
                    },
                  ],
                },
                currentAnswer: {
                  operator: "",
                  expr: [
                    {
                      operator: "\\frac",
                      expr: [
                        "\\mathrm{d}",
                        { operator: "", expr: [latexCursorString] },
                      ],
                    },
                    {
                      operator: "",
                      expr: [
                        "\\mathrm{d}",
                        { operator: "", expr: [latexEntryPointString] },
                      ],
                    },
                  ],
                },
                initialCursorIndex: [0, 1, 0],
                cursorIndex: [0, 1, 0],
                answerState: "pending",
              }}
            >
              <Text>
                For example, if the distance your friend George walks is{" "}
                <MathJax inline>\(g(t)\)</MathJax> where{" "}
                <MathJax inline>\(t\)</MathJax> is the number of hours since he
                started walking, then what his instantaneous speed?
              </Text>
              <Hint>
                <Text>
                  Speed is change in distance divided by change in time
                </Text>
              </Hint>
              <MathJaxInputQuestion />
              <InputQuestionSubmitButton onNext={() => setCurrentSlide(2)} />
            </InputQuestionProvider>
          </Slide>,
          <Slide key={2}>
            <InputQuestionProvider
              initial={{
                questionLatex: "",
                options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                  basicButton
                ),
                correctAnswer: ce.parse("2"),
                initialAnswer: { operator: "", expr: [latexCursorString] },
                currentAnswer: { operator: "", expr: [latexCursorString] },
                initialCursorIndex: [0],
                cursorIndex: [0],
                answerState: "pending",
              }}
            >
              <Text>
                George was walking when Frank runs pass him. If Frank&rsquo;s
                distance is <MathJax inline>\(g(t)\)</MathJax> and Frank is
                going twice as fast as George, then what is{" "}
                <MathJax inline>
                  {"\\(\\dfrac{\\mathrm{d}f}{\\mathrm{d}g}\\)"}
                </MathJax>
                ?
              </Text>
              <MathJaxInputQuestion />
              <InputQuestionSubmitButton onNext={() => setCurrentSlide(3)} />
            </InputQuestionProvider>
          </Slide>,
          <Slide key={3}>
            <MultipleChoiceProvider
              initial={{
                options: ["5 km/h", "10 km/h", "15 km/h", "20 km/h"],
                correctAnswer: 1,
                currentAnswer: null,
                answerState: "pending",
              }}
            >
              <Text>
                If George is walking at <MathJax inline>\(5 km/h\)</MathJax>,
                then how fast is Frank running at?
              </Text>
              <MultipleChoice />
              <MultipleChoiceSubmit onNext={() => setCurrentSlide(4)} />
            </MultipleChoiceProvider>
          </Slide>,
          <Slide key={4}>
            <Text>
              Since Frank is going twice as fast as George, we just have to
              multiply <MathJax inline>2</MathJax> by{" "}
              <MathJax inline>5</MathJax> to get Frank&rsquo;s speed. Writing
              out this multiplication, we get the chain rule:
            </Text>
            <MathJax>
              {
                "\\(\\dfrac{\\mathrm{d}f}{\\mathrm{d}x}=\\dfrac{\\mathrm{d}f}{\\mathrm{d}g}\\cdot\\dfrac{\\mathrm{d}g}{\\mathrm{d}x}\\)"
              }
            </MathJax>
            <Text>or</Text>
            <MathJax>{"\\(f(g(x))'=f'(g(x))\\cdot g'(x)\\)"}</MathJax>
            <Text>
              While the bottom formula is usually taught, the first one is probably
              easier to remember. It looks just like cancelling fractions,
              showing how the chain rule is just multiplying ratios together.
            </Text>
            <div className="flex justify-end">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/derivative-practice/chain-rule/do";
                }}
              >
                Practice
              </Button>
            </div>
          </Slide>,
        ][currentSlide]
      }
      <div></div>
    </MathJaxContext>
  );
}
