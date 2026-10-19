import Link from "next/link";

type BackLinkProps = {
  href: string;
};

export const BackLink = ({ href }: BackLinkProps) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      <span aria-hidden="true">←</span>
      Back
    </Link>
  );
};
