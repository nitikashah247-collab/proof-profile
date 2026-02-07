import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const revenueGrowthData = [
  { year: "2020", revenue: 5.2 },
  { year: "2021", revenue: 12.8 },
  { year: "2022", revenue: 22.4 },
  { year: "2023", revenue: 34.1 },
  { year: "2024", revenue: 45.0 },
];

const ebitdaData = [
  { year: "2020", margin: -15 },
  { year: "2021", margin: -8 },
  { year: "2022", margin: 2 },
  { year: "2023", margin: 12 },
  { year: "2024", margin: 18 },
];

const capitalEfficiencyData = [
  { quarter: "Q1'22", burnRate: 2.8, runway: 18 },
  { quarter: "Q2'22", burnRate: 2.5, runway: 20 },
  { quarter: "Q3'22", burnRate: 2.2, runway: 24 },
  { quarter: "Q4'22", burnRate: 1.9, runway: 28 },
  { quarter: "Q1'23", burnRate: 1.8, runway: 30 },
  { quarter: "Q2'23", burnRate: 1.5, runway: 34 },
  { quarter: "Q3'23", burnRate: 1.3, runway: 38 },
  { quarter: "Q4'23", burnRate: 1.1, runway: 42 },
];

const CHARCOAL = "hsl(222, 47%, 11%)";
const CHARCOAL_LIGHT = "hsl(215, 25%, 27%)";
const GOLD = "hsl(38, 92%, 50%)";
const GOLD_LIGHT = "hsl(38, 92%, 70%)";
const SLATE = "hsl(215, 16%, 47%)";

const FinanceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Revenue" || entry.name === "Burn Rate"
              ? `$${entry.value}M`
              : entry.name === "EBITDA Margin"
              ? `${entry.value}%`
              : `${entry.value} mo`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const FinanceImpactCharts = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-1">Financial Impact</h2>
          <p className="text-muted-foreground mb-8">
            Key performance indicators across tenure
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Revenue Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                ARR Growth
              </h3>
              <p className="text-2xl font-bold mb-4">
                $5M → <span style={{ color: GOLD }}>$45M</span>
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 10, fill: SLATE }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: SLATE }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}M`}
                    />
                    <Tooltip content={<FinanceTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke={CHARCOAL}
                      strokeWidth={3}
                      dot={{ fill: GOLD, stroke: CHARCOAL, strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: GOLD, r: 6, stroke: CHARCOAL, strokeWidth: 2 }}
                      animationBegin={isInView ? 0 : 99999}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* EBITDA Margin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                EBITDA Margin
              </h3>
              <p className="text-2xl font-bold mb-4">
                -15% → <span style={{ color: GOLD }}>+18%</span>
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ebitdaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 10, fill: SLATE }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: SLATE }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<FinanceTooltip />} />
                    <Bar
                      dataKey="margin"
                      name="EBITDA Margin"
                      radius={[4, 4, 0, 0]}
                      animationBegin={isInView ? 0 : 99999}
                      animationDuration={1500}
                    >
                      {ebitdaData.map((entry, index) => (
                        <rect
                          key={index}
                          fill={entry.margin >= 0 ? CHARCOAL : CHARCOAL_LIGHT}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Capital Efficiency - Stacked Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Capital Efficiency
              </h3>
              <p className="text-2xl font-bold mb-4">
                Burn ↓ <span style={{ color: GOLD }}>Runway ↑</span>
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={capitalEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="quarter"
                      tick={{ fontSize: 9, fill: SLATE }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: SLATE }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<FinanceTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Area
                      type="monotone"
                      dataKey="runway"
                      name="Runway (mo)"
                      fill={GOLD_LIGHT}
                      fillOpacity={0.3}
                      stroke={GOLD}
                      strokeWidth={2}
                      animationBegin={isInView ? 0 : 99999}
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="burnRate"
                      name="Burn Rate"
                      fill={CHARCOAL_LIGHT}
                      fillOpacity={0.2}
                      stroke={CHARCOAL}
                      strokeWidth={2}
                      animationBegin={isInView ? 300 : 99999}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};