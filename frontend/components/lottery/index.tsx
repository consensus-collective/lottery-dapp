import React from "react";
import { Admin } from "@/components/admin";
import { useAccount, useContractRead } from "wagmi";

import Action from "@/components/action";
import PoolInfo from "@/components/pool-info";
import ShowIf from "@/components/common/show-if";

import styles from "./lottery.module.css";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

export default function Lottery() {
  const { address } = useAccount();
  const { data, isLoading } = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "owner",
    args: [],
  });

  return (
    <React.Fragment>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Lottery<span>-dapp</span>
          </h1>
          <h3>Group 6 Week 5</h3>
        </div>
      </header>
      <ShowIf condition={!isLoading && address !== data}>
        <div className={styles.lottery_container}>
          <PoolInfo />
          <Action />
        </div>
      </ShowIf>
      <ShowIf condition={!isLoading && address === data}>
        <div className={styles.admin_container}>
          <Admin />
        </div>
      </ShowIf>
    </React.Fragment>
  );
}
