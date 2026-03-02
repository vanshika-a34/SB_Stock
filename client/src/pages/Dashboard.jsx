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
                    borderWidth: 3,
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
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 16,
                cornerRadius: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 11, weight: '500' }, padding: 10 },
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 11, weight: '500' }, callback: (v) => `$${v}`, padding: 10 },
            },
        },
    };

    if (portfolioLoading) return <Loader text="Loading dashboard..." />;

    return (
        <div className="space-y-8 lg:space-y-10 fade-in pb-10">
            {/* Welcome */}
            <header className="space-y-2">
                <h1 className="text-3xl lg:text-[34px] font-black tracking-tight text-white drop-shadow-sm">
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-[var(--color-primary-light)] font-medium text-sm lg:text-base opacity-90 max-w-2xl">
                    Here&apos;s your daily portfolio overview and market performance.
                </p>
            </header>

            {/* Portfolio Summary Cards */}
            <PortfolioSummary
                totalInvested={totalInvested}
                totalCurrentValue={totalCurrentValue}
                totalProfitLoss={totalProfitLoss}
                availableBalance={user?.virtualBalance || availableBalance}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Chart */}
                <section className="glass-card p-6 sm:p-7 lg:p-8 shadow-lg">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                        <div className="p-2 bg-[var(--color-primary)] bg-opacity-20 rounded-lg">
                            <FiActivity className="text-[var(--color-primary)]" size={20} />
                        </div>
                        Market Trend
                    </h2>
                    <div style={{ height: '300px' }} className="w-full">
                        {chartData ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--color-text-muted)] font-medium">
                                Gathering chart data...
                            </div>
                        )}
                    </div>
                </section>

                {/* Recent Transactions */}
                <section className="glass-card p-6 sm:p-7 lg:p-8 shadow-lg flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black flex items-center gap-3 text-white">
                            <div className="p-2 bg-[var(--color-accent)] bg-opacity-20 rounded-lg">
                                <FiDollarSign className="text-[var(--color-accent)]" size={20} />
                            </div>
                            Recent Activity
                        </h2>
                        {transactions && transactions.length > 0 && (
                            <a href="/transactions" className="text-sm font-bold text-[var(--color-primary-light)] hover:text-white transition-colors">View All</a>
                        )}
                    </div>

                    <div className="flex-1">
                        {transactions && transactions.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {transactions.slice(0, 5).map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors border border-[rgba(255,255,255,0.05)]">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                                                style={{ background: tx.type === 'buy' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
                                            >
                                                {tx.type === 'buy' ? (
                                                    <FiTrendingUp className="text-[var(--color-success)]" size={18} />
                                                ) : (
                                                    <FiTrendingDown className="text-[var(--color-danger)]" size={18} />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base font-bold text-white tracking-tight">
                                                    {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.symbol}
                                                </p>
                                                <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-0.5">
                                                    {tx.quantity} shares @ ${tx.priceAtExecution?.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-base font-black tracking-tight whitespace-nowrap ${tx.type === 'buy' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
                                            {tx.type === 'buy' ? '-' : '+'}${tx.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                <FiDollarSign size={48} className="text-[var(--color-text-muted)] opacity-20 mb-4" />
                                <p className="text-[var(--color-text-secondary)] font-medium mb-2">No transactions yet.</p>
                                <a href="/stocks" className="text-sm font-bold text-[var(--color-primary)] hover:text-white transition-colors">Start trading to see activity here!</a>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Top Movers/Overview */}
            {stocks && stocks.length > 0 && (
                <section className="glass-card p-6 sm:p-7 lg:p-8 shadow-lg">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                        <div className="p-2 bg-[var(--color-success)] bg-opacity-20 rounded-lg">
                            <FiTrendingUp className="text-[var(--color-success)]" size={20} />
                        </div>
                        Market Overview
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {stocks.slice(0, 5).map((stock) => (
                            <div key={stock._id} className="p-4 rounded-xl border border-[rgba(255,255,255,0.05)] hover:border-[var(--color-primary)] transition-all bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] shadow-sm">
                                <p className="text-sm font-black text-[var(--color-primary-light)] mb-1">{stock.symbol}</p>
                                <p className="text-xl font-bold text-white mb-2">${stock.price?.toFixed(2)}</p>
                                <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${stock.change >= 0 ? 'bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]' : 'bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
