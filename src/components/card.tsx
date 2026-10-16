import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
};

export const Card = ({ children, title, subtitle }: CardProps) => {
  return (
    <div className="border border-zinc-200 p-4 rounded-xl bg-white">
      <div className="flex justify-between w-full pb-2">
        <h2 className="font-bold">{title}</h2>
        <p className="font-medium text-zinc-500">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};
