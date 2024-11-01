import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <header>
        <Link href="/" className="flex items-center space-x-2">
          <Icon />
          <h1 className="text-2xl font-semibold">Tangent</h1>
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center font-sans">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Chain rule</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col space-y-2 mt-4">
            <Link
              href="/derivative-practice/chain-rule/do"
              className="text-blue-700 hover:underline"
            >
              Practice
            </Link>
            <Link
              href="/derivative-practice/chain-rule/how"
              className="text-blue-700 hover:underline"
            >
              Example
            </Link>
            <Link
              href="/derivative-practice/chain-rule/why"
              className="text-blue-700 hover:underline"
            >
              Intuition
            </Link>
          </CardContent>
        </Card>
      </div>
      <div></div>
    </>
  );
}
