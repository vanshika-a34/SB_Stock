import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FiLogOut, FiTrendingUp } from 'react-icons/fi';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--color-border)] shadow-sm" style={{ backgroundColor: 'rgba(11, 15, 25, 0.75)', backdropFilter: 'blur(24px)' }}>
            <nav className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
                <Link to="/" className="flex items-center gap-3 no-underline group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                        <FiTrendingUp className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-black gradient-text tracking-tight group-hover:opacity-80 transition-opacity">SB Stocks</span>
                </Link>

                {user ? (
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <span className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-muted)]">Balance</span>
                            <span className="text-sm font-bold text-[var(--color-success)]">
                                ${user.virtualBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 pl-4 border-l border-[var(--color-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-bold text-[var(--color-text-primary)] leading-none mb-1">{user.name}</p>
                                    <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-primary-light)]">{user.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl text-[var(--color-text-muted)] hover:text-[#f87171] hover:bg-[#7f1d1d20] transition-colors"
                                title="Logout"
                                id="logout-btn"
                            >
                                <FiLogOut size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors no-underline px-4 py-2"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm px-5 py-2.5 rounded-xl font-bold text-white no-underline transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
