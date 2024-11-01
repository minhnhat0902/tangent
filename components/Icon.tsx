import Image from "next/image";
import icon from "@/app/android-chrome-512x512.png";

export default function Icon() {
  return <Image src={icon} alt="Tangent Logo" width={32} height={32}></Image>;
}