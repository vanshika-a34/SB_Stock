import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { FiUsers, FiActivity, FiTrendingUp, FiDollarSign, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminPanel = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editStock, setEditStock] = useState(null);
    const [formData, setFormData] = useState({
        symbol: '', companyName: '', price: '', sector: '', marketCap: '', volume: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, stocksRes] = await Promise.all([
                axiosInstance.get('/admin/stats'),
                axiosInstance.get('/stocks?limit=100'),
            ]);
            setStats(statsRes.data.data);
            setStocks(stocksRes.data.data.stocks);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                marketCap: Number(formData.marketCap) || 0,
                volume: Number(formData.volume) || 0,
            };

            if (editStock) {
                await axiosInstance.put(`/stocks/${editStock._id}`, payload);
                toast.success('Stock updated successfully');
            } else {
                await axiosInstance.post('/stocks', payload);
                toast.success('Stock created successfully');
            }

            setShowAddModal(false);
            setEditStock(null);
            setFormData({ symbol: '', companyName: '', price: '', sector: '', marketCap: '', volume: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stock?')) return;
        try {
            await axiosInstance.delete(`/stocks/${id}`);
            toast.success('Stock deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete stock');
        }
    };

    const openEdit = (stock) => {
        setEditStock(stock);
        setFormData({
            symbol: stock.symbol,
            companyName: stock.companyName,
            price: stock.price.toString(),
            sector: stock.sector,
            marketCap: stock.marketCap?.toString() || '',
            volume: stock.volume?.toString() || '',
        });
        setShowAddModal(true);
    };

    if (loading) return <Loader text="Loading admin panel..." />;

    return (
        <div className="space-y-6 fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage stocks and monitor platform</p>
                </div>
                <Button onClick={() => { setEditStock(null); setFormData({ symbol: '', companyName: '', price: '', sector: '', marketCap: '', volume: '' }); setShowAddModal(true); }} id="add-stock-btn">
                    <FiPlus size={16} /> Add Stock
                </Button>
            </header>

            {/* Stats */}
            {stats && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Admin stats">
                    {[
                        { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: '#6366f1' },
                        { label: 'Active Stocks', value: stats.totalStocks, icon: FiTrendingUp, color: '#22d3ee' },
                        { label: 'Total Transactions', value: stats.totalTransactions, icon: FiActivity, color: '#f59e0b' },
                        { label: 'Trade Volume', value: `$${((stats.buyVolume + stats.sellVolume) / 1e6).toFixed(1)}M`, icon: FiDollarSign, color: '#10b981' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card p-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</span>
                                <stat.icon size={18} style={{ color: stat.color }} />
                            </div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Stocks Table */}
            <section className="glass-card overflow-x-auto" aria-label="Manage stocks">
                <div className="p-4 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold">Manage Stocks ({stocks.length})</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Company</th>
                            <th>Price</th>
                            <th>Sector</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock) => (
                            <tr key={stock._id}>
                                <td className="font-bold text-[var(--color-primary-light)]">{stock.symbol}</td>
                                <td className="text-[var(--color-text-secondary)]">{stock.companyName}</td>
                                <td className="font-semibold">${stock.price?.toFixed(2)}</td>
                                <td className="text-[var(--color-text-muted)]">{stock.sector}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(stock)} className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-primary-light)] transition-colors" title="Edit">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(stock._id)} className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-danger)] transition-colors" title="Delete">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card w-full max-w-md p-6 fade-in" role="dialog" aria-modal="true">
                        <h2 className="text-xl font-bold mb-6">{editStock ? 'Edit Stock' : 'Add New Stock'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="symbol" className="block text-sm text-[var(--color-text-muted)] mb-1">Symbol</label>
                                    <input id="symbol" value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} required />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm text-[var(--color-text-muted)] mb-1">Price</label>
                                    <input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="companyName" className="block text-sm text-[var(--color-text-muted)] mb-1">Company Name</label>
                                <input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                            </div>
                            <div>
                                <label htmlFor="sector" className="block text-sm text-[var(--color-text-muted)] mb-1">Sector</label>
                                <input id="sector" value={formData.sector} onChange={(e) => setFormData({ ...formData, sector: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="marketCap" className="block text-sm text-[var(--color-text-muted)] mb-1">Market Cap</label>
                                    <input id="marketCap" type="number" value={formData.marketCap} onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="volume" className="block text-sm text-[var(--color-text-muted)] mb-1">Volume</label>
                                    <input id="volume" type="number" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" fullWidth>{editStock ? 'Update' : 'Create'} Stock</Button>
                                <Button variant="ghost" fullWidth onClick={() => { setShowAddModal(false); setEditStock(null); }}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
