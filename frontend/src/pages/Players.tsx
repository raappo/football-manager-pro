import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

interface PlayerRoster {
    player_id: number;
    full_name: string;
    age_calculated: number;
    club_name: string;
    position: string;
}

interface Club {
    club_id: number;
    club_name: string;
}

const Players = () => {
    const [players, setPlayers] = useState<PlayerRoster[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        f_name: '', l_name: '', dob: '', position: '',
        city: '', state: '', pincode: '', club_id: ''
    });

    useEffect(() => {
        fetchPlayers();
        fetchClubs();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await api.get('/players');
            setPlayers(response.data);
        } catch (error) {
            console.error("Error fetching players:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await api.get('/clubs');
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingId(null);
        setFormData({ f_name: '', l_name: '', dob: '', position: '', city: '', state: '', pincode: '', club_id: '' });
        setErrorMsg('');
        setIsModalOpen(true);
    };

    // Open Edit Modal & Fetch Data
    const openEditModal = async (id: number) => {
        setErrorMsg('');
        try {
            const response = await api.get(`/players/${id}`);
            const player = response.data;
            setEditingId(player.player_id);
            setFormData({
                f_name: player.f_name,
                l_name: player.l_name,
                dob: player.dob,
                position: player.position,
                city: player.city,
                state: player.state,
                pincode: player.pincode,
                club_id: player.club_id || '' // Convert null to empty string for dropdown
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching player details:", error);
            alert("Could not load player data.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (editingId) {
                await api.put(`/players/${editingId}`, formData);
            } else {
                await api.post('/players', formData);
            }
            setIsModalOpen(false);
            fetchPlayers();
        } catch (error: any) {
            setErrorMsg(error.response?.data?.error || "Failed to save player");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Delete this player? (This will fire the AFTER DELETE trigger in MySQL)")) {
            try {
                await api.delete(`/players/${id}`);
                fetchPlayers();
            } catch (error) {
                console.error("Error deleting player:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Player Roster</h1>
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} /> Register Player
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading players...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Player Name</th>
                                <th className="p-4 font-semibold">Age</th>
                                <th className="p-4 font-semibold">Position</th>
                                <th className="p-4 font-semibold">Current Club</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {players.map((player) => (
                                <tr key={player.player_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{player.full_name}</td>
                                    <td className="p-4 text-gray-600">{player.age_calculated} yrs</td>
                                    <td className="p-4 text-gray-600">{player.position}</td>
                                    <td className="p-4">
                                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-bold">
                                            {player.club_name || 'Free Agent'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <button onClick={() => openEditModal(player.player_id)} className="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(player.player_id)} className="text-red-600 hover:text-red-800 transition-colors p-1" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add / Edit Player Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Player' : 'Register New Player'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {errorMsg && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 font-medium">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input required type="text" name="f_name" value={formData.f_name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input required type="text" name="l_name" value={formData.l_name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                    <select required name="position" value={formData.position} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="">Select Position...</option>
                                        <option value="Forward">Forward</option>
                                        <option value="Midfielder">Midfielder</option>
                                        <option value="Defender">Defender</option>
                                        <option value="Goalkeeper">Goalkeeper</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Club</label>
                                    <select name="club_id" value={formData.club_id} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="">Free Agent (No Club)</option>
                                        {clubs.map(club => (
                                            <option key={club.club_id} value={club.club_id}>{club.club_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                    {editingId ? 'Update Player' : 'Save Player'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Players;