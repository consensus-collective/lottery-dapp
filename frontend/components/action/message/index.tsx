import React from "react";

import styles from "./message.module.css";

export interface MessageProps {
  message: string;
  status: string;
  url?: string;
}

export function Message(props: MessageProps) {
  const { message, status, url } = props;

  if (status === "success") {
    return (
      <a className={styles.explorer_url} href={url}>
        {message}
      </a>
    );
  }

  if (status === "error") {
    return <p className={styles.error_message}>{message}</p>;
  }

  return <React.Fragment />;
}
