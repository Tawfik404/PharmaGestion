import { useState } from 'react'
import './Table.css'

export default function DataTable({ columns, data, searchable = true, onRowClick, emptyText = 'Aucune donnée disponible' }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = data.filter(row => {
    if (!search) return true
    return columns.some(col => {
      const val = col.accessor ? col.accessor(row) : row[col.key]
      return String(val || '').toLowerCase().includes(search.toLowerCase())
    })
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="table-container">
      {searchable && (
        <div className="table-toolbar">
          <div className="table-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{emptyText}</td></tr>
          ) : paged.map((row, i) => (
            <tr key={i} onClick={() => onRowClick?.(row)} style={onRowClick ? { cursor: 'pointer' } : {}}>
              {columns.map((col, j) => (
                <td key={j}>{col.render ? col.render(row) : (col.accessor ? col.accessor(row) : row[col.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <span>{filtered.length} résultat(s)</span>
        {totalPages > 1 && (
          <div className="table-pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        )}
      </div>
    </div>
  )
}
