import { useTimer } from "@/hooks/use-timer";

export function Timer() {
  const { timer, closeLottery } = useTimer();
  const { writeAsync } = closeLottery;

  const onCloseLottery = async () => {
    try {
      await writeAsync();
    } catch {
      // ignore
    }
  };

  if (timer > 0) {
    return <p>Lottery closes in {timer} seconds</p>;
  } else {
    return (
      <button style={{ padding: "0.5rem 1rem" }} onClick={onCloseLottery}>
        Close Lottery
      </button>
    );
  }
}
