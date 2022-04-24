import { exec } from "child_process";
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

// var express = require('express');
// var jsonServer = require('json-server');

// var server = express();
// // ...

// // You may want to mount JSON Server on a specific end-point, for example /api
// // Optiona,l except if you want to have JSON Server defaults
// // server.use('/api', jsonServer.defaults()); 
// server.use(jsonServer.router('db.json'));

// server.listen(4000);


export async function getServerSideProps(){
  console.log("howdy--------");
  exec("yarn run json-server --watch db.json --port 4000")
  await axios.put('http://localhost:4000/graph_data/1', {
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
