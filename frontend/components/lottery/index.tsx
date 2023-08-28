import React from "react";
import { Admin } from "@/components/admin";
import { useAccount } from "wagmi";
import { useLottery } from "@/hooks/use-lottery.hook";

import Action from "@/components/action";
import PoolInfo from "@/components/pool-info";
import ShowIf from "@/components/common/show-if";

import styles from "./lottery.module.css";

export default function Lottery() {
  const { address } = useAccount();
  const { owner } = useLottery();

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
      <ShowIf condition={address !== owner}>
        <div className={styles.lottery_container}>
          <PoolInfo />
          <Action />
        </div>
      </ShowIf>
      <ShowIf condition={address === owner}>
        <div className={styles.admin_container}>
          <Admin />
        </div>
      </ShowIf>
    </React.Fragment>
  );
}
