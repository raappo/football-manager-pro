import { useEffect, useState } from 'react';
import { Users, Trophy, Flag, Activity } from 'lucide-react';
import api from '../services/api';

interface DashboardData {
    stats: {
        total_players: number;
        total_clubs: number;
        total_trophies: number;
        total_matches: number;
    };
    upcoming: any[];
    recent: any[];
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchDashboard();
    }, []);

    if (!data) return <div className="p-8 text-gray-500 font-medium text-lg">Loading Dashboard Data...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard Overview</h1>

            {/* Aggregate Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-lg"><Users size={32} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Total Players</p>
                        <p className="text-3xl font-extrabold text-gray-900">{data.stats.total_players}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-lg"><Flag size={32} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Registered Clubs</p>
                        <p className="text-3xl font-extrabold text-gray-900">{data.stats.total_clubs}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-yellow-100 text-yellow-600 rounded-lg"><Trophy size={32} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Total Trophies</p>
                        <p className="text-3xl font-extrabold text-gray-900">{data.stats.total_trophies}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-lg"><Activity size={32} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Matches Logged</p>
                        <p className="text-3xl font-extrabold text-gray-900">{data.stats.total_matches}</p>
                    </div>
                </div>
            </div>

            {/* Matches Display Area */}
            <div className="grid grid-cols-2 gap-6 mt-8">

                {/* Upcoming Matches */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                        <h2 className="text-xl font-bold text-gray-800">Upcoming Matches</h2>
                    </div>
                    <div className="p-5">
                        {data.upcoming.length === 0 ? (
                            <p className="text-gray-500 italic">No upcoming matches scheduled.</p>
                        ) : (
                            <ul className="space-y-4">
                                {data.upcoming.map((match: any) => (
                                    <li key={match.match_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="font-bold text-gray-800 w-1/3 text-right">{match.home_team}</span>
                                        <div className="flex flex-col items-center w-1/3">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold mb-1">VS</span>
                                            <span className="text-xs text-gray-500 font-medium">{match.formatted_date}</span>
                                        </div>
                                        <span className="font-bold text-gray-800 w-1/3 text-left">{match.away_team}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Previous Matches & Scores */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                        <h2 className="text-xl font-bold text-gray-800">Recent Results</h2>
                    </div>
                    <div className="p-5">
                        {data.recent.length === 0 ? (
                            <p className="text-gray-500 italic">No recent match results.</p>
                        ) : (
                            <ul className="space-y-4">
                                {data.recent.map((match: any) => (
                                    <li key={match.match_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="font-bold text-gray-800 w-1/3 text-right">{match.home_team}</span>
                                        <div className="flex flex-col items-center w-1/3">
                                            <span className="bg-slate-800 text-white text-lg px-3 py-1 rounded-md font-mono font-bold">
                                                {match.home_score} - {match.away_score}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1 font-medium">{match.formatted_date}</span>
                                        </div>
                                        <span className="font-bold text-gray-800 w-1/3 text-left">{match.away_team}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;