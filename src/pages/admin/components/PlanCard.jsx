import { Link } from 'react-router-dom';

function PlanCard({ plan, onDelete }) {
  return (
    <div
      className={`admin-glass-card rounded-2xl p-8 flex flex-col transition-all group ${
        plan.popular
          ? 'border-primary/40 relative shadow-xl shadow-primary/5'
          : 'hover:border-primary/30'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className={`font-outfit text-xl font-medium ${plan.popular ? 'text-primary' : 'text-on-surface'}`}>
            {plan.name}
          </h4>
          <p className="text-on-surface-variant text-sm">{plan.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.userBadgeClass}`}>
            {plan.users.toLocaleString()} Users
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/admin/plans/${plan.id}/edit`}
              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              title="Edit"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </Link>
            <button
              type="button"
              onClick={() => onDelete?.(plan.id)}
              className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors"
              title="Delete"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
            <Link
              to={`/admin/plans/${plan.id}/edit`}
              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              title="View Details"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <span className="font-outfit text-[48px] font-semibold text-on-surface leading-none">${plan.price}</span>
        <span className="text-on-surface-variant">/mo</span>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className={`flex items-center gap-3 text-sm ${
              feature.included ? 'text-on-surface' : 'text-on-surface-variant/50 line-through'
            }`}
          >
            <span
              className={`material-symbols-outlined text-lg ${
                feature.included ? 'text-secondary' : ''
              }`}
            >
              {feature.included ? 'check_circle' : 'cancel'}
            </span>
            {feature.label}
          </li>
        ))}
      </ul>

      <Link
        to={`/admin/plans/${plan.id}/edit`}
        className={`w-full py-3 font-semibold text-sm rounded-xl text-center transition-all active:scale-95 ${
          plan.popular
            ? 'bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/30'
            : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        Edit Plan
      </Link>
    </div>
  );
}

export default PlanCard;
