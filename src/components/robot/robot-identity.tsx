import type { Robot } from "@/lib/types/robot";

type RobotIdentityProps = {
  robot: Robot;
};

export const RobotIdentity = ({ robot }: RobotIdentityProps) => {
  return (
    <dl className="divide-y divide-zinc-100 text-sm">
      <div className="flex justify-between gap-4 py-2">
        <dt className="text-zinc-500">Name</dt>
        <dd className="text-right">{robot.displayName}</dd>
      </div>
      <div className="flex justify-between gap-4 py-2">
        <dt className="text-zinc-500">ID</dt>
        <dd className="text-right font-mono text-xs">{robot.id}</dd>
      </div>
      <div className="flex justify-between gap-4 py-2">
        <dt className="text-zinc-500">Vendor</dt>
        <dd className="text-right font-mono text-xs">{robot.vendorId}</dd>
      </div>
    </dl>
  );
};
