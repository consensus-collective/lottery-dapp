import React, { useEffect, useState } from "react";

import ShowIf from "@/components/common/show-if";

import styles from "./admin.module.css";

interface Props {
  state: boolean;
  loading: boolean;
  onOpen: (time: string) => Promise<void>;
}

interface Durations {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function LotteryState(props: Props) {
  const { state, loading, onOpen } = props;

  const [reset, setReset] = useState<boolean>(false);
  const [closingTimeDuration, setClosingTimeDuration] = useState<number>(0);
  const [durations, setDurations] = useState<Durations>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const onChangeDuration = (duration: number, dimension: string) => {
    if (dimension === "Days") {
      const { hours, minutes, seconds } = durations;
      const total = duration + hours + minutes + seconds;

      setDurations({ ...durations, days: duration });
      setClosingTimeDuration(total);
      return;
    }

    if (dimension === "Hours") {
      const { days, minutes, seconds } = durations;
      const total = days + duration + minutes + seconds;

      setDurations({ ...durations, hours: duration });
      setClosingTimeDuration(total);
      return;
    }

    if (dimension === "Minutes") {
      const { days, hours, seconds } = durations;
      const total = days + hours + duration + seconds;

      setDurations({ ...durations, minutes: duration });
      setClosingTimeDuration(total);
      return;
    }

    const { days, hours, minutes } = durations;
    const total = days + hours + minutes + duration;

    setDurations({ ...durations, seconds: duration });
    setClosingTimeDuration(total);
  };

  const onReset = () => {
    setReset(true);
    setClosingTimeDuration(0);
    setDurations({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  const onClear = (isClear: boolean) => {
    if (reset && isClear) setReset(false);
  };

  const onStart = async () => {
    const closingTimeInMs = closingTimeDuration + Date.now();
    const closingTimeInS = Math.floor(closingTimeInMs / 1000);
    await onOpen(closingTimeInS.toString());
    onReset();
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>State</p>
      <p>{state ? "Bets is Open" : "Bets is Closed"}</p>

      <ShowIf condition={!state}>
        <div className={styles.duration}>
          <div className={styles.times}>
            <Duration
              dimension="Days"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
          <div className={styles.times}>
            <Duration
              dimension="Hours"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
          <div className={styles.times}>
            <Duration
              dimension="Minutes"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
          <div className={styles.times}>
            <Duration
              dimension="Seconds"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
        </div>
        <div>
          <button disabled={loading} onClick={onStart}>
            {loading ? "Starting..." : "Start"}
          </button>
          <button disabled={loading} onClick={onReset}>
            Reset
          </button>
        </div>
      </ShowIf>
    </div>
  );
}

interface DurationProps {
  dimension: string;
  loading: boolean;
  reset: boolean;
  onClear: (isClear: boolean) => void;
  onChangeDuration: (duration: number, dimension: string) => void;
}

function Duration(props: DurationProps) {
  const { dimension, loading, onChangeDuration, reset, onClear } = props;

  const [duration, setDuration] = useState<string>("0");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const currentDuration = validateNumber(value, dimension);
    if (!currentDuration) {
      return;
    }

    let durationInMs = 0;
    switch (dimension) {
      case "Days":
        durationInMs = +currentDuration * 24 * 60 * 60 * 1000;
        break;
      case "Hours":
        durationInMs = +currentDuration * 60 * 60 * 1000;
        break;
      case "Minutes":
        durationInMs = +currentDuration * 60 * 1000;
        break;
      default:
        durationInMs = +currentDuration * 1000;
    }

    setDuration(currentDuration);
    onChangeDuration(durationInMs, dimension);
  };

  useEffect(() => {
    if (!reset) return;
    setDuration("0");
    onClear(true);
  }, [reset]);

  return (
    <React.Fragment>
      <p>{dimension}</p>
      <input
        style={{ width: "50%" }}
        value={duration}
        onChange={onChange}
        disabled={loading}
      />
    </React.Fragment>
  );
}

function validateNumber(value: string, dimension: string): string {
  const regex = new RegExp(/^\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const duration = Number(value);

  switch (dimension) {
    case "Days":
      break;
    case "Hours":
      if (duration > 23) return "";
      break;
    case "Minutes":
    case "Seconds":
      if (duration > 59) return "";
      break;
    default:
      return "";
  }

  return duration.toString();
}
