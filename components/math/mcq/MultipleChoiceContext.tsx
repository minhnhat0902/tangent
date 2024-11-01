import { createContext, Dispatch, useContext, useReducer } from "react";
import { AnswerState } from "@/utils/types/quiz";

export const MultipleChoiceContext = createContext<MultipleChoiceState>({
  options: [],
  correctAnswer: 0,
  currentAnswer: null,
  answerState: "pending",
});
export const MultipleChoiceDispatcher = createContext<
  Dispatch<MultipleChoiceAction>
>(() => {});

export interface MultipleChoiceProviderProps {
  children: React.ReactNode;
  initial: MultipleChoiceState;
}

export function MultipleChoiceProvider({
  children,
  initial,
}: MultipleChoiceProviderProps) {
  const [context, dispatch] = useReducer(reducer, initial);

  return (
    <MultipleChoiceContext.Provider value={context}>
      <MultipleChoiceDispatcher.Provider value={dispatch}>
        {children}
      </MultipleChoiceDispatcher.Provider>
    </MultipleChoiceContext.Provider>
  );
}

export function useMultipleChoice() {
  return useContext(MultipleChoiceContext);
}

export function useMultipleChoiceDispatch() {
  return useContext(MultipleChoiceDispatcher);
}

export interface MultipleChoiceState {
  options: string[];
  correctAnswer: number;
  currentAnswer: number | null;
  answerState: AnswerState;
}

export type MultipleChoiceAction = {
  type: "check";
} | {
  type: "set-answer";
  value: number;
};

function reducer(
  state: MultipleChoiceState,
  action: MultipleChoiceAction
): MultipleChoiceState {
  switch (action.type) {
    case "check": {
      if (state.currentAnswer === state.correctAnswer) {
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
    } case "set-answer": {
      return {
        ...state,
        currentAnswer: action.value,
        answerState: "pending",
      };
    }
  }
}
