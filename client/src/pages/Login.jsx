import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import { FiMail, FiLock, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) navigate('/');
        if (isError && message) {
            toast.error(message);
            dispatch(reset());
        }
    }, [user, isError, message, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                        <FiTrendingUp className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
                    <p className="text-[var(--color-text-muted)]">Sign in to your SB Stocks account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5" id="login-form">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" fullWidth size="lg" loading={isLoading}>
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-[var(--color-text-muted)]">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-[var(--color-primary-light)] hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Login;
