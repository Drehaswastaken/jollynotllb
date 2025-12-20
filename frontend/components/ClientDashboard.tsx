"use client";

import React from "react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Activity, ShieldCheck, TrendingUp, Gavel, FileText } from "lucide-react";

// Data for Bar Chart: Global Judicial Backlog
const backlogData = [
    { year: "2022", cases: 42 },
    { year: "2023", cases: 45 },
    { year: "2024", cases: 48 },
    { year: "2025", cases: 50 },
];

// Data for Line Chart: Accuracy vs Complexity
const accuracyData = [
    { level: "Simple", human: 75, ai: 96 },
    { level: "Moderate", human: 70, ai: 95 },
    { level: "Complex", human: 65, ai: 94 },
    { level: "Extreme", human: 60, ai: 92 },
];

// Data for Area Chart: Time Analysis (Time Saved)
const timeSavedData = [
    { month: "Jan", hours: 120 },
    { month: "Feb", hours: 135 },
    { month: "Mar", hours: 160 },
    { month: "Apr", hours: 190 },
    { month: "May", hours: 210 },
    { month: "Jun", hours: 250 },
];

// Data for Pie Chart: Case Distribution
const caseDistributionData = [
    { name: "Civil", value: 45 },
    { name: "Criminal", value: 25 },
    { name: "Corporate", value: 20 },
    { name: "Family", value: 10 },
];

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7"];

export default function ClientDashboard() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">

            {/* --- HEADER --- */}
            <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Logo */}
                        <div className="flex items-baseline tracking-tight">
                            <span className="font-serif font-bold text-2xl text-white tracking-wide">ASTRA</span>
                            <span className="font-sans font-medium text-2xl text-orange-500 ml-2">AI COURT</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* System Status */}
                        <div className="flex items-center space-x-2 border border-green-500/20 bg-green-900/10 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                            <span className="text-xs font-mono text-green-400 tracking-widest uppercase">System Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">

                {/* --- INTRODUCTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-5xl font-serif font-bold leading-tight">
                            The Future of <span className="text-orange-500">Judicial Intelligence</span>
                        </h1>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                            Astra is an autonomous legal reasoning engine aimed at reducing judicial backlog and democratizing access to high-quality legal defense.
                            By simulating opposing legal counsels and a neutral judge, Astra identifies loopholes, cites obscure precedents from the Indian Constitution,
                            and predicts case outcomes with superhuman accuracy.
                        </p>
                        <div className="pt-4">
                            <Link href="/simulation" className="inline-flex items-center bg-white text-black px-8 py-3 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                                <Gavel className="mr-2" size={18} />
                                Launch Simulation
                            </Link>
                        </div>
                    </div>

                    {/* Key Metric Card */}
                    <div className="group relative bg-zinc-950 border border-zinc-900 rounded-xl p-8 overflow-hidden hover:border-orange-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                                    <ShieldCheck size={28} />
                                </div>
                            </div>
                            <h3 className="text-zinc-400 text-sm uppercase tracking-wider font-medium mb-2">AI Predictive Accuracy</h3>
                            <div className="text-5xl font-serif font-bold text-white drop-shadow-sm">94.2%</div>
                            <p className="text-xs text-zinc-500 mt-2">Consistently exceeds human benchmarks in complex case analysis.</p>
                        </div>
                    </div>
                </div>


                {/* --- CHARTS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Chart 1: Global Backlog */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors">
                        <h3 className="text-lg font-serif mb-6 text-white flex items-center">
                            <Activity className="mr-2 text-zinc-500" size={18} />
                            Global Judicial Backlog Projections
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={backlogData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#52525b"
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}M`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar
                                        dataKey="cases"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        activeBar={{ fill: '#60a5fa' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Accuracy Comparison */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors">
                        <h3 className="text-lg font-serif mb-6 text-white flex items-center">
                            <TrendingUp className="mr-2 text-zinc-500" size={18} />
                            Accuracy vs. Case Complexity
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={accuracyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="level"
                                        stroke="#52525b"
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[50, 100]}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="human"
                                        name="Legacy Human"
                                        stroke="#71717a"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: '#71717a' }}
                                        strokeDasharray="5 5"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ai"
                                        name="Astra AI"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 3: Time Saved (Area Chart) */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors">
                        <h3 className="text-lg font-serif mb-6 text-white flex items-center">
                            <FileText className="mr-2 text-zinc-500" size={18} />
                            Research Hours Saved (Monthly)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeSavedData}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                                    <Area type="monotone" dataKey="hours" stroke="#22c55e" fillOpacity={1} fill="url(#colorHours)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 4: Case Distribution (Pie Chart) */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors">
                        <h3 className="text-lg font-serif mb-6 text-white flex items-center">
                            <Gavel className="mr-2 text-zinc-500" size={18} />
                            Processed Case Types
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={caseDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {caseDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* --- HALLUCINATION & ETHICS MONITORING --- */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 overflow-hidden hover:border-red-500/30 transition-all duration-300">
                    <h3 className="text-xl font-serif text-white mb-6 flex items-center">
                        <Activity className="mr-2 text-red-500" size={20} />
                        Model Reliability & Hallucination Risk
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Gauge Visualization */}
                        <div className="flex flex-col items-center justify-center relative">
                            <div className="h-[150px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[{ value: 83 }, { value: 17 }]}
                                            cx="50%"
                                            cy="100%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill="#22c55e" /> {/* Green for Faithfulness */}
                                            <Cell fill="#27272a" /> {/* Zinc background */}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute bottom-0 left-0 right-0 text-center mb-2">
                                    <span className="text-3xl font-bold text-white">83%</span>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Source Faithfulness (RAG)</p>
                                </div>
                            </div>
                        </div>

                        {/* Risk Indicators */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-zinc-400 text-sm font-mono uppercase tracking-widest">Semantic Entropy</h4>
                                    <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Elevated Uncertainty</span>
                                </div>
                                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-full w-[65%]"></div>
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">Reasoning uncertainty detected in 12% of recent complex queries.</p>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                                <Activity className="text-red-500 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <h5 className="text-red-400 text-sm font-bold mb-1">Hallucination Risk Warning</h5>
                                    <p className="text-red-300/80 text-xs leading-relaxed">
                                        Complex reasoning hallucination risk identified at <span className="text-white font-bold">42%</span> for non-RAG queries. Recommend enabling strict citation mode.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Research Insight */}
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6 flex flex-col justify-center">
                            <h4 className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">Industry Adoption Insight</h4>
                            <p className="text-zinc-300 text-sm leading-7">
                                Recent studies show that <span className="text-white font-bold">79% of legal professionals</span> have adopted this autonomous verification tech.
                                It has proven <span className="text-white font-bold">50% more effective</span> at risk identification than traditional manual review processes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER: RESEARCH SUMMARY --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="p-4">
                        <h4 className="text-orange-500 font-mono text-xs uppercase tracking-widest mb-2">Case Law Recall</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Our advanced autonomous agents leverage a vector database of over 100 million legal precedents, achieving a
                            <span className="text-white font-bold"> 90% recall accuracy</span> in citing obscure case law.
                            This capability virtually eliminates the risk of missed precedents in appellate briefs.
                        </p>
                    </div>
                    <div className="p-4 border-l border-white/5 pl-8">
                        <h4 className="text-blue-500 font-mono text-xs uppercase tracking-widest mb-2">Social Impact Metrics</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Early pilot programs indicate a
                            <span className="text-white font-bold"> 15% increase in public trust</span>
                            for AI-driven bail decisions among minority groups, attributed to the removal of implicit human bias
                            and the transparent, factor-based reasoning provided by the Astra engine.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}
