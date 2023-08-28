import { CountdownCircleTimer } from "react-countdown-circle-timer";

import styles from "./count-down.module.css";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const TimerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

const renderTime = (dimension: string, time: number) => {
  return (
    <div>
      <div style={{ fontSize: "32px" }}>{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time: number) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time: number) =>
  ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time: number) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time: number) => (time / daySeconds) | 0;

interface CountDownProps {
  startTime: number;
  endTime: number;
  onChange?: (totalElapsedTime: number) => void;
}

export function CountDown(props: CountDownProps) {
  const { startTime, endTime, onChange } = props;

  const remainingTime = endTime - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <div className={styles.container}>
      <CountdownCircleTimer
        {...TimerProps}
        colors="#7E2E84"
        duration={daysDuration}
        initialRemainingTime={remainingTime}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("days", getTimeDays(daysDuration - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...TimerProps}
        colors="#D14081"
        duration={daySeconds}
        initialRemainingTime={remainingTime % daySeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("hours", getTimeHours(daySeconds - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...TimerProps}
        colors="#EF798A"
        duration={hourSeconds}
        initialRemainingTime={remainingTime % hourSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds,
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...TimerProps}
        colors="#218380"
        duration={minuteSeconds}
        initialRemainingTime={remainingTime % minuteSeconds}
        onComplete={(totalElapsedTime) => {
          if (onChange) {
            onChange(totalElapsedTime);
          }

          return {
            shouldRepeat: remainingTime - totalElapsedTime > 0,
          };
        }}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("seconds", getTimeSeconds(elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
