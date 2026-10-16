import { Card } from "@/components/card";

type RobotDetailProps = {
  params: Promise<{ robotId: string }>;
};

export default async function RobotDetail({ params }: RobotDetailProps) {
  const { robotId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold text-2xl">{robotId}</h1>
      <div className="flex gap-2">
        <span className="flex-1">
          <Card title="State">Working</Card>
        </span>
        <span className="flex-1">
          <Card title="Last Update">Working</Card>
        </span>
        <span className="flex-1">
          <Card title="Last Update">Working</Card>
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_320px]">
        <Card title="Event History">List of last events</Card>
        <div className="flex flex-col gap-4">
          <Card title="Identity">Robot details</Card>
          <Card title="Developer controls">
            Controls to change the state of the robot
          </Card>
        </div>
      </div>
    </div>
  );
}
