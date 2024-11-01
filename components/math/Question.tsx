import { MathJax } from "better-react-mathjax";
import { useInputQuestion } from "./input/InputQuestionContext";

export default function Question() {
  const { questionLatex } = useInputQuestion();

  return (
    <MathJax inline dynamic className="ml-1">
      {"\\(" + questionLatex + "\\)"}
    </MathJax>
  );
}