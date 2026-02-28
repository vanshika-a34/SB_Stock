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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 57px)' }}>
          <div className="max-w-screen-xl mx-auto">
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
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
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
