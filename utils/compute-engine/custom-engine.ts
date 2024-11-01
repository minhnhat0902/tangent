import { ComputeEngine } from "@cortex-js/compute-engine";

const ce = new ComputeEngine();

const expLatexEntry = ce.latexDictionary.find((value) => value.name == "Exp");
if (!expLatexEntry) {
  throw new Error("No entry named Exp in `latexDictionary`");
}
expLatexEntry.serialize = (serializer, expr): string =>
  "e^{" + serializer.serialize(Array.isArray(expr) ? expr[1] : null) + "}";

export default ce;
