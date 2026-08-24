export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      {children}
    </div>
  );
}
