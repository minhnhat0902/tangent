import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MathJax } from "better-react-mathjax";
import {
  useMultipleChoice,
  useMultipleChoiceDispatch,
} from "./MultipleChoiceContext";

export default function MultipleChoice() {
  const { options } = useMultipleChoice();
  const dispatch = useMultipleChoiceDispatch();

  function setCurrentAnswer(value: number) {
    dispatch({ type: "set-answer", value });
  }

  return (
    <Select onValueChange={(v) => setCurrentAnswer(+v)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a value" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option, index) => (
            <SelectItem
              key={index}
              value={index.toString()}
            >
              <MathJax>{"\\(" + option + "\\)"}</MathJax>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
