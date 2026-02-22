import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';

interface Club {
    club_id: number;
    club_name: string;
    founded_year: number;
    total_trophies: number;
    owner_name: string;
    club_email?: string;
}

const Clubs = () => {
    const { user } = useOutletContext<any>();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        club_name: '', founded_year: '', owner_name: '', club_email: ''
    });

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const response = await api.get('/clubs');
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ club_name: '', founded_year: '', owner_name: '', club_email: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (club: Club) => {
        setEditingId(club.club_id);
        setFormData({
            club_name: club.club_name,
            founded_year: club.founded_year.toString(),
            owner_name: club.owner_name,
            club_email: club.club_email || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/clubs/${editingId}`, formData);
            } else {
                await api.post('/clubs', formData);
            }
            setIsModalOpen(false);
            fetchClubs();
        } catch (error) {
            console.error("Error saving club:", error);
            alert("Failed to save club. Ensure the name/email is unique.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this club?")) {
            try {
                await api.delete(`/clubs/${id}`);
                fetchClubs();
            } catch (error) {
                console.error("Error deleting club:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Football Clubs</h1>
                {/* ADMIN ONLY CHECK */}
                {user?.role === 'Admin' && (
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus size={20} /> Add New Club
                    </button>
                )}
            </div>

            {loading ? (
                <p className="text-gray-500">Loading clubs...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Club Name</th>
                                <th className="p-4 font-semibold">Founded</th>
                                <th className="p-4 font-semibold">Trophies</th>
                                <th className="p-4 font-semibold">Owner</th>
                                {/* ADMIN ONLY CHECK */}
                                {user?.role === 'Admin' && <th className="p-4 font-semibold text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clubs.map((club) => (
                                <tr key={club.club_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{club.club_name}</td>
                                    <td className="p-4 text-gray-600">{club.founded_year}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                                            {club.total_trophies}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{club.owner_name}</td>
                                    {/* ADMIN ONLY CHECK */}
                                    {user?.role === 'Admin' && (
                                        <td className="p-4 flex justify-center gap-3">
                                            <button onClick={() => openEditModal(club)} className="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(club.club_id)} className="text-red-600 hover:text-red-800 transition-colors p-1" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Club' : 'Add New Club'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                                <input required type="text" name="club_name" value={formData.club_name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Arsenal FC" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                                <input required type="number" name="founded_year" value={formData.founded_year} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1886" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                <input required type="text" name="owner_name" value={formData.owner_name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Kroenke Sports" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                <input type="email" name="club_email" value={formData.club_email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="contact@club.com" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                    {editingId ? 'Update Club' : 'Save Club'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clubs;