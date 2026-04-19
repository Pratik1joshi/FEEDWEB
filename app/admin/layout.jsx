'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Public auth pages are accessible without an active admin session.
  const publicAuthRoutes = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];
  const isPublicAuthPage = publicAuthRoutes.includes(pathname);

  useEffect(() => {
    // Check for authentication token in localStorage
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && !isPublicAuthPage) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isPublicAuthPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If it's the login page, render without the admin layout
  if (isPublicAuthPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  if (!user) {
    return null;
  }

  // Simple layout - just render children without sidebar
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
};

export default AdminLayout;
