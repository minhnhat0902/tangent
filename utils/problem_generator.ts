import { MathJaxInputQuestionButton } from "@/components/math/input/MathJaxInputQuestion";
import ce from "@/utils/compute-engine/custom-engine";
import {
  BoxedExpression,
  SemiBoxedExpression,
} from "@cortex-js/compute-engine";
import { basicButton, specialButtons } from "./buttons";

const funcs = [
  "Power",
  "Exponential",
  "Log",
  "Root",
  "Sin",
  "Cos",
  "Tan",
  "Csc",
  "Sec",
  "Cot",
];
const trigFuncs = ["Sin", "Cos", "Tan", "Csc", "Sec", "Cot"];
// const inverseTrigFuncs = ["Arcsin", "Arccos", "Arctan", "Acsc", "Asec", "Acot"];

type OptionObj =
  | {
      type: "dynamic";
      value: SemiBoxedExpression;
    }
  | {
      type: "special";
      value: "\\frac{\\square}{\\square}" | "\\square^{\\square}";
    }
  | {
      type: "basic";
      value: string;
    };

interface funcDiffRuleObj {
  name: string;
  pattern: SemiBoxedExpression;
  result: SemiBoxedExpression;
  repOptions: OptionObj[];
  options: OptionObj[];
  red_herrings: OptionObj[];
  complexity: number;
}

