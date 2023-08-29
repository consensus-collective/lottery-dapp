import { useLottery } from "@/hooks/use-lottery.hook";
import styles from "./pool-info.module.css";
import { formatEther } from "viem";

export default function PoolInfo() {
  const { totalBet } = useLottery();

  return (
    <div className={styles.container}>
      <h1>Pool Info</h1>
      <div>Pool size: {formatEther(totalBet)} $MAGA</div>
    </div>
  );
}
