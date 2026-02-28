import { FiTrendingUp } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="border-t border-[var(--color-border)] py-6 px-6" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <FiTrendingUp className="text-[var(--color-primary)]" />
                    <span className="text-sm font-semibold gradient-text">SB Stocks</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                    &copy; {new Date().getFullYear()} SB Stocks. All rights reserved. This is a simulation platform.
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span>Virtual Trading</span>
                    <span>•</span>
                    <span>No Real Money</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
