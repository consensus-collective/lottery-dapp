"use client";
import { ConnectKitButton } from "connectkit";
import styles from "./navbar.module.css";
import { useAccount, useNetwork, useBalance, useContractRead } from "wagmi";


export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftContent}>
        <a className={styles.button} href="https://github.com/consensus-collective/lottery-dapp" target={"_blank"}>
          <p>Github Repository</p>
        </a>
      </div>
      <div className={styles.rightContent}>
        <ConnectKitButton />
        <div className={styles.balanceContainer}>
          <PageBody></PageBody>
        </div>
      </div>
    </nav>
  );
}

function PageBody() {
  return (
    <div>
      <WalletInfo></WalletInfo>
    </div>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();

  if (address) {
    return (
      <div>
        <WalletBalance address={address}></WalletBalance>
        <TokenBalance address={address}></TokenBalance>
      </div>
    )
  };
  if (isConnecting) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  };
  if (isDisconnected) {
    return (
      <div>
        <p>Connect wallet</p>
      </div>
    )
  };
}

function WalletBalance(params: { address: any }) {
  const { data, isError, isLoading } = useBalance({ address: params.address });
  if (isLoading) return <div>Fetching Balance....</div>;
  if (isError) return <div>Error fetching balance</div>;

  // Format the ETH balance to show only 3 decimal places; it defaults to showing 18
  const formattedBalance = data ? parseFloat(data.formatted).toFixed(3) : 'N/A';

  return (
    <div>
      ETH Balance: {formattedBalance}
    </div>
  );
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0x1Ea03621FaeAE28cB6c896C78E56138f9436cCF2",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });
  const balance = typeof data === "number" ? data : 0;
  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Token Balance: {balance}</div>;
}