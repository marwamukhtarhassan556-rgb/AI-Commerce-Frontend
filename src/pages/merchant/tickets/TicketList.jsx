import { useState } from 'react';
import { Filter, Frown, Smile, Meh } from 'lucide-react';

export default function TicketList({ tickets, activeTicketId, onSelectTicket }) {
  const [filter, setFilter] = useState('all');

  const filteredTickets = tickets.filter(t => {
    if (filter === 'unassigned') return t.unassigned;
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Urgent</span>;
      case 'Medium':
        return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Medium</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Low</span>;
    }
  };

  const getSentimentBadge = (sentiment) => {
    if (sentiment === 'Negative') {
      return (
        <div className="bg-red-100 text-red-800 px-2 py-0.5 rounded flex items-center gap-1 text-xs">
          <Frown className="w-3.5 h-3.5" /> Negative
        </div>
      );
    }
    if (sentiment === 'Positive') {
      return (
        <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded flex items-center gap-1 text-xs">
          <Smile className="w-3.5 h-3.5" /> Positive
        </div>
      );
    }
    return (
      <div className="bg-[#dee8ff] text-on-surface-variant px-2 py-0.5 rounded flex items-center gap-1 text-xs">
        <Meh className="w-3.5 h-3.5" /> Neutral
      </div>
    );
  };

  return (
    <div className="col-span-12 lg:col-span-5 flex flex-col bg-white border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm h-full">
      {/* Header Filters */}
      <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              filter === 'all'
                ? 'bg-white border-primary text-primary'
                : 'bg-white/50 border-transparent text-on-surface-variant hover:bg-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> All Tickets
          </button>
          <button
            onClick={() => setFilter('unassigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'unassigned'
                ? 'bg-white border border-primary text-primary'
                : 'bg-white/50 text-on-surface-variant hover:bg-white'
            }`}
          >
            Unassigned
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">
        {filteredTickets.map((t) => {
          const isActive = t.id === activeTicketId;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTicket(t.id)}
              className={`p-4 cursor-pointer transition-all ${
                isActive
                  ? 'bg-primary/5 border-l-4 border-l-primary'
                  : 'hover:bg-surface-container-low'
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-outline'}`}>
                  {t.code}
                </span>
                {getPriorityBadge(t.priority)}
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-1 truncate">{t.title}</h4>
              <p className="text-xs text-on-surface-variant line-clamp-1 mb-3">{t.preview}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getSentimentBadge(t.sentiment)}
                  <span className="text-xs text-on-surface-variant">{t.customerName}</span>
                </div>
                <span className="text-xs text-outline">{t.timeAgo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}