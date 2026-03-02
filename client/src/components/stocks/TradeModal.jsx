import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buyStock, sellStock, resetTrade } from '../../features/transactions/transactionSlice';
import { getMe } from '../../features/auth/authSlice';
import Button from '../common/Button';
import { FiX, FiTrendingUp, FiTrendingDown, FiInfo } from 'react-icons/fi';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(12px)' }}>
            <div className="glass-card w-full max-w-lg p-8 fade-in relative overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)]" role="dialog" aria-modal="true" aria-label="Trade stock">
                {/* Decorative background glow */}
                <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] opacity-20 transition-colors duration-500 ${type === 'buy' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'}`}></div>

                {/* Header */}
                <div className="flex items-start justify-between mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-black tracking-tight text-white">{stock.symbol}</h2>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold mt-1 ${stock.change >= 0 ? 'bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]' : 'bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]'}`}>
                                {stock.change >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                {stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                            </span>
                        </div>
                        <p className="text-sm font-medium text-[var(--color-text-muted)] truncate max-w-[250px]">{stock.companyName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[var(--color-text-secondary)] hover:text-white transition-all" id="close-trade-modal">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Trade type toggle */}
                <div className="flex gap-2 mb-8 p-1.5 rounded-xl border border-[rgba(255,255,255,0.05)] relative z-10" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    {['buy', 'sell'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex-1 py-3 rounded-lg text-sm font-black uppercase tracking-wider transition-all duration-300 ${type === t
                                ? 'shadow-md text-white'
                                : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                                }`}
                            style={type === t ? { background: t === 'buy' ? 'var(--color-success)' : 'var(--color-danger)' } : {}}
                            id={`trade-type-${t}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Price info & Quantity wrapper */}
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <div className="p-5 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex flex-col justify-center shadow-inner">
                        <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Market Price</p>
                        <p className="text-2xl font-black text-white">${stock.price?.toFixed(2)}</p>
                    </div>
                    <div className="p-5 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex flex-col shadow-inner">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block" htmlFor="quantity">
                            Shares
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-primary)] text-2xl font-black text-white px-0 py-1 focus:ring-0 rounded-none w-full"
                        />
                    </div>
                </div>

                {/* Order summary */}
                <div className="p-5 rounded-2xl mb-8 border border-[rgba(255,255,255,0.02)] bg-[rgba(0,0,0,0.2)] shadow-inner relative z-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Estimated Cost</span>
                        <span className="text-sm font-bold text-white">${stock.price?.toFixed(2)} × {quantity}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-[rgba(255,255,255,0.05)]">
                        <span className="text-base font-bold text-white">Total Value</span>
                        <span className="font-black text-2xl text-[var(--color-primary-light)]">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                        <FiInfo className="text-[var(--color-text-muted)] mt-0.5 shrink-0" size={16} />
                        <div className="flex-1 flex justify-between">
                            <span className="text-[var(--color-text-muted)]">Buying Power</span>
                            <span className={`font-bold ${totalCost > user?.virtualBalance && type === 'buy' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
                                ${user?.virtualBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    variant={type === 'buy' ? 'success' : 'danger'}
                    fullWidth
                    size="lg"
                    onClick={handleTrade}
                    loading={isLoading}
                    disabled={type === 'buy' && totalCost > user?.virtualBalance}
                    className={`py-4 text-base font-black tracking-wide uppercase shadow-lg transition-transform hover:-translate-y-1 ${type === 'buy' && totalCost > user?.virtualBalance ? 'opacity-50 cursor-not-allowed' : ''}`}
                    id="execute-trade-btn"
                >
                    {type === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'}
                </Button>
            </div>
        </div>
    );
};

export default TradeModal;
