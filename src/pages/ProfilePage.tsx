import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/icons';

const ProfilePage: React.FC = () => {
    const { user, updateUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/profile');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [isAuthenticated, navigate, user]);

    if (!user) {
        return (
             <div className="container mx-auto px-4 py-16 text-center">
                <Icons.User className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
                <h1 className="mt-6 text-3xl font-bold text-primary-dark dark:text-white">Loading Profile...</h1>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name, email });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark dark:text-white mb-8">My Profile</h1>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Update Your Details</CardTitle>
                        <CardDescription>Keep your account information up to date.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="font-medium">Full Name</label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="font-medium">Email Address</label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button type="submit">Save Changes</Button>
                        {isSaved && <p className="text-sm text-green-600 dark:text-green-400">Profile saved successfully!</p>}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default ProfilePage;
