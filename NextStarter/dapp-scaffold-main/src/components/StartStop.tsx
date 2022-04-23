import { FC, useCallback, useState } from 'react';

import {ret_t_2, routeOutputV3} from '../tsx';



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
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#fa8b50] to-[#f9d472] hover:from-[#3DA5EB] hover:to-[#2CBDD4] ..."
                onClick={onClick}
            >
                <span>{`${status ? "Stop Trading" : "Start Trading"}`} </span>
            </button>
        </div>
    );
};

export default StartStop