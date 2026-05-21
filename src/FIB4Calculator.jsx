import { useState, useRef } from 'react';

const FIELDS = [
  { key: 'age', label: '年齡',  unit: '歲',     hint: 'Age',              next: 'ast' },
  { key: 'ast', label: 'AST',   unit: 'U/L',    hint: '天門冬胺酸轉胺酶',  next: 'alt' },
  { key: 'alt', label: 'ALT',   unit: 'U/L',    hint: '丙胺酸轉胺酶',     next: 'plt' },
  { key: 'plt', label: '血小板', unit: '×10⁹/L', hint: 'Platelet count',   next: null  },
];

const RISK = {
  low: {
    label: '低風險', en: 'Low Risk',
    color: '#15803d', bg: '#f0fdf4', border: '#86efac', header: '#16a34a',
    range: 'FIB-4 < 1.3', lsm: 'LSM < 8 kPa',
    action: '常規監測，每 1–2 年追蹤',
  },
  intermediate: {
    label: '中度風險', en: 'Intermediate',
    color: '#92400e', bg: '#fffbeb', border: '#fcd34d', header: '#d97706',
    range: 'FIB-4 1.3–2.67', lsm: 'LSM 8–12 kPa',
    action: '每 3–6 個月密切監控，定期追蹤肝功能',
  },
  high: {
    label: '高風險', en: 'High Risk',
    color: '#991b1b', bg: '#fef2f2', border: '#fca5a5', header: '#dc2626',
    range: 'FIB-4 > 2.67', lsm: 'LSM > 12 kPa',
    action: '每 3 個月密切監控，定期追蹤肝功能',
  },
};

function getRisk(v) {
  if (v < 1.3)   return 'low';
  if (v <= 2.67) return 'intermediate';
  return 'high';
}

export default function FIB4Calculator() {
  const [vals, setVals]   = useState({ age: '', ast: '', alt: '', plt: '' });
  const [result, setResult] = useState(null);
  const refs = useRef({});

  const update = (k, v) => {
    setVals(p => ({ ...p, [k]: v }));
    setResult(null);
  };

  const handleKey = (e, nextKey) => {
    if (e.key === 'Enter' || e.key === 'Next') {
      e.preventDefault();
      if (nextKey) refs.current[nextKey]?.focus();
    }
  };

  const allFilled = FIELDS.every(f => vals[f.key] !== '');

  const calculate = () => {
    const a = parseFloat(vals.age), s = parseFloat(vals.ast),
          l = parseFloat(vals.alt), p = parseFloat(vals.plt);
    if (!a || !s || !l || !p || l <= 0 || p <= 0) return;
    setResult((a * s) / (p * Math.sqrt(l)));
  };

  const reset = () => {
    setVals({ age: '', ast: '', alt: '', plt: '' });
    setResult(null);
    refs.current['age']?.focus();
  };

  const risk = result !== null ? getRisk(result) : null;
  const cfg  = risk ? RISK[risk] : null;

  return (
    <div style={{ minHeight: '100svh', background: '#f1f5f9', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* ── Header ── */}
      <header style={{ background: '#1e40af', padding: 'env(safe-area-inset-top, 0) 0 0', color: '#fff' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 20px 18px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase' }}>
            Hepatic Fibrosis · Non-invasive
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>FIB-4</span>
            <span style={{ fontSize: 14, opacity: 0.75, marginBottom: 3 }}>肝纖維化風險評估</span>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11, opacity: 0.5, fontStyle: 'italic', fontFamily: 'Georgia,serif' }}>
            (Age × AST) ÷ (Platelet × √ALT)
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 48px' }}>

        {/* ── Input card ── */}
        <section style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 12 }}>
          {FIELDS.map(({ key, label, unit, hint, next }, i) => (
            <div
              key={key}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < FIELDS.length - 1 ? '1px solid #f1f5f9' : 'none',
                gap: 12,
              }}
            >
              <div style={{ width: 68, flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{unit}</div>
              </div>

              <input
                ref={el => refs.current[key] = el}
                type="number"
                inputMode="decimal"
                value={vals[key]}
                onChange={e => update(key, e.target.value)}
                onKeyDown={e => handleKey(e, next)}
                enterKeyHint={next ? 'next' : 'done'}
                placeholder="—"
                style={{
                  flex: 1,
                  border: 'none', outline: 'none',
                  fontSize: 26, fontWeight: 700,
                  color: vals[key] ? '#1e40af' : '#cbd5e1',
                  background: 'transparent',
                  textAlign: 'right',
                  width: '100%',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />

              <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, width: 64, textAlign: 'right', lineHeight: 1.3 }}>
                {hint}
              </div>
            </div>
          ))}
        </section>

        {/* ── Buttons ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={calculate}
            disabled={!allFilled}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 12, border: 'none',
              background: allFilled ? '#1e40af' : '#e2e8f0',
              color: allFilled ? '#fff' : '#94a3b8',
              fontSize: 16, fontWeight: 700,
              cursor: allFilled ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s, color 0.15s',
              letterSpacing: '0.03em',
            }}
          >
            計算 Calculate
          </button>
          <button
            onClick={reset}
            style={{
              padding: '14px 18px', borderRadius: 12,
              border: '1px solid #e2e8f0', background: '#fff',
              color: '#64748b', fontSize: 15, cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            清除
          </button>
        </div>

        {/* ── Result ── */}
        {result !== null && cfg && (
          <section
            key={result}
            style={{
              borderRadius: 16, overflow: 'hidden',
              border: `1.5px solid ${cfg.border}`,
              animation: 'slideUp 0.28s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{
              background: cfg.header,
              padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                {cfg.label}
                <span style={{ fontWeight: 400, fontSize: 13, marginLeft: 6, opacity: 0.85 }}>{cfg.en}</span>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{cfg.range}</span>
            </div>

            <div style={{ background: cfg.bg, padding: '20px 16px 16px', textAlign: 'center' }}>
              <div style={{
                fontSize: 60, fontWeight: 900, lineHeight: 1,
                color: cfg.color, fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
              }}>
                {result.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', marginTop: 4 }}>FIB-4 INDEX</div>
            </div>

            <div style={{
              background: cfg.bg,
              borderTop: `1px solid ${cfg.border}`,
              padding: '14px 16px',
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: '#1e293b', lineHeight: 1.5 }}>
                <strong>建議：</strong>{cfg.action}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>對應 LSM：{cfg.lsm}</p>
            </div>
          </section>
        )}

        {/* ── Risk legend (before result) ── */}
        {result === null && (
          <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>風險分級 Risk Guide</span>
            </div>
            {Object.entries(RISK).map(([k, r], i, arr) => (
              <div
                key={k}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px',
                  borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.header, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{r.range}</span>
                </div>
                <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>{r.lsm}</span>
              </div>
            ))}
          </section>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 20, lineHeight: 1.6 }}>
          Ref: Hepatol Commun. 2024;8(11):e0571
        </p>
      </main>

      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
