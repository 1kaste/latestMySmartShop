import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import ThemeToggleButton from './ThemeToggleButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const MobileNav: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSearchSubmit: (e: React.FormEvent) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}> = ({ isOpen, onClose, onSearchSubmit, searchQuery, setSearchQuery }) => {
    const { isAuthenticated, user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };
    
    return (
        <>
            <div 
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-background-light dark:bg-background-dark z-50 transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="font-bold">Menu</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}><Icons.X className="h-5 w-5"/></Button>
                </div>
                <div className="p-4">
                     <form onSubmit={onSearchSubmit} className="relative mb-4">
                        <Input
                            type="search"
                            placeholder="Search for products..."
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <nav className="flex flex-col gap-2">
                         {isAuthenticated ? (
                            <>
                                <div className="px-2 py-3 border-b dark:border-gray-700">
                                    <p className="font-semibold">Hi, {user?.name.split(' ')[0]}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                                <Link to="/profile" onClick={onClose} className="flex items-center w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><Icons.User className="mr-2 h-4 w-4" /> Profile</Link>
                                <Link to="/my-orders" onClick={onClose} className="flex items-center w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><Icons.Package className="mr-2 h-4 w-4" /> My Orders</Link>
                                {isAdmin && <Link to="/admin" onClick={onClose} className="flex items-center w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><Icons.LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard</Link>}
                                <button onClick={handleLogout} className="flex items-center w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><Icons.LogOut className="mr-2 h-4 w-4" /> Logout</button>
                            </>
                         ) : (
                            <Link to="/login" onClick={onClose} className="flex items-center w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><Icons.LogIn className="mr-2 h-4 w-4" /> Login</Link>
                         )}
                         <div className="border-t dark:border-gray-700 mt-2 pt-2">
                             <Link to="/contact" onClick={onClose} className="flex items-center w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><Icons.Mail className="mr-2 h-4 w-4"/>Contact</Link>
                         </div>
                    </nav>
                </div>
            </div>
        </>
    )
}


const UserMenu: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };
    
    if (!user) return null;

    return (
        <div className="absolute right-0 mt-2 w-56 bg-background-light dark:bg-background-dark rounded-md shadow-lg py-1 border dark:border-gray-700">
            <div className="px-4 py-2 border-b dark:border-gray-700">
                <p className="text-sm font-semibold text-primary-dark dark:text-white truncate">Hi, {user.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
            {isAdmin && (
                 <Link to="/admin" onClick={onClose} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Icons.LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                </Link>
            )}
            <Link to="/profile" onClick={onClose} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Icons.User className="mr-2 h-4 w-4" />
                Profile
            </Link>
            <Link to="/my-orders" onClick={onClose} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Icons.Package className="mr-2 h-4 w-4" />
                My Orders
            </Link>
            <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Icons.LogOut className="mr-2 h-4 w-4" />
                Logout
            </button>
        </div>
    );
};


const Header: React.FC = () => {
    const { cartCount } = useCart();
    const { isAuthenticated } = useAuth();
    const { settings } = useData();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-primary-dark/80 dark:border-gray-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 shrink-0">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt={`${settings.shopName} logo`} className="h-8 w-auto" />
                    ) : (
                        <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white" />
                    )}
                    <span className="font-bold text-lg text-primary-dark dark:text-white hidden sm:inline-block truncate">{settings.shopName}</span>
                </Link>
                
                {/* Desktop Search */}
                <div className="flex-1 px-4 lg:px-12 hidden md:flex justify-center">
                    <div className="w-full max-w-lg">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Input
                                type="search"
                                placeholder="Semantic Search for products..."
                                className="w-full pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </form>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                    <ThemeToggleButton />
                    <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-dark dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md">
                        Contact
                    </Link>
                    
                    {isAuthenticated ? (
                         <div className="relative" ref={userMenuRef}>
                            <Button variant="ghost" size="icon" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                                <Icons.User className="h-5 w-5" />
                            </Button>
                            {isUserMenuOpen && <UserMenu onClose={() => setIsUserMenuOpen(false)}/>}
                        </div>
                    ) : (
                        <Button asChild variant="ghost">
                            <Link to="/login">Login</Link>
                        </Button>
                    )}
                     <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
                    <Button asChild variant="ghost" size="icon" className="relative">
                        <Link to="/cart" aria-label={`View cart with ${cartCount} items`}>
                            <Icons.ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                </nav>
                
                {/* Mobile Nav Toggle */}
                <div className="flex md:hidden items-center">
                     <Button asChild variant="ghost" size="icon" className="relative">
                        <Link to="/cart" aria-label={`View cart with ${cartCount} items`}>
                            <Icons.ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                        <Icons.Menu className="h-6 w-6"/>
                    </Button>
                </div>
            </div>
             <MobileNav 
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onSearchSubmit={handleSearchSubmit}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
             />
        </header>
    );
};

export default Header;
