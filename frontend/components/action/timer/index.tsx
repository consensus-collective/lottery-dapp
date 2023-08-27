import { useTimer } from "@/hooks/use-timer";
import styles from "./timer.module.css";


export function Timer() {

    const { timer, closeLottery } = useTimer();
    const { writeAsync } = closeLottery;

    const onCloseLottery = async () => {
        await writeAsync();
    }

    if (timer > 0){
        return (
            <div className={styles.container}>
                <p>Lottery closes in {timer} seconds</p>
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                <button onClick={onCloseLottery}>Close Lottery</button>
            </div>
        );
    }
}