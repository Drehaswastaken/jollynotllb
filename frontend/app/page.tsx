"use client";

import { useState } from "react";

// Define the shape of the data coming from your Python backend
interface AgentMessage {
  agent_name: string;
  role: string;
  content: string;
  metadata?: any;
}

export default function Home() {
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
      // 1. Get the URL from environment variables
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 2. Send POST request to your Python backend
      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // IMPORTANT: This key 'question' matches the BaseModel in main.py
        body: JSON.stringify({ question: caseInput }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
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
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Moot Court AI
          </h1>
          <p className="text-gray-400">
            Test your legal case against 3 AI agents.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Describe your case:
          </label>
          <textarea
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
            className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="e.g. I want to sue a cafe because their coffee was too hot..."
          />
          <button
            onClick={runSimulation}
            disabled={loading || !caseInput}
            className={`mt-4 w-full py-3 rounded-lg font-bold transition-all duration-200 
              ${
                loading
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20"
              }`}
          >
            {loading ? "Analyzing Case..." : "Run Simulation"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results.map((agent, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Agent Header */}
              <div className="bg-gray-750 p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {agent.agent_name}
                  </h3>
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    {agent.role}
                  </span>
                </div>
                {/* Visual indicator for specific agents */}
                {agent.agent_name.includes("Devil") && (
                  <span className="text-2xl">😈</span>
                )}
                {agent.agent_name.includes("Clerk") && (
                  <span className="text-2xl">📚</span>
                )}
                {agent.agent_name.includes("Strategist") && (
                  <span className="text-2xl">⚖️</span>
                )}
              </div>

              {/* Agent Content */}
              <div className="p-6 whitespace-pre-wrap leading-relaxed text-gray-300">
                {agent.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
