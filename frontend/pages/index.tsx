import styles from "@/styles/page.module.css";

import dynamic from "next/dynamic";

const Lottery = dynamic(() => import("@/components/lottery"), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <Lottery />
    </main>
  );
}
