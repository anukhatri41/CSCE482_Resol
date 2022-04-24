import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Home</title>
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
