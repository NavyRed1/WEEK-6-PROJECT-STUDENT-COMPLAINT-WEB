import type { ReportCategory, ReportStatus, SortOption } from '../types/report'
import { CATEGORY_LABELS, STATUS_LABELS } from '../types/report'

interface Props {
  statusFilter: ReportStatus | 'all'
  categoryFilter: ReportCategory | 'all'
  sortBy: SortOption
  onStatusChange: (v: ReportStatus | 'all') => void
  onCategoryChange: (v: ReportCategory | 'all') => void
  onSortChange: (v: SortOption) => void
}

export default function FilterPanel({
  statusFilter,
  categoryFilter,
  sortBy,
  onStatusChange,
  onCategoryChange,
  onSortChange,
}: Props) {
  return (
    <div className="card-surface p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex-1">
        <label className="label-text" htmlFor="status-filter">
          Status
        </label>
        <select
          id="status-filter"
          className="input-field"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as ReportStatus | 'all')}
        >
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABELS) as ReportStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="label-text" htmlFor="category-filter">
          Category
        </label>
        <select
          id="category-filter"
          className="input-field"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as ReportCategory | 'all')}
        >
          <option value="all">All categories</option>
          {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="label-text" htmlFor="sort-by">
          Sort by
        </label>
        <select
          id="sort-by"
          className="input-field"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  )
}
