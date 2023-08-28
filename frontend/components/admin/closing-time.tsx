import { useEffect, useState } from "react";
import { CountDown } from "../count-down";

import ShowIf from "../common/show-if";

import styles from "./admin.module.css";
import { usePublicClient } from "wagmi";

interface Props {
  closingTime: number;
  state: boolean;
  loading: boolean;
  onClose: () => Promise<void>;
}

export function ClosingTime(props: Props) {
  const { closingTime, state, loading, onClose } = props;

  const [enabled, setEnabled] = useState<boolean>(false);
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0);

  const { getBlock } = usePublicClient();

  const onChange = (totalElapsedTime: number) => {
    const isDone = totalElapsedTime === closingTime - blockTimestamp;
    if (isDone) {
      setEnabled(isDone);
      setBlockTimestamp((ts) => ts + 1000);
    }
  };

  const onCloseBet = async () => {
    await onClose();
    setEnabled(false);
    setBlockTimestamp((ts) => ts + 1000);
  };

  useEffect(() => {
    getBlock().then(({ timestamp }) => {
      setBlockTimestamp(Number(timestamp));
    });
  }, [closingTime]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Closing Time</p>
      <ShowIf condition={blockTimestamp > 0 && closingTime >= blockTimestamp}>
        <CountDown
          startTime={blockTimestamp}
          endTime={closingTime}
          onChange={onChange}
        />
      </ShowIf>
      <ShowIf condition={enabled || (state && blockTimestamp > closingTime)}>
        <button disabled={loading} onClick={onCloseBet}>
          {loading ? "Closing..." : "Close"}
        </button>
      </ShowIf>
      <ShowIf condition={!state && blockTimestamp > closingTime}>
        <p style={{ marginTop: "10px" }}>N/A</p>
      </ShowIf>
    </div>
  );
}
