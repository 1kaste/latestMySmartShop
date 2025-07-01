import React, { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import AIAssistant from '../components/AIAssistant';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Icons } from '../components/icons';

const UserLayout: React.FC = () => {
    const { settings } = useData();
    const location = useLocation();
    const { isAdmin, setLastUserPath } = useAuth();

    useEffect(() => {
        if (!location.pathname.startsWith('/admin') && location.pathname !== '/login') {
            setLastUserPath(location.pathname + location.search + location.hash);
        }
    }, [location, setLastUserPath]);

    useEffect(() => {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const baseTitle = settings.shopName;

        if (pathParts.length === 0) {
            document.title = baseTitle;
            return;
        } 
        
        const pageName = pathParts[0];
        let title = baseTitle;

        if (pageName === 'category' && pathParts.length > 1) {
             const categoryName = decodeURIComponent(pathParts[1]);
             title = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} - ${baseTitle}`;
        } else if (pageName === 'search') {
            title = `Search - ${baseTitle}`;
        } else {
            const formattedPageName = pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            title = `${formattedPageName} - ${baseTitle}`;
        }
        document.title = title;

    }, [location.pathname, settings.shopName]);

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-sans text-gray-800 dark:text-gray-300">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
            <AIAssistant />
             {isAdmin && (
                <Link
                    to="/admin"
                    className="fixed bottom-6 left-6 h-16 w-16 rounded-full bg-primary-dark dark:bg-accent-teal hover:scale-110 flex items-center justify-center shadow-lg transition-transform z-50"
                    aria-label="Go to Admin Dashboard"
                >
                    <Icons.LayoutDashboard className="h-8 w-8 text-white" />
                </Link>
            )}
        </div>
    );
};

export default UserLayout;