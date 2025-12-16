/**
 * MessagingPage - Internal Communication System
 *
 * Features:
 * - Admin/Manager/Data Entry communication
 * - System owner broadcasts
 * - Thread-based conversations
 * - Real-time messaging via WebSocket
 */
import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Send,
  Users,
  User,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { apiClient } from '../../utils/api'
import { formatDistance } from 'date-fns'
import clsx from 'clsx'

export default function MessagingPage() {
  const { user } = useAuth()
  const { showSuccess, showError, addNotification } = useAppState()

  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const messagesEndRef = useRef(null)

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
    loadUsers()
  }, [])

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const response = await apiClient.get('/api/messages/conversations')
      setConversations(response.data?.data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
      showError('Failed to load conversations')
    }
  }

  const loadUsers = async () => {
    try {
      const response = await apiClient.get('/api/users')
      setUsers(response.data?.data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadMessages = async (conversationId) => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/api/messages/conversations/${conversationId}`)
      setMessages(response.data?.data?.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
      showError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    if (!selectedConversation) {
      // Create new conversation first
      if (selectedRecipients.length === 0) {
        showError('Please select at least one recipient')
        return
      }

      try {
        const response = await apiClient.post('/api/messages/conversations', {
          recipients: selectedRecipients,
          message: newMessage
        })

        const newConv = response.data?.data
        setConversations([newConv, ...conversations])
        setSelectedConversation(newConv)
        setNewMessage('')
        setShowNewConversation(false)
        setSelectedRecipients([])
        showSuccess('Message sent!')
      } catch (error) {
        console.error('Error creating conversation:', error)
        showError('Failed to send message')
      }
    } else {
      // Send message to existing conversation
      try {
        const response = await apiClient.post(`/api/messages/conversations/${selectedConversation._id}`, {
          message: newMessage
        })

        const newMsg = response.data?.data
        setMessages([...messages, newMsg])
        setNewMessage('')
        showSuccess('Message sent!')
      } catch (error) {
        console.error('Error sending message:', error)
        showError('Failed to send message')
      }
    }
  }

  const deleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      await apiClient.delete(`/api/messages/conversations/${conversationId}`)
      setConversations(conversations.filter(c => c._id !== conversationId))
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null)
        setMessages([])
      }
      showSuccess('Conversation deleted')
    } catch (error) {
      console.error('Error deleting conversation:', error)
      showError('Failed to delete conversation')
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole && u._id !== user?._id
  })

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-greenly-light flex flex-col">
        <div className="p-4 border-b border-greenly-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-greenly-midnight flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </h2>
            <button
              onClick={() => setShowNewConversation(!showNewConversation)}
              className="px-3 py-1.5 bg-greenly-primary text-white rounded-lg text-sm font-semibold hover:bg-greenly-primary/90 transition-colors"
            >
              New
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-greenly-gray" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2 border border-greenly-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-greenly-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-greenly-gray mx-auto mb-3" />
              <p className="text-sm text-greenly-gray">No conversations yet</p>
              <button
                onClick={() => setShowNewConversation(true)}
                className="mt-3 text-sm text-greenly-primary font-semibold hover:underline"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
                className={clsx(
                  'w-full p-4 border-b border-greenly-light hover:bg-greenly-off-white transition-colors text-left',
                  selectedConversation?._id === conv._id && 'bg-greenly-primary/10'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {conv.isGroup ? (
                      <div className="h-10 w-10 rounded-full bg-greenly-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-greenly-primary" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-greenly-gray/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-greenly-gray" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-greenly-midnight truncate">
                        {conv.title || conv.participants?.map(p => p.firstName).join(', ')}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-greenly-gray ml-2">
                          {formatDistance(new Date(conv.lastMessage.createdAt), new Date(), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-greenly-slate truncate mt-1">
                        {conv.lastMessage.content}
                      </p>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-greenly-alert text-white text-xs font-bold rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-greenly-light flex flex-col">
        {showNewConversation ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-greenly-light">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-greenly-midnight">New Conversation</h3>
                <button
                  onClick={() => {
                    setShowNewConversation(false)
                    setSelectedRecipients([])
                  }}
                  className="text-sm text-greenly-gray hover:text-greenly-midnight"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setFilterRole('all')}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                    filterRole === 'all'
                      ? 'bg-greenly-primary text-white'
                      : 'bg-greenly-light text-greenly-gray hover:bg-greenly-primary/20'
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterRole('admin')}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                    filterRole === 'admin'
                      ? 'bg-greenly-primary text-white'
                      : 'bg-greenly-light text-greenly-gray hover:bg-greenly-primary/20'
                  )}
                >
                  Admins
                </button>
                <button
                  onClick={() => setFilterRole('manager')}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                    filterRole === 'manager'
                      ? 'bg-greenly-primary text-white'
                      : 'bg-greenly-light text-greenly-gray hover:bg-greenly-primary/20'
                  )}
                >
                  Managers
                </button>
                <button
                  onClick={() => setFilterRole('user')}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                    filterRole === 'user'
                      ? 'bg-greenly-primary text-white'
                      : 'bg-greenly-light text-greenly-gray hover:bg-greenly-primary/20'
                  )}
                >
                  Data Entry
                </button>
              </div>

              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedRecipients.map(recipientId => {
                    const recipient = users.find(u => u._id === recipientId)
                    return (
                      <span
                        key={recipientId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-greenly-primary/10 text-greenly-primary rounded-lg text-xs font-semibold"
                      >
                        {recipient?.firstName} {recipient?.lastName}
                        <button
                          onClick={() => setSelectedRecipients(selectedRecipients.filter(id => id !== recipientId))}
                          className="hover:text-greenly-midnight"
                        >
                          ×
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredUsers.map(u => (
                  <button
                    key={u._id}
                    onClick={() => {
                      if (selectedRecipients.includes(u._id)) {
                        setSelectedRecipients(selectedRecipients.filter(id => id !== u._id))
                      } else {
                        setSelectedRecipients([...selectedRecipients, u._id])
                      }
                    }}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left',
                      selectedRecipients.includes(u._id)
                        ? 'border-greenly-primary bg-greenly-primary/10'
                        : 'border-greenly-light hover:bg-greenly-off-white'
                    )}
                  >
                    <div className="h-10 w-10 rounded-full bg-greenly-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-greenly-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-greenly-midnight">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-greenly-slate truncate">{u.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-greenly-light text-greenly-gray text-xs rounded-full capitalize">
                        {u.role}
                      </span>
                    </div>
                    {selectedRecipients.includes(u._id) && (
                      <CheckCircle className="h-5 w-5 text-greenly-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-greenly-light">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-greenly-light rounded-lg focus:outline-none focus:ring-2 focus:ring-greenly-primary"
                  disabled={selectedRecipients.length === 0}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || selectedRecipients.length === 0}
                  className="px-4 py-2 bg-greenly-primary text-white rounded-lg font-semibold hover:bg-greenly-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b border-greenly-light flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-greenly-primary/20 flex items-center justify-center">
                  {selectedConversation.isGroup ? (
                    <Users className="h-5 w-5 text-greenly-primary" />
                  ) : (
                    <User className="h-5 w-5 text-greenly-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-greenly-midnight">
                    {selectedConversation.title || selectedConversation.participants?.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                  </h3>
                  <p className="text-xs text-greenly-slate">
                    {selectedConversation.participants?.length} participants
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteConversation(selectedConversation._id)}
                className="p-2 text-greenly-gray hover:text-greenly-alert hover:bg-greenly-alert/10 rounded-lg transition-colors"
                title="Delete conversation"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-greenly-off-white">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm text-greenly-gray">Loading messages...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-greenly-gray mx-auto mb-3" />
                    <p className="text-sm text-greenly-gray">No messages yet</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.sender?._id === user?._id
                  const showAvatar = index === 0 || messages[index - 1].sender?._id !== msg.sender?._id

                  return (
                    <div
                      key={msg._id || index}
                      className={clsx('flex gap-3', isOwn && 'flex-row-reverse')}
                    >
                      {showAvatar ? (
                        <div className="h-8 w-8 rounded-full bg-greenly-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-greenly-primary" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 flex-shrink-0" />
                      )}
                      <div className={clsx('flex-1 max-w-[70%]', isOwn && 'flex flex-col items-end')}>
                        {showAvatar && (
                          <div className={clsx('text-xs text-greenly-gray mb-1', isOwn && 'text-right')}>
                            {isOwn ? 'You' : `${msg.sender?.firstName} ${msg.sender?.lastName}`}
                          </div>
                        )}
                        <div
                          className={clsx(
                            'px-4 py-2 rounded-lg',
                            isOwn
                              ? 'bg-greenly-primary text-white'
                              : 'bg-white border border-greenly-light text-greenly-midnight'
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className={clsx('text-xs text-greenly-gray mt-1 flex items-center gap-1', isOwn && 'justify-end')}>
                          <Clock className="h-3 w-3" />
                          {formatDistance(new Date(msg.createdAt), new Date(), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-greenly-light bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-greenly-light rounded-lg focus:outline-none focus:ring-2 focus:ring-greenly-primary"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-greenly-primary text-white rounded-lg font-semibold hover:bg-greenly-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-greenly-gray mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-greenly-midnight mb-2">
                No conversation selected
              </h3>
              <p className="text-sm text-greenly-gray mb-4">
                Choose a conversation from the sidebar or start a new one
              </p>
              <button
                onClick={() => setShowNewConversation(true)}
                className="px-4 py-2 bg-greenly-primary text-white rounded-lg font-semibold hover:bg-greenly-primary/90 transition-colors"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
