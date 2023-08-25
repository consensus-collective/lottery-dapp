import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

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
      <Footer />
    </div>
  );
}
