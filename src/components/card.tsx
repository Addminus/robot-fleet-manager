import type { ReactNode } from "react";

export type CardTone = "default" | "error";

const toneStyles: Record<CardTone, string> = {
  default: "border-zinc-100 bg-white",
  error: "border-red-300 bg-red-50",
};

type CardProps = {
  children: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: CardTone;
};

export const Card = ({
  children,
  title,
  subtitle,
  tone = "default",
}: CardProps) => {
  return (
    <div className={`h-full border p-4 rounded-xl ${toneStyles[tone]}`}>
      <div className="flex justify-between w-full pb-4">
        <h2 className="font-bold">{title}</h2>
        <p className="font-medium text-zinc-500 text-sm">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};
