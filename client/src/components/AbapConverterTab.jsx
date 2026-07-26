import React, { useState } from 'react';
import { Code, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

export default function AbapConverterTab() {
  const [legacyCode, setLegacyCode] = useState(
`" Legacy ECC 6.0 ABAP Code (Reading BSEG / BSIS)
SELECT * FROM bseg 
  INTO TABLE @DATA(lt_bseg)
  WHERE bukrs = '1000'
    AND gjahr = '2025'.`
  );

  const [convertedCode, setConvertedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    const s4Code =
`" S/4HANA Optimized ABAP OpenSQL (Targeting ACDOCA Universal Journal)
" Benefit: Reads from single column-store repository ACDOCA instead of cluster BSEG.

SELECT rbukrs AS company_code,
       belnr  AS document_no,
       gjahr  AS fiscal_year,
       docln  AS line_item,
       racct  AS gl_account,
       hsl    AS amount_local_curr,
       prctr  AS profit_center
  FROM acdoca
  WHERE rldnr  = '0L'       " Leading Ledger
    AND rbukrs = '1000'     " Company Code
    AND gjahr  = '2026'     " Fiscal Year
  INTO TABLE @DATA(lt_acdoca).

" Performance Optimization Note:
" 1. Avoid SELECT * on ACDOCA (300+ fields); explicitly list needed columns.
" 2. Always filter by RLDNR = '0L' to query Leading Ledger items.`;

    setConvertedCode(s4Code);
  };

  const handleCopy = () => {
    if (!convertedCode) return;
    navigator.clipboard.writeText(convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Code className="color-cyan" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>
          🛠️ Legacy ABAP to S/4HANA ACDOCA Code Converter
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Convert legacy ECC BSEG/COEP code into high-performance S/4HANA ABAP OpenSQL & CDS Views targeting ACDOCA.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-amber)' }}>1. Legacy ECC 6.0 ABAP / SQL Code</h3>
          <textarea
            rows={10}
            value={legacyCode}
            onChange={(e) => setLegacyCode(e.target.value)}
            style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
          <button className="btn" onClick={handleConvert}>
            <Sparkles size={16} />
            <span>Convert to S/4HANA ACDOCA Code</span>
          </button>
        </div>

        <div style={{ background: '#060911', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-emerald)' }}>2. S/4HANA ACDOCA OpenSQL Output</h3>
            {convertedCode && (
              <button className="btn" onClick={handleCopy} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied ABAP!' : 'Copy Code'}</span>
              </button>
            )}
          </div>

          {convertedCode ? (
            <pre style={{ fontSize: '0.82rem', flex: 1, color: '#a7f3d0' }}>{convertedCode}</pre>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: '2rem' }}>
              Click "Convert to S/4HANA ACDOCA Code" to generate optimized ABAP.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
