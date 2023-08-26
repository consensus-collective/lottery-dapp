import Action from "@/components/action";
import PoolInfo from "@/components/pool-info";

import styles from "@/styles/page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Lottery<span>-dapp</span>
          </h1>
          <h3>Group 6 Week 5</h3>
        </div>
      </header>
      <div className={styles.body}>
        <PoolInfo />
        <Action />
      </div>
    </main>
  );
}
