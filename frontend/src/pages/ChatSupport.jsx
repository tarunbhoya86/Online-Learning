import React, { useState, useEffect } from 'react';

const ChatSupport = () => {
    const [messages, setMessages] = useState([
        { sender: 'agent', text: 'Hello! Welcome to LearnX Support. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newUserMessage = { sender: 'user', text: input };
        setMessages([...messages, newUserMessage]);

        // Save to Database
        try {
            await fetch('http://localhost:5000/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'chat',
                    messages: [newUserMessage], // In a real app, we'd append to a session ID
                    email: 'user@chat.com'
                })
            });
        } catch (error) {
            console.error("Failed to save chat:", error);
        }

        setInput('');

        // Simulate agent response
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'agent', text: 'Thank you for reaching out. An agent will be with you shortly.' }]);
        }, 1000);
    };

    return (
        <div style={{ minHeight: '80vh', padding: '4rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="glass-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>💬</div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Live Chat Support</h3>
                            <span style={{ fontSize: '0.9rem', color: '#10b981' }}>● Online</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-glass)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                                padding: '0.8rem 1.2rem', borderRadius: '15px', maxWidth: '80%'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flex: 1, padding: '1rem', borderRadius: '50px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>➤</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatSupport;
