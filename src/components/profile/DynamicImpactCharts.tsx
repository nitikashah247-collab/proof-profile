import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface Visualization {
  type: "line_chart" | "bar_chart" | "pie_chart";
  title: string;
  headline_value: string;
  headline_label: string;
  data: ChartDataPoint[];
  format?: "currency" | "percentage" | "number";
}

interface DynamicImpactChartsProps {
  visualizations: Visualization[];
}

const PIE_COLORS = [
  "hsl(240 100% 50%)",
  "hsl(240 100% 65%)",
  "hsl(240 100% 80%)",
  "hsl(200 100% 50%)",
  "hsl(160 100% 40%)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-primary">
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatValue = (value: number, format?: string) => {
  if (format === "currency") return `$${value}M`;
  if (format === "percentage") return `${value}%`;
  return String(value);
};

export const DynamicImpactCharts = ({ visualizations }: DynamicImpactChartsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!visualizations || visualizations.length === 0) return null;

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-2">Impact Metrics</h2>
          <p className="text-muted-foreground mb-8">Data-driven results that speak for themselves</p>

          <div className="grid md:grid-cols-3 gap-6">
            {visualizations.slice(0, 3).map((viz, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{viz.title}</h3>
                <p className="text-2xl font-bold mb-4">
                  <span className="text-primary">{viz.headline_value}</span>{" "}
                  {viz.headline_label}
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    {viz.type === "line_chart" ? (
                      <LineChart data={viz.data.map((d) => ({ name: d.label, value: d.value }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => formatValue(v, viz.format)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(240 100% 50%)"
                          strokeWidth={3}
                          dot={false}
                          animationBegin={isInView ? 0 : 99999}
                          animationDuration={2000}
                        />
                      </LineChart>
                    ) : viz.type === "bar_chart" ? (
                      <BarChart data={viz.data.map((d) => ({ name: d.label, value: d.value }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="value"
                          fill="hsl(240 100% 50%)"
                          radius={[4, 4, 0, 0]}
                          animationBegin={isInView ? 0 : 99999}
                          animationDuration={1500}
                        />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={viz.data.map((d) => ({ name: d.label, value: d.value }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          animationBegin={isInView ? 0 : 99999}
                          animationDuration={1500}
                        >
                          {viz.data.map((_, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: "10px" }}
                          formatter={(value) => (
                            <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
