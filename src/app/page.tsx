import { Card } from "@/components/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Card title="Errors">Number of faulty robots</Card>
        <span className="flex-2">
          <Card title="Fleet composition" subtitle="13 out of 15 reporting">
            Composition display of fleet
          </Card>
        </span>
      </div>

      <div>
        <Card
          title="Needs attention"
          subtitle="State the system can not resolve on its own"
        >
          Table of robots in need of attention
        </Card>
      </div>

      <div>
        <Card title="All robots">Table of all Robots</Card>
      </div>
    </div>
  );
}
