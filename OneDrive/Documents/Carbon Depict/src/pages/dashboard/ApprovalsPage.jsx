/**
 * ApprovalsPage - Manager Approval Workflow
 *
 * Features:
 * - View pending data entries
 * - Approve/Reject entries with notes
 * - Filter by entry type and submitter
 * - Notification system for data entry clerks
 */
import { useState, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Filter,
  Search,
  AlertCircle,
  Eye
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { apiClient } from '../../utils/api'
import { formatDistance } from 'date-fns'
import clsx from 'clsx'

export default function ApprovalsPage() {
  const { user } = useAuth()
  const { showSuccess, showError, addNotification } = useAppState()

  const [pendingEntries, setPendingEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null) // 'approve' or 'reject'
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('pending')

  useEffect(() => {
    loadPendingEntries()
  }, [filterType, filterStatus])

  const loadPendingEntries = async () => {
    setLoading(true)
    try {
      // Fetch from multiple sources
      const [
        scope1Response,
        scope2Response,
        scope3Response,
        esgMetricsResponse,
        csrdResponse,
        materialityResponse
      ] = await Promise.all([
        apiClient.get('/api/esg/metrics?sourceType=scope1_emissions&approvalStatus=' + filterStatus),
        apiClient.get('/api/esg/metrics?sourceType=scope2_emissions&approvalStatus=' + filterStatus),
        apiClient.get('/api/scope3?approvalStatus=' + filterStatus),
        apiClient.get('/api/esg-metrics?approvalStatus=' + filterStatus),
        apiClient.get('/api/csrd?approvalStatus=' + filterStatus),
        apiClient.get('/api/materiality?approvalStatus=' + filterStatus)
      ])

      const allEntries = [
        ...(scope1Response.data?.data || []).map(item => ({ ...item, entryType: 'Scope 1 Emissions' })),
        ...(scope2Response.data?.data || []).map(item => ({ ...item, entryType: 'Scope 2 Emissions' })),
        ...(scope3Response.data?.data || []).map(item => ({ ...item, entryType: 'Scope 3 Emissions' })),
        ...(esgMetricsResponse.data?.data || []).map(item => ({ ...item, entryType: 'ESG Metrics' })),
        ...(csrdResponse.data?.data || []).map(item => ({ ...item, entryType: 'CSRD Data' })),
        ...(materialityResponse.data?.data || []).map(item => ({ ...item, entryType: 'Materiality Assessment' }))
      ]

      // Filter by type if not 'all'
      const filtered = filterType === 'all'
        ? allEntries
        : allEntries.filter(entry => entry.entryType.toLowerCase().includes(filterType.toLowerCase()))

      // Sort by newest first
      filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))

      setPendingEntries(filtered)
    } catch (error) {
      console.error('Error loading pending entries:', error)
      showError('Failed to load pending entries')
    } finally {
      setLoading(false)
    }
  }

  const openApprovalModal = (entry, type) => {
    setSelectedEntry(entry)
    setModalType(type)
    setNotes('')
    setShowModal(true)
  }

  const handleApprove = async () => {
    if (!selectedEntry) return

    try {
      const endpoint = getEndpointForEntry(selectedEntry)
      await apiClient.put(`${endpoint}/${selectedEntry._id}/approve`, {
        notes: notes.trim() || 'Approved by manager'
      })

      showSuccess('Entry approved successfully')

      // Send notification to data entry clerk
      await apiClient.post('/api/notifications', {
        recipientId: selectedEntry.createdBy?._id || selectedEntry.userId,
        type: 'approval',
        title: 'Data Entry Approved',
        message: `Your ${selectedEntry.entryType} submission has been approved.`,
        metadata: {
          entryId: selectedEntry._id,
          entryType: selectedEntry.entryType,
          notes: notes.trim()
        }
      })

      setShowModal(false)
      loadPendingEntries()
    } catch (error) {
      console.error('Error approving entry:', error)
      showError('Failed to approve entry')
    }
  }

  const handleReject = async () => {
    if (!selectedEntry) return
    if (!notes.trim()) {
      showError('Please provide a reason for rejection')
      return
    }

    try {
      const endpoint = getEndpointForEntry(selectedEntry)
      await apiClient.put(`${endpoint}/${selectedEntry._id}/reject`, {
        notes: notes.trim()
      })

      showSuccess('Entry rejected with feedback')

      // Send notification to data entry clerk
      await apiClient.post('/api/notifications', {
        recipientId: selectedEntry.createdBy?._id || selectedEntry.userId,
        type: 'rejection',
        title: 'Data Entry Needs Revision',
        message: `Your ${selectedEntry.entryType} submission needs revision.`,
        metadata: {
          entryId: selectedEntry._id,
          entryType: selectedEntry.entryType,
          reason: notes.trim(),
          action: {
            label: 'View and Edit',
            url: getEditUrlForEntry(selectedEntry)
          }
        }
      })

      setShowModal(false)
      loadPendingEntries()
    } catch (error) {
      console.error('Error rejecting entry:', error)
      showError('Failed to reject entry')
    }
  }

  const getEndpointForEntry = (entry) => {
    if (entry.entryType.includes('Scope 1')) return '/api/esg/metrics'
    if (entry.entryType.includes('Scope 2')) return '/api/esg/metrics'
    if (entry.entryType.includes('Scope 3')) return '/api/scope3'
    if (entry.entryType.includes('CSRD')) return '/api/csrd'
    if (entry.entryType.includes('Materiality')) return '/api/materiality'
    return '/api/esg-metrics'
  }

  const getEditUrlForEntry = (entry) => {
    if (entry.entryType.includes('Scope 1')) return '/dashboard/emissions/scope1'
    if (entry.entryType.includes('Scope 2')) return '/dashboard/emissions/scope2'
    if (entry.entryType.includes('Scope 3')) return '/dashboard/emissions/scope3'
    if (entry.entryType.includes('CSRD')) return '/dashboard/esg/csrd'
    if (entry.entryType.includes('Materiality')) return '/dashboard/esg/materiality'
    return '/dashboard/esg/data-entry'
  }

  const filteredEntries = pendingEntries.filter(entry => {
    const matchesSearch =
      entry.entryType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.createdBy?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.createdBy?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.createdBy?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Only show approval page if user is manager or admin
  if (user?.role !== 'manager' && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-greenly-gray mx-auto mb-4" />
          <h2 className="text-xl font-bold text-greenly-midnight mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-greenly-gray">
            Only managers and administrators can access the approvals page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-greenly-midnight">Data Approvals</h1>
        <p className="mt-2 text-lg text-greenly-slate">
          Review and approve data entries from your team
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-greenly-gray" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Statuses</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary"
            >
              <option value="all">All Types</option>
              <option value="scope 1">Scope 1</option>
              <option value="scope 2">Scope 2</option>
              <option value="scope 3">Scope 3</option>
              <option value="esg">ESG Metrics</option>
              <option value="csrd">CSRD</option>
              <option value="materiality">Materiality</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-xl shadow-sm border border-greenly-light">
        <div className="p-6 border-b border-greenly-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-greenly-midnight">
              {filterStatus === 'pending' ? 'Pending Entries' : `${filterStatus} Entries`}
            </h2>
            <span className="px-3 py-1 bg-greenly-primary/10 text-greenly-primary rounded-full text-sm font-semibold">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>

        <div className="divide-y divide-greenly-light">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-greenly-slate">
              Loading entries...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="h-12 w-12 text-greenly-gray mx-auto mb-3" />
              <p className="text-sm text-greenly-gray font-medium">No entries found</p>
              <p className="text-xs text-greenly-slate mt-1">
                {filterStatus === 'pending'
                  ? "You're all caught up!"
                  : `No ${filterStatus} entries to display`}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry._id}
                className="px-6 py-4 hover:bg-greenly-off-white transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-greenly-primary/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-greenly-primary" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-greenly-midnight">
                            {entry.entryType}
                          </h3>
                          <span className={clsx(
                            'px-2 py-0.5 rounded-full text-xs font-semibold',
                            entry.approvalStatus === 'pending' && 'bg-yellow-100 text-yellow-700',
                            entry.approvalStatus === 'approved' && 'bg-green-100 text-green-700',
                            entry.approvalStatus === 'rejected' && 'bg-red-100 text-red-700'
                          )}>
                            {entry.approvalStatus || 'Pending'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-greenly-slate mt-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {entry.createdBy?.firstName} {entry.createdBy?.lastName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistance(new Date(entry.createdAt || entry.updatedAt), new Date(), { addSuffix: true })}
                          </span>
                          {entry.reportingPeriod && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Period: {entry.reportingPeriod}
                            </span>
                          )}
                        </div>

                        {entry.notes && (
                          <div className="mt-2 p-2 bg-greenly-off-white rounded-lg border border-greenly-light">
                            <p className="text-xs text-greenly-slate">
                              <span className="font-semibold">Notes:</span> {entry.notes}
                            </p>
                          </div>
                        )}

                        {entry.approvedBy && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-greenly-slate">
                            {entry.approvalStatus === 'approved' ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            {entry.approvalStatus === 'approved' ? 'Approved' : 'Rejected'} by{' '}
                            {entry.approvedBy?.firstName} {entry.approvedBy?.lastName}{' '}
                            {entry.approvedAt && formatDistance(new Date(entry.approvedAt), new Date(), { addSuffix: true })}
                          </div>
                        )}
                      </div>

                      {entry.approvalStatus === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openApprovalModal(entry, 'approve')}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => openApprovalModal(entry, 'reject')}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval/Rejection Modal */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border-2 border-greenly-light">
            <div className={clsx(
              'p-6 border-b-2 border-greenly-light rounded-t-2xl text-white',
              modalType === 'approve' ? 'bg-green-600' : 'bg-red-600'
            )}>
              <div className="flex items-center gap-3">
                {modalType === 'approve' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                <h3 className="text-xl font-bold">
                  {modalType === 'approve' ? 'Approve' : 'Reject'} Entry
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-greenly-slate mb-2">
                  <span className="font-semibold">Entry Type:</span> {selectedEntry.entryType}
                </p>
                <p className="text-sm text-greenly-slate">
                  <span className="font-semibold">Submitted by:</span>{' '}
                  {selectedEntry.createdBy?.firstName} {selectedEntry.createdBy?.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-greenly-midnight mb-2">
                  {modalType === 'approve' ? 'Notes (optional)' : 'Reason for Rejection (required)'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    modalType === 'approve'
                      ? 'Add any notes for the submitter...'
                      : 'Explain what needs to be corrected or improved...'
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-greenly-light flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border-2 border-greenly-light text-greenly-midnight rounded-lg font-semibold hover:bg-greenly-off-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={modalType === 'approve' ? handleApprove : handleReject}
                className={clsx(
                  'px-4 py-2 rounded-lg font-semibold text-white transition-colors flex items-center gap-2',
                  modalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                )}
              >
                {modalType === 'approve' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Approve Entry
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Reject Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
