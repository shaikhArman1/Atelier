"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Studio", icon: "◈" },
  { href: "/consultations", label: "Consultations", icon: "◉" },
  { href: "/library", label: "Design Library", icon: "◫" },
  { href: "/projects", label: "Projects", icon: "◻" },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut, isDemoMode } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#FAF8F5" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "22px", fontWeight: 300, letterSpacing: "0.1em", color: "#2C2A28", textTransform: "uppercase" }}>Atelier</div>
          <div style={{ marginTop: "16px", display: "flex", gap: "6px", justifyContent: "center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C9A96E", opacity: 0.4, animation: `pulse 1.4s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAF8F5" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px",
        flexShrink: 0,
        background: "white",
        borderRight: "1px solid #EDE9E2",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #EDE9E2" }}>
          {isDemoMode && (
            <div className="demo-badge" style={{ marginBottom: "12px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#8B7355", display: "inline-block" }} />
              Demo Mode
            </div>
          )}
          <div style={{ fontSize: "20px", fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2C2A28" }}>
            Atelier
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "0.08em", color: "#9B9189", textTransform: "uppercase", marginTop: "2px" }}>
            Design Studio
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "20px 12px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  marginBottom: "2px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#2C2A28" : "#6B6964",
                  background: isActive ? "#F4F0EA" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontSize: "16px", opacity: isActive ? 1 : 0.5 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* New Consultation CTA */}
        <div style={{ padding: "16px 12px" }}>
          <Link
            href="/consultations/new"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              background: "#2C2A28",
              color: "white",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s ease",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
            New Consultation
          </Link>
        </div>

        {/* User info */}
        <div style={{ padding: "16px 16px 24px", borderTop: "1px solid #EDE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #8B7355, #C9A96E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 600, color: "white", flexShrink: 0
            }}>
              {user.displayName?.charAt(0) || "D"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#2C2A28", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.displayName}
              </div>
              <div style={{ fontSize: "11px", color: "#9B9189", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            style={{
              width: "100%", padding: "8px", border: "1px solid #EDE9E2",
              borderRadius: "7px", fontSize: "12px", color: "#6B6964",
              background: "transparent", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
