"use client";

import { useState, useEffect } from "react";
import { supabase, isConfigured } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success" | null; text: string }>({ type: null, text: "" });

    // Monitor Auth State
    useEffect(() => {
        if (!isConfigured) return; // Don't try to auth if not configured
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                router.push("/");
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);


    const handleGoogleLogin = async () => {
        if (!isConfigured) {
            setStatusMessage({ type: "error", text: "System not configured. Check .env.local" });
            return;
        }
        setGoogleLoading(true);
        setStatusMessage({ type: null, text: "" });

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/`,
                }
            });
            if (error) throw error;
        } catch (error: any) {
            setStatusMessage({ type: "error", text: error.message || "Google auth failed" });
            setGoogleLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConfigured) {
            setStatusMessage({ type: "error", text: "System not configured. Check .env.local" });
            return;
        }
        setLoading(true);
        setStatusMessage({ type: null, text: "" });

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            // Redirect handled by onAuthStateChange
        } catch (error: any) {
            setStatusMessage({ type: "error", text: error.message || "Authentication failed" });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Main Login Card */}
            <div className="w-full max-w-md p-8 relative z-10 animate-fade-in">

                {/* Glassmorphism Container */}
                <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-orange-500/20 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.1)] p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <span className="font-serif font-bold text-3xl text-white tracking-wide">ASTRA</span>
                            <span className="font-sans font-medium text-3xl text-orange-500">AI</span>
                        </div>
                        <p className="text-zinc-400 text-sm tracking-widest uppercase font-mono">Restricted Access Portal</p>
                    </div>

                    {/* CONFIGURATION CHECK */}
                    {!isConfigured && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm">
                                <h4 className="text-red-400 font-bold mb-1">Configuration Missing</h4>
                                <p className="text-red-300/80 leading-relaxed text-xs">
                                    Authentication service is offline. Please create <code className="bg-red-500/20 px-1 rounded">.env.local</code> with your Supabase credentials.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading || loading || !isConfigured}
                        className="w-full flex items-center justify-center space-x-3 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-zinc-200 transition-colors mb-6 relative overflow-hidden group"
                    >
                        {googleLoading ? (
                            <span className="flex items-center space-x-2">
                                <span className="w-4 h-4 border-2 border-zinc-400 border-t-black rounded-full animate-spin"></span>
                                <span>Verifying Identity...</span>
                            </span>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-950 px-2 text-zinc-500">Or sign in with email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Agent ID (Email)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Access Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
                                required
                            />
                        </div>

                        {statusMessage.text && (
                            <div className={`text-xs p-3 rounded flex items-start space-x-2 ${statusMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                {statusMessage.type === 'error' ? <AlertCircle size={14} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={14} className="mt-0.5 shrink-0" />}
                                <span>{statusMessage.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full bg-zinc-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-zinc-700 hover:text-orange-500 transition-all border border-white/5"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>

                </div>

                {/* Footer Disclaimer */}
                <div className="text-center mt-6 space-y-2 opacity-50">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                        Unauthorized access is a federal offense
                    </p>
                    <p className="text-[10px] text-zinc-600">
                        All login attempts are recorded for judicial audit logs.
                        <br />
                        System v2.4.0 (Secure)
                    </p>
                </div>

            </div>
        </div>
    );
}
