import { useMemo, useState } from 'react'
import { Loader2, PlusCircle, X } from 'lucide-react'
import type { ReportCategory, ReportStatus, SortOption } from '../types/report'
import { useReports } from '../hooks/useReports'
import ReportCard from '../components/ReportCard'
import ReportForm from '../components/ReportForm'
import FilterPanel from '../components/FilterPanel'
import SearchBar from '../components/SearchBar'
import CampusMap from '../components/CampusMap'

const STATUS_ORDER: Record<ReportStatus, number> = { pending: 0, in_progress: 1, completed: 2 }

export default function Dashboard({ userId }: { userId: string | undefined }) {
  const { reports, loading, error, createReport } = useReports(userId)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = reports.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    })

    return list
  }, [reports, search, statusFilter, categoryFilter, sortBy])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Facility Reports</h1>
          <p className="text-sm text-ethereal-500 dark:text-ethereal-400">
            Browse, search, and track campus facility issues.
          </p>
        </div>
        <button className="btn-primary w-fit" onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={16} /> : <PlusCircle size={16} />}
          {showForm ? 'Close' : 'New Report'}
        </button>
      </div>

      {showForm && (
        <ReportForm
          onSubmit={async (input) => {
            await createReport(input)
          }}
          onDone={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            sortBy={sortBy}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryFilter}
            onSortChange={setSortBy}
          />
        </div>
        <CampusMap />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-ethereal-500">
          <Loader2 className="animate-spin" size={18} /> Loading reports...
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-ethereal-500 dark:text-ethereal-400">
          No reports match your filters yet.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
