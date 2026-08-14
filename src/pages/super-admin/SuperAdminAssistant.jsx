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
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1 admin-chat-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" fill="white" opacity="0.9" />
            <circle cx="12" cy="12" r="2" fill="white" />
          </svg>
        </div>
      )}
      <div className="max-w-[72%]">
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'admin-chat-user' : 'admin-chat-assistant'}`}>
          <p className="m-0 text-sm leading-6 whitespace-pre-wrap">{text}</p>
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sources.map((src, i) => (
              <span
                key={i}
                className="admin-pill px-2 py-0.5 rounded-full text-xs"
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
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 gap-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white m-0">Navi Back-office Assistant</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">Powered by RAG · GPT-level context over your platform data</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="Filter by store_id (optional)"
            className="admin-chat-input rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white w-52 outline-none"
          />
          <button
            onClick={() => setUseStream((v) => !v)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${useStream ? 'bg-sky-100 border border-sky-200 text-sky-600 dark:bg-sky-900/20 dark:border-sky-500/30 dark:text-sky-300' : 'bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
          >
            {useStream ? '⚡ Streaming' : '📄 Batch'}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-2xl p-6 admin-chat-area">
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
      <div className="flex items-end gap-3 p-4 rounded-2xl admin-chat-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about platform data, stores, AI models... (Enter to send)"
          rows={2}
          className="admin-chat-composer-input flex-1 resize-none rounded-2xl px-3 py-3 text-sm outline-none leading-6"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
          style={{ background: loading || !input.trim() ? 'rgba(37,99,235,0.2)' : 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
        >
          <span className="material-symbols-outlined text-lg">send</span>
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
