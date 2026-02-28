import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StockCard = ({ stock, onTrade, onWatchlist }) => {
    const isPositive = stock.change >= 0;

    return (
        <article
            className="glass-card p-5 hover:border-[var(--color-primary)] transition-all cursor-pointer fade-in"
            onClick={() => onTrade && onTrade(stock)}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{stock.symbol}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[160px]">{stock.companyName}</p>
                </div>
                <span
                    className={`badge ${isPositive ? 'badge-success' : 'badge-danger'}`}
                >
                    {isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                    {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                </span>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-2xl font-bold">${stock.price?.toFixed(2)}</p>
                    <p className={`text-sm font-medium ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                        {isPositive ? '+' : ''}{stock.change?.toFixed(2)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-[var(--color-text-muted)]">{stock.sector}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Vol: {(stock.volume / 1e6)?.toFixed(1)}M
                    </p>
                </div>
            </div>
        </article>
    );
};

export default StockCard;
