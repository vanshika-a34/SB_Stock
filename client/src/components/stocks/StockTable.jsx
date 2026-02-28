import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StockTable = ({ stocks, onTrade }) => {
    if (!stocks || stocks.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
                <p>No stocks found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto glass-card">
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Price</th>
                        <th>Change</th>
                        <th>% Change</th>
                        <th>Volume</th>
                        <th>Sector</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => {
                        const isPositive = stock.change >= 0;
                        return (
                            <tr key={stock._id} className="hover:bg-[var(--color-bg-hover)] transition-colors">
                                <td className="font-bold text-[var(--color-primary-light)]">{stock.symbol}</td>
                                <td className="text-[var(--color-text-secondary)] max-w-[200px] truncate">{stock.companyName}</td>
                                <td className="font-semibold">${stock.price?.toFixed(2)}</td>
                                <td>
                                    <span className={`flex items-center gap-1 ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                        {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                        {isPositive ? '+' : ''}{stock.change?.toFixed(2)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${isPositive ? 'badge-success' : 'badge-danger'}`}>
                                        {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                    </span>
                                </td>
                                <td className="text-[var(--color-text-muted)]">{(stock.volume / 1e6)?.toFixed(1)}M</td>
                                <td className="text-[var(--color-text-muted)]">{stock.sector}</td>
                                <td>
                                    <button
                                        onClick={() => onTrade(stock)}
                                        className="px-3 py-1 text-xs font-medium rounded-md text-white transition-all hover:opacity-90"
                                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
                                        id={`trade-btn-${stock.symbol}`}
                                    >
                                        Trade
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable;
