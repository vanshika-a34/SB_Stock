import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import { FiUser, FiMail, FiLock, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        dispatch(register(formData));
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                        <FiTrendingUp className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
                    <p className="text-[var(--color-text-muted)]">Start trading with $100,000 virtual funds</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5" id="register-form">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                id="reg-email"
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
                        <label htmlFor="reg-password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                id="reg-password"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" fullWidth size="lg" loading={isLoading}>
                        Create Account
                    </Button>

                    <p className="text-center text-sm text-[var(--color-text-muted)]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[var(--color-primary-light)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Register;
