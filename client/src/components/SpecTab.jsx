import React, { useState, useEffect } from 'react';
import { generateSpec } from '../services/api';
import { Copy, Check, Code, FileSpreadsheet, Download } from 'lucide-react';

export default function SpecTab() {
  const [title, setTitle] = useState('Custom S/4HANA FI Revenue & Accounts Receivable Aging Report');
  const [type, setType] = useState('Report');
  const [tcode, setTcode] = useState('ZFI_REV_AGING');
  const [tables, setTables] = useState('ACDOCA, BKPF, BSEG, VBRK, KNA1');
  const [includeAbap, setIncludeAbap] = useState(true);
  const [includeTestMatrix, setIncludeTestMatrix] = useState(true);

  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchPreview = async () => {
    try {
      const res = await generateSpec({ title, type, tcode, tables });
      let finalMd = res.markdown;

      if (includeAbap) {
        finalMd += `\n\n4. ABAP PSEUDO-CODE / CDS VIEW:\n\`\`\`abap\nSELECT a~rbukrs, a~belnr, a~gjahr, a~racct, a~hsl\n  FROM acdoca AS a\n  INNER JOIN vbrk AS v ON v~vbeln = a~awkey\n  WHERE a~rldnr = '0L'\n    AND a~gjahr = @p_gjahr\n  INTO TABLE @DATA(lt_revenue).\n\`\`\``;
      }

      if (includeTestMatrix) {
        finalMd += `\n\n5. UNIT TEST MATRIX:\n- Scenario 01: Standard SD Invoice release (MVT 101 -> Billing Doc VF01 -> ACDOCA posting).\n- Scenario 02: Foreign currency invoice with tax key MWS.\n- Scenario 03: Cancellation of billing doc via VF11 (Reversal ACDOCA entry).`;
      }

      setMarkdown(finalMd);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [title, type, tcode, tables, includeAbap, includeTestMatrix]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tcode || 'RICEF_SPEC'}_Functional_Specification.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>📝 RICEF Specification Studio</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate Enterprise Functional & Technical Specs for ABAP Developers</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={handleDownload} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-color)' }}>
            <Download size={16} />
            <span>Download .MD</span>
          </button>
          <button className="btn" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Specification'}</span>
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Specification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RICEF Category</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
              <option value="Report">Report (ALV Grid Display / CDS View)</option>
              <option value="Enhancement">Enhancement (BAdI / User Exit / Implicit)</option>
              <option value="Interface">Interface (REST API / OData / IDoc)</option>
              <option value="Form">Form (Adobe Interactive / SmartForm)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Custom T-Code</label>
            <input
              type="text"
              value={tcode}
              onChange={(e) => setTcode(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Source Database Tables</label>
            <input
              type="text"
              value={tables}
              onChange={(e) => setTables(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeAbap}
                onChange={(e) => setIncludeAbap(e.target.checked)}
              />
              Include ABAP Pseudo-code / CDS View logic
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeTestMatrix}
                onChange={(e) => setIncludeTestMatrix(e.target.checked)}
              />
              Include Unit Test Cases Matrix
            </label>
          </div>
        </div>

        <div style={{ background: '#060911', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '550px', overflowY: 'auto' }}>
          <pre>{markdown}</pre>
        </div>
      </div>
    </div>
  );
}
