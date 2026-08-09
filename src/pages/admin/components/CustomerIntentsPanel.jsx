function CustomerIntentsPanel({ intents }) {
  return (
    <div className="admin-glass-card rounded-xl p-6">
      <h3 className="font-outfit text-xl font-medium mb-6">Top Customer Intents</h3>
      <div className="space-y-6">
        {intents.map((intent) => (
          <div key={intent.label} className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>{intent.label}</span>
              <span>{intent.value}%</span>
            </div>
            <div className="h-2 w-full bg-[#eff4ff] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${intent.barClass ?? 'bg-primary'}`}
                style={{ width: `${intent.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerIntentsPanel;
