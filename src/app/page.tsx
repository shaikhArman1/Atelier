"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#FAF8F5" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "28px", fontWeight: 300, letterSpacing: "0.12em", color: "#2C2A28", textTransform: "uppercase" }}>Atelier</div>
        <div style={{ marginTop: "8px", fontSize: "12px", letterSpacing: "0.06em", color: "#6B6964", textTransform: "uppercase" }}>Interior Design Studio</div>
      </div>
    </div>
  );
}