const funcDiffRules: funcDiffRuleObj[] = [
  {
    name: "Power rule",
    pattern: ["Power", "_x", "_n"],
    result: ["Multiply", "_n", ["Power", "_x", ["Subtract", "_n", 1]]],
    repOptions: [
      {
        type: "special",
        value: "\\square^{\\square}",
      },
      {
        type: "dynamic",
        value: "_n",
      },
    ],
    options: [
      {
        type: "special",
        value: "\\square^{\\square}",
      },
      {
        type: "dynamic",
        value: "_n",
      },
      {
        type: "dynamic",
        value: ["Subtract", "_n", 1],
      },
    ],
    red_herrings: [
      {
        type: "dynamic",
        value: ["Add", "_n", 1],
      },
      {
        type: "basic",
        value: "e",
      },
      {
        type: "basic",
        value: "-",
      },
    ],
    complexity: 2,
  },
  // {
  //   name: "Constant rule",
  //   pattern: ["_n"],
  //   result: ["0"],
  //   options: [],
  //   complexity: 0,
  // },
  {
    name: "Derivative of e^x",
    pattern: ["Power", "ExponentialE", "_x"],
    result: ["Power", "ExponentialE", "_x"],
    repOptions: [
      {
        type: "special",
        value: "\\square^{\\square}",
      },
      {
        type: "basic",
        value: "e",
      },
    ],
    options: [
      {
        type: "special",
        value: "\\square^{\\square}",
      },
      {
        type: "basic",
        value: "e",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "x - 1",
      },
    ],
    complexity: 2,
  },
  // {
  //   name: "Derivative of exponential functions",
  //   pattern: ["Power", "_n", "_x"],
  //   result: ["Multiply", ["Ln", "_n"], ["Power", "_n", "_x"]],
  //   options: [
  //     {
  //       type: "dynamic",
  //       value: "_n",
  //     },
  //     {
  //       type: "special",
  //       value: "\\square^{\\square}",
  //     },
  //     "e",
  //     "\\ln",
  //   ],
  //   complexity: 2,
  // },
  {
    name: "Derivative of the natural log function",
    pattern: ["Ln", "_x"],
    result: ["Divide", 1, "_x"],
    repOptions: [
      {
        type: "basic",
        value: "\\ln",
      },
    ],
    options: [
      {
        type: "basic",
        value: "1",
      },
      {
        type: "special",
        value: "\\frac{\\square}{\\square}",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\ln",
      },
      {
        type: "basic",
        value: "e",
      },
    ],
    complexity: 2,
  },
  // {
  //   name: "Derivative of log functions",
  //   pattern: ["Log", "_x", "_n"],
  //   result: ["Divide", 1, ["Multiply", ["Ln", "_n"], "_x"]],
  //   options: [
  //     {
  //       type: "dynamic",
  //       value: "_n",
  //     },
  //     {
  //       type: "special",
  //       value: "\\frac{\\square}{\\square}",
  //     },
  //     "1",
  //     "\\ln",
  //   ],
  //   complexity: 2,
  // },
  {
    name: "Derivative of sin",
    pattern: ["Sin", "_x"],
    result: ["Cos", "_x"],
    repOptions: [
      {
        type: "basic",
        value: "\\sin",
      },
    ],
    options: [
      {
        type: "basic",
        value: "\\cos",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\sin",
      },
      {
        type: "basic",
        value: "\\cos",
      },
      {
        type: "basic",
        value: "-",
      },
    ],
    complexity: 1,
  },
  {
    name: "Derivative of cos",
    pattern: ["Cos", "_x"],
    result: ["Negate", ["Sin", "_x"]],
    repOptions: [
      {
        type: "basic",
        value: "\\cos",
      },
    ],
    options: [
      {
        type: "basic",
        value: "-",
      },
      {
        type: "basic",
        value: "\\sin",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\cos",
      },
      {
        type: "basic",
        value: "\\tan",
      },
    ],
    complexity: 1,
  },
  {
    name: "Derivative of tan",
    pattern: ["Tan", "_x"],
    result: ["Power", ["Sec", "_x"], 2],
    repOptions: [
      {
        type: "basic",
        value: "\\tan",
      },
    ],
    options: [
      {
        type: "basic",
        value: "\\sec",
      },
      {
        type: "special",
        value: "\\square^{\\square}",
      },
      {
        type: "basic",
        value: "2",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\tan",
      },
      {
        type: "basic",
        value: "\\csc",
      },
      {
        type: "basic",
        value: "\\cot",
      },
      {
        type: "basic",
        value: "-",
      },
    ],
    complexity: 1,
  },
  {
    name: "Derivative of cot",
    pattern: ["Cot", "_x"],
    result: ["Negate", ["Power", ["Csc", "_x"], 2]],
    repOptions: [
      {
        type: "basic",
        value: "\\cot",
      },
    ],
    options: [
      {
        type: "basic",
        value: "-",
      },
      {
        type: "basic",
        value: "\\csc",
      },
      {
        type: "special",
        value: "\\square^{\\square}",
      },
      {
        type: "basic",
        value: "2",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\cot",
      },
      {
        type: "basic",
        value: "\\sec",
      },
      {
        type: "basic",
        value: "\\tan",
      },
    ],
    complexity: 1,
  },
  {
    name: "Derivative of sec",
    pattern: ["Sec", "_x"],
    result: ["Multiply", ["Sec", "_x"], ["Tan", "_x"]],
    repOptions: [
      {
        type: "basic",
        value: "\\sec",
      },
    ],
    options: [
      {
        type: "basic",
        value: "\\tan",
      },
      {
        type: "basic",
        value: "\\sec",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\sin",
      },
      {
        type: "basic",
        value: "\\cos",
      },
      {
        type: "basic",
        value: "\\cot",
      },
      {
        type: "basic",
        value: "-",
      },
    ],
    complexity: 2,
  },
  {
    name: "Derivative of csc",
    pattern: ["Csc", "_x"],
    result: ["Negate", ["Multiply", ["Cot", "_x"], ["Csc", "_x"]]],
    repOptions: [
      {
        type: "basic",
        value: "\\csc",
      },
    ],
    options: [
      {
        type: "basic",
        value: "-",
      },
      {
        type: "basic",
        value: "\\cot",
      },
      {
        type: "basic",
        value: "\\csc",
      },
    ],
    red_herrings: [
      {
        type: "basic",
        value: "\\sin",
      },
      {
        type: "basic",
        value: "\\cos",
      },
      {
        type: "basic",
        value: "\\tan",
      },
    ],
    complexity: 2,
  },
];

