export interface Contract {
  signer?: string;
  contract: string;
}

export interface DeployArgument {
  name: string;
  params: Params;
}

// Params lists
export interface Params {
  [any: string]: any;
}
