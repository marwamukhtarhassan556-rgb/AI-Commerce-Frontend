import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Sparkles, Send } from 'lucide-react';

export default function TicketDetailPanel({ ticket, onStatusChange, updatingStatus, onSendSuggestedResponse, onResolve, onEscalate, ticketAction }) {
  const [escalationPriority, setEscalationPriority] = useState('high');
  if (!ticket) {
    return (
      <div className="hidden lg:flex lg:col-span-7 items-center justify-center bg-white border border-outline-variant/40 rounded-xl p-8 text-on-surface-variant">
        Select a ticket to view its details.
      </div>
    );
  }

  return (
    <div className="hidden lg:flex lg:col-span-7 flex-col gap-4 overflow-y-auto pr-1">
      {/* 1. Customer Context Card */}
      <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#dbe1ff]">
            <img src={ticket.customerAvatar} alt={ticket.customerName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-on-surface">{ticket.customerName}</h3>
            <p className="text-xs text-on-surface-variant">
              Customer since {ticket.customerSince} • <span className="text-primary font-bold">{ticket.tier}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-outline uppercase font-bold tracking-tight">Lifetime Value</p>
            <p className="text-lg font-bold text-emerald-600">{ticket.lifetimeValue}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/30 pt-3">
          <span className="text-xs font-bold uppercase text-outline">Ticket status</span>
          <div className="flex flex-wrap items-center justify-end gap-2"><select value={ticket.status || 'open'} onChange={(event) => onStatusChange(event.target.value)} disabled={updatingStatus || Boolean(ticketAction)} className="rounded-lg border border-outline-variant/50 bg-white px-3 py-1.5 text-xs font-bold text-on-surface disabled:opacity-50"><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select><button type="button" onClick={onResolve} disabled={Boolean(ticketAction) || ticket.status === 'resolved'} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{ticketAction === 'resolving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{ticketAction === 'resolving' ? 'Resolving…' : 'Resolve'}</button></div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5">
          <div><p className="text-xs font-bold text-amber-900">Need human follow-up?</p><p className="text-[11px] text-amber-700">Escalate this ticket to your support workflow.</p></div>
          <div className="flex items-center gap-2"><select value={escalationPriority} onChange={(event) => setEscalationPriority(event.target.value)} disabled={Boolean(ticketAction)} className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-xs font-semibold text-amber-900"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select><button type="button" onClick={() => onEscalate(escalationPriority)} disabled={Boolean(ticketAction)} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500 bg-white px-3 py-1.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50">{ticketAction === 'escalating' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}{ticketAction === 'escalating' ? 'Escalating…' : 'Escalate'}</button></div>
        </div>

        <div className="border-t border-outline-variant/30 pt-3">
          <h5 className="text-xs font-bold mb-2 uppercase text-outline">Recent Orders</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant font-bold">
                <tr>
                  <th className="py-2 px-3 rounded-l-lg">Order ID</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {ticket.recentOrders?.map((order) => (
                  <tr key={order.id} className={order.status === 'Delivered' ? 'opacity-60' : ''}>
                    <td className="py-2.5 px-3 font-bold">{order.id}</td>
                    <td className="py-2.5 px-3">{order.date}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{order.amount}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        order.status === 'In Dispute' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. AI Suggested Response */}
      <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary fill-primary" />
          <h3 className="text-sm font-bold text-on-surface">AI Suggested Response</h3>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-primary/20 mb-4 relative">
          <p className="text-xs text-on-surface leading-relaxed">"{ticket.aiSuggestion}"</p>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {ticket.matchPercentage}% Match
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={onSendSuggestedResponse} disabled={Boolean(ticketAction) || !ticket.aiSuggestion} className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:shadow-md transition-all text-xs flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50">
            {ticketAction === 'sending' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}{ticketAction === 'sending' ? 'Sending…' : 'Approve & Send'}
          </button>
        </div>
      </div>

      {/* 3. Conversation History */}
      <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-on-surface">Conversation History</h3>
          <span className="text-xs text-outline">{ticket.messages?.length} Messages</span>
        </div>
        <div className="space-y-3">
          {ticket.messages?.map((msg, idx) => (
            <div key={idx} className="flex flex-col items-start max-w-[85%]">
              <div className="bg-surface-container-low p-3 rounded-2xl rounded-tl-none">
                <p className="text-xs text-on-surface">{msg.text}</p>
              </div>
              <span className="text-[10px] text-outline mt-1 ml-1">{msg.sender} • {msg.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
