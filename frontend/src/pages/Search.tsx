import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, DollarSign, Trophy } from 'lucide-react';
import api from '../services/api';

interface Club {
    club_id: number;
    club_name: string;
}

const Search = () => {
    const [results, setResults] = useState<any[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]); // To hold dynamic club list
    const [loading, setLoading] = useState(false);

    // Hold all the optional filter states
    const [filters, setFilters] = useState({
        name: '', nameMatchType: 'contains', position: '', club_id: '', minAge: '', maxAge: '', minSalary: '', minTrophies: ''
    });

    // On mount, load all players AND load the clubs for the dropdown
    useEffect(() => {
        handleSearch();
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const res = await api.get('/clubs');
            setClubs(res.data);
        } catch (error) {
            console.error("Failed to load clubs dropdown");
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // Send the filters to the backend
            const response = await api.get('/players/search', { params: filters });
            setResults(response.data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({ name: '', nameMatchType: 'contains', position: '', club_id: '', minAge: '', maxAge: '', minSalary: '', minTrophies: '' });
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <SearchIcon className="text-blue-600" size={32} /> Advanced Scouting
                </h1>
                <p className="text-gray-600 mt-1">Use the smart filters to locate players based on text, exact matches, and ranges.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* SMART TEXT MATCHING */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Player Name Search</label>
                            <div className="flex">
                                <select
                                    name="nameMatchType"
                                    value={filters.nameMatchType}
                                    onChange={handleInputChange}
                                    className="border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700"
                                >
                                    <option value="contains">Contains (LIKE %x%)</option>
                                    <option value="startsWith">Starts With (LIKE x%)</option>
                                    <option value="endsWith">Ends With (LIKE %x)</option>
                                    <option value="exact">Exact Match (=)</option>
                                </select>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-r-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type name here..."
                                />
                            </div>
                        </div>

                        {/* EXACT DROPDOWNS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <select name="position" value={filters.position} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="">-- Any Position --</option>
                                <option value="Forward">Forward</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Defender">Defender</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Club</label>
                            <select name="club_id" value={filters.club_id} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="">-- Any Club --</option>
                                {clubs.map(club => (
                                    <option key={club.club_id} value={club.club_id}>{club.club_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* RANGES & NUMBERS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Age (&gt;=)</label>
                            <input type="number" min="15" name="minAge" value={filters.minAge} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 18" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Age (&lt;=)</label>
                            <input type="number" min="15" name="maxAge" value={filters.maxAge} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 25" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($)</label>
                            <input type="number" step="1000" name="minSalary" value={filters.minSalary} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Club Trophies (Min)</label>
                            <input type="number" min="0" name="minTrophies" value={filters.minTrophies} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5" />
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button type="button" onClick={clearFilters} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                            Clear Filters
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm">
                            <Filter size={18} /> Search Players
                        </button>
                    </div>
                </form>
            </div>

            {/* RESULTS TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Executing complex query...</div>
                ) : results.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-medium">No records match your exact criteria. Try broadening your search.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Player Name</th>
                                <th className="p-4 font-semibold">Age</th>
                                <th className="p-4 font-semibold">Position</th>
                                <th className="p-4 font-semibold">Club (Trophies)</th>
                                <th className="p-4 font-semibold text-right">Weekly Salary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {results.map((player) => (
                                <tr key={player.player_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{player.full_name}</td>
                                    <td className="p-4 text-gray-600">{player.age} yrs</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-md font-medium">{player.position}</span>
                                    </td>
                                    <td className="p-4 text-indigo-700 font-medium flex items-center gap-2">
                                        {player.club_name}
                                        {player.club_trophies > 0 && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold shadow-sm border border-yellow-200">
                                                <Trophy size={10} /> {player.club_trophies}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-green-700">
                                        {player.salary > 0 ? (
                                            <div className="flex items-center justify-end gap-1"><DollarSign size={14} />{Number(player.salary).toLocaleString()}</div>
                                        ) : (
                                            <span className="text-gray-400 text-sm font-sans font-normal italic">Unassigned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Search;