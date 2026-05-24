import { useState } from 'react';
import FIB4Calculator from './FIB4Calculator.jsx';
import BMRCalculator from './BMRCalculator.jsx';

const TABS = [
  { key: 'fib4', icon: '🫀', label: 'FIB-4', color: '#1e40af' },
  { key: 'bmr',  icon: '🔥', label: '熱量 BMR', color: '#16a34a' },
];

export default function App() {
  const [tab, setTab] = useState('fib4');

  return (
    <div style={{ paddingBottom: 'calc(58px + env(safe-area-inset-bottom, 0px))' }}>
      {tab === 'fib4' ? <FIB4Calculator /> : <BMRCalculator />}

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -1px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 200,
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '8px 0 10px',
              border: 'none', background: 'none',
              borderTop: `2.5px solid ${tab === t.key ? t.color : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: tab === t.key ? t.color : '#94a3b8',
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.key ? 700 : 400, fontFamily: 'system-ui,sans-serif' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
