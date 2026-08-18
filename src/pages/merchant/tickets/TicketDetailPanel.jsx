import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Sparkles, Send, FileText } from 'lucide-react';

export default function TicketDetailPanel({ ticket, onStatusChange, updatingStatus, onSendSuggestedResponse, onResolve, onEscalate, ticketAction }) {
  const [escalationPriority, setEscalationPriority] = useState('high');

  if (!ticket) {
    return (
      <div className="hidden lg:flex lg:col-span-7 items-center justify-center bg-white border border-outline-variant/40 rounded-xl p-8 text-on-surface-variant">
        Select a ticket to view its details.
      </div>
    );
  }

  const sentimentColor = {
    Negative: 'bg-red-50 text-red-700 border-red-200',
    Positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  }[ticket.sentiment] || 'bg-slate-100 text-slate-700 border-slate-200';

  const priorityColor = {
    Urgent: 'bg-red-100 text-red-800',
    High: 'bg-amber-100 text-amber-800',
    Medium: 'bg-blue-100 text-blue-800',
    Low: 'bg-slate-100 text-slate-700',
  }[ticket.priority] || 'bg-slate-100 text-slate-700';

  const rawSuggested = ticket.suggested_response || ticket.suggestedResponse || ticket.ai_suggestion || ticket.aiSuggestion;
  const suggestedReply = (typeof rawSuggested === 'string' && rawSuggested.trim() && rawSuggested !== 'No AI suggestion is available for this ticket.')
    ? rawSuggested.trim()
    : (ticket.suggested_response || ticket.suggestedResponse || '');
  const rawMsgList = (Array.isArray(ticket.messages) && ticket.messages.length)
    ? ticket.messages
    : (ticket.conversation?.recent_messages || []);

  const chatMessages = (Array.isArray(rawMsgList) ? rawMsgList : []).map((msg) => {
    if (typeof msg === 'string') return { text: msg, sender: 'customer', time: '' };
    return {
      text: msg.content || msg.text || msg.message || String(msg || ''),
      sender: msg.sender || msg.sender_name || msg.role || 'customer',
      time: msg.created_at || msg.createdAt ? new Date(msg.created_at || msg.createdAt).toLocaleString() : '',
    };
  });

  return (
    <div className="hidden lg:flex lg:col-span-7 flex-col gap-4 overflow-y-auto pr-1">
      {/* 1. Ticket Overview & Metadata Card */}
      <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              #{ticket.code || ticket.id}
            </span>
            <h3 className="text-base font-bold text-on-surface mt-1.5">{ticket.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sentimentColor}`}>
              {ticket.sentiment || 'Neutral'}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityColor}`}>
              {ticket.priority || 'Low'}
            </span>
            {ticket.resolution_type && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 capitalize">
                {ticket.resolution_type}
              </span>
            )}
          </div>
        </div>

        {/* Response Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Category</p>
            <p className="font-semibold text-slate-800 truncate">{ticket.category || 'General'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Analyzed At</p>
            <p className="font-semibold text-slate-800">{ticket.analyzed_at ? new Date(ticket.analyzed_at).toLocaleString() : '—'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Assigned To</p>
            <p className="font-semibold text-slate-800">{ticket.assigned_to || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Resolution Type</p>
            <p className="font-semibold text-slate-800 capitalize">{ticket.resolution_type || 'unresolved'}</p>
          </div>
        </div>

        {/* Customer Context */}
        <div className="flex items-center gap-4 pt-2 border-t border-outline-variant/30">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#dbe1ff] shrink-0">
            <img src={ticket.customerAvatar} alt={ticket.customerName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-on-surface truncate">{ticket.customerName}</h4>
            <p className="text-xs text-on-surface-variant truncate">
              {ticket.customer?.email ? `${ticket.customer.email} • ` : ''}
              {ticket.customer?.phone ? `${ticket.customer.phone} • ` : ''}
              Since {ticket.customerSince}
            </p>
          </div>
          {ticket.customer_id && (
            <div className="text-right text-xs">
              <p className="text-[10px] text-outline uppercase font-bold">Customer ID</p>
              <p className="font-mono text-slate-600 truncate max-w-[120px]">{ticket.customer_id}</p>
            </div>
          )}
        </div>

        {/* Ticket Status Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/30 pt-3">
          <span className="text-xs font-bold uppercase text-outline">Ticket status</span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <select
              value={ticket.status || 'open'}
              onChange={(event) => onStatusChange(event.target.value)}
              disabled={updatingStatus || Boolean(ticketAction)}
              className="rounded-lg border border-outline-variant/50 bg-white px-3 py-1.5 text-xs font-bold text-on-surface disabled:opacity-50"
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button
              type="button"
              onClick={onResolve}
              disabled={Boolean(ticketAction) || ticket.status === 'resolved'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ticketAction === 'resolving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              {ticketAction === 'resolving' ? 'Resolving…' : 'Resolve'}
            </button>
          </div>
        </div>

        {/* Escalate Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5">
          <div>
            <p className="text-xs font-bold text-amber-900">Need human follow-up?</p>
            <p className="text-[11px] text-amber-700">Escalate this ticket to your support workflow.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={escalationPriority}
              onChange={(event) => setEscalationPriority(event.target.value)}
              disabled={Boolean(ticketAction)}
              className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-xs font-semibold text-amber-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              type="button"
              onClick={() => onEscalate(escalationPriority)}
              disabled={Boolean(ticketAction)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500 bg-white px-3 py-1.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ticketAction === 'escalating' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {ticketAction === 'escalating' ? 'Escalating…' : 'Escalate'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI Problem Summary */}
      {ticket.summary && (
        <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase text-indigo-900 tracking-wider">AI Issue Summary</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
            {ticket.summary}
          </p>
        </div>
      )}

      {/* 3. AI Suggested Response */}
      <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary fill-primary" />
          <h3 className="text-sm font-bold text-on-surface">AI Suggested Response</h3>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-primary/20 mb-4 relative">
          <p className="text-xs text-on-surface leading-relaxed font-medium">"{suggestedReply || 'No AI suggestion available for this ticket.'}"</p>
          {typeof ticket.matchPercentage === 'number' && (
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {ticket.matchPercentage}% Match
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-xs text-on-surface-variant">This sends the suggested reply directly to the customer conversation.</p>
          <button
            type="button"
            onClick={onSendSuggestedResponse}
            disabled={Boolean(ticketAction) || !suggestedReply}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-on-primary-fixed-variant hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ticketAction === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {ticketAction === 'sending' ? 'Sending reply…' : 'Send AI reply to customer'}
          </button>
        </div>
      </div>

      {/* 4. Conversation History */}
      <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-on-surface">Conversation History</h3>
          <span className="text-xs text-outline">{chatMessages.length} Messages</span>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {!chatMessages.length && (
            <p className="text-xs text-on-surface-variant py-2">No messages recorded for this ticket yet.</p>
          )}
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col items-start max-w-[85%] ${msg.sender === 'system' ? 'w-full max-w-none items-center' : ''}`}>
              {msg.sender === 'system' ? (
                <div className="w-full text-center my-1">
                  <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full">
                    ⚠️ {msg.text} {msg.time ? `• ${msg.time}` : ''}
                  </span>
                </div>
              ) : (
                <>
                  <div className={`p-3 rounded-2xl ${msg.sender === 'customer' ? 'bg-surface-container-low rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-outline mt-1 ml-1 capitalize">{msg.sender} • {msg.time}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
