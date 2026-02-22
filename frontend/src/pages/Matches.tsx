import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';

interface Match {
    match_id: number; match_type: string; match_date: string;
    home_team: string; away_team: string; home_score: number;
    away_score: number; stadium_name: string;
}

interface DropdownItem { id: number; name: string; }

const Matches = () => {
    const { user } = useOutletContext<any>();
    const [matches, setMatches] = useState<Match[]>([]);
    const [clubs, setClubs] = useState<DropdownItem[]>([]);
    const [stadiums, setStadiums] = useState<DropdownItem[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        match_type: '', match_date: '', home_club_id: '', away_club_id: '',
        home_score: 0, away_score: 0, stadium_id: ''
    });

    useEffect(() => {
        fetchMatches();
        fetchDropdownData();
    }, []);

    const fetchMatches = async () => {
        const res = await api.get('/matches');
        setMatches(res.data);
    };

    const fetchDropdownData = async () => {
        const [clubRes, stadRes] = await Promise.all([
            api.get('/clubs'), api.get('/matches/stadiums')
        ]);
        setClubs(clubRes.data.map((c: any) => ({ id: c.club_id, name: c.club_name })));
        setStadiums(stadRes.data.map((s: any) => ({ id: s.stadium_id, name: s.stadium_name })));
    };

    const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const openModal = async (id: number | null = null) => {
        setErrorMsg('');
        setEditingId(id);
        if (id) {
            const { data } = await api.get(`/matches/${id}`);
            setFormData(data);
        } else {
            setFormData({ match_type: '', match_date: '', home_club_id: '', away_club_id: '', home_score: 0, away_score: 0, stadium_id: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (editingId) await api.put(`/matches/${editingId}`, formData);
            else await api.post('/matches', formData);

            setIsModalOpen(false);
            fetchMatches();
        } catch (error: any) {
            setErrorMsg(error.response?.data?.error || "Failed to save match.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Delete this match?")) {
            await api.delete(`/matches/${id}`);
            fetchMatches();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Match Schedule</h1>
                {/* ADMIN ONLY CHECK */}
                {user?.role === 'Admin' && (
                    <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={20} /> Schedule Match
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4">Date</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-right">Home Team</th>
                            <th className="p-4 text-center">Score</th>
                            <th className="p-4">Away Team</th>
                            <th className="p-4">Stadium</th>
                            {/* ADMIN ONLY CHECK */}
                            {user?.role === 'Admin' && <th className="p-4 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {matches.map((match) => (
                            <tr key={match.match_id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-900 font-medium">{match.match_date}</td>
                                <td className="p-4 text-gray-600">{match.match_type}</td>
                                <td className="p-4 text-right font-bold text-gray-800">{match.home_team}</td>
                                <td className="p-4 text-center">
                                    <span className="bg-slate-800 text-white px-3 py-1 rounded-md text-lg font-mono">
                                        {match.home_score} - {match.away_score}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-gray-800">{match.away_team}</td>
                                <td className="p-4 text-gray-600">{match.stadium_name}</td>
                                {/* ADMIN ONLY CHECK */}
                                {user?.role === 'Admin' && (
                                    <td className="p-4 flex justify-center gap-3">
                                        <button onClick={() => openModal(match.match_id)} className="text-blue-600 p-1"><Pencil size={18} /></button>
                                        <button onClick={() => handleDelete(match.match_id)} className="text-red-600 p-1"><Trash2 size={18} /></button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between p-4 border-b bg-gray-50">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Match' : 'Schedule Match'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{errorMsg}</div>}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Match Type</label>
                                    <select required name="match_type" value={formData.match_type} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                                        <option value="">Select...</option>
                                        <option value="League">League</option>
                                        <option value="Champions League">Champions League</option>
                                        <option value="Friendly">Friendly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Date</label>
                                    <input required type="date" name="match_date" value={formData.match_date} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <label className="block text-sm font-bold text-blue-800 mb-1">Home Team</label>
                                    <select required name="home_club_id" value={formData.home_club_id} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-3">
                                        <option value="">Select Home Team...</option>
                                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <label className="block text-sm mb-1">Home Goals</label>
                                    <input type="number" name="home_score" min="0" value={formData.home_score} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                    <label className="block text-sm font-bold text-red-800 mb-1">Away Team</label>
                                    <select required name="away_club_id" value={formData.away_club_id} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-3">
                                        <option value="">Select Away Team...</option>
                                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <label className="block text-sm mb-1">Away Goals</label>
                                    <input type="number" name="away_score" min="0" value={formData.away_score} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm mb-1">Stadium</label>
                                    <select required name="stadium_id" value={formData.stadium_id} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                                        <option value="">Select Stadium...</option>
                                        {stadiums.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Match</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Matches;