import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Calendar, FileText, LogOut } from 'lucide-react';

interface LayoutProps {
    user: { username: string; role: string };
    onLogout: () => void;
}

const Layout = ({ user, onLogout }: LayoutProps) => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
                    <Trophy className="text-yellow-400" />
                    <span>FootyPro</span>
                </div>

                {/* User Badge */}
                <div className="p-4 bg-slate-800 mx-4 mt-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-gray-400">Logged in as:</p>
                    <p className="font-bold text-lg text-blue-400 capitalize">{user.username}</p>
                    <span className="inline-block mt-1 text-xs font-bold px-2 py-1 bg-slate-700 rounded-full text-gray-300">
                        {user.role} Module
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-2">
                    <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <LayoutDashboard size={20} /><span>Dashboard</span>
                    </Link>
                    <Link to="/clubs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <Trophy size={20} /><span>Manage Clubs</span>
                    </Link>
                    <Link to="/players" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <Users size={20} /><span>Player Roster</span>
                    </Link>
                    <Link to="/matches" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <Calendar size={20} /><span>Match Schedule</span>
                    </Link>
                    <Link to="/contracts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <FileText size={20} /><span>Contracts</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;