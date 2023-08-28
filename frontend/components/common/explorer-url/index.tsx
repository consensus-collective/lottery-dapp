import React from "react";
import { SnackbarKey, useSnackbar } from "notistack";

import styles from "./explorer.module.css";

interface Props {
  snackbarId: SnackbarKey;
  href: string;
}

export const ExplorerURL = (props: Props) => {
  const { href, snackbarId: id } = props;
  const { closeSnackbar } = useSnackbar();

  return (
    <React.Fragment>
      <a className={styles.detail} href={href} target="_blank">
        Detail
      </a>
      <a className={styles.dismiss} onClick={() => closeSnackbar(id)}>
        Dismiss
      </a>
    </React.Fragment>
  );
};
