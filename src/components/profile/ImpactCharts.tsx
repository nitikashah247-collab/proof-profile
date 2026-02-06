import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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

const revenueData = [
  { month: "Jan", value: 2.1 },
  { month: "Feb", value: 2.4 },
  { month: "Mar", value: 2.8 },
  { month: "Apr", value: 3.2 },
  { month: "May", value: 3.9 },
  { month: "Jun", value: 4.5 },
  { month: "Jul", value: 5.2 },
  { month: "Aug", value: 5.8 },
  { month: "Sep", value: 6.5 },
  { month: "Oct", value: 7.2 },
  { month: "Nov", value: 8.1 },
  { month: "Dec", value: 9.4 },
];

const beforeAfterData = [
  { metric: "MQLs", before: 450, after: 820 },
  { metric: "Pipeline", before: 2.1, after: 4.8 },
  { metric: "Win Rate", before: 18, after: 31 },
  { metric: "NPS", before: 32, after: 58 },
];

const portfolioData = [
  { name: "Enterprise", value: 45, color: "hsl(240 100% 50%)" },
  { name: "Mid-Market", value: 35, color: "hsl(240 100% 65%)" },
  { name: "SMB", value: 20, color: "hsl(240 100% 80%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-primary">
            {entry.name}: {typeof entry.value === 'number' && entry.value < 100 ? 
              (entry.name === 'Revenue' || entry.name === 'value' ? `$${entry.value}M` : `${entry.value}%`) : 
              entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ImpactCharts = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [animationComplete, setAnimationComplete] = useState(false);

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
            {/* Revenue Growth Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue Growth</h3>
              <p className="text-2xl font-bold mb-4">
                <span className="text-primary">38%</span> YoY
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Revenue"
                      stroke="hsl(240 100% 50%)"
                      strokeWidth={3}
                      dot={false}
                      animationBegin={isInView ? 0 : 99999}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Before/After Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Before → After</h3>
              <p className="text-2xl font-bold mb-4">
                Key Metrics <span className="text-primary">Improved</span>
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={beforeAfterData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="metric" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ fontSize: '10px' }}
                    />
                    <Bar 
                      dataKey="before" 
                      name="Before" 
                      fill="hsl(var(--muted))" 
                      radius={[0, 4, 4, 0]}
                      animationBegin={isInView ? 0 : 99999}
                      animationDuration={1500}
                    />
                    <Bar 
                      dataKey="after" 
                      name="After" 
                      fill="hsl(240 100% 50%)" 
                      radius={[0, 4, 4, 0]}
                      animationBegin={isInView ? 500 : 99999}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Portfolio Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue by Segment</h3>
              <p className="text-2xl font-bold mb-4">
                Market <span className="text-primary">Focus</span>
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={isInView ? 0 : 99999}
                      animationDuration={1500}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ fontSize: '10px' }}
                      formatter={(value, entry: any) => (
                        <span style={{ color: 'hsl(var(--foreground))' }}>
                          {value} ({entry.payload.value}%)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
