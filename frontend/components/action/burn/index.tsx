import { useEffect, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useToken } from "@/hooks/use-token.hook";

import styles from "./burn.module.css";
import ShowIf from "@/components/common/show-if";

export function BurnToken() {
  const [ethAmountBN, setEthAmountBN] = useState<bigint>(BigInt(0));
  const [amount, setAmount] = useState<`${number}`>("0");
  const [ethAmount, setEthAmount] = useState<string>("0");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false);

  const [tokenAmountBN, setTokenAmountBN] = useState<bigint>(BigInt(0));
  const [tokenAmount, setTokenAmount] = useState<string>("0");

  const { address, isConnected, isDisconnected, isConnecting } = useAccount();
  const { returnTokens, purchaseRatio, contract } = useLottery();

  const [approved, setApproved] = useState<boolean>(false);
  const { allowance, approve } = useToken(contract);

  const { data } = useBalance({ address });
  const { writeAsync: writeReturnTokens } = returnTokens;
  const { writeAsync: writeApprove } = approve;

  useEffect(() => {
    setDisabled(isConnecting);
  }, [isConnecting]);
  

  const onBurnToken = async () => {
    setLoading(true);

    try {
      await writeReturnTokens({ value: tokenAmountBN });

      setAmount("0");
      setEthAmountBN(BigInt(0));
      setEthAmount("0");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    const value = event.target.value;
    const tokenAmount = validateNumber(value);
    if (!tokenAmount) {
      return;
    }

    const tokenAmountBN = parseEther(tokenAmount as `${number}`);
    const ethAmountBN = tokenAmountBN / purchaseRatio;
    if (ethAmountBN > data.value) {
      return;
    }

    setEthAmountBN(ethAmountBN);
    setEthAmount(formatEther(ethAmountBN));
    setAmount(tokenAmount as `${number}`);
  };

  const onApproved = async () => {
    setLoadingApprove(true);

    try {
      await writeApprove({ args: [contract, tokenAmountBN] });
    } catch {
      // ignore
    } finally {
      setLoadingApprove(false);
      setApproved(true);
    }
  };

  return (
    <div className={styles.container}>
      <p>Token amount:</p>
      <input
        value={amount}
        onChange={onChangeAmount}
        disabled={loading || isDisconnected || disabled}
      />
      <p style={{ marginBottom: "20px" }}>You will get: {ethAmount} ETH</p>
      <button
        disabled={loading || isDisconnected || isConnecting}
        onClick={approved ? onBurnToken : onApproved}
      >
        <ShowIf
          condition={allowance >= tokenAmountBN || isDisconnected || isConnecting}
        >
          {loading ? "Burning..." : "Burn Tokens"}
        </ShowIf>
        <ShowIf condition={allowance < tokenAmountBN && isConnected}>
          {loadingApprove ? "Approving..." : "Approve"}
        </ShowIf>
      </button>
    </div>
  );
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
