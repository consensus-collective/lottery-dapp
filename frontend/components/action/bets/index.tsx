import React, { useEffect, useState } from "react";
import { useAccount, useNetwork, useContractReads } from "wagmi";
import { waitForTransaction, writeContract, readContract } from "@wagmi/core";

import styles from "./bets.module.css";

import LOTTERY from "@/artifacts/lottery.json";
import TOKEN from "@/artifacts/token.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;

interface BetsProps {
  onChangeMessage: (message: string, status: string, url?: string) => void;
}

export default function PlaceBets(props: BetsProps) {
  const { onChangeMessage } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [times, setTimes] = useState<string>("1");
  const [maxTimes, setMaxTimes] = useState<string>("1");
  const [text, setText] = useState<string>("Approve");

  const { chain } = useNetwork();
  const { address, isDisconnected } = useAccount();
  const { data } = useContractReads({
    contracts: [
      {
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi as any,
        functionName: "betPrice",
        args: [],
      },
      {
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi as any,
        functionName: "betFee",
        args: [],
      },
    ],
  });

  const betsOnce = async () => {
    const [betPrice, betFee] = data as any;

    if (betPrice.status !== "success" && betFee.status !== "success") return;

    setLoading(true);

    try {
      const { hash } = await writeContract({
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi,
        functionName: "bet",
      });

      const { transactionHash } = await waitForTransaction({ hash });

      const explorer = chain?.blockExplorers?.default.url;
      const message = transactionHash;
      const status = "success";
      const url = explorer ? `${explorer}/tx/${transactionHash}` : "";

      onChangeMessage(message, status, url);

      const allowance = await readContract({
        address: TOKEN_CONTRACT as `0x${string}`,
        abi: TOKEN.abi as any,
        functionName: "allowance",
        args: [address, LOTTERY_CONTRACT],
      });

      setApproved(allowance >= betPrice.result + betFee.result);

      if (allowance >= betPrice.result + betFee.result) {
        const amount = betPrice.result + betFee.result;
        const maxTimes = (allowance as unknown as bigint) / amount;

        setMaxTimes(maxTimes.toString());
      }
    } catch (err) {
      onChangeMessage((err as any).message, "error");
    } finally {
      setLoading(false);
    }
  };

  const betsMany = async () => {
    const [betPrice, betFee] = data as any;

    if (betPrice.status !== "success" && betFee.status !== "success") return;

    setLoading(true);

    try {
      const { hash } = await writeContract({
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi,
        functionName: "betMany",
        args: [times],
      });

      const { transactionHash } = await waitForTransaction({ hash });

      const explorer = chain?.blockExplorers?.default.url;
      const message = transactionHash;
      const status = "success";
      const url = explorer ? `${explorer}/tx/${transactionHash}` : "";

      onChangeMessage(message, status, url);

      const allowance = await readContract({
        address: TOKEN_CONTRACT as `0x${string}`,
        abi: TOKEN.abi as any,
        functionName: "allowance",
        args: [address, LOTTERY_CONTRACT],
      });

      setApproved(allowance >= betPrice.result + betFee.result);

      if (allowance >= betPrice.result + betFee.result) {
        const amount = betPrice.result + betFee.result;
        const maxTimes = (allowance as unknown as bigint) / amount;

        setMaxTimes(maxTimes.toString());
      }
    } catch (err) {
      onChangeMessage((err as any).message, "error");
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
    const [betPrice, betFee] = data as any;

    if (betPrice.status !== "success" && betFee.status !== "success") return;

    setLoading(true);

    try {
      const amount = betPrice.result + betFee.result;
      const { hash } = await writeContract({
        address: TOKEN_CONTRACT as `0x${string}`,
        abi: TOKEN.abi,
        functionName: "approve",
        args: [LOTTERY_CONTRACT, amount],
      });

      await waitForTransaction({ hash });

      const allowance = await readContract({
        address: TOKEN_CONTRACT as `0x${string}`,
        abi: TOKEN.abi as any,
        functionName: "allowance",
        args: [address, LOTTERY_CONTRACT],
      });

      setApproved(allowance >= amount);

      if (allowance >= amount) {
        const maxTimes = (allowance as unknown as bigint) / amount;

        setMaxTimes(maxTimes.toString());
      }
    } catch (err) {
      onChangeMessage((err as any).message, "error");
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

  useEffect(() => {
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
  }, [isDisconnected, approved, loading]);

  useEffect(() => {
    if (isDisconnected) return;
    const [betPrice, betFee] = data as any;
    if (betPrice.status !== "success" && betFee.status !== "success") return;
    readContract({
      address: TOKEN_CONTRACT as `0x${string}`,
      abi: TOKEN.abi as any,
      functionName: "allowance",
      args: [address, LOTTERY_CONTRACT] as any,
    }).then((allowance) => {
      const amount = betPrice.result + betFee.result;
      const maxTimes = (allowance as unknown as bigint) / amount;

      setMaxTimes(maxTimes.toString());
      setApproved(allowance >= betPrice.result + betFee.result);
    });
  }, [isDisconnected, data]);

  return (
    <div className={styles.container}>
      {approved && (
        <React.Fragment>
          <p>Max bets: {maxTimes} times</p>
          <input value={times} onChange={onChangeTimes} />
        </React.Fragment>
      )}

      <button
        disabled={loading || isDisconnected || +times <= 0}
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
