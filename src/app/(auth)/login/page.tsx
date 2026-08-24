"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { signIn, isDemoMode } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(isDemoMode ? "demo@atelierinteriors.com" : "");
  const [password, setPassword] = useState(isDemoMode ? "demo1234" : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(135deg, #FAF8F5 0%, #F4F0EA 100%)"
    }}>
      {/* Left panel - brand */}
      <div style={{
        width: "50%",
        background: "#2C2A28",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(250,248,245,0.04) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
        {/* Large image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.12
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,248,245,0.5)", marginBottom: "24px" }}>
            Interior Design Studio
          </div>
          <div style={{ fontSize: "52px", fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase", color: "#FAF8F5", lineHeight: 1 }}>
            Atelier
          </div>
          <div style={{ height: "1px", width: "60px", background: "rgba(201,169,110,0.6)", margin: "32px 0" }} />
          <div style={{ fontSize: "16px", color: "rgba(250,248,245,0.65)", lineHeight: 1.7, fontWeight: 300, maxWidth: "360px" }}>
            Turn client ideas into visual design directions — with the precision of a luxury studio.
          </div>
          <div style={{ marginTop: "48px", display: "flex", gap: "32px" }}>
            {["Visual Discovery", "AI Concepts", "Design Library"].map((label) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(201,169,110,0.8)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px"
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {isDemoMode && (
            <div style={{
              marginBottom: "32px",
              padding: "14px 18px",
              background: "rgba(139,115,85,0.08)",
              border: "1px solid rgba(139,115,85,0.2)",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#8B7355",
              lineHeight: 1.6
            }}>
              <strong style={{ display: "block", marginBottom: "4px", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Demo Mode Active</strong>
              Credentials pre-filled. Click sign in to explore.
            </div>
          )}

          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em", color: "#2C2A28", marginBottom: "8px" }}>
              Welcome back
            </h1>
            <p style={{ color: "#6B6964", fontSize: "15px" }}>Sign in to your studio</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="atelier-label">Email</label>
              <input
                className="atelier-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="atelier-label">Password</label>
              <input
                className="atelier-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(180,40,40,0.06)", border: "1px solid rgba(180,40,40,0.15)", borderRadius: "8px", fontSize: "13px", color: "#B42828" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="atelier-btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "8px", fontSize: "15px" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "12px", color: "#9B9189", letterSpacing: "0.02em" }}>
            Professional interior design consultation platform
          </div>
        </div>
      </div>
    </div>
  );
}
