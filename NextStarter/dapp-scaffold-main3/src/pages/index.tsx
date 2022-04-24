import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Resol Home</title>
        <link rel="icon" href="/favicon.ico"/>
        <meta
          name="Resol"
          content="Capstone"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
