import React, { useEffect } from 'react';

const LandingPage: React.FC = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://affiliate.trip.com/js/searchbox.js';
        script.setAttribute('data-partnerid', 'YOUR_PARTNER_ID');
        script.setAttribute('data-siteid', 'YOUR_SITE_ID');
        const container = document.getElementById('trip-affiliate-search');
        if (container) container.appendChild(script);
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7f7f7', color: '#333' }}>
            <header style={{ backgroundColor: '#0066cc', color: '#fff', padding: '1rem', textAlign: 'center' }}>
                <h1>Book Your Dream Vacation</h1>
                <p>Powered by Trip.com Affiliate &amp; Our Telegram Bot</p>
            </header>
            <main style={{ flex: 1, maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                <p>Use our Telegram bot to search and book hotels around the world. Just click the button below to start chatting!</p>
                <a
                    href="tg://resolve?domain=YourBotUsername"
                    style={{ display: 'inline-block', margin: '1rem 0', padding: '0.75rem 1.5rem', backgroundColor: '#0088cc', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '1rem' }}
                >
                    Chat on Telegram
                </a>
                <div id="trip-affiliate-search" style={{ margin: '2rem 0' }} />
            </main>
            <footer style={{ backgroundColor: '#eee', textAlign: 'center', padding: '1rem 0', fontSize: '0.9rem' }}>
                <p>&copy; 2025 Your Company Name. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
