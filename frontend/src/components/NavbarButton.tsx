import { Link } from "@tanstack/react-router";
type NavbarButtonProps = {
  text: string;
  to: string;
};
export function NavbarButton({ text, to }: NavbarButtonProps) {
  return (
    <Link
      to={to}
      className="w-[10em] rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-center font-medium text-white"
    >
      {text}
    </Link>
  );
}