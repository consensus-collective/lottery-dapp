import { useState } from "react";
import { BuyToken } from "./buy";
import { Message, MessageProps as IMessage } from "./message";

import dynamic from "next/dynamic";
import styles from "./action.module.css";

const PlaceBets = dynamic(() => import("./bets"), { ssr: false });

export default function Action() {
  const [data, setData] = useState<IMessage>({
    message: "",
    status: "",
  });

  const onChangeMessage = (message: string, status: string, url?: string) => {
    setData({
      ...data,
      message,
      status,
      url,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.bets_container}>
        <div className={styles.bets}>
          <BuyToken onChangeMessage={onChangeMessage} />
          <PlaceBets onChangeMessage={onChangeMessage} />
        </div>
        <div className={styles.message_container}>
          <Message {...data} />
        </div>
      </div>
    </div>
  );
}
