import { useEffect, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useToken } from "@/hooks/use-token.hook";

import styles from "./claim.module.css";
import ShowIf from "@/components/common/show-if";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

export function ClaimPrize(params: { address: `0x${string}` }) {
  const { address, isConnected, isDisconnected, isConnecting } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const { prizeWithdraw } = useLottery();
  const { writeAsync: writeClaimPrize } = prizeWithdraw;

  const { data, isError, isLoading } = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "prize",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ],
    functionName: "prize",
    args: [params.address],
  });

  const prize = typeof data === "number" ? data : "0";

  const onClaimPrize = async () => {
    setLoading(true);

    try {
      await writeClaimPrize({args: [prize]});
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Fetching your potential multimillion jackpot...</div>;
  if (isError) return <div>Error fetching prize</div>;
  if (!prize) {
    return (
      <div className={styles.container}>
        <p>There are no prizes to claim</p>
      </div>

    )
  }
  if (prize) {
    return (
      <div className={styles.container}>
        <p>Prize amount: {prize}</p>
        <button
          disabled={loading || isDisconnected || isConnecting}
          onClick={onClaimPrize}
        >
            {loading ? "Claiming..." : "Claim Prize"}
        </button>
      </div>
    );
  }
}


function validateNumber(value: string): string {
  const regex = new RegExp(/^\d*\.?\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const values = value.split(".");
  if (values.length === 1) {
    return Number(values[0]).toString();
  }

  if (values[1] && values[1].length > 5) {
    return "";
  }

  return values.join(".");
}
