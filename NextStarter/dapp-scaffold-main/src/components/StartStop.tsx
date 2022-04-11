import { FC, useState } from 'react';

export const StartStop: FC = () => {
    const [status, setStatus] = useState(false);

    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={() => setStatus(!status)}
            >
                <span>{`${status ? "Stop Trading" : "Start Trading"}`} </span>
            </button>
        </div>
    );
};