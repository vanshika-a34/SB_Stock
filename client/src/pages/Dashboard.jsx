import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../features/portfolio/portfolioSlice';
import { getStocks } from '../features/stocks/stockSlice';
import { getTransactions } from '../features/transactions/transactionSlice';
import { getMe } from '../features/auth/authSlice';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import Loader from '../components/common/Loader';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { holdings, totalInvested, totalCurrentValue, totalProfitLoss, availableBalance, isLoading: portfolioLoading } = useSelector((state) => state.portfolio);
    const { stocks } = useSelector((state) => state.stocks);
    const { transactions } = useSelector((state) => state.transactions);

    useEffect(() => {
        dispatch(getMe());
        dispatch(getPortfolio());
        dispatch(getStocks({ limit: 5 }));
        dispatch(getTransactions({ limit: 5 }));
    }, [dispatch]);

    // Chart data from first stock's historical data
    const topStock = stocks?.[0];
    const chartData = topStock?.historicalData
        ? {
            labels: topStock.historicalData.slice(-15).map((d) =>
                new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            ),
            datasets: [
                {
                    label: topStock.symbol,
                    data: topStock.historicalData.slice(-15).map((d) => d.price),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                },
            ],
        }
        : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#64748b', font: { size: 10 } },
            },
            y: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#64748b', font: { size: 10 }, callback: (v) => `$${v}` },
            },
        },
    };

    if (portfolioLoading) return <Loader text="Loading dashboard..." />;

    return (
        <div className="space-y-6 fade-in">
            {/* Welcome */}
            <header>
                <h1 className="text-2xl font-bold">
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                    Here&apos;s your portfolio overview
                </p>
            </header>

            {/* Portfolio Summary Cards */}
            <PortfolioSummary
                totalInvested={totalInvested}
                totalCurrentValue={totalCurrentValue}
                totalProfitLoss={totalProfitLoss}
                availableBalance={user?.virtualBalance || availableBalance}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <section className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiActivity className="text-[var(--color-primary)]" />
                        Market Trend
                    </h2>
                    <div style={{ height: '250px' }}>
                        {chartData ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                                No chart data available
                            </div>
                        )}
                    </div>
                </section>

                {/* Recent Transactions */}
                <section className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiDollarSign className="text-[var(--color-accent)]" />
                        Recent Transactions
                    </h2>
                    {transactions && transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.slice(0, 5).map((tx) => (
                                <div key={tx._id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: tx.type === 'buy' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
                                        >
                                            {tx.type === 'buy' ? (
                                                <FiTrendingUp className="text-[var(--color-success)]" size={14} />
                                            ) : (
                                                <FiTrendingDown className="text-[var(--color-danger)]" size={14} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.symbol}
                                            </p>
                                            <p className="text-xs text-[var(--color-text-muted)]">
                                                {tx.quantity} shares @ ${tx.priceAtExecution?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-semibold ${tx.type === 'buy' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
                                        {tx.type === 'buy' ? '-' : '+'}${tx.totalAmount?.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[var(--color-text-muted)] text-sm text-center py-8">
                            No transactions yet. Start trading!
                        </p>
                    )}
                </section>
            </div>

            {/* Top Movers */}
            {stocks && stocks.length > 0 && (
                <section className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiTrendingUp className="text-[var(--color-success)]" />
                        Market Overview
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {stocks.slice(0, 5).map((stock) => (
                            <div key={stock._id} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                                <p className="text-sm font-bold text-[var(--color-primary-light)]">{stock.symbol}</p>
                                <p className="text-lg font-bold mt-1">${stock.price?.toFixed(2)}</p>
                                <span className={`text-xs font-semibold ${stock.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
