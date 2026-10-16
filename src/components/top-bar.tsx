import Link from "next/link";

export const Topbar = () => {
  return (
    <header className="bg-white w-full flex justify-start shadow-sm p-4">
      <div className="mx-auto flex  w-full max-w-[1860px] items-center justify-between px-7">
        <Link href="/">
          <span className="font-bold font-black text-2xl">fleet</span>
        </Link>
      </div>
    </header>
  );
};
