import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./navbar"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "105vh",
      }}
    >
      <Navbar />
      <div style={{ flexGrow: 1 }}>{children}</div>
    </div>
  );
}
