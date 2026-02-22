import { useEffect, useState } from 'react';
import { Plus, X, Trash2, DollarSign } from 'lucide-react';
import api from '../services/api';

const Contracts = () => {
    const [contracts, setContracts] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [clubs, setClubs] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        start_date: '', end_date: '', salary: '', player_id: '', club_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [contractRes, playerRes, clubRes] = await Promise.all([
            api.get('/contracts'), api.get('/players'), api.get('/clubs')
        ]);
        setContracts(contractRes.data);
        setPlayers(playerRes.data);
        setClubs(clubRes.data);
    };

    const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/contracts', formData);
            setIsModalOpen(false);
            setFormData({ start_date: '', end_date: '', salary: '', player_id: '', club_id: '' });
            fetchData();
        } catch (error) {
            alert("Failed to save contract");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Terminate this contract?")) {
            await api.delete(`/contracts/${id}`);
            fetchData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Financials & Contracts</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={20} /> New Contract
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4">Player</th>
                            <th className="p-4">Club</th>
                            <th className="p-4">Weekly Salary</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {contracts.map((c) => (
                            <tr key={c.contract_id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-gray-900">{c.player_name}</td>
                                <td className="p-4 font-medium text-gray-700">{c.club_name}</td>
                                <td className="p-4 text-green-600 font-bold flex items-center gap-1">
                                    <DollarSign size={16} /> {Number(c.salary).toLocaleString()}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {c.start_date} to {c.end_date}
                                </td>
                                <td className="p-4 flex justify-center">
                                    <button onClick={() => handleDelete(c.contract_id)} className="text-red-600 p-1"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex justify-between p-4 border-b bg-gray-50">
                            <h2 className="text-xl font-bold">Draft New Contract</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Select Player</label>
                                <select required name="player_id" value={formData.player_id} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                                    <option value="">Choose...</option>
                                    {players.map(p => <option key={p.player_id} value={p.player_id}>{p.full_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Select Club</label>
                                <select required name="club_id" value={formData.club_id} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                                    <option value="">Choose...</option>
                                    {clubs.map(c => <option key={c.club_id} value={c.club_id}>{c.club_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Weekly Salary ($)</label>
                                <input required type="number" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Start Date</label>
                                    <input required type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">End Date</label>
                                    <input required type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Sign Contract</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contracts;