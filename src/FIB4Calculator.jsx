import { useState } from "react";

const getRisk = (v) => {
  if (v === null) return null;
  if (v < 1.3) return "low";
  if (v <= 2.67) return "intermediate";
  return "high";
};

const RISK = {
  low: {
    label: "低風險 Low Risk",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#86efac",
    fib: "FIB-4 < 1.3",
    lsm: "LSM < 8 kPa",
    action: "常規監測，每 1–2 年追蹤",
  },
  intermediate: {
    label: "中度風險 Intermediate Risk",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fcd34d",
    fib: "FIB-4 1.3–2.67",
    lsm: "LSM 8–12 kPa",
    action: "每 3–6 個月追蹤，建議轉介肝膽腸胃科",
  },
  high: {
    label: "高風險 High Risk",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fca5a5",
    fib: "FIB-4 > 2.67",
    lsm: "LSM > 12 kPa",
    action: "強烈建議轉介肝膽腸胃科專科評估",
  },
};

const FIELDS = [
  { key: "age",     label: "年齡",  unit: "歲",     hint: "Age",            placeholder: "55" },
  { key: "ast",     label: "AST",   unit: "U/L",   hint: "天門冬胺酸轉胺酶", placeholder: "42" },
  { key: "alt",     label: "ALT",   unit: "U/L",   hint: "丙胺酸轉胺酶",   placeholder: "38" },
  { key: "platelet",label: "血小板", unit: "×10⁹/L",hint: "Platelet count",  placeholder: "180" },
];

export default function FIB4Calculator() {
  const [vals, setVals] = useState({ age: "", ast: "", alt: "", platelet: "" });
  const [result, setResult] = useState(null);

  const set = (k, v) => {
    setVals((p) => ({ ...p, [k]: v }));
    setResult(null);
  };

  const allFilled = FIELDS.every((f) => vals[f.key] !== "");

  const calculate = () => {
    const { age, ast, alt, platelet } = vals;
    const a = parseFloat(age), s = parseFloat(ast),
          l = parseFloat(alt), p = parseFloat(platelet);
    if (!a || !s || !l || !p || l <= 0 || p <= 0) return;
    setResult((a * s) / (p * Math.sqrt(l)));
  };

  const reset = () => {
    setVals({ age: "", ast: "", alt: "", platelet: "" });
    setResult(null);
  };

  const risk = getRisk(result);
  const cfg  = risk ? RISK[risk] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>Non-invasive Hepatic Fibrosis Screening</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>FIB-4 計算機</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>公式：(年齡 × AST) ÷ (血小板 × √ALT)</p>
        </div>

        {/* Form Card */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
          {FIELDS.map(({ key, label, unit, hint, placeholder }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                  {label} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({unit})</span>
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{hint}</span>
              </label>
              <input
                type="number"
                value={vals[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: vals[key] ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  borderRadius: 8, padding: "10px 12px",
                  fontSize: 15, color: "#0f172a",
                  outline: "none", transition: "border-color 0.15s",
                  background: vals[key] ? "#eff6ff" : "#fff",
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={calculate}
              disabled={!allFilled}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 8, border: "none",
                background: allFilled ? "#2563eb" : "#e2e8f0",
                color: allFilled ? "#fff" : "#94a3b8",
                fontSize: 15, fontWeight: 600,
                cursor: allFilled ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              計算 Calculate
            </button>
            <button
              onClick={reset}
              style={{
                padding: "11px 16px", borderRadius: 8,
                border: "1px solid #e2e8f0", background: "#fff",
                color: "#64748b", fontSize: 14, cursor: "pointer",
              }}
            >
              清除
            </button>
          </div>
        </div>

        {/* Result */}
        {result !== null && cfg && (
          <div style={{
            background: cfg.bg, border: `1.5px solid ${cfg.border}`,
            borderRadius: 12, padding: 20,
            animation: "fadeIn 0.25s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{cfg.fib} ／ {cfg.lsm}</span>
            </div>
            <div style={{ textAlign: "center", padding: "14px 0", borderTop: `1px solid ${cfg.border}`, borderBottom: `1px solid ${cfg.border}`, margin: "0 0 14px" }}>
              <p style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em", margin: "0 0 4px" }}>FIB-4 INDEX</p>
              <p style={{ fontSize: 48, fontWeight: 700, color: cfg.color, margin: 0, fontVariantNumeric: "tabular-nums" }}>{result.toFixed(2)}</p>
            </div>
            <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: cfg.color }}>建議：</strong>{cfg.action}
            </p>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 20 }}>
          Reference: Hepatol Commun. 2024;8(11):e0571
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        input:focus { border-color: #2563eb !important; background: #eff6ff !important; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
