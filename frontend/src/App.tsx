import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { HomePage } from './pages/HomePage';
import { SessionsPage } from './pages/SessionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { PassesPage } from './pages/PassesPage';

const AppContent: React.FC = () => {
  const { user, setUser, selectedBranch, setSelectedBranch, toast } = useApp();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentTab, setCurrentTab] = useState<'home' | 'sessions' | 'passes' | 'profile'>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // If user is not logged in, show isolated Login / SignUp pages
  if (!user) {
    return authView === 'login' ? (
      <LoginPage onGoToSignUp={() => setAuthView('signup')} />
    ) : (
      <SignUpPage onGoToLogin={() => setAuthView('login')} />
    );
  }

  // Once logged in, show customer space
  return (
    <div style={styles.app}>
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === 'success' ? '#0f766e' : '#b91c1c' }}>
          {toast.msg}
        </div>
      )}

      {/* Side Drawer */}
      {drawerOpen && (
        <div style={styles.drawerOverlay} onClick={() => setDrawerOpen(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerTop}>
              <div style={styles.drawerAvatar}>{user.gamer_tag[0]}</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15 }}>{user.gamer_tag}</div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>{user.email}</div>
              </div>
            </div>

            <div style={styles.drawerMenu}>
              <button
                style={{ ...styles.drawerLink, ...(currentTab === 'home' ? styles.drawerLinkActive : {}) }}
                onClick={() => { setCurrentTab('home'); setDrawerOpen(false); }}
              >
                🏠 Home & Arena
              </button>
              <button
                style={{ ...styles.drawerLink, ...(currentTab === 'sessions' ? styles.drawerLinkActive : {}) }}
                onClick={() => { setCurrentTab('sessions'); setDrawerOpen(false); }}
              >
                🕹️ My Sessions
              </button>
              <button
                style={{ ...styles.drawerLink, ...(currentTab === 'passes' ? styles.drawerLinkActive : {}) }}
                onClick={() => { setCurrentTab('passes'); setDrawerOpen(false); }}
              >
                🎟️ Buy Passes
              </button>
              <button
                style={{ ...styles.drawerLink, ...(currentTab === 'profile' ? styles.drawerLinkActive : {}) }}
                onClick={() => { setCurrentTab('profile'); setDrawerOpen(false); }}
              >
                👤 Profile ({user.days_remaining}d left)
              </button>
            </div>

            <button style={styles.logoutBtn} onClick={() => { setUser(null); setDrawerOpen(false); }}>
              🚪 Log out
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={styles.menuBtn} onClick={() => setDrawerOpen(true)}>☰</button>
          <div style={{ fontWeight: 900, fontSize: 16 }}>CYBER <span style={{ color: '#0066FF' }}>ZONE</span></div>
        </div>
        <div style={styles.avatarMini} onClick={() => setCurrentTab('profile')}>{user.gamer_tag[0]}</div>
      </header>

      {/* Branch Bar */}
      <div style={styles.branchBar}>
        <button
          style={{ ...styles.branchBtn, ...(selectedBranch === 'shop_a' ? styles.branchActive : {}) }}
          onClick={() => setSelectedBranch('shop_a')}
        >
          📍 Airoli • Sector 8
        </button>
        <button
          style={{ ...styles.branchBtn, ...(selectedBranch === 'shop_b' ? styles.branchActive : {}) }}
          onClick={() => setSelectedBranch('shop_b')}
        >
          📍 Bhandup • Arena
        </button>
      </div>

      {/* Active Page View */}
      <main style={styles.main}>
        {currentTab === 'home' && <HomePage />}
        {currentTab === 'sessions' && <SessionsPage />}
        {currentTab === 'passes' && <PassesPage />}
        {currentTab === 'profile' && <ProfilePage />}
      </main>

      {/* Bottom Nav Bar */}
      <nav style={styles.bottomNav}>
        <button style={{ ...styles.navBtn, ...(currentTab === 'home' ? styles.navActive : {}) }} onClick={() => setCurrentTab('home')}>
          🏠 Home
        </button>
        <button style={{ ...styles.navBtn, ...(currentTab === 'sessions' ? styles.navActive : {}) }} onClick={() => setCurrentTab('sessions')}>
          🕹️ Sessions
        </button>
        <button style={{ ...styles.navBtn, ...(currentTab === 'passes' ? styles.navActive : {}) }} onClick={() => setCurrentTab('passes')}>
          🎟️ Passes
        </button>
        <button style={{ ...styles.navBtn, ...(currentTab === 'profile' ? styles.navActive : {}) }} onClick={() => setCurrentTab('profile')}>
          👤 Profile
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { background: '#ffffff', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  menuBtn: { background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', fontSize: 18 },
  avatarMini: { width: 34, height: 34, borderRadius: 17, background: '#0066FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer' },
  branchBar: { display: 'flex', gap: 8, padding: '8px 16px', background: '#f1f5f9' },
  branchBtn: { flex: 1, padding: '7px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, fontWeight: 800, cursor: 'pointer' },
  branchActive: { background: '#0066FF', color: '#ffffff', borderColor: '#0066FF' },
  main: { padding: '14px 16px 80px 16px', maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box', flex: 1 },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', padding: '8px 0', zIndex: 50 },
  navBtn: { flex: 1, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 11, fontWeight: 800, cursor: 'pointer' },
  navActive: { color: '#0066FF' },
  drawerOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex' },
  drawer: { width: 280, background: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', padding: 18, boxSizing: 'border-box' },
  drawerTop: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 },
  drawerAvatar: { width: 44, height: 44, borderRadius: 22, background: '#0066FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 },
  drawerMenu: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  drawerLink: { padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#374151', cursor: 'pointer' },
  drawerLinkActive: { background: '#eff6ff', color: '#0066FF', fontWeight: 900 },
  logoutBtn: { padding: 10, borderRadius: 8, border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: 900, cursor: 'pointer' },
  toast: { position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', color: '#ffffff', padding: '10px 18px', borderRadius: 20, fontSize: 12, fontWeight: 900, zIndex: 9999 },
};