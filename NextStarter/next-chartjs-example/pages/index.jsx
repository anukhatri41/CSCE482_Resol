import { FaBitcoin } from 'react-icons/fa';
import { FcAreaChart, FcBarChart, FcDoughnutChart } from 'react-icons/fc';
import CoinPriceChart from '../components/CoinPriceChart';

const Home = (props) => {
  return (
    <section className="flex h-screen items-center justify-center bg-gradient-to-tr from-green-400 to-blue-400">
      <div className="mx-5 max-w-4xl bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-center p-5 space-x-5">
          <FaBitcoin className="w-20 h-20 text-yellow-500" />
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-black text-gray-500">Bitcoin</h2>
            <p className="text-sm text-gray-500">$ 42770</p>
          </div>
          <div className="flex flex-col space-y-2 pl-10">
            <div className="flex items-center space-x-2">
              <FcDoughnutChart className="w-7 h-7" />
              <p className="text-sm text-gray-500 font-bold">Total Supply</p>
              <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full">
                21M
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FcAreaChart className="w-7 h-7" />
              <p className="text-sm text-gray-500 font-bold">
                Circulating Supply
              </p>
              <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full">
                18M
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FcBarChart className="w-7 h-7" />
              <p className="text-sm text-gray-500 font-bold">Max Supply</p>
              <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full">
                21M
              </span>
            </div>
          </div>
        </div>
      </div><div className="mx-5 max-w-4xl w-1/3 h-1/2 rounded-lg shadow-xl bg-white">
        <CoinPriceChart {...props.marketData} />
      </div>
    </section>
  );
};

export const getServerSideProps = async () => {
  const _cg_api = 'https://api.coingecko.com/api/v3';

  const marketData = await fetch(
    `${_cg_api}/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly`
  ).then((res) => res.json());

  return {
    props: {
      marketData: marketData
    }
  };
};

export default Home;