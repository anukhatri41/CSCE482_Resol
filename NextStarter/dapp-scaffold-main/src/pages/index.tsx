import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Resol</title>
        <meta
          name="description"
          content="Solana Arbitrage"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
