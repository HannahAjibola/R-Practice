import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-amber-500/60" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}
