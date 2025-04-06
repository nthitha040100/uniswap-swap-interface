'use client';

import React from 'react';
import { SwapTransaction } from '@/types/swapTypes';
import { getExplorerTxUrl } from '@/utils/getExplorerUrl';
import { useGlobal } from '../providers/GlobalProviders';

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};

export default function TransactionHistory({ transactions }: { transactions: SwapTransaction[] }) {

    const { activeChain } = useGlobal()
    if (!transactions.length) return null;

    console.log(transactions)

    return (
        <div className="mt-8 overflow-x-auto">
            <h3 className="text-white text-lg mb-3">Recent Swaps</h3>
            <table className="min-w-full text-sm text-left text-gray-400 bg-zinc-900 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800 text-gray-300 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Input</th>
                        <th className="px-4 py-3">Output</th>
                        <th className="px-4 py-3">Txn</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.txHash} className="border-t border-zinc-700 hover:bg-zinc-800">
                            <td className="px-4 py-2">{formatDate(tx.timestamp)}</td>
                            <td className="px-4 py-2">{tx.fromAmount} {tx.fromSymbol}</td>
                            <td className="px-4 py-2">{tx.toAmount} {tx.toSymbol}</td>
                            <td className="px-4 py-2">
                                <a
                                    href={activeChain? getExplorerTxUrl(activeChain.id, tx.txHash): ''}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline break-all"
                                >
                                    {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
