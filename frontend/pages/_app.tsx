import { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { SnackbarProvider } from "notistack";

import Layout from "@/components/layout";

import "../styles/globals.css";

const { chains } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "" })],
);

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",

    // Required
    appName: "Web3 Dapp Template",

    // Optional
    chains,
    appDescription: "This is a web3 dapp template",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
  }),
);

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Layout>
            <Component {...pageProps}></Component>
          </Layout>
        </SnackbarProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
