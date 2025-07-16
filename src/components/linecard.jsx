import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "15", value: 70, status: "Sunny" },
  { time: "16", value: 70, status: "Sunny" },
  { time: "17", value: 70, status: "Sunny" },
  { time: "18", value: 65, status: "Sunny" },
  { time: "19", value: 65, status: "Sunny" },
  { time: "20", value: 65, status: "Sunny" },
  { time: "21", value: 90, status: "Rainy" },
  { time: "00", value: 45, status: "Heavy" },
  { time: "03", value: 80, status: "Rainy" },
  { time: "06", value: 35, status: "Heavy" },
];

function WeatherChart() {
  return (
    <div className="w-full h-96 bg-[#1B1B1D] text-white p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          <XAxis className="text-sm" dataKey="time" stroke="#ccc" />
          <YAxis className="text-base"
            stroke="#ccc"
            domain={[0, 100]}
            ticks={[30, 60, 90]}
            tickFormatter={(val) => {
              if (val === 60) return "60";
              if (val === 90) return "90";
              if (val === 30) return "30";
              return "";
            }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#AEE2FF" radius={[10, 10, 0, 0]} barSize={10} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4db8ff"
            strokeWidth={2}
            dot={{ r: 4, stroke: "#4db8ff", fill: "#1B1B1D", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default WeatherChart