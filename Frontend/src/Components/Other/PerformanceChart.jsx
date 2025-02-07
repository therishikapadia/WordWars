import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import "../../Font.css";

const PerformanceChart = ({ wpmPerMinute }) => {
  // Calculate average WPM per second
  const averageWpmPerSecond = {};

  // Iterate through the wpmPerMinute data
  wpmPerMinute.forEach(({ time, wpm }) => {
    if (!averageWpmPerSecond[time]) {
      averageWpmPerSecond[time] = { totalWpm: 0, count: 0 };
    }
    // Only consider valid WPM values (not Infinity)
    if (wpm !== Infinity) {
      averageWpmPerSecond[time].totalWpm += wpm;
      averageWpmPerSecond[time].count += 1;
    }
  });

  // Create an array of average WPM per second
  const chartData = Object.keys(averageWpmPerSecond).map((time) => {
    const { totalWpm, count } = averageWpmPerSecond[time];
    return {
      time: parseInt(time, 10),
      wpm: count > 0 ? (totalWpm / count).toFixed(2) : 0, // Calculate average
    };
  });

  // Limit the data to the last 50 points for performance
  const limitedData = chartData.slice(-50);

  return (
    <div className="geist-mono-latin-400" style={{ padding: "20px", borderRadius: "8px" }}>
      <LineChart
        width={800}
        height={400}
        data={limitedData} // Pass the calculated average data
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="time" tick={{ fill: "#aaa" }} />
        <YAxis tick={{ fill: "#aaa" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#222", borderRadius: "15px" }}
          itemStyle={{ color: "#fff" }}
        />
        <Line type="monotone" dataKey="wpm" stroke="#00ff00" strokeWidth={2} />
        <ReferenceLine y={37} label="Avg: 37 WPM" stroke="#ffcc00" strokeDasharray="3 3" />
      </LineChart>
    </div>
  );
};

export default PerformanceChart;