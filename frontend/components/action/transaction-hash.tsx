import React from "react";

import { SnackbarContent, CustomContentProps } from "notistack";

import styles from "@/components/action/action.module.css";

interface TransactionHashProps extends CustomContentProps {
  hash: string;
  allowDownload: boolean;
}

const TransactionHash = React.forwardRef<HTMLDivElement, TransactionHashProps>(
  (props, ref) => {
    const { id, message, hash, ...other } = props;

    return (
      <SnackbarContent ref={ref} role="alert" {...other}>
        <div className={styles.transaction_hash}>
          <span style={{ color: "whitesmoke" }}>Transaction Hash: </span>
          <a
            className={styles.explorer_url}
            href={message?.toString() ?? ""}
            target="_blank"
          >
            {hash}
          </a>
        </div>
      </SnackbarContent>
    );
  },
);

TransactionHash.displayName = "TransactionHash";

export default TransactionHash;
