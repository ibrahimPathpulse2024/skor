    import React, { useState } from 'react';
    import Image from 'next/image';
    import Statusbar from './statusbar';

    const StakeCard = () => {
    const [amount, setAmount] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('60');
    const [isStaking, setIsStaking] = useState(true);

    const stakingOptions = [
        { days: '60 Days', apy: '8%' },
        { days: '90 Days', apy: '12%' },
        { days: '120 Days', apy: '16%' },
        { days: '365 Days', apy: '20%' },
    ];

    const unstakingHistory = [
        {
        id: 1,
        date: '---',
        amount: '---',
        timeLeft: '---',
        claimed: true,
        },
        {
        id: 2,
        date: '---',
        amount: '---',
        timeLeft: '---',
        claimed: false,
        },
        {
        id: 3,
        date: '---',
        amount: '---',
        timeLeft: '----',
        claimed: false,
        },
    ];

    return (
        <div className="w-full max-w-[700px] h-full p-6 sm:p-10 bg-[#141110] shadow-[5.392767429351807px_8.474349021911621px_62.55609893798828px_0px_rgba(36,33,32,0.60)] overflow-hidden mx-auto">
        <div className="text-center text-white text-3xl sm:text-4xl font-bold font-chakra uppercase leading-snug">
            Stake your tokens
        </div>

        {isStaking && (
            <div className="flex justify-center items-center text-[#FB553F] font-sora text-sm mt-2 text-center">
            Enter the number of tokens to stake.
            </div>
        )}

        {isStaking && (
            <div className="p-4 bg-[#111410] border border-white/20 text-white text-sm font-bold font-chakra uppercase">
            <div className="relative bg-zinc-800/40 p-6 sm:p-20 mt-6 ml-0 sm:ml-4">
            <Image
            src="/Background.svg"
            alt="Background Decoration"
            width={475}
            height={50}
            className="hidden sm:block absolute top-0 left-0 z-10 pointer-events-none ml-[60px]"
            /> 
                $SKORAI
                <div className="bg-[#111410] border border-white/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-2">
                <div>
                    <Image
                    src="/bronze.svg"
                    alt="Circles"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                    />
                </div>
                <input
                    type="number"
                    className="bg-transparent outline-none w-full font-semibold text-white text-lg placeholder-gray-400 caret-red-500"
                    placeholder="ENTER AMOUNT"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                </div>
                <Statusbar segments={3} filled={10} />
            </div>
            </div>
        )}


        

        {!isStaking && (
            <div className="mt-10">
            <h3 className="text-lg font-bold font-chakra text-white mb-4">
                Staking History
            </h3>
            <div className="w-full text-white text-sm font-sora border-t border-white/20">
                <div className="grid grid-cols-4 text-center py-2 border-b border-white/20 text-white/60 font-semibold uppercase text-[10px]">
                <div>Date</div>
                <div>Staked Amount</div>
                <div>Time Left</div>
                <div>Action</div>
                </div>

                {unstakingHistory.map((entry) => (
                <div
                    key={entry.id}
                    className="grid grid-cols-4 py-3 text-center items-center text-[8px]"
                >
                    <div>{entry.date}</div>
                    <div className="font-bold">{entry.amount}</div>
                    <div>{entry.timeLeft}</div>
                    <div>
                    {entry.claimed ? (
                        <div className="flex items-center text-center justify-center gap-2 text-white">
                        <Image
                            src="/claimed.svg"
                            alt="Claim Icon"
                            width={30}
                            height={30}
                        />
                        <span className="text-white/70 text-[10px]">
                            Claimed
                            <br />
                            {entry.amount} US
                        </span>
                        </div>
                    ) : entry.timeLeft === '0 days left' ? (
                        <button className="w-full bg-stone-700 border-r-[4px] border-b-[4px] border-[#65CB4C] text-white px-4 py-1 text-[10px] font-semibold ">
                        CLAIM
                        </button>
                    ) : (
                        <button className="w-full  bg-stone-700 border-r-[4px] border-b-[4px] border-[#ED4732] text-white px-4 py-1 text-[10px] font-semibold">
                        UNSTAKE
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* Toggle Switch */}
        <div className="flex justify-center items-center gap-2 mt-4 font-chakra">
            <span
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                isStaking ? 'border border-[#EE5D4B] text-white' : 'text-gray-400'
            }`}
            >
            Stake
            </span>
            <button
            onClick={() => setIsStaking(!isStaking)}
            className="w-10 h-5 bg-gray-600 rounded-full flex items-center px-1"
            >
            <div
                className={`w-3 h-3 rounded-full bg-[#EE5D4B] shadow-md transform transition-transform duration-300 ${
                isStaking ? 'translate-x-0' : 'translate-x-[1.2rem]'
                }`}
            />
            </button>
            <span
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                !isStaking ? 'border border-[#EE5D4B] text-white' : 'text-gray-400'
            }`}
            >
            Unstake
            </span>
            
        </div>
            {isStaking && (
    <div className=" mt-10 w-full max-w-[700px] mx-auto flex flex-col items-center space-y-6">
        <div className="w-full flex sm:flex-col flex-row">
        
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-6 mb-0 sm:mb-4 ">
        <div className="text-white/80 text-lg font-bold font-chakra leading-relaxed">
            Lockup
        </div>
            {stakingOptions.map((option) => (
            <button
                key={option.days}
                onClick={() => setSelectedPeriod(option.days)}
                className={`w-28 flex items-center justify-center rounded-lg px-2 py-2 text-sm font-sora ${
                selectedPeriod === option.days
                    ? 'bg-gradient-to-l from-[#EE5D4B] to-[#ED4732] text-white font-semibold'
                    : 'text-white bg-[#1C1C1C]'
                }`}
            >
                <Image src="/clock.svg" alt="Clock Icon" width={16} height={16} />
                {option.days}
            </button>
            ))}
        </div>
        

        <div className="w-full flex flex-col">
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-x-10 space-y-6 ">
        <div className="text-white/80 text-lg font-bold font-chakra leading-relaxed mt-0 sm:mt-6 ml-0 sm:ml-4">
            APY
        </div>
            {stakingOptions.map((option) => (
            <button
                key={option.days}
                onClick={() => setSelectedPeriod(option.days)}
                className={`w-28 h-9 rounded-lg px-2 py-2 text-sm font-sora ${
                selectedPeriod === option.days
                    ? 'bg-gradient-to-l from-[#EE5D4B] to-[#ED4732] text-black font-semibold'
                    : 'text-white bg-[#1C1C1C]'
                }`}
            >
                <div className="text-xs">{option.apy}</div>
            </button>
            ))}
        </div>
        </div>
    </div>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-6">
        {/* Badge + Offer */}
        <div className="px-3.5 py-2 bg-black rounded-full shadow-[0px_2.9px_34.8px_-7.2px_rgba(238,93,75,0.50)] outline outline-1 outline-offset-[-0.95px] outline-white/20 inline-flex items-center gap-1.5 animate-heartbeat">
            <div className="p-1 bg-red-500 rounded-full inline-flex justify-center items-center">
            <div className="text-black text-[9px] font-bold font-sora">NEW</div>
            </div>
            <div className="text-red-500 text-[10px] font-normal font-sora text-center leading-relaxed">
            Upto 20% APY on All Tiers   
            </div>
        </div>

        {/* Rewards */}
        <div className="text-center">
            <div className="text-white text-sm font-medium font-chakra leading-snug">
            Additional Rewards
            </div>
            <div className="text-red-500 text-xl font-bold font-chakra leading-10">
            ----
            </div>
        </div>

        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] px-4 py-1 border-2 border-black gap-2 text-black font-semibold font-chakra text-xs hover:scale-105 transition-transform duration-200 cursor-pointer rounded-md">
            <Image src="/bl.svg" alt="Left Icon" width={4} height={4} />
            PROCEED
            <Image src="/br.svg" alt="Right Icon" width={4} height={4} />
            </div>
        </div>
        </div>
    </div>
    )}

        </div>
    );
    };

    export default StakeCard;
