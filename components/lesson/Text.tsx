export default function Text({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-base mb-4 w-80 md:w-100">{children}</p>;
}
