import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buyStock, sellStock, resetTrade } from '../../features/transactions/transactionSlice';
import { getMe } from '../../features/auth/authSlice';
import Button from '../common/Button';
import { FiX, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TradeModal = ({ stock, isOpen, onClose }) => {
    const [type, setType] = useState('buy');
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { isLoading, tradeSuccess, tradeMessage, isError, message } = useSelector(
        (state) => state.transactions
    );
    const { user } = useSelector((state) => state.auth);

    const totalCost = stock ? stock.price * quantity : 0;

    useEffect(() => {
        if (tradeSuccess) {
            toast.success(tradeMessage || 'Trade executed successfully!');
            dispatch(getMe());
            dispatch(resetTrade());
            onClose();
        }
        if (isError && message) {
            toast.error(message);
            dispatch(resetTrade());
        }
    }, [tradeSuccess, isError, message, dispatch, onClose, tradeMessage]);

    const handleTrade = () => {
        if (quantity < 1) {
            toast.error('Quantity must be at least 1');
            return;
        }

        const tradeData = { stockId: stock._id, quantity: Number(quantity) };

        if (type === 'buy') {
            if (totalCost > user.virtualBalance) {
                toast.error('Insufficient funds');
                return;
            }
            dispatch(buyStock(tradeData));
        } else {
            dispatch(sellStock(tradeData));
        }
    };

    if (!isOpen || !stock) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="glass-card w-full max-w-md p-6 fade-in" role="dialog" aria-modal="true" aria-label="Trade stock">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold">{stock.symbol}</h2>
                        <p className="text-sm text-[var(--color-text-muted)]">{stock.companyName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors" id="close-trade-modal">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Price info */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                    <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Current Price</p>
                        <p className="text-2xl font-bold">${stock.price?.toFixed(2)}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                        {stock.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                        <span className="text-sm font-medium">{stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%</span>
                    </div>
                </div>

                {/* Trade type toggle */}
                <div className="flex gap-2 mb-4 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                    {['buy', 'sell'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold capitalize transition-all ${type === t
                                    ? t === 'buy'
                                        ? 'text-white'
                                        : 'text-white'
                                    : 'text-[var(--color-text-muted)]'
                                }`}
                            style={type === t ? { background: t === 'buy' ? 'var(--color-success)' : 'var(--color-danger)' } : {}}
                            id={`trade-type-${t}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Quantity input */}
                <div className="mb-4">
                    <label className="block text-sm text-[var(--color-text-muted)] mb-2" htmlFor="quantity">
                        Quantity
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                </div>

                {/* Order summary */}
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-[var(--color-text-muted)]">Price × Quantity</span>
                        <span>${stock.price?.toFixed(2)} × {quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-[var(--color-text-muted)]">Total</span>
                        <span className="font-bold text-lg">${totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-[var(--color-border)]">
                        <span className="text-[var(--color-text-muted)]">Available Balance</span>
                        <span className="text-[var(--color-success)]">
                            ${user?.virtualBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    variant={type === 'buy' ? 'success' : 'danger'}
                    fullWidth
                    size="lg"
                    onClick={handleTrade}
                    loading={isLoading}
                    id="execute-trade-btn"
                >
                    {type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
                </Button>
            </div>
        </div>
    );
};

export default TradeModal;
