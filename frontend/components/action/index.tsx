import PlaceBets from "./bets";
import BuyToken from "./buy";

import styles from "./action.module.css";

export default function Action() {
  return (
    <div className={styles.container}>
      <div className={styles.bets}>
        <BuyToken />
        <PlaceBets />
      </div>
    </div>
  );
}
