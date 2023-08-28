import { BuyToken } from "./buy";
import { Timer } from "./timer";
import { useContractRead } from "wagmi";

import ShowIf from "../common/show-if";

import dynamic from "next/dynamic";
import styles from "./action.module.css";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

const PlaceBets = dynamic(() => import("./bets"), { ssr: false });

export default function Action() {
  const { data } = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betsOpen",
    args: [],
  });

  return (
    <div className={styles.container}>
      <div className={styles.time_container}>
        <Timer />
      </div>
      <div className={styles.bets_container}>
        <BuyToken />
        <ShowIf condition={Boolean(data)}>
          <PlaceBets />
        </ShowIf>
      </div>
    </div>
  );
}
