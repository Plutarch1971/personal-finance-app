import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      
      {/* Page Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}