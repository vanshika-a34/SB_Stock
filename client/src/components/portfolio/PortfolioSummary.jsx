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
            color: 'var(--color-primary-light)',
            bgIcon: 'rgba(99,102,241,0.2)',
            gradient: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.02))',
            borderColor: 'rgba(99,102,241,0.2)'
        },
        {
            label: 'Total Invested',
            value: `$${totalInvested?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: FiPieChart,
            color: 'var(--color-secondary)',
            bgIcon: 'rgba(34,211,238,0.2)',
            gradient: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(34,211,238,0.02))',
            borderColor: 'rgba(34,211,238,0.2)'
        },
        {
            label: 'Current Value',
            value: `$${totalCurrentValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: FiTrendingUp,
            color: 'var(--color-accent)',
            bgIcon: 'rgba(245,158,11,0.2)',
            gradient: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
            borderColor: 'rgba(245,158,11,0.2)'
        },
        {
            label: 'Total Return',
            value: `${isProfit ? '+' : ''}$${totalProfitLoss?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            subValue: `${isProfit ? '+' : ''}${profitPercent}%`,
            icon: isProfit ? FiTrendingUp : FiTrendingDown,
            color: isProfit ? 'var(--color-success)' : 'var(--color-danger)',
            bgIcon: isProfit ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
            gradient: isProfit
                ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.02))',
            borderColor: isProfit ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Portfolio summary">
            {cards.map((card, i) => (
                <div
                    key={card.label}
                    className="glass-card p-6 fade-in relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                    style={{
                        animationDelay: `${i * 0.05}s`,
                        background: card.gradient,
                        borderColor: card.borderColor,
                        boxShadow: `0 8px 32px -8px ${card.color}20`
                    }}
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: card.color }}></div>

                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <span className="text-[11px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                            {card.label}
                        </span>
                        <div className="p-2.5 rounded-xl shadow-inner" style={{ backgroundColor: card.bgIcon }}>
                            <card.icon size={20} style={{ color: card.color }} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-3xl font-black tracking-tight mb-1 font-mono text-white drop-shadow-sm">{card.value}</p>
                        {card.subValue && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: card.bgIcon, color: card.color }}>
                                {card.icon === FiTrendingUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                {card.subValue}
                            </div>
                        )}
                        {!card.subValue && <div className="h-5"></div>}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default PortfolioSummary;
