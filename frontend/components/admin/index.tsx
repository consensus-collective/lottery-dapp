import React, { useState } from "react";
import { LotteryState } from "./lottery-state";
import { ClosingTime } from "./closing-time";
import { OwnerPool } from "./owner-pool";
import { AdminBalance } from "./admin-balance";
import { useToken } from "@/hooks/use-token.hook";
import { useLottery } from "@/hooks/use-lottery.hook";

import styles from "./admin.module.css";

interface Loading {
  openBets: boolean;
  withdraw: boolean;
  return: boolean;
  closeLottery: boolean;
}

export function Admin() {
  const [loading, setLoading] = useState<Loading>({
    openBets: false,
    withdraw: false,
    return: false,
    closeLottery: false,
  });

  const {
    contract,
    betsOpen,
    openBets,
    ownerPool,
    betsClosingTime,
    ownerWithdraw,
    returnTokens,
    purchaseRatio,
    closeLottery,
  } = useLottery();

  const { balance, approve, allowance } = useToken(contract);

  const { writeAsync: writeOpen } = openBets;
  const { writeAsync: writeOwnerWithdraw } = ownerWithdraw;
  const { writeAsync: writeReturnTokens } = returnTokens;
  const { writeAsync: writeApprove } = approve;
  const { writeAsync: writeCloseLottery } = closeLottery;

  const onOpen = async (time: string) => {
    setLoading({ ...loading, openBets: true });

    try {
      await writeOpen({ args: [time] });
    } catch {
      // ignore
    } finally {
      setLoading({ ...loading, openBets: false });
    }
  };

  const onClose = async () => {
    setLoading({ ...loading, closeLottery: true });

    try {
      await writeCloseLottery();
    } catch {
      // ignore
    } finally {
      setLoading({ ...loading, closeLottery: false });
    }
  };

  const onWithdraw = async (amount: bigint, cb?: () => void) => {
    setLoading({ ...loading, withdraw: true });

    try {
      await writeOwnerWithdraw({ args: [amount] });
      if (cb) cb();
    } catch {
      // ignore
    } finally {
      setLoading({ ...loading, withdraw: false });
    }
  };

  const onApprove = async (amount: bigint) => {
    setLoading({ ...loading, return: true });

    try {
      await writeApprove({ args: [contract, amount] });
    } catch {
      // ignore
    } finally {
      setLoading({ ...loading, return: false });
    }
  };

  const onReturn = async (amount: bigint, cb?: () => void) => {
    setLoading({ ...loading, return: true });

    try {
      await writeReturnTokens({ args: [amount] });
      if (cb) cb();
    } catch {
      // ignore
    } finally {
      setLoading({ ...loading, return: false });
    }
  };

  return (
    <React.Fragment>
      <LotteryState
        state={betsOpen}
        onOpen={onOpen}
        loading={loading.openBets}
      />
      <ClosingTime
        closingTime={Number(betsClosingTime)}
        state={betsOpen}
        loading={loading.closeLottery}
        onClose={onClose}
      />
      <div className={styles.admin_balance}>
        <OwnerPool
          pool={ownerPool}
          loading={loading.withdraw}
          onWithdraw={onWithdraw}
        />
        <AdminBalance
          ratio={purchaseRatio}
          balance={balance}
          allowance={allowance}
          loading={loading.return}
          onReturn={onReturn}
          onApprove={onApprove}
        />
      </div>
    </React.Fragment>
  );
}
