import React from "react";

export interface Props {
  children: React.ReactNode;
  condition: boolean;
}

/**
 * Shows the child nodes if the supplied condition is true
 */
const ShowIf: React.FC<Props> = ({ condition, children }) => (
  <React.Fragment>{(condition && children) || null}</React.Fragment>
);

export default ShowIf;
