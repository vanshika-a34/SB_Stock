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
        `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all no-underline ${isActive
            ? 'text-white shadow-lg'
            : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
        }`;

    const linkStyle = (isActive) =>
        isActive
            ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))',
                borderLeft: '3px solid var(--color-primary)',
            }
            : {
                borderLeft: '3px solid transparent',
            };

    return (
        <aside
            className="hidden lg:flex flex-col w-64 h-[calc(100vh-72px)] sticky top-[72px] flex-shrink-0 border-r border-[var(--color-border)] px-5 py-6 space-y-6"
            style={{ backgroundColor: 'rgba(11, 15, 25, 0.4)', backdropFilter: 'blur(12px)' }}
        >
            <nav className="flex flex-col flex-1 gap-1.5 mt-1">
                <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-[0.25em] pl-1 mb-2">
                    Menu
                </p>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={linkClass}
                        style={({ isActive }) => linkStyle(isActive)}
                        end={to === '/'}
                    >
                        <Icon
                            size={18}
                            className="shrink-0"
                        />
                        <span className="truncate">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-success)] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center gap-2.5 mb-3 relative z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] pulse-dot shadow-[0_0_8px_var(--color-success)]" />
                    <span className="text-xs uppercase font-bold tracking-wider text-[var(--color-text-muted)]">System Status</span>
                </div>
                <p className="text-base font-black text-white relative z-10">Simulation Active</p>
                <p className="text-xs font-medium text-[var(--color-primary-light)] mt-1.5 relative z-10">Markets are open</p>
            </div>
        </aside>
    );
};

export default Sidebar;
