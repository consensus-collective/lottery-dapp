import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useBet } from "@/hooks/use-bet.hook";

import ShowIf from "@/components/common/show-if";

import styles from "./bets.module.css";

export default function PlaceBets() {
  const [loadingBet, setLoadingBet] = useState<boolean>(false);
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [times, setTimes] = useState<string>("1");
  const [maxTimes, setMaxTimes] = useState<string>("1");

  const { address, isDisconnected, isConnecting, isConnected } = useAccount();
  const { bet, betMany, allowance, approve, totalBet } = useBet(address);

  const { writeAsync: writeBet } = bet;
  const { writeAsync: writeBetMany } = betMany;
  const { writeAsync: writeApprove } = approve;

  const loading = loadingBet || loadingApprove;

  useEffect(() => {
    if (isDisconnected) return;
    const maxTimes = allowance / totalBet;
    setApproved(allowance >= totalBet);
    setMaxTimes(maxTimes.toString());
  }, [isDisconnected, allowance, totalBet]);

  const onPlaceBets = async () => {
    const betTimes = Number(times);
    if (betTimes <= 0) return;

    setLoadingBet(true);

    try {
      if (betTimes > 1) {
        await writeBetMany({ args: [times] });
      } else {
        await writeBet();
      }
    } catch {
      // ignore
    } finally {
      setLoadingBet(false);
    }
  };

  const onApproved = async () => {
    setLoadingApprove(true);

    try {
      await writeApprove();
    } catch {
      // ignore
    } finally {
      setLoadingApprove(false);
    }
  };

  const onChangeTimes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value, maxTimes);
    if (!amount) {
      return;
    }

    setTimes(amount);
  };

  return (
    <div className={styles.container}>
      <ShowIf condition={approved && isConnected}>
        <p>Total bets: </p>
        <input
          value={times}
          onChange={onChangeTimes}
          disabled={loading || isConnecting}
        />
        <p style={{ marginBottom: "20px" }}>Max bets: {maxTimes} times</p>
      </ShowIf>

      <button
        disabled={loading || isDisconnected || +times <= 0 || isConnecting}
        onClick={approved ? onPlaceBets : onApproved}
      >
        <ShowIf
          condition={allowance >= totalBet || isDisconnected || isConnecting}
        >
          {loadingBet ? "Betting..." : "Place Bets"}
        </ShowIf>
        <ShowIf condition={allowance < totalBet && isConnected}>
          {loadingApprove ? "Approving..." : "Approve"}
        </ShowIf>
      </button>
    </div>
  );
}

function validateNumber(value: string, maxTimes: string): string {
  const regex = new RegExp(/^\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const num = Number(value);
  if (num > +maxTimes) {
    return "";
  }

  if (num > 999) {
    return "";
  }

  return num.toString();
}
