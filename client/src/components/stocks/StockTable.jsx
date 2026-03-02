import { FiTrendingUp, FiTrendingDown, FiShoppingCart } from 'react-icons/fi';

const StockTable = ({ stocks, onTrade }) => {
    if (!stocks || stocks.length === 0) {
        return (
            <div className="glass-card text-center py-16 px-4 shadow-lg border border-[rgba(255,255,255,0.05)]">
                <p className="text-[var(--color-text-muted)] text-lg">No stocks found matching your criteria</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden glass-card shadow-xl border-[1px] border-[rgba(255,255,255,0.05)]">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Symbol</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Company</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Price</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Change</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">% Change</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Volume</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Sector</th>
                            <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        {stocks.map((stock) => {
                            const isPositive = stock.change >= 0;
                            return (
                                <tr key={stock._id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                                    <td className="px-6 py-4 font-black text-[var(--color-primary-light)] text-base group-hover:text-white transition-colors">{stock.symbol}</td>
                                    <td className="px-6 py-4 text-[var(--color-text-secondary)] font-medium max-w-[200px] truncate">{stock.companyName}</td>
                                    <td className="px-6 py-4 font-bold text-white">${stock.price?.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 font-bold ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                            {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                            {isPositive ? '+' : ''}{stock.change?.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded textxs font-bold ${isPositive ? 'bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]' : 'bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]'}`}>
                                            {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[var(--color-text-muted)]">{(stock.volume / 1e6)?.toFixed(1)}M</td>
                                    <td className="px-6 py-4 font-medium text-[var(--color-text-muted)] uppercase tracking-wider text-xs">{stock.sector}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onTrade(stock)}
                                            className="px-4 py-2 text-xs font-bold rounded-lg text-white transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 shadow-md hover:shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.3)' }}
                                            id={`trade-btn-${stock.symbol}`}
                                        >
                                            <FiShoppingCart size={12} /> Trade
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTable;