const DiffRules = [
  {
    name: "Sum rule",
    pattern: ["Add", ["Function", "_f", "_x"], ["Function", "_g", "_x"]],
    result: [
      "Add",
      ["D", ["Function", "_f", "_x"], "_x"],
      ["D", ["Function", "_g", "_x"], "_x"],
    ],
    options: ["+", "-"],
    complexity: 1,
  },
  {
    name: "Constant multiple rule",
    pattern: ["Multiply", "_n", ["Function", "_f", "_x"]],
    result: ["Multiply", "_n", ["D", ["Function", "_f", "_x"], "_x"]],
    options: [
      {
        type: "dynamic",
        value: "_n",
      },
    ],
    complexity: 0,
  },
  {
    name: "Product rule",
    pattern: ["Multiply", ["Function", "_f", "_x"], ["Function", "_g", "_x"]],
    result: [
      "Add",
      [
        "Multiply",
        ["D", ["Function", "_f", "_x"], "_x"],
        ["Function", "_g", "_x"],
      ],
      [
        "Multiply",
        ["Function", "_f", "_x"],
        ["D", ["Function", "_g", "_x"], "_x"],
      ],
    ],
    complexity: 4,
  },
  {
    name: "Quotient rule",
    pattern: ["Divide", ["Function", "_f", "_x"], ["Function", "_g", "_x"]],
    result: [
      "Divide",
      [
        "Subtract",
        [
          "Multiply",
          ["D", ["Function", "_f", "_x"], "_x"],
          ["Function", "_g", "_x"],
        ],
        [
          "Multiply",
          ["Function", "_f", "_x"],
          ["D", ["Function", "_g", "_x"], "_x"],
        ],
      ],
      ["Power", ["Function", "_g", "_x"], 2],
    ],
    complexity: 7,
  },
  {
    name: "Chain rule",
    pattern: ["Apply", ["Function", "_f", "_y"], ["Function", "_g", "_x"]],
    result: [
      "Multiply",
      [
        "Apply",
        ["D", ["Function", "_f", "_y"], "_y"],
        ["Function", "_g", "_x"],
      ],
      ["D", ["Function", "_g", "_x"], "_x"],
    ],
    complexity: 4,
  },
  {
    name: "Inverse function rule",
    pattern: ["InverseFunction", ["Function", "_f", "_y"], "_x"],
    result: [
      "Divide",
      1,
      ["Apply", ["D", ["Function", "_f", "_y"], "_y"]],
      "_x",
    ],
    complexity: 4,
  },
  {
    name: "Derivative of inverse trigonometric functions",
    func: null,
    complexity: 4,
  },
];

const constant = ["ExponentialE", "Pi"];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randConstant(): number {
  return randInt(1, 8);
}

export function randTrigFunc(): string {
  return trigFuncs[randInt(0, trigFuncs.length)];
}

function differentiate(
  expr: BoxedExpression,
  variable: string
): BoxedExpression {
  return ce.box(["D", expr, variable]).evaluate();
}

function coinFlip(): boolean {
  return Math.random() < 0.5;
}

export default function randomCompositionExpression(): {
  questionLatex: string;
  correctAnswer: BoxedExpression;
  options: MathJaxInputQuestionButton[];
} {
  const outer = funcDiffRules[randInt(0, funcDiffRules.length)];
  const inner = funcDiffRules[randInt(0, funcDiffRules.length)];

  const variable = ["x", "t"][randInt(0, 2)];
  const constant = randInt(2, 8);
  const expr = ce
    .box(outer.pattern)
    .subs({ _x: ce.box(inner.pattern) })
    .subs({ _x: variable, _n: ce.box(constant) });

  const questionLatex = expr.latex;
  const correctAnswer = differentiate(expr, variable);
  const options: OptionObj[] = [
    {
      type: "basic",
      value: variable,
    },
    {
      type: "basic",
      value: "(",
    },
    {
      type: "basic",
      value: ")",
    },
    {
      type: "basic",
      value: "\\cdot",
    },
  ];

  function addOption(option: OptionObj) {
    for (const buttonOption of options) {
      if (
        option.type === "dynamic" &&
        buttonOption.type === "basic" &&
        ce.box(option.value).subs({ _n: constant }).evaluate().latex === 
          buttonOption.value
      ) {
        return;
      }

      if (
        option.type === buttonOption.type &&
        option.value === buttonOption.value
      ) {
        return;
      }
    }

    options.push(option);
  }

  outer.options.forEach(addOption);
  inner.options.forEach(addOption);
  inner.repOptions.forEach(addOption);
  outer.red_herrings.forEach((option) => {
    if (coinFlip()) addOption(option);
  });
  inner.red_herrings.forEach((option) => {
    if (coinFlip()) addOption(option);
  });

  const buttonOptions = options.map(
    (option: OptionObj): MathJaxInputQuestionButton => {
      switch (option.type) {
        case "dynamic": {
          const value = ce
            .box(option.value)
            .subs({ _n: constant })
            .evaluate().latex;
          return basicButton(value);
        }
        case "special": {
          return specialButtons[option.value];
        }
        case "basic": {
          return basicButton(option.value);
        }
      }
    }
  );

  return {
    questionLatex,
    correctAnswer,
    options: buttonOptions,
  };
}
