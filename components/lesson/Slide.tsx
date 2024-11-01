interface SlideProps {
  children: React.ReactNode;
}

export default function Slide({ children }: SlideProps) {
  return <section className="flex flex-col gap-6">{children}</section>;
}
