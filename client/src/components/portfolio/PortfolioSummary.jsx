import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi';

const PortfolioSummary = ({ totalInvested, totalCurrentValue, totalProfitLoss, availableBalance }) => {
    const profitPercent = totalInvested > 0
        ? ((totalProfitLoss / totalInvested) * 100).toFixed(2)
        : 0;
    const isProfit = totalProfitLoss >= 0;

    const cards = [
        {
            label: 'Available Balance',
            value: `$${availableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: FiDollarSign,
            color: 'var(--color-primary)',
            gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
        },
        {
            label: 'Total Invested',
            value: `$${totalInvested?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: FiPieChart,
            color: 'var(--color-secondary)',
            gradient: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))',
        },
        {
            label: 'Current Value',
            value: `$${totalCurrentValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: FiTrendingUp,
            color: 'var(--color-accent)',
            gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
        },
        {
            label: 'Profit / Loss',
            value: `${isProfit ? '+' : ''}$${totalProfitLoss?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            subValue: `${isProfit ? '+' : ''}${profitPercent}%`,
            icon: isProfit ? FiTrendingUp : FiTrendingDown,
            color: isProfit ? 'var(--color-success)' : 'var(--color-danger)',
            gradient: isProfit
                ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Portfolio summary">
            {cards.map((card, i) => (
                <div
                    key={card.label}
                    className="glass-card p-5 fade-in"
                    style={{ animationDelay: `${i * 0.05}s`, background: card.gradient }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                            {card.label}
                        </span>
                        <card.icon size={18} style={{ color: card.color }} />
                    </div>
                    <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
                    {card.subValue && (
                        <p className="text-sm mt-1" style={{ color: card.color }}>{card.subValue}</p>
                    )}
                </div>
            ))}
        </section>
    );
};

export default PortfolioSummary;
