import { InnerExpression, NestedIndex } from "@/utils/types/math";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { MathJaxInputQuestionButton } from "./MathJaxInputQuestion";
import { AnswerState } from "@/utils/types/quiz";
import ce from "@/utils/compute-engine/custom-engine";
import { toStrippedLatex } from "@/utils/serialize";
import { BoxedExpression } from "@cortex-js/compute-engine";
import randomCompositionExpression from "@/utils/problem_generator";

export const InputQuestionContext = createContext<InputQuestionState>({
  questionLatex: "",
  options: [],
  correctAnswer: ce.parse(""),
  initialAnswer: { operator: "", expr: [] },
  currentAnswer: { operator: "", expr: [] },
  initialCursorIndex: [0],
  cursorIndex: [0],
  answerState: "pending",
});
export const InputQuestionDispatcher =
  createContext<Dispatch<InputQuestionAction>>(() => {});

export interface InputQuestionProviderProps {
  children: React.ReactNode;
  initial: InputQuestionState;
}

export function InputQuestionProvider({
  children,
  initial,
}: InputQuestionProviderProps) {
  const [context, dispatch] = useReducer(reducer, initial);

  return (
    <InputQuestionContext.Provider value={context}>
      <InputQuestionDispatcher.Provider value={dispatch}>
        {children}
      </InputQuestionDispatcher.Provider>
    </InputQuestionContext.Provider>
  );
}

export function useInputQuestion() {
  return useContext(InputQuestionContext);
}

export function useInputQuestionDispatch() {
  return useContext(InputQuestionDispatcher);
}

export interface InputQuestionState {
  questionLatex: string;
  options: MathJaxInputQuestionButton[];
  correctAnswer: BoxedExpression;
  initialAnswer: InnerExpression;
  currentAnswer: InnerExpression;
  initialCursorIndex: NestedIndex;
  cursorIndex: NestedIndex;
  answerState: AnswerState;
}

export type InputQuestionAction =
  | {
      type: "reset";
    }
  | {
      type: "check";
    }
  | {
      type: "set-answer";
      value: InnerExpression;
    }
  | {
      type: "set-cursor-index";
      value: NestedIndex;
    }
  | {
      type: "set-question";
      value: {
        questionLatex: string;
        correctAnswer: BoxedExpression;
        options: MathJaxInputQuestionButton[];
      };
    }
  | {
      type: "set-random-question";
    };

function reducer(
  state: InputQuestionState,
  action: InputQuestionAction
): InputQuestionState {
  switch (action.type) {
    case "check": {
      const answer = ce.parse(toStrippedLatex(state.currentAnswer)).evaluate();

      if (answer.isEqual(state.correctAnswer)) {
        return {
          ...state,
          answerState: "correct",
        };
      } else {
        return {
          ...state,
          answerState: "incorrect",
        };
      }
    }
    case "reset": {
      return {
        ...state,
        answerState: "pending",
        cursorIndex: state.initialCursorIndex,
        currentAnswer: state.initialAnswer,
      };
    }
    case "set-answer": {
      return {
        ...state,
        currentAnswer: action.value,
      };
    }
    case "set-cursor-index": {
      return {
        ...state,
        cursorIndex: action.value,
      };
    }
    case "set-question": {
      return {
        ...state,
        ...action.value,
      };
    }
    case "set-random-question": {
      return {
        ...state,
        ...randomCompositionExpression(),
        currentAnswer: state.initialAnswer,
        answerState: "pending",
        cursorIndex: state.initialCursorIndex,
      };
    }
  }
}
