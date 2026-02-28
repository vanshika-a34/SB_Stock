import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../features/portfolio/portfolioSlice';
import { getMe } from '../features/auth/authSlice';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import HoldingsTable from '../components/portfolio/HoldingsTable';
import Loader from '../components/common/Loader';

const Portfolio = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { holdings, totalInvested, totalCurrentValue, totalProfitLoss, availableBalance, isLoading } = useSelector(
        (state) => state.portfolio
    );

    useEffect(() => {
        dispatch(getMe());
        dispatch(getPortfolio());
    }, [dispatch]);

    if (isLoading) return <Loader text="Loading portfolio..." />;

    return (
        <div className="space-y-6 fade-in">
            <header>
                <h1 className="text-2xl font-bold">My Portfolio</h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                    Track your investments and performance
                </p>
            </header>

            {/* Summary Cards */}
            <PortfolioSummary
                totalInvested={totalInvested}
                totalCurrentValue={totalCurrentValue}
                totalProfitLoss={totalProfitLoss}
                availableBalance={user?.virtualBalance || availableBalance}
            />

            {/* Holdings */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Holdings</h2>
                <HoldingsTable holdings={holdings} />
            </section>
        </div>
    );
};

export default Portfolio;
