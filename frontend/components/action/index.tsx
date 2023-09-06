import { BuyToken } from "./buy";
import { BurnToken } from "./burn";
import { ClaimPrize } from "./claimPrize";
import { Timer } from "./timer";
import { useAccount } from "wagmi";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useToken } from "@/hooks/use-token.hook";

import ShowIf from "../common/show-if";

import dynamic from "next/dynamic";
import styles from "./action.module.css";

const PlaceBets = dynamic(() => import("./bets"), { ssr: false });

export default function Action() {
  const { address, isDisconnected } = useAccount();
  const { contract, betsOpen } = useLottery();
  const { balance } = useToken(contract);

  return (
    <div className={styles.container}>
      <div className={styles.time_container}>
        <Timer />
      </div>
      <div className={styles.bets_container}>
        <BuyToken />
        <ShowIf condition={(betsOpen && balance > 0) || isDisconnected}>
          <PlaceBets />
        </ShowIf>
      </div>
      <div className={styles.prize_container}>
        <ShowIf condition={(betsOpen && balance > 0) || isDisconnected}>
          <BurnToken />
        </ShowIf>
        <ShowIf condition={(!betsOpen && balance > 0) || isDisconnected}>
          <ClaimPrize address={address as `0x${string}`}/>
        </ShowIf>
      </div>
    </div>
  );
}
