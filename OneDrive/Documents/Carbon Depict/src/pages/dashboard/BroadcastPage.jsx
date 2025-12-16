/**
 * BroadcastPage - System Owner Broadcast Notifications
 *
 * Allows admins/system owners to send broadcasts to all users
 */
import { useState } from 'react'
import { Send, Users, AlertCircle, CheckCircle, Radio } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { apiClient } from '../../utils/api'
import clsx from 'clsx'

export default function BroadcastPage() {
  const { user } = useAuth()
  const { showSuccess, showError } = useAppState()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [priority, setPriority] = useState('normal')
  const [sending, setSending] = useState(false)
  const [lastBroadcast, setLastBroadcast] = useState(null)

  const handleSend = async (e) => {
    e.preventDefault()

    if (!title.trim() || !message.trim()) {
      showError('Please fill in all fields')
      return
    }

    if (!confirm(`Are you sure you want to broadcast this message to all users in your organization?`)) {
      return
    }

    setSending(true)

    try {
      const response = await apiClient.post('/api/notifications/broadcast', {
        title: title.trim(),
        message: message.trim(),
        type,
        priority
      })

      setLastBroadcast({
        title,
        message,
        type,
        recipientCount: response.data?.recipientCount || 0,
        timestamp: new Date()
      })

      setTitle('')
      setMessage('')
      setType('info')
      setPriority('normal')

      showSuccess(`Broadcast sent to ${response.data?.recipientCount || 0} users!`)
    } catch (error) {
      console.error('Error sending broadcast:', error)
      showError('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  // Only admins can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-greenly-gray mx-auto mb-4" />
          <h2 className="text-xl font-bold text-greenly-midnight mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-greenly-gray">
            Only system administrators can access the broadcast page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-greenly-midnight flex items-center gap-3">
          <Radio className="h-10 w-10 text-greenly-primary" />
          Broadcast Notifications
        </h1>
        <p className="mt-2 text-lg text-greenly-slate">
          Send system-wide notifications to all users in your organization
        </p>
      </div>

      {/* Last Broadcast Success */}
      {lastBroadcast && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">
                Broadcast sent successfully!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Delivered to {lastBroadcast.recipientCount} users •{' '}
                {lastBroadcast.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Form */}
      <div className="bg-white rounded-xl shadow-sm border border-greenly-light">
        <div className="p-6 border-b border-greenly-light">
          <h2 className="text-xl font-bold text-greenly-midnight flex items-center gap-2">
            <Users className="h-5 w-5" />
            Compose Broadcast
          </h2>
          <p className="text-sm text-greenly-slate mt-1">
            This notification will be sent to all users except yourself
          </p>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-greenly-midnight mb-3">
              Notification Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'info', label: 'Info', color: 'blue' },
                { value: 'success', label: 'Success', color: 'green' },
                { value: 'warning', label: 'Warning', color: 'yellow' },
                { value: 'error', label: 'Alert', color: 'red' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={clsx(
                    'px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all',
                    type === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                      : 'border-greenly-light text-greenly-gray hover:border-greenly-primary/30'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-semibold text-greenly-midnight mb-3">
              Priority Level
            </label>
            <div className="flex gap-3">
              {[
                { value: 'low', label: 'Low' },
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={clsx(
                    'flex-1 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all',
                    priority === option.value
                      ? 'border-greenly-primary bg-greenly-primary/10 text-greenly-primary'
                      : 'border-greenly-light text-greenly-gray hover:border-greenly-primary/30'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-greenly-midnight mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, concise title..."
              className="w-full px-4 py-3 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary"
              maxLength={200}
              required
            />
            <p className="text-xs text-greenly-gray mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-greenly-midnight mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your broadcast message here..."
              rows={6}
              className="w-full px-4 py-3 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary resize-none"
              maxLength={1000}
              required
            />
            <p className="text-xs text-greenly-gray mt-1">
              {message.length}/1000 characters
            </p>
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="border-2 border-greenly-light rounded-lg p-4 bg-greenly-off-white">
              <p className="text-xs font-semibold text-greenly-gray uppercase mb-2">
                Preview
              </p>
              <div className="bg-white rounded-lg p-4 border border-greenly-light">
                {title && (
                  <p className="font-semibold text-greenly-midnight mb-2">
                    {title}
                  </p>
                )}
                {message && (
                  <p className="text-sm text-greenly-slate whitespace-pre-wrap">
                    {message}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    type === 'info' && 'bg-blue-100 text-blue-700',
                    type === 'success' && 'bg-green-100 text-green-700',
                    type === 'warning' && 'bg-yellow-100 text-yellow-700',
                    type === 'error' && 'bg-red-100 text-red-700'
                  )}>
                    {type}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-greenly-light text-greenly-gray capitalize">
                    {priority} priority
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-greenly-light">
            <p className="text-xs text-greenly-slate">
              <AlertCircle className="inline h-3 w-3 mr-1" />
              All users will receive this notification instantly
            </p>
            <button
              type="submit"
              disabled={!title.trim() || !message.trim() || sending}
              className="px-6 py-3 bg-greenly-primary text-white rounded-lg font-semibold hover:bg-greenly-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {sending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Broadcast
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3">Broadcast Guidelines</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Use clear, professional language appropriate for all staff</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Ensure the message is relevant to the entire organization</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Choose the appropriate priority level - urgent should be used sparingly</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Keep messages concise and actionable when possible</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
