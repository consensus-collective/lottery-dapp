import styles from "@/styles/page.module.css";

import Action from "@/components/action";
import PoolInfo from "@/components/pool-info";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            create<span>-web3-dapp</span>
          </h1>
          <h3>The ultimate solution to create web3 applications</h3>
        </div>
      </header>
      <div className={styles.body}>
        <PoolInfo />
        <Action />
      </div>
    </main>
  );
}
