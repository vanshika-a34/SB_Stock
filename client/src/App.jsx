import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';

const AppLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {user && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full px-1 sm:px-0 pb-10">
            <AppRoutes />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            fontSize: '14px',
            padding: '16px',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
