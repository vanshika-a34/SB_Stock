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
        <div className="space-y-6 fade-in">
            <header>
                <h1 className="text-2xl font-bold">Stock Market</h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                    Browse and trade US stocks with virtual funds
                </p>
            </header>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-1 gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                            id="stock-search"
                        />
                    </div>

                    {/* Sector filter */}
                    <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="max-w-[200px]"
                        id="sector-filter"
                    >
                        <option value="">All Sectors</option>
                        {sectors.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* View toggle */}
                <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'}`}
                        title="Grid view"
                        id="grid-view-btn"
                    >
                        <FiGrid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'}`}
                        title="Table view"
                        id="table-view-btn"
                    >
                        <FiList size={16} />
                    </button>
                </div>
            </div>

            {/* Stock list */}
            {isLoading ? (
                <Loader text="Loading stocks..." />
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {stocks.map((stock) => (
                        <StockCard key={stock._id} stock={stock} onTrade={handleTrade} />
                    ))}
                </div>
            ) : (
                <StockTable stocks={stocks} onTrade={handleTrade} />
            )}

            {stocks.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-[var(--color-text-muted)]">No stocks found matching your search</p>
                </div>
            )}

            {/* Trade Modal */}
            <TradeModal stock={selectedStock} isOpen={isTradeOpen} onClose={handleCloseTrade} />
        </div>
    );
};

export default Stocks;
