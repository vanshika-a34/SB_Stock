import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStocks, getSectors } from '../features/stocks/stockSlice';
import StockCard from '../components/stocks/StockCard';
import StockTable from '../components/stocks/StockTable';
import TradeModal from '../components/stocks/TradeModal';
import Loader from '../components/common/Loader';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';

const Stocks = () => {
    const dispatch = useDispatch();
    const { stocks, sectors, isLoading, totalPages, currentPage } = useSelector(
        (state) => state.stocks
    );
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStock, setSelectedStock] = useState(null);
    const [isTradeOpen, setIsTradeOpen] = useState(false);

    useEffect(() => {
        dispatch(getSectors());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getStocks({ search, sector, limit: 20 }));
        }, 300);
        return () => clearTimeout(timer);
    }, [dispatch, search, sector]);

    const handleTrade = (stock) => {
        setSelectedStock(stock);
        setIsTradeOpen(true);
    };

    const handleCloseTrade = () => {
        setIsTradeOpen(false);
        setSelectedStock(null);
        dispatch(getStocks({ search, sector, limit: 20 }));
    };

    return (
        <div className="space-y-8 lg:space-y-10 fade-in pb-10">
            <header className="space-y-2">
                <h1 className="text-3xl lg:text-[34px] font-black tracking-tight text-white drop-shadow-sm">
                    Stock Market
                </h1>
                <p className="text-[var(--color-primary-light)] font-medium text-sm lg:text-base opacity-90 max-w-2xl">
                    Browse real-time market data and execute trades with your virtual portfolio.
                </p>
            </header>

            {/* Filters */}
            <div className="glass-card p-4 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between shadow-md">
                <div className="flex flex-1 flex-col sm:flex-row gap-3 sm:gap-4 w-full min-w-0">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by symbol or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 w-full"
                            id="stock-search"
                        />
                    </div>

                    {/* Sector filter */}
                    <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="sm:max-w-[220px] cursor-pointer"
                        id="sector-filter"
                    >
                        <option value="">All Sectors</option>
                        {sectors.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* View toggle */}
                <div className="flex gap-2 p-1.5 rounded-xl border border-[var(--color-border)] shadow-inner shrink-0 self-start lg:self-auto" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-[var(--color-text-muted)] hover:text-white'}`}
                        title="Grid view"
                        id="grid-view-btn"
                    >
                        <FiGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-[var(--color-text-muted)] hover:text-white'}`}
                        title="Table view"
                        id="table-view-btn"
                    >
                        <FiList size={18} />
                    </button>
                </div>
            </div>

            {/* Stock list */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader text="Fetching market data..." />
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {stocks.map((stock) => (
                        <StockCard key={stock._id} stock={stock} onTrade={handleTrade} />
                    ))}
                </div>
            ) : (
                <StockTable stocks={stocks} onTrade={handleTrade} />
            )}

            {stocks.length === 0 && !isLoading && (
                <div className="glass-card text-center py-16 px-4">
                    <FiSearch className="mx-auto text-4xl mb-4 text-[var(--color-text-muted)] opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No stocks found</h3>
                    <p className="text-[var(--color-text-muted)] max-w-sm mx-auto">Try adjusting your search criteria or switching to a different sector to find what you're looking for.</p>
                </div>
            )}

            {/* Trade Modal */}
            <TradeModal stock={selectedStock} isOpen={isTradeOpen} onClose={handleCloseTrade} />
        </div>
    );
};

export default Stocks;
