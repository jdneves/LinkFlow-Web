import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CliquesPorDevice, Device } from "@/types/api";

const LABELS: Record<Device, string> = {
  MOBILE: "Mobile",
  DESKTOP: "Desktop",
  TABLET: "Tablet",
};
const COLORS: Record<Device, string> = {
  MOBILE: "hsl(221 83% 53%)",
  DESKTOP: "hsl(160 84% 39%)",
  TABLET: "hsl(38 92% 50%)",
};

export function DeviceChart({ data }: { data: CliquesPorDevice }) {
  const entries = (Object.entries(data) as [Device, number][]).filter(
    ([, v]) => v > 0,
  );
  const chartData = entries.map(([device, value]) => ({
    name: LABELS[device],
    value,
    color: COLORS[device],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cliques por dispositivo</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Sem dados de dispositivo.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {chartData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
