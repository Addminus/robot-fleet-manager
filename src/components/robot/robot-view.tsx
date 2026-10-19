import { BackLink } from "@/components/back-link";
import { Card } from "@/components/card";
import { OperationalState } from "@/components/robot/operational-state";
import type { SimulatedRobot } from "@/lib/types/robot";
import { RobotIdentity } from "./robot-identity";

type RobotViewProps = {
  robot: SimulatedRobot;
  lastUpdate: string;
};

export const RobotView = ({ robot, lastUpdate }: RobotViewProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start gap-2">
        <BackLink href="/" />
        <h1 className="font-bold text-2xl">{robot.robot.id}</h1>
      </div>
      <div className="flex gap-2">
        <span className="flex-1">
          <Card title="State">
            <OperationalState state={robot.telemetry.operationalState} />
          </Card>
        </span>
        <span className="flex-1">
          <Card title="Battery">
            <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
              {Math.round(robot.telemetry.batteryPercent)}%
            </span>
          </Card>
        </span>
        <span className="flex-1">
          <Card title="Last Update">
            <span className="font-mono text-2xl leading-none tracking-tight">
              {lastUpdate}
            </span>
            <p className="mt-4 text-[13px] text-zinc-500">
              counted in the browser
            </p>
          </Card>
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_320px]">
        <Card title="Event History">List of last events</Card>
        <div className="flex flex-col gap-4">
          <Card title="Identity">
            <RobotIdentity robot={robot.robot} />
          </Card>
          <Card title="Developer controls">
            Controls to change the state of the robot
          </Card>
        </div>
      </div>
    </div>
  );
};
