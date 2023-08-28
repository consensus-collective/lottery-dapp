import { useEffect, useState } from "react";
import { CountDown } from "../count-down";

import ShowIf from "../common/show-if";

import styles from "./admin.module.css";

interface Props {
  closingTime: number;
  state: boolean;
  loading: boolean;
  onClose: () => Promise<void>;
}

export function ClosingTime(props: Props) {
  const { closingTime, state, loading, onClose } = props;

  const [enabled, setEnabled] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);

  const onChange = (totalElapsedTime: number) => {
    const isDone = totalElapsedTime === closingTime - startTime;
    if (isDone) {
      setEnabled(isDone);
      setStartTime((ts) => ts + 1000);
    }
  };

  const onCloseBet = async () => {
    await onClose();
    setEnabled(false);
    setStartTime((ts) => ts + 1000);
  };

  useEffect(() => {
    setStartTime(Math.floor(Date.now() / 1000));
  }, [closingTime]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Closing Time</p>
      <ShowIf condition={state && startTime > 0 && closingTime >= startTime}>
        <CountDown
          startTime={startTime}
          endTime={closingTime}
          onChange={onChange}
        />
      </ShowIf>
      <ShowIf condition={enabled || (state && startTime > closingTime)}>
        <button disabled={loading} onClick={onCloseBet}>
          {loading ? "Closing..." : "Close"}
        </button>
      </ShowIf>
      <ShowIf condition={!state && startTime > closingTime}>
        <p style={{ marginTop: "10px" }}>N/A</p>
      </ShowIf>
    </div>
  );
}
