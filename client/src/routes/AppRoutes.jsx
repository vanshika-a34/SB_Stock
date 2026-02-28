import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Stocks from '../pages/Stocks';
import Portfolio from '../pages/Portfolio';
import Transactions from '../pages/Transactions';
import AdminPanel from '../pages/AdminPanel';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stocks"
                element={
                    <ProtectedRoute>
                        <Stocks />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/portfolio"
                element={
                    <ProtectedRoute>
                        <Portfolio />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute adminOnly>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
