import { useState, useRef } from 'react';

const ACTIVITY = [
  { key: 'sedentary', label: '久坐',    hint: '幾乎不運動',          mult: 1.2 },
  { key: 'light',     label: '輕度活動', hint: '每週 1–3 天',          mult: 1.375 },
  { key: 'moderate',  label: '中度活動', hint: '每週 3–5 天',          mult: 1.55 },
  { key: 'active',    label: '高度活動', hint: '每週 6–7 天',          mult: 1.725 },
  { key: 'extreme',   label: '極高活動', hint: '體力工作 / 每日訓練', mult: 1.9 },
];

const G = '#16a34a';
const G_DARK = '#15803d';

const MALE_FIELDS = [
  { key: 'weight', label: '體重', unit: 'kg', hint: 'Weight', next: 'height', placeholder: '70' },
  { key: 'height', label: '身高', unit: 'cm', hint: 'Height', next: 'age',    placeholder: '175' },
  { key: 'age',    label: '年齡', unit: '歲',  hint: 'Age',    next: null,     placeholder: '30' },
];

export default function BMRCalculator() {
  const [gender,   setGender]   = useState('male');
  const [vals,     setVals]     = useState({ weight: '', height: '', age: '' });
  const [activity, setActivity] = useState('moderate');
  const [result,   setResult]   = useState(null);
  const refs = useRef({});

  const update = (k, v) => { setVals(p => ({ ...p, [k]: v })); setResult(null); };
  const switchGender = g => { setGender(g); setResult(null); };

  const allFilled = MALE_FIELDS.every(f => vals[f.key] !== '');

  const calculate = () => {
    const w = parseFloat(vals.weight);
    const h = parseFloat(vals.height);
    const a = parseFloat(vals.age);
    if (!w || !h || !a) return;
    const bmr = gender === 'male'
      ? 66 + (13.7 * w) + (5 * h) - (6.8 * a)
      : 655 + (9.6 * w) + (1.8 * h) - (4.7 * a);
    setResult(Math.round(bmr));
  };

  const reset = () => { setVals({ weight: '', height: '', age: '' }); setResult(null); };

  const handleKey = (e, next) => {
    if (e.key === 'Enter') { e.preventDefault(); if (next) refs.current[next]?.focus(); }
  };

  const act = ACTIVITY.find(a => a.key === activity);
  const tdee = result !== null ? Math.round(result * act.mult) : null;

  const formula = gender === 'male'
    ? 'BMR = 66 + (13.7 × 體重) + (5 × 身高) − (6.8 × 年齡)'
    : 'BMR = 655 + (9.6 × 體重) + (1.8 × 身高) − (4.7 × 年齡)';

  return (
    <div style={{ minHeight: '100svh', background: '#f1f5f9', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <header style={{ background: G, padding: 'env(safe-area-inset-top,0) 0 0', color: '#fff' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 20px 18px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase' }}>
            Fitness · Calorie Estimation
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>BMR</span>
            <span style={{ fontSize: 14, opacity: 0.75, marginBottom: 3 }}>基礎代謝率計算</span>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11, opacity: 0.5, fontStyle: 'italic', fontFamily: 'Georgia,serif' }}>
            Harris-Benedict Equation
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 32px' }}>

        {/* Gender toggle */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 4, display: 'flex', gap: 4, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          {[['male', '♂ 男性'], ['female', '♀ 女性']].map(([g, label]) => (
            <button key={g} onClick={() => switchGender(g)} style={{
              flex: 1, padding: '10px 0', borderRadius: 9, border: 'none',
              background: gender === g ? G : 'transparent',
              color: gender === g ? '#fff' : '#94a3b8',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Formula */}
        <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 11, color: G_DARK, fontStyle: 'italic', fontFamily: 'Georgia,serif', lineHeight: 1.5 }}>
          {formula}
        </div>

        {/* Inputs */}
        <section style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 12 }}>
          {MALE_FIELDS.map(({ key, label, unit, hint, next, placeholder }, i) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', gap: 12 }}>
              <div style={{ width: 68, flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{unit}</div>
              </div>
              <input
                ref={el => refs.current[key] = el}
                type="number" inputMode="decimal"
                value={vals[key]}
                onChange={e => update(key, e.target.value)}
                onKeyDown={e => handleKey(e, next)}
                enterKeyHint={next ? 'next' : 'done'}
                placeholder="—"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 26, fontWeight: 700,
                  color: vals[key] ? G : '#cbd5e1',
                  background: 'transparent', textAlign: 'right', width: '100%',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
              <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, width: 56, textAlign: 'right' }}>{hint}</div>
            </div>
          ))}
        </section>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={calculate} disabled={!allFilled} style={{
            flex: 1, padding: '14px 0', borderRadius: 12, border: 'none',
            background: allFilled ? G : '#e2e8f0',
            color: allFilled ? '#fff' : '#94a3b8',
            fontSize: 16, fontWeight: 700,
            cursor: allFilled ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s', letterSpacing: '0.03em',
          }}>
            計算 Calculate
          </button>
          <button onClick={reset} style={{
            padding: '14px 18px', borderRadius: 12,
            border: '1px solid #e2e8f0', background: '#fff',
            color: '#64748b', fontSize: 15, cursor: 'pointer', fontWeight: 500,
          }}>清除</button>
        </div>

        {/* Result */}
        {result !== null && (
          <section key={result} style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #86efac', animation: 'slideUp 0.28s cubic-bezier(0.16,1,0.3,1)' }}>

            {/* BMR score */}
            <div style={{ background: G, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>基礎代謝率 BMR</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>kcal / day</span>
            </div>
            <div style={{ background: '#f0fdf4', padding: '20px 16px 16px', textAlign: 'center', borderBottom: '1px solid #86efac' }}>
              <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1, color: G_DARK, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
                {result.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', marginTop: 4 }}>KCAL / DAY</div>
            </div>

            {/* Activity selector */}
            <div style={{ background: '#f0fdf4', padding: '14px 16px', borderBottom: '1px solid #86efac' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>選擇活動量 → 計算每日總熱量消耗</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ACTIVITY.map(a => (
                  <button key={a.key} onClick={() => setActivity(a.key)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${activity === a.key ? G : '#d1fae5'}`,
                    background: activity === a.key ? '#dcfce7' : '#fff',
                    transition: 'all 0.12s',
                  }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: activity === a.key ? G_DARK : '#374151' }}>{a.label}</span>
                      <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 6 }}>{a.hint}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>×{a.mult}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TDEE */}
            <div style={{ background: '#f0fdf4', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>每日總熱量消耗 TDEE</span>
                <span style={{ fontSize: 30, fontWeight: 900, color: G_DARK, fontVariantNumeric: 'tabular-nums' }}>
                  {tdee?.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 500 }}>kcal</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '8px 12px', border: '1px solid #d1fae5', minWidth: 120 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>減重目標</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: G_DARK }}>{(tdee - 400).toLocaleString()} kcal</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>TDEE √ 300–500</div>
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '8px 12px', border: '1px solid #d1fae5', minWidth: 120 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>增肌目標</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: G_DARK }}>{(tdee + 300).toLocaleString()} kcal</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>TDEE + 200–400</div>
                </div>
              </div>
            </div>
          </section>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 20, lineHeight: 1.6 }}>
          Harris-Benedict (1919, revised 1984)
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
