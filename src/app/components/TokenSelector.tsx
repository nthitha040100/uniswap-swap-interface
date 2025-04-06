'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { normalizeIpfsUri } from '@/utils/normalizeIpfsUri';
import { IoClose } from 'react-icons/io5';
import { useGlobal } from '../providers/GlobalProvider';
import { Token } from '@/types/swapTypes';

const TokenSelector = ({
    onSelect,
    onClose,
    excludeTokenAddress,
}: {
    onSelect: (token: Token) => void
    onClose: () => void
    excludeTokenAddress?: string
}) => {
    const [tokenList, setTokenList] = useState<Token[]>([])
    const [search, setSearch] = useState('')
    const [filteredTokens, setFilteredTokens] = useState<Token[]>([])
    const { activeChain } = useGlobal()


    useEffect(() => {
        fetch("https://tokens.uniswap.org")
          .then((res) => res.json())
          .then((data) => {
            const filtered = data.tokens
              .filter((token: Token) => token.chainId === activeChain?.id)
              .map((token: Token) => ({
                ...token,
                logoURI: normalizeIpfsUri(token.logoURI),
              }))
      
            setTokenList(filtered)
            setFilteredTokens(filtered)
          })
      }, [activeChain?.id])

    useEffect(() => {
        const q = search.toLowerCase()
        const filtered = tokenList
          .filter(token =>
            token.name.toLowerCase().includes(q) ||
            token.symbol.toLowerCase().includes(q) ||
            token.address.toLowerCase().includes(q)
          )
          .filter(token => token.address !== excludeTokenAddress)
        
        setFilteredTokens(filtered)
    }, [search, tokenList, excludeTokenAddress])

    return (
        <div className="w-full max-w-md bg-[#1a1a1a] p-4 rounded-lg border border-gray-700">
            
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Select a token</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition">
                    <IoClose size={24} />
                </button>
            </div>

            
            <input
                className="w-full mb-4 p-2 rounded bg-zinc-800 text-white placeholder-gray-400"
                placeholder="Search token by name, symbol, or address"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            
            <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredTokens.map(token => (
                    <button
                        key={token.address}
                        onClick={() => onSelect(token)}
                        className="w-full text-left flex items-center space-x-2 p-2 rounded hover:bg-zinc-700"
                    >
                        <Image
                            src={token.logoURI}
                            alt={token.symbol}
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                        <span>{token.symbol} — {token.name}</span>
                    </button>
                ))}
            </div>
        </div>

    )
}

export default TokenSelector
