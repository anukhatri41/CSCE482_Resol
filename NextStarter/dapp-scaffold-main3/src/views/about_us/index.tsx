// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const AboutUsView: FC = ({ }) => {

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Resol <span className='text-sm font-normal align-top text-slate-700'>v{pkg.version}</span>
        </h1>      
          <div className="text-center">
        </div>
      </div>
    </div>
  );
};
