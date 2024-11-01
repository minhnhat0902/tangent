import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMultipleChoice, useMultipleChoiceDispatch } from "./MultipleChoiceContext";

function randomEncouragement() {
  const encouragement = [
    "That’s right!",
    "Perfect!",
    "Fantastic!",
    "Awesome job!",
    "Amazing!",
    "Beautiful!",
  ];
  return encouragement[Math.floor(Math.random() * encouragement.length)];
}

interface SubmitButtonProps {
  nextText?: string;
  onNext: () => void;
}

export default function SubmitButton({ nextText = "Next", onNext }: SubmitButtonProps) {
  const { answerState } = useMultipleChoice();
  const dispatch = useMultipleChoiceDispatch();

  function check() {
    dispatch({ type: "check" });
  }

  return answerState === "pending" ? (
    <div className="flex justify-end">
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={(e) => {
          e.preventDefault();
          check();
        }}
      >
        Check
      </Button>
    </div>
  ) : answerState === "correct" ? (
    <div className="flex justify-between">
      <span className="flex justify-start items-center">
        <Check className="h-6 w-6 mr-2" />
        <p>{randomEncouragement()}</p>
      </span>
      <span className="flex justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-self-end"
          onClick={(e) => {
            e.preventDefault();
            onNext();
          }}
        >
          {nextText}
        </Button>
      </span>
    </div>
  ) : (
    <div className="flex justify-between">
      <span className="flex justify-start items-center">
        <X className="h-6 w-6 mr-2" />
        <p>Not quite</p>
      </span>
      <span className="flex justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-self-end"
          onClick={(e) => {
            e.preventDefault();
            check();
          }}
        >
          Check
        </Button>
      </span>
    </div>
  );
}
