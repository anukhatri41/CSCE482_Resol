import { FC, useCallback, useState } from 'react';

import { routeOutputV3} from '../tsx';



function StartStop () {

    const [status, setStatus] = useState(false);

    const onClick = useCallback(async () => {
        setStatus(!status);

        // routeOutputV3()
        // .then(() => {
        //     console.log("Done");
        // })
        // .catch((e) => {
        //     console.error(e);
        // });


    
     },[status]);


    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick}
            >
                <span>{`${status ? "Stop Trading" : "Start Trading"}`} </span>
            </button>
        </div>
    );
};

export default StartStop