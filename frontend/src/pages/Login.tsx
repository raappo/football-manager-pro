import { useState } from 'react';
import { Trophy } from 'lucide-react';
import api from '../services/api';

interface LoginProps {
    onLogin: (user: any) => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            onLogin(response.data); // Pass the user data up to App.tsx
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans">
            <div className="mb-8 flex items-center gap-3 text-white">
                <Trophy className="text-yellow-400" size={48} />
                <h1 className="text-5xl font-bold tracking-tight">FootyPro</h1>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            required type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Login
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="font-bold mb-1 text-gray-700">Test Accounts:</p>
                    <p>Admin: <span className="font-mono bg-gray-200 px-1 rounded">admin</span> / <span className="font-mono bg-gray-200 px-1 rounded">admin123</span></p>
                    <p>User: <span className="font-mono bg-gray-200 px-1 rounded">manager</span> / <span className="font-mono bg-gray-200 px-1 rounded">user123</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;