import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const HoldingsTable = ({ holdings }) => {
    if (!holdings || holdings.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-[var(--color-text-muted)]">No holdings yet. Start trading to build your portfolio!</p>
            </div>
        );
    }

    return (
        <section className="glass-card overflow-x-auto" aria-label="Holdings table">
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Quantity</th>
                        <th>Avg. Buy Price</th>
                        <th>Current Price</th>
                        <th>Invested</th>
                        <th>Current Value</th>
                        <th>P&L</th>
                    </tr>
                </thead>
                <tbody>
                    {holdings.map((holding) => {
                        const isProfit = holding.profitLoss >= 0;
                        return (
                            <tr key={holding.stockId}>
                                <td className="font-bold text-[var(--color-primary-light)]">{holding.symbol}</td>
                                <td className="text-[var(--color-text-secondary)] max-w-[180px] truncate">{holding.companyName}</td>
                                <td className="font-semibold">{holding.quantity}</td>
                                <td>${holding.avgBuyPrice?.toFixed(2)}</td>
                                <td className="font-semibold">${holding.currentPrice?.toFixed(2)}</td>
                                <td>${holding.investedValue?.toFixed(2)}</td>
                                <td className="font-semibold">${holding.currentValue?.toFixed(2)}</td>
                                <td>
                                    <div className={`flex items-center gap-1 font-semibold ${isProfit ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                        {isProfit ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                        <span>{isProfit ? '+' : ''}${holding.profitLoss?.toFixed(2)}</span>
                                        <span className="text-xs">({isProfit ? '+' : ''}{holding.profitLossPercent}%)</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
};

export default HoldingsTable;
