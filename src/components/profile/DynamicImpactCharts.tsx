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
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--accent) / 0.7)",
  "hsl(var(--primary) / 0.5)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-foreground font-metrics">
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

  const charts = visualizations.filter(v => v.data && v.data.length >= 2);
  const metricCards = visualizations.filter(v => !v.data || v.data.length < 2);

  return (
    <section ref={ref} className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">Impact Metrics</p>
            <h2 className="text-2xl font-semibold text-foreground">Data-driven results that speak for themselves</h2>
          </div>

          {metricCards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {metricCards.map((viz, i) => (
                <motion.div
                  key={`mc-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-5 rounded-2xl border border-border bg-card text-center hover:shadow-md transition-shadow"
                >
                  <p className="text-3xl font-bold text-foreground font-metrics">{viz.headline_value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{viz.headline_label || viz.title}</p>
                </motion.div>
              ))}
            </div>
          )}

          {charts.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {charts.slice(0, 3).map((viz, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{viz.title}</h3>
                  <p className="text-2xl font-bold mb-4 text-foreground">
                    <span className="font-metrics">{viz.headline_value}</span>{" "}
                    {viz.headline_label}
                  </p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      {viz.type === "line_chart" ? (
                        <LineChart data={viz.data.map((d) => ({ name: d.label, value: d.value }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatValue(v, viz.format)} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} animationBegin={isInView ? 0 : 99999} animationDuration={2000} />
                        </LineChart>
                      ) : viz.type === "bar_chart" ? (
                        <BarChart data={viz.data.map((d) => ({ name: d.label, value: d.value }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationBegin={isInView ? 0 : 99999} animationDuration={1500} />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie data={viz.data.map((d) => ({ name: d.label, value: d.value }))} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" animationBegin={isInView ? 0 : 99999} animationDuration={1500}>
                            {viz.data.map((_, idx) => (
                              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: "10px" }} formatter={(value) => (<span style={{ color: "hsl(var(--foreground))" }}>{value}</span>)} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
