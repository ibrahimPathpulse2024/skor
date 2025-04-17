import React from 'react';

const History = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#141110]">
            <h3 className="text-white font-sora font-semibold text-lg">Transaction History</h3>
            <p className="text-[14px] text-white/80 mt-2 font-light font-sora leading-snug">
                View your transaction history and details.
            </p>
            {/* Add your transaction history component here */}
        </div>
    );  
};
export default History;