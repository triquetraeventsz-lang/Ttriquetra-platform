export function Table({ columns, rows, keyField = '_id', onRowClick, emptyMessage = 'Nothing here yet.' }) {
  if (!rows || rows.length === 0) {
    return <p className="rounded-xl border border-line bg-cream/50 p-8 text-center text-sm text-stone">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-cream">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-stone">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[keyField]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-line last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-paper' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
