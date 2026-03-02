import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../features/transactions/transactionSlice';
import Loader from '../components/common/Loader';
import { FiTrendingUp, FiTrendingDown, FiList } from 'react-icons/fi';

const Transactions = () => {
    const dispatch = useDispatch();
    const { transactions, isLoading, total } = useSelector(
        (state) => state.transactions
    );

    useEffect(() => {
        dispatch(getTransactions({ limit: 50 }));
    }, [dispatch]);

    if (isLoading) return <Loader text="Loading transactions..." />;

    return (
        <div className="space-y-8 lg:space-y-10 fade-in pb-10">
            <header className="space-y-2">
                <h1 className="text-3xl lg:text-[34px] font-black tracking-tight text-white drop-shadow-sm">
                    Transaction History
                </h1>
                <p className="text-[var(--color-primary-light)] font-medium text-sm lg:text-base opacity-90 max-w-2xl">
                    Review your past trades and activity ({total} total transactions)
                </p>
            </header>

            {transactions && transactions.length > 0 ? (
                <section className="glass-card overflow-hidden shadow-xl border-[1px] border-[rgba(255,255,255,0.05)]" aria-label="Transaction history">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Type</th>
                                    <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Stock</th>
                                    <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Shares</th>
                                    <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Price</th>
                                    <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Total Amount</th>
                                    <th className="px-6 py-4 bg-[rgba(15,23,42,0.6)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${tx.type === 'buy' ? 'bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]' : 'bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]'}`}>
                                                {tx.type === 'buy' ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-[var(--color-primary-light)] text-base group-hover:text-white transition-colors">{tx.symbol}</td>
                                        <td className="px-6 py-4 font-bold text-white bg-[rgba(255,255,255,0.01)]">{tx.quantity.toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">${tx.priceAtExecution?.toFixed(2)}</td>
                                        <td className="px-6 py-4 font-bold">
                                            <span className={tx.type === 'buy' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}>
                                                {tx.type === 'buy' ? '-' : '+'}${tx.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--color-text-muted)] text-sm">
                                            {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : (
                <div className="glass-card p-16 text-center shadow-lg border border-[rgba(255,255,255,0.05)]">
                    <FiList size={48} className="mx-auto text-[var(--color-text-muted)] opacity-30 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-white">No transaction history</h3>
                    <p className="text-[var(--color-text-secondary)] font-medium max-w-sm mx-auto">You haven't made any trades yet. Once you buy or sell stocks, your activity will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default Transactions;
