const Loader = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-label="Loading">
            <div
                className={`${sizes[size]} rounded-full animate-spin`}
                style={{
                    borderColor: 'var(--color-border)',
                    borderTopColor: 'var(--color-primary)',
                }}
            />
            {text && <p className="text-sm text-[var(--color-text-muted)]">{text}</p>}
        </div>
    );
};

export default Loader;
