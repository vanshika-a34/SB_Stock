import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../features/transactions/transactionSlice';
import Loader from '../components/common/Loader';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

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
        <div className="space-y-6 fade-in">
            <header>
                <h1 className="text-2xl font-bold">Transaction History</h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                    {total} total transactions
                </p>
            </header>

            {transactions && transactions.length > 0 ? (
                <section className="glass-card overflow-x-auto" aria-label="Transaction history">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Stock</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td>
                                        <span className={`badge ${tx.type === 'buy' ? 'badge-success' : 'badge-danger'}`}>
                                            {tx.type === 'buy' ? <FiTrendingUp className="mr-1" size={12} /> : <FiTrendingDown className="mr-1" size={12} />}
                                            {tx.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="font-bold text-[var(--color-primary-light)]">{tx.symbol}</td>
                                    <td>{tx.quantity}</td>
                                    <td>${tx.priceAtExecution?.toFixed(2)}</td>
                                    <td className="font-semibold">
                                        <span className={tx.type === 'buy' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}>
                                            {tx.type === 'buy' ? '-' : '+'}${tx.totalAmount?.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="text-[var(--color-text-muted)]">
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
                </section>
            ) : (
                <div className="glass-card p-12 text-center">
                    <p className="text-[var(--color-text-muted)]">No transactions yet. Start trading to see your history!</p>
                </div>
            )}
        </div>
    );
};

export default Transactions;
