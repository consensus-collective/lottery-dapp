import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useToken } from "@/hooks/use-token.hook";

import styles from "./bets.module.css";

import TOKEN from "@/artifacts/token.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;

export default function PlaceBets() {
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [times, setTimes] = useState<string>("1");
  const [maxTimes, setMaxTimes] = useState<string>("1");
  const [text, setText] = useState<string>("Loading...");

  const { address, isDisconnected } = useAccount();
  const { bet, betMany, betFee, betPrice } = useLottery();
  const { approve } = useToken();

  const { writeAsync: writeBet } = bet;
  const { writeAsync: writeBetMany } = betMany;
  const { writeAsync: writeApprove } = approve;

  useEffect(() => {
    if (loadingPage) {
      return setText("Loading...");
    }

    if (loading) {
      if (!approved) {
        setText("Aproving...");
      } else {
        setText("Betting...");
      }
    } else {
      if (approved || isDisconnected) {
        setText("Place Bets");
      } else {
        setText("Approve");
      }
    }
  }, [isDisconnected, approved, loading, loadingPage]);

  useEffect(() => {
    if (isDisconnected || !address) return;
    setLoadingPage(true);
    onCheckAllowance(() => {
      setLoadingPage(false);
    });
  }, [isDisconnected, betPrice, address, betFee]);

  const onCheckAllowance = async (cb?: () => void) => {
    if (!betPrice || !betFee) return;
    const allowance = await readContract({
      address: TOKEN_CONTRACT as `0x${string}`,
      abi: TOKEN.abi as any,
      functionName: "allowance",
      args: [address, LOTTERY_CONTRACT],
    });

    const allowanceBN = allowance as unknown as bigint;
    const totalBet = betPrice + betFee;

    setApproved(allowanceBN >= totalBet);

    if (allowanceBN >= totalBet) {
      const maxTimes = (allowance as unknown as bigint) / totalBet;

      setTimes("1");
      setMaxTimes(maxTimes.toString());
    }

    cb && cb();
  };

  const betsOnce = async () => {
    setLoading(true);

    try {
      await writeBet();
      await onCheckAllowance();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const betsMany = async () => {
    setLoading(true);

    try {
      await writeBetMany({ args: [times] });
      await onCheckAllowance();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onPlaceBets = async () => {
    if (+times === 1) {
      await betsOnce();
    } else {
      await betsMany();
    }
  };

  const onApproved = async () => {
    if (!betPrice || !betFee) return;

    setLoading(true);

    try {
      const totalBet = betPrice + betFee;

      await writeApprove({ args: [LOTTERY_CONTRACT, totalBet] });
      await onCheckAllowance();
    } catch {
      // ignore
    } finally {
      setLoading(false);
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
      {approved && (
        <React.Fragment>
          <p>Max bets: {maxTimes} times</p>
          <input value={times} onChange={onChangeTimes} />
        </React.Fragment>
      )}

      <button
        disabled={loading || isDisconnected || +times <= 0 || loadingPage}
        onClick={approved ? onPlaceBets : onApproved}
      >
        {text}
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
