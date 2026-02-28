import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FiLogOut, FiUser, FiTrendingUp } from 'react-icons/fi';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--color-border)]" style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)' }}>
            <nav className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-3">
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                        <FiTrendingUp className="text-white text-lg" />
                    </div>
                    <span className="text-xl font-bold gradient-text tracking-tight">SB Stocks</span>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                            <span className="text-xs text-[var(--color-text-muted)]">Balance</span>
                            <span className="text-sm font-semibold text-[var(--color-success)]">
                                ${user.virtualBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium leading-tight">{user.name}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{user.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-bg-hover)] transition-all"
                                title="Logout"
                                id="logout-btn"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors no-underline"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm px-4 py-2 rounded-lg font-medium text-white no-underline transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
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
