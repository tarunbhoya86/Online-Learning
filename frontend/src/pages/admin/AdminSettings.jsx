import React, { useState } from 'react';
import PageTransition from '../../components/PageTransition';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        publicRegistration: true,
        autoApproveMentors: false,
        security2FA: true
    });

    const [loading, setLoading] = useState(false);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1500);
    };

    const Toggle = ({ label, description, active, onClick }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
                <div style={{ fontWeight: '500', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{description}</div>
            </div>
            <div
                onClick={onClick}
                style={{
                    width: '48px',
                    height: '24px',
                    background: active ? 'var(--primary)' : 'var(--bg-card)',
                    border: active ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{
                    position: 'absolute',
                    left: active ? '26px' : '2px',
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    background: active ? 'white' : 'var(--text-muted)',
                    borderRadius: '50%',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}></div>
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>System Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure platform-wide settings and preferences.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                        General Notifications
                    </h3>
                    <Toggle
                        label="Email Notifications"
                        description="Receive activity digests and important system alerts via email"
                        active={settings.emailNotifications}
                        onClick={() => handleToggle('emailNotifications')}
                    />
                    <Toggle
                        label="SMS Notifications"
                        description="Urgent alerts sent directly to your registered phone number"
                        active={settings.smsNotifications}
                        onClick={() => handleToggle('smsNotifications')}
                    />
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                        Platform Management
                    </h3>
                    <Toggle
                        label="Public Registration"
                        description="Allow new users to sign up freely. Turn off to switch to invite-only."
                        active={settings.publicRegistration}
                        onClick={() => handleToggle('publicRegistration')}
                    />
                    <Toggle
                        label="Auto-Approve Mentors"
                        description="Automatically approve new mentor applications without manual review."
                        active={settings.autoApproveMentors}
                        onClick={() => handleToggle('autoApproveMentors')}
                    />
                    <Toggle
                        label="Maintenance Mode"
                        description="Disable user access for system updates. Only Admins can login."
                        active={settings.maintenanceMode}
                        onClick={() => handleToggle('maintenanceMode')}
                    />
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                        Security
                    </h3>
                    <Toggle
                        label="Two-Factor Authentication (2FA)"
                        description="Enforce 2FA for all admin accounts."
                        active={settings.security2FA}
                        onClick={() => handleToggle('security2FA')}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={loading}
                        style={{ minWidth: '150px', display: 'flex', justifyContent: 'center' }}
                    >
                        {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminSettings;
