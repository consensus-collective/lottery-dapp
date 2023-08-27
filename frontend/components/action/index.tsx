import { BuyToken } from "./buy";
import { Timer } from "./timer";

import dynamic from "next/dynamic";
import styles from "./action.module.css";

const PlaceBets = dynamic(() => import("./bets"), { ssr: false });

export default function Action() {
  return (
    <div className={styles.container}>
      <div className={styles.bets_container}>
        <Timer />
        <BuyToken />
        <PlaceBets />
      </div>
    </div>
  );
}
