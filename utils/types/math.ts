export type NestedIndex = number[];
export interface InnerExpression {
  operator: string;
  expr: Expression[];
}
export type Expression = string | InnerExpression;