import { BuyToken } from "./buy";
import { Timer } from "./timer";
import { useAccount } from "wagmi";
import { useLottery } from "@/hooks/use-lottery.hook";

import ShowIf from "../common/show-if";

import dynamic from "next/dynamic";
import styles from "./action.module.css";

const PlaceBets = dynamic(() => import("./bets"), { ssr: false });

export default function Action() {
  const { isDisconnected } = useAccount();
  const { betsOpen } = useLottery();

  return (
    <div className={styles.container}>
      <div className={styles.time_container}>
        <Timer />
      </div>
      <div className={styles.bets_container}>
        <BuyToken />
        <ShowIf condition={betsOpen || isDisconnected}>
          <PlaceBets />
        </ShowIf>
      </div>
    </div>
  );
}
