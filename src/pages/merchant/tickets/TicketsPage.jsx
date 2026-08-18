import { useEffect, useMemo, useState } from 'react';
import { Ticket, TrendingUp, Star } from 'lucide-react';
import { ticketsApi } from '../../../api/integrationApi';
import { getUserErrorMessage } from '../../../utils/errorMessage';
import TicketList from './TicketList';
import TicketDetailPanel from './TicketDetailPanel';

const titleCase = (value = '') => value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : 'Unknown';

const mapTicket = (ticket) => {
  const customer = ticket.customer || {};
  const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.email || 'Customer';
  const recentOrders = (ticket.recent_orders || []).map((order) => ({
    id: order.id,
    date: order.created_at ? new Date(order.created_at).toLocaleDateString() : '—',
    amount: `${order.currency || ''} ${Number(order.total_price || 0).toFixed(2)}`.trim(),
    status: titleCase(order.financial_status),
  }));
  const messages = (ticket.conversation?.recent_messages || []).map((message) => ({
    text: message.content || message.text || String(message),
    sender: message.sender_name || message.role || customerName,
    time: message.created_at ? new Date(message.created_at).toLocaleString() : '',
  }));
  return {
    ...ticket,
    id: ticket.ticket_id || ticket.id,
    code: ticket.ticket_id || ticket.id,
    priority: titleCase(ticket.priority),
    title: titleCase(ticket.category || 'Support request'),
    preview: ticket.summary || 'No summary available.',
    sentiment: titleCase(ticket.sentiment),
    customerName,
    customerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=4F46E5&color=fff`,
    customerSince: ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—',
    tier: 'Customer',
    lifetimeValue: '—',
    timeAgo: ticket.updated_at ? new Date(ticket.updated_at).toLocaleString() : '',
    unassigned: !ticket.customer_id,
    aiSuggestion: ticket.suggested_response || 'No AI suggestion is available for this ticket.',
    matchPercentage: null,
    recentOrders,
    messages,
  };
};

export default function TicketsPage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const [tickets, setTickets] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [loading, setLoading] = useState(Boolean(storeId));
  const [error, setError] = useState(storeId ? '' : 'Select a store before viewing tickets.');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [ticketAction, setTicketAction] = useState('');

  useEffect(() => {
    if (!storeId) return;
    let mounted = true;
    Promise.all([ticketsApi.list({ storeId }), ticketsApi.getMetrics(storeId)])
      .then(([ticketResponse, metricResponse]) => {
        if (!mounted) return;
        const mappedTickets = (ticketResponse.data?.items || []).map(mapTicket);
        setTickets(mappedTickets);
        setMetrics(metricResponse.data);
        setActiveTicketId(mappedTickets[0]?.id || null);
      })
      .catch(() => mounted && setError('Tickets could not be loaded.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [storeId]);

  const activeTicket = useMemo(() => tickets.find((ticket) => ticket.id === activeTicketId), [tickets, activeTicketId]);
  const resolutionRate = metrics?.resolution_rate ?? 0;

  const updateTicketStatus = async (status) => {
    if (!activeTicket) return;
    setUpdatingStatus(true); setError('');
    try {
      const resolutionType = status === 'resolved' ? 'human' : status === 'closed' ? 'unresolved' : undefined;
      const { data } = await ticketsApi.updateStatus(activeTicket.id, status, resolutionType);
      setTickets((current) => current.map((ticket) => ticket.id === activeTicket.id ? mapTicket({ ...ticket, ...data, status }) : ticket));
    } catch (error) {
      setError(getUserErrorMessage(error, 'Ticket status could not be updated. Please try again.'));
    } finally { setUpdatingStatus(false); }
  };

  const sendSuggestedResponse = async () => {
    if (!activeTicket?.aiSuggestion) return;
    setTicketAction('sending'); setError('');
    try {
      await ticketsApi.addMessage(activeTicket.id, { sender: 'agent', content: activeTicket.aiSuggestion });
      const sentMessage = { text: activeTicket.aiSuggestion, sender: 'Navi AI', time: new Date().toLocaleString() };
      setTickets((current) => current.map((ticket) => ticket.id === activeTicket.id ? { ...ticket, messages: [...(ticket.messages || []), sentMessage] } : ticket));
    } catch (error) {
      setError(getUserErrorMessage(error, 'We could not send the suggested response. Please try again.'));
    } finally { setTicketAction(''); }
  };

  const resolveTicket = async () => {
    if (!activeTicket) return;
    setTicketAction('resolving'); setError('');
    try {
      const { data } = await ticketsApi.resolve(activeTicket.id, { resolutionType: 'human' });
      setTickets((current) => current.map((ticket) => ticket.id === activeTicket.id ? mapTicket({ ...ticket, ...data, status: 'resolved' }) : ticket));
    } catch (error) {
      setError(getUserErrorMessage(error, 'We could not resolve this ticket. Please try again.'));
    } finally { setTicketAction(''); }
  };

  const escalateTicket = async (priority) => {
    if (!activeTicket) return;
    setTicketAction('escalating'); setError('');
    try {
      const { data } = await ticketsApi.escalate(activeTicket.id, { priority, message: 'Escalated by the merchant.' });
      setTickets((current) => current.map((ticket) => ticket.id === activeTicket.id ? mapTicket({ ...ticket, ...data, priority, status: data?.status || 'in_progress' }) : ticket));
    } catch (error) {
      setError(getUserErrorMessage(error, 'We could not escalate this ticket. Please try again.'));
    } finally { setTicketAction(''); }
  };

  return <div className="p-6 space-y-6">
    {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-outline-variant/40 p-5 rounded-xl relative overflow-hidden shadow-sm"><p className="text-xs font-medium text-on-surface-variant">Total Tickets</p><div className="mt-2 flex items-end gap-2"><span className="text-3xl font-bold text-on-surface">{metrics?.total_tickets ?? 0}</span><span className="mb-1 flex items-center text-emerald-600 text-xs font-bold"><TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Live</span></div><Ticket className="absolute -right-3 -bottom-3 text-on-surface/5 w-24 h-24" /></div>
      <div className="bg-white border border-outline-variant/40 p-5 rounded-xl shadow-sm"><p className="text-xs font-medium text-on-surface-variant">Resolution Rate</p><div className="mt-2 flex items-end gap-2"><span className="text-3xl font-bold text-on-surface">{Number(resolutionRate).toFixed(1)}%</span><span className="mb-1 flex items-center text-emerald-600 text-xs font-bold"><TrendingUp className="w-3.5 h-3.5 mr-0.5" /> AI + Human</span></div></div>
      <div className="bg-white border border-outline-variant/40 p-5 rounded-xl shadow-sm flex justify-between items-center"><div><p className="text-xs font-medium text-on-surface-variant">AI Resolved</p><div className="mt-2 flex items-center gap-2"><span className="text-3xl font-bold text-on-surface">{metrics?.ai_resolved ?? 0}</span><div className="flex text-amber-400">{[...Array(5)].map((_, index) => <Star key={index} className="w-4 h-4 fill-amber-400" />)}</div></div></div><p className="text-xs text-on-surface-variant">Human: {metrics?.human_resolved ?? 0}</p></div>
    </div>
    {loading ? <div className="rounded-xl bg-white p-8 text-center text-sm text-on-surface-variant">Loading tickets…</div> : <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)]"><TicketList tickets={tickets} activeTicketId={activeTicketId} onSelectTicket={setActiveTicketId} /><TicketDetailPanel ticket={activeTicket} onStatusChange={updateTicketStatus} updatingStatus={updatingStatus} onSendSuggestedResponse={sendSuggestedResponse} onResolve={resolveTicket} onEscalate={escalateTicket} ticketAction={ticketAction} /></div>}
  </div>;
}
