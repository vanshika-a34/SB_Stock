import { FiTrendingUp, FiTrendingDown, FiShoppingCart } from 'react-icons/fi';

const StockCard = ({ stock, onTrade, onWatchlist }) => {
    const isPositive = stock.change >= 0;

    return (
        <article className="glass-card p-6 border-[1px] border-[rgba(255,255,255,0.05)] hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col justify-between h-full fade-in shadow-lg hover:shadow-2xl">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-white">{stock.symbol}</h3>
                        <p className="text-xs font-medium text-[var(--color-text-muted)] truncate max-w-[150px] mt-0.5">{stock.companyName}</p>
                    </div>
                    <span className={`badge ${isPositive ? 'badge-success shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'badge-danger shadow-[0_0_10px_rgba(239,68,68,0.2)]'} text-[11px] px-2.5 py-1`}>
                        {isPositive ? <FiTrendingUp className="mr-1.5" size={12} /> : <FiTrendingDown className="mr-1.5" size={12} />}
                        {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                    </span>
                </div>

                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-3xl font-bold tracking-tight text-white">${stock.price?.toFixed(2)}</p>
                        <p className={`text-sm font-bold flex items-center gap-1 mt-1 ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                            {isPositive ? '+' : ''}{stock.change?.toFixed(2)} USD
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-muted)] mb-1">{stock.sector}</p>
                        <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                            Vol: <span className="text-white">{(stock.volume / 1e6)?.toFixed(1)}M</span>
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (onTrade) onTrade(stock);
                }}
                className="w-full mt-2 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)' }}
                id={`trade-card-btn-${stock.symbol}`}
            >
                <FiShoppingCart size={16} /> <span>Trade {stock.symbol}</span>
            </button>
        </article>
    );
};

export default StockCard;
