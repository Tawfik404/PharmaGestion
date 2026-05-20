import './StatsCard.css'

export function StatsCard({ icon, label, value, change, color = 'blue' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
        {change && <div className={`stat-change ${change > 0 ? 'up' : 'down'}`}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}% ce mois</div>}
      </div>
    </div>
  )
}

export function StatsGrid({ children }) {
  return <div className="stats-grid">{children}</div>
}
