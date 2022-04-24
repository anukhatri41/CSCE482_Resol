import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
const axios = require('axios');
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


export async function getServerSideProps(){
  console.log("howdy--------");
  await axios.post('http://localhost:4000/graph_data', {
          txId: null,
          totalBalance: 0,
          id: 1
        }).then(resp => {
          console.log(resp.data);
        }).catch(error => {
          console.log(error);
        });

        return {
          props: {
            d:{}
          }
        }
}
