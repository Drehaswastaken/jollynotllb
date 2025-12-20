"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Define the shape of the data
interface AgentMessage {
    agent_name: string;
    role: string;
    content: string;
    metadata?: any;
}

import { supabase } from "../../lib/supabaseClient";

export default function Simulation() {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const [caseInput, setCaseInput] = useState("");
    const [results, setResults] = useState<AgentMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const runSimulation = async () => {
        if (!caseInput.trim()) return;

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";
            const response = await fetch(`${apiUrl}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: caseInput }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || `Server Error: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black overflow-x-hidden relative">

            {/* Dynamic Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-900/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full">

                {/* Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
                        <div className="p-2 bg-white/5 rounded-full mr-3 group-hover:bg-white/10 border border-white/5">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="text-sm tracking-widest uppercase font-mono">Back to Dashboard</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="text-xs font-mono text-zinc-500 hover:text-white uppercase tracking-widest transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5"
                    >
                        Logout
                    </button>
                </div>

                {/* Cinematic Hero */}
                <header className="text-center space-y-6 mb-16 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-sans tracking-widest uppercase text-gray-400">System Online</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none">
                        <span className="block bg-gradient-to-br from-white via-gray-200 to-gray-600 bg-clip-text text-transparent">
                            ASTRA
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                            AI COURT
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Harness the power of autonomous legal agents to stress-test your case before you ever step into a courtroom.
                    </p>
                </header>

                {/* Input Area - Glassmorphism */}
                <div className="relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {/* Glowing Border Layout */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-50 blur transition duration-1000"></div>

                    <div className="relative bg-[#0f0f0f] rounded-2xl border border-white/10 p-1 md:p-2 shadow-2xl">
                        <div className="bg-black/50 rounded-xl overflow-hidden backdrop-blur-sm">
                            <textarea
                                value={caseInput}
                                onChange={(e) => setCaseInput(e.target.value)}
                                className="w-full h-48 bg-transparent text-lg text-gray-200 p-6 
                  focus:outline-none placeholder:text-gray-700 resize-none font-sans"
                                placeholder="Describe your legal situation here. Be specific..."
                            />

                            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/5">
                                <span className="text-xs text-gray-500 font-mono tracking-wider">SECURE TRANSMISSION</span>
                                <button
                                    onClick={runSimulation}
                                    disabled={loading || !caseInput}
                                    className={`
                    px-8 py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-300
                    ${loading
                                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                            : "bg-white text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transform hover:-translate-y-0.5"
                                        }
                  `}
                                >
                                    {loading ? "Analyzing..." : "Analyze Case"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-8 p-4 bg-red-900/20 border-l-2 border-red-500 text-red-400 font-mono text-sm animate-fade-in">
                        ERROR: {error}
                    </div>
                )}

                {/* Loading State - Custom CSS Holographic Loader */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-fade-in">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* Outer Ring */}
                            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            {/* Middle Ring */}
                            <div className="absolute inset-4 border-2 border-white/30 rounded-full border-t-white/80 animate-[spin_3s_linear_infinite_reverse]"></div>
                            {/* Inner Ring */}
                            <div className="absolute inset-10 border-2 border-amber-400/50 rounded-full border-b-amber-400 animate-[spin_5s_linear_infinite]"></div>

                            {/* Core */}
                            <div className="w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
                        </div>

                        <div className="space-y-2 text-center">
                            <p className="text-amber-500 font-bold tracking-[0.3em] text-sm animate-pulse">COURT IN SESSION</p>
                            <p className="text-gray-500 text-xs font-mono uppercase">Reviewing Precedents...</p>
                        </div>
                    </div>
                )}

                {/* Results Grid */}
                {results.length > 0 && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
                        {results.map((agent, index) => (
                            <div
                                key={index}
                                className="group relative bg-[#121212] rounded-xl border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all duration-500"
                                style={{ animation: `fadeIn 0.6s ease-out forwards`, animationDelay: `${index * 150}ms`, opacity: 0 }}
                            >
                                {/* Agent Type Badge */}
                                <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs text-xs text-gray-500 group-hover:text-amber-500 transition-colors">
                                    0{index + 1}
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all">
                                        {agent.agent_name.includes("Devil") ? "⚡" :
                                            agent.agent_name.includes("Clerk") ? "📂" : "⚖️"}
                                    </div>

                                    {/* Header */}
                                    <div>
                                        <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-amber-400 transition-colors">
                                            {agent.agent_name}
                                        </h3>
                                        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                                            {agent.role}
                                        </p>
                                    </div>

                                    {/* Body Body */}
                                    <div className="text-gray-400 text-sm leading-7 font-light border-t border-white/10 pt-6 group-hover:border-amber-500/20 transition-colors whitespace-pre-wrap">
                                        {agent.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}
