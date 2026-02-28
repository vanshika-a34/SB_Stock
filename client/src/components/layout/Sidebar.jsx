import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FiHome,
    FiTrendingUp,
    FiPieChart,
    FiList,
    FiStar,
    FiSettings,
} from 'react-icons/fi';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);

    const navItems = [
        { to: '/', icon: FiHome, label: 'Dashboard' },
        { to: '/stocks', icon: FiTrendingUp, label: 'Stocks' },
        { to: '/portfolio', icon: FiPieChart, label: 'Portfolio' },
        { to: '/transactions', icon: FiList, label: 'Transactions' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ to: '/admin', icon: FiSettings, label: 'Admin Panel' });
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${isActive
            ? 'text-white'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
        }`;

    const linkStyle = (isActive) =>
        isActive
            ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1))', borderLeft: '3px solid var(--color-primary)' }
            : {};

    return (
        <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-57px)] border-r border-[var(--color-border)] p-4" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={linkClass}
                        style={({ isActive }) => linkStyle(isActive)}
                        end={to === '/'}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="glass-card p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-success)] pulse-dot" />
                    <span className="text-xs text-[var(--color-text-muted)]">Market Status</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-success)]">Simulation Active</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Trade with virtual funds</p>
            </div>
        </aside>
    );
};

export default Sidebar;
