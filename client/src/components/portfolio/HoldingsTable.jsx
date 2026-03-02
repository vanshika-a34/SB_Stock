import { FiTrendingUp, FiTrendingDown, FiArchive } from 'react-icons/fi';

const HoldingsTable = ({ holdings }) => {
    if (!holdings || holdings.length === 0) {
        return (
            <div className="glass-card p-12 text-center shadow-lg border border-[rgba(255,255,255,0.05)]">
                <FiArchive size={48} className="mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">No active holdings</h3>
                <p className="text-[var(--color-text-secondary)] font-medium max-w-sm mx-auto">You haven't purchased any stocks yet. Head over to the Stocks page to start building your portfolio!</p>
            </div>
        );
    }

    return (
        <section className="glass-card overflow-hidden shadow-xl border-[1px] border-[rgba(255,255,255,0.05)]" aria-label="Holdings table">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Symbol</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Company</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Shares</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Avg Cost</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Current</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Invested</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Value</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Total Return</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        {holdings.map((holding) => {
                            const isProfit = holding.profitLoss >= 0;
                            return (
                                <tr key={holding.stockId} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                                    <td className="px-6 py-5 font-black text-[var(--color-primary-light)] text-base group-hover:text-white transition-colors">{holding.symbol}</td>
                                    <td className="px-6 py-5 text-[var(--color-text-secondary)] font-medium max-w-[180px] truncate">{holding.companyName}</td>
                                    <td className="px-6 py-5 font-bold text-white bg-[rgba(255,255,255,0.01)]">{holding.quantity.toLocaleString()}</td>
                                    <td className="px-6 py-5 font-medium text-[var(--color-text-secondary)]">${holding.avgBuyPrice?.toFixed(2)}</td>
                                    <td className="px-6 py-5 font-bold text-white">${holding.currentPrice?.toFixed(2)}</td>
                                    <td className="px-6 py-5 font-medium text-[var(--color-text-secondary)]">${holding.investedValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-5 font-bold text-white">${holding.currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-sm ${isProfit ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' : 'bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]'}`}>
                                            {isProfit ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                            <span>{isProfit ? '+' : ''}${Math.abs(holding.profitLoss)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span className="text-xs opacity-80 border-l border-current pl-1.5 ml-0.5">({isProfit ? '+' : ''}{holding.profitLossPercent}%)</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default HoldingsTable;
