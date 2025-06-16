import { useState } from 'react';
import { Copy, Check } from './Icons';
import { Theme } from '../styles/themes';

interface CopyCodeButtonProps {
  code: string;
  theme: Theme;
}

export default function CopyCodeButton({ code, theme }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`absolute top-3 right-3 p-2 rounded-md ${theme.card} ${theme.border} border opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 z-10`}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
} 