import type { NextPage } from "next";
import Head from "next/head";
import { AboutUsView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>About Us</title>
        <meta
          name="About Us"
          content="Capstone Team Information"
        />
      </Head>
      <AboutUsView />
    </div>
  );
};

export default Home;
