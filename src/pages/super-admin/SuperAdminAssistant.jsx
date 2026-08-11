import { useState, useEffect, useRef } from 'react';
import {
  sendRagChat,
  sendRagChatStream,
} from '../../api/aiService';

function ChatBubble({ role, text, sources }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1"
          style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" fill="white" opacity="0.9" />
            <circle cx="12" cy="12" r="2" fill="white" />
          </svg>
        </div>
      )}
      <div style={{ maxWidth: '72%' }}>
        <div
          className="px-4 py-3 rounded-2xl"
          style={
            isUser
              ? { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: 'white', borderBottomRightRadius: '4px' }
              : { background: 'rgba(255,255,255,0.05)', color: '#E2E8F0', borderBottomLeftRadius: '4px', border: '1px solid rgba(255,255,255,0.07)' }
          }
        >
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{text}</p>
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sources.map((src, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(56,189,248,0.1)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.2)' }}
              >
                📄 {src.title || src.source || `Source ${i + 1}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuperAdminAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m your Navi back-office assistant. Ask me anything about platform performance, store data, or AI configurations.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [useStream, setUseStream] = useState(true);
  const [storeId, setStoreId] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    const payload = {
      message: text,
      store_id: storeId || localStorage.getItem('currentStoreId') || localStorage.getItem('storeId') || null,
      organization_id: localStorage.getItem('organizationId') || localStorage.getItem('orgId') || null,
      conversation_id: null,
      customer_id: null,
      model: null,
      temperature: 0.3,
      max_tokens: 1024,
      top_k: 5,
      score_threshold: 0,
      use_hybrid: false,
      use_mmr: false,
      rerank: false,
      language: null,
      knowledge_scope: null,
      stream: useStream,
    };

    if (useStream) {
      setStreaming(true);
      let accum = '';
      setMessages((prev) => [...prev, { role: 'assistant', text: '▌', sources: [] }]);
      try {
        const res = await sendRagChatStream(payload);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // SSE lines: "data: ..." 
          chunk.split('\n').forEach((line) => {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                accum += parsed.chunk || parsed.text || parsed.content || '';
              } catch {
                accum += line.slice(6);
              }
            }
          });
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', text: accum + '▌', sources: [] };
            return copy;
          });
        }
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', text: accum || '(No response)', sources: [] };
          return copy;
        });
      } catch (err) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', text: `Error: ${err.message || 'Connection failed'}`, sources: [] };
          return copy;
        });
      }
      setStreaming(false);
    } else {
      try {
        const data = await sendRagChat(payload);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data?.answer || data?.response || data?.text || JSON.stringify(data), sources: data?.sources || data?.citations || [] },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `Error: ${err.message || 'Failed to get response.'}`, sources: [] },
        ]);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', padding: '1.5rem', gap: '1rem' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Navi Back-office Assistant</h2>
          <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '4px' }}>Powered by RAG · GPT-level context over your platform data</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="Filter by store_id (optional)"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(71,85,105,0.4)',
              borderRadius: '8px', padding: '0.4rem 0.75rem', color: '#CBD5E1',
              fontSize: '0.8rem', width: '200px', outline: 'none',
            }}
          />
          <button
            onClick={() => setUseStream((v) => !v)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              background: useStream ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.05)',
              border: useStream ? '1px solid rgba(37,99,235,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: useStream ? '#38BDF8' : '#64748B',
            }}
          >
            {useStream ? '⚡ Streaming' : '📄 Batch'}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} sources={m.sources} />
        ))}
        {loading && !streaming && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}>
              <span style={{ color: 'white', fontSize: '0.7rem' }}>N</span>
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="flex items-end gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about platform data, stores, AI models... (Enter to send)"
          rows={2}
          style={{
            flex: 1, resize: 'none', background: 'transparent', border: 'none',
            color: '#E2E8F0', fontSize: '0.9rem', outline: 'none', lineHeight: 1.6,
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            width: '40px', height: '40px', borderRadius: '10px', border: 'none',
            background: loading || !input.trim() ? 'rgba(37,99,235,0.2)' : 'linear-gradient(135deg, #2563EB, #38BDF8)',
            color: 'white', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>send</span>
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
