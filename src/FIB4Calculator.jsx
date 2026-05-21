import { useState } from "react";

const getRiskLevel = (fib4) => {
  if (fib4 === null) return null;
  if (fib4 < 1.3) return "low";
  if (fib4 <= 2.67) return "intermediate";
  return "high";
};

const riskConfig = {
  low: {
    label: "低風險 Low Risk",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "#22c55e",
    fib: "FIB-4 < 1.3",
    lsm: "或 LSM < 8 kPa",
    action: "常規監測，每 1–2 年追蹤",
    emoji: "✅",
  },
  intermediate: {
    label: "中度風險 Intermediate Risk",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    border: "#6366f1",
    fib: "FIB-4 1.3 – 2.67",
    lsm: "或 LSM 8–12 kPa",
    action: "每 3–6 個月密切監控或轉介肝膽科",
    emoji: "⚠️",
  },
  high: {
    label: "高風險 High Risk",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "#ef4444",
    fib: "FIB-4 > 2.67",
    lsm: "或 LSM > 12 kPa",
    action: "強烈建議轉介肝膽科專科評估",
    emoji: "🚨",
  },
};

export default function FIB4Calculator() {
  const [age, setAge] = useState("");
  const [ast, setAst] = useState("");
  const [alt, setAlt] = useState("");
  const [platelet, setPlatelet] = useState("");
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const calculate = () => {
    const a = parseFloat(age);
    const s = parseFloat(ast);
    const l = parseFloat(alt);
    const p = parseFloat(platelet);
    if (!a || !s || !l || !p || l <= 0 || p <= 0) return;
    const fib4 = (a * s) / (p * Math.sqrt(l));
    setAnimating(true);
    setTimeout(() => {
      setResult(fib4);
      setAnimating(false);
    }, 300);
  };

  const reset = () => {
    setAge(""); setAst(""); setAlt(""); setPlatelet("");
    setResult(null);
  };

  const allFilled = age && ast && alt && platelet;
  const risk = getRiskLevel(result);
  const cfg = risk ? riskConfig[risk] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            color: "#818cf8",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Non-invasive Hepatic Fibrosis Screening
          </div>
          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>FIB-4</h1>
          <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 8 }}>
            肝纖維化風險評估計算機
          </div>
          <div style={{
            marginTop: 16,
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 12,
            padding: "10px 18px",
            display: "inline-block",
            color: "#c7d2fe",
            fontSize: 13,
            fontStyle: "italic",
          }}>
            FIB-4 = (年齡 × AST) ÷ (血小板 × √ALT)
          </div>
        </div>

        {/* Input Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 28,
          marginBottom: 20,
        }}>
          {[
            { label: "年齡", unit: "歲", value: age, setter: setAge, placeholder: "e.g. 55", hint: "Age (years)" },
            { label: "AST", unit: "U/L", value: ast, setter: setAst, placeholder: "e.g. 42", hint: "天門冬胺酸轉胺酶" },
            { label: "ALT", unit: "U/L", value: alt, setter: setAlt, placeholder: "e.g. 38", hint: "丙胺酸轉胺酶" },
            { label: "血小板", unit: "×10⁹/L", value: platelet, setter: setPlatelet, placeholder: "e.g. 180", hint: "Platelet count" },
          ].map(({ label, unit, value, setter, placeholder, hint }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>
                  {label} <span style={{ color: "#64748b", fontWeight: 400, fontSize: 12 }}>({unit})</span>
                </label>
                <span style={{ color: "#475569", fontSize: 11 }}>{hint}</span>
              </div>
              <input
                type="number"
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: value ? "1.5px solid rgba(99,102,241,0.6)" : "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "11px 14px",
                  color: "#f1f5f9",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "monospace",
                }}
              />
            </div>
          ))}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              onClick={calculate}
              disabled={!allFilled}
              style={{
                flex: 1,
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                background: allFilled
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(255,255,255,0.06)",
                color: allFilled ? "#fff" : "#475569",
                fontSize: 15,
                fontWeight: 700,
                cursor: allFilled ? "pointer" : "not-allowed",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
            >
              計算 Calculate
            </button>
            <button
              onClick={reset}
              style={{
                padding: "13px 18px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#64748b",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              清除
            </button>
          </div>
        </div>

        {/* Result */}
        {result !== null && cfg && (
          <div style={{
            background: cfg.bg,
            border: `1.5px solid ${cfg.border}`,
            borderRadius: 20,
            padding: 24,
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "all 0.35s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{cfg.emoji}</span>
              <div>
                <div style={{ color: cfg.color, fontWeight: 700, fontSize: 15 }}>{cfg.label}</div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{cfg.fib} ／ {cfg.lsm}</div>
              </div>
            </div>
            <div style={{
              textAlign: "center",
              margin: "16px 0",
              padding: "14px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 12,
            }}>
              <div style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.1em", marginBottom: 4 }}>FIB-4 INDEX</div>
              <div style={{ color: cfg.color, fontSize: 44, fontWeight: 700, lineHeight: 1, fontFamily: "monospace" }}>
                {result.toFixed(2)}
              </div>
            </div>
            <div style={{
              background: "rgba(0,0,0,0.15)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#e2e8f0",
              fontSize: 14,
              lineHeight: 1.5,
            }}>
              📋 <strong>建議：</strong>{cfg.action}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 16, color: "#334155", fontSize: 11 }}>
          翻譯自 Hepatol Commun. 2024 Oct 30;8(11):e0571
        </div>
      </div>
    </div>
  );
}
