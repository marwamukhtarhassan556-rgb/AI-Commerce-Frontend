import { Sparkles, Edit, RotateCcw, Send } from 'lucide-react';

export default function TicketDetailPanel({ ticket, onStatusChange, updatingStatus }) {
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

        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3">
          <span className="text-xs font-bold uppercase text-outline">Ticket status</span>
          <select value={ticket.status || 'open'} onChange={(event) => onStatusChange(event.target.value)} disabled={updatingStatus} className="rounded-lg border border-outline-variant/50 bg-white px-3 py-1.5 text-xs font-bold text-on-surface disabled:opacity-50">
            <option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
          </select>
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

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant/50 rounded-lg hover:bg-surface-container-low transition-colors">
              <Edit className="w-4 h-4 text-on-surface-variant" />
            </button>
            <button className="p-2 border border-outline-variant/50 rounded-lg hover:bg-surface-container-low transition-colors">
              <RotateCcw className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 text-xs">
              Draft Internal Note
            </button>
            <button className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:shadow-md transition-all text-xs flex items-center gap-1.5">
              Approve & Send <Send className="w-3.5 h-3.5" />
            </button>
          </div>
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
