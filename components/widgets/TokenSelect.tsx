import { Fragment, useEffect, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react';
import { TokenListTypes } from './Constants/type';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { getUserTokensInfo } from '@/utils/erc20';

interface TokenSelectProps {
    selectedToken: TokenListTypes | undefined;
    setSelectedToken: (selectedToken: TokenListTypes) => void;
    tokens: string[];
}

export default function TokenSelect({ selectedToken, setSelectedToken, tokens }: TokenSelectProps) {
    const { address } = useAccount();
    const [feeTokenList, setFeeTokenList] = useState<TokenListTypes[]>([])

    useEffect(() => {
        if (tokens.length > 0 && !tokens.includes('')) {
            (async () => {
                const feeTokenList = await getUserTokensInfo(tokens, address)
                setFeeTokenList(feeTokenList)
            })()
        }
    }, [address, tokens])

    useEffect(() => {
        if (feeTokenList && feeTokenList.length > 0) {
            setSelectedToken(feeTokenList[0])
        }
    }, [feeTokenList])

    return (
        <div className="w-48">
            {selectedToken && <Listbox value={selectedToken} onChange={setSelectedToken}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-[#18181B] py-2 px-2 sm:px-4 pr-6 sm:pr-8 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <div className='flex items-center gap-1 sm:gap-2 text-white overflow-hidden whitespace-nowrap text-ellipsis'>
                            <Image src={`/image/${selectedToken.name}.png`} alt='Token logo' width={20} height={20} />
                            <span className="block truncate font-bold text-sm sm:text-base">{selectedToken.name}</span>
                            <span>({selectedToken.balance.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })})</span>
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icon icon="icon-park-outline:down" fontSize={16} className='text-white' />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#18181B] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                            {feeTokenList.map((token: TokenListTypes, index: number) => {
                                return (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 px-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-white'}`
                                        }
                                        value={token}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <div className='flex items-center text-sm sm:text-base justify-between gap-2'>
                                                    <span className={`block truncate ${selected ? 'font-black' : 'font-bold'}`}>
                                                        {token.name}
                                                    </span>
                                                    <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'} text-[#0084FE]`}>
                                                        {token.balance.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </Listbox.Option>
                                )
                            })}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>}
        </div>
    )
}
