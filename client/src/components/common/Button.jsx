const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const variants = {
        primary:
            'text-white hover:opacity-90',
        secondary:
            'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]',
        success:
            'text-white hover:opacity-90',
        danger:
            'text-white hover:opacity-90',
        ghost:
            'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
    };

    const gradients = {
        primary: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        success: 'linear-gradient(135deg, #10b981, #059669)',
        danger: 'linear-gradient(135deg, #ef4444, #dc2626)',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
            style={gradients[variant] ? { background: gradients[variant] } : {}}
            {...props}
        >
            {loading && (
                <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                />
            )}
            {children}
        </button>
    );
};

export default Button;
