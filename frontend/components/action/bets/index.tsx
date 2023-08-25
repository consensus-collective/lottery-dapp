import styles from "./bets.module.css";

export default function PlaceBets() {
  const onPlaceBets = () => {
    console.log("Placing a bets");
  }

  return (
    <div className={styles.container}>
      <button onClick={onPlaceBets}>Place Bets</button>
    </div>
  );
}
