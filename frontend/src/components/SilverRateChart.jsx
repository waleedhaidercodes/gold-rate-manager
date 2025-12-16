import React, { useState, useEffect } from 'react';
import client from '../api/client';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const SilverRateChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await client.get('/silver-rates/history?days=30');
                // Data comes sorted by date descending, reverse for chart (oldest to newest)
                const formattedData = response.data.reverse().map(item => ({
                    date: new Date(item.rateDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                    // Convert stored Rate Per Gram back to Rate Per Tola for display?
                    // User wants "Silver in Tola".
                    // RatePerTola = RatePerGram * 11.664
                    rate: Math.round(item.ratePerGram * 11.664)
                }));
                setData(formattedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching silver rate history:', err);
                setError('Failed to load chart data');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>;
    if (error) return <div className="h-64 flex items-center justify-center text-red-500">{error}</div>;
    if (data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data available for chart</div>;

    return (
        <div className="bg-dark-800 p-6 rounded-lg shadow-md mb-8 border border-gray-500/20">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Silver Rate History (Last 30 Days)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 50,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#D1D5DB' }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={20}
                        />
                        <YAxis
                            width={100}
                            tickMargin={20}
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 12, fill: '#D1D5DB' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `Rs ${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #9CA3AF', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            labelStyle={{ color: '#9CA3AF', marginBottom: '0.5rem' }}
                            formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Rate (Per Tola)']}
                        />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#C0C0C0" // Silver color
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#C0C0C0', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SilverRateChart;
