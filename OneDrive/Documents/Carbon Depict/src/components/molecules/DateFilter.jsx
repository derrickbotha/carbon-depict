import { useState, useEffect, useRef } from 'react'
import { Calendar, Filter, ChevronDown } from '@atoms/Icon'

const DateFilter = ({ 
  onDateRangeChange, 
  defaultRange = 'last-30-days',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState(defaultRange)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState('left')
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const predefinedRanges = [
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-90-days', label: 'Last 90 days' },
    { value: 'last-6-months', label: 'Last 6 months' },
    { value: 'last-year', label: 'Last year' },
    { value: 'ytd', label: 'Year to date' },
    { value: 'custom', label: 'Custom range' }
  ]

  const getDateRange = (range) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (range) {
      case 'last-7-days':
        return {
          startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: today
        }
      case 'last-30-days':
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: today
        }
      case 'last-90-days':
        return {
          startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          endDate: today
        }
      case 'last-6-months':
        return {
          startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
          endDate: today
        }
      case 'last-year':
        return {
          startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
          endDate: today
        }
      case 'ytd':
        return {
          startDate: new Date(today.getFullYear(), 0, 1),
          endDate: today
        }
      case 'custom':
        return {
          startDate: customStartDate ? new Date(customStartDate) : null,
          endDate: customEndDate ? new Date(customEndDate) : null
        }
      default:
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: today
        }
    }
  }

  const [dropdownWidth, setDropdownWidth] = useState(320)

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const width = Math.min(320, viewportWidth - 32) // 32px total margin
      
      setDropdownWidth(width)
      
      // Check if dropdown would overflow on the right
      if (buttonRect.left + width > viewportWidth - 16) { // 16px margin
        setDropdownPosition('right')
      } else {
        setDropdownPosition('left')
      }
    }
  }

  const handleRangeChange = (range) => {
    setSelectedRange(range)
    if (range !== 'custom') {
      const dateRange = getDateRange(range)
      onDateRangeChange(dateRange)
      setIsOpen(false) // Only close for predefined ranges
    } else {
      // For 'custom' range, populate the date inputs with current selected dates
      const currentRange = getDateRange(selectedRange)
      if (currentRange.startDate && currentRange.endDate) {
        setCustomStartDate(currentRange.startDate.toISOString().split('T')[0])
        setCustomEndDate(currentRange.endDate.toISOString().split('T')[0])
      }
    }
    // Keep dropdown open for custom range to show the form
  }

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const dateRange = getDateRange('custom')
      if (dateRange.startDate && dateRange.endDate) {
        onDateRangeChange(dateRange)
        setIsOpen(false) // Close dropdown after applying custom range
      }
    }
  }

  const formatDateRange = (range) => {
    const dateRange = getDateRange(range)
    if (range === 'custom' && customStartDate && customEndDate) {
      return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
    }
    
    // Handle null dates gracefully
    const startDateStr = dateRange.startDate ? dateRange.startDate.toLocaleDateString() : 'N/A'
    const endDateStr = dateRange.endDate ? dateRange.endDate.toLocaleDateString() : 'N/A'
    
    return `${startDateStr} - ${endDateStr}`
  }

  useEffect(() => {
    // Initialize with default range
    const dateRange = getDateRange(defaultRange)
    if (dateRange.startDate && dateRange.endDate) {
      onDateRangeChange(dateRange)
    }
    
    // If default range is custom, populate the date inputs
    if (defaultRange === 'custom' && dateRange.startDate && dateRange.endDate) {
      setCustomStartDate(dateRange.startDate.toISOString().split('T')[0])
      setCustomEndDate(dateRange.endDate.toISOString().split('T')[0])
    }
  }, [])

  useEffect(() => {
    // Recalculate position on window resize
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Populate custom date inputs when switching to custom range
  useEffect(() => {
    if (selectedRange === 'custom' && isOpen) {
      const currentRange = getDateRange(selectedRange)
      if (currentRange.startDate && currentRange.endDate) {
        setCustomStartDate(currentRange.startDate.toISOString().split('T')[0])
        setCustomEndDate(currentRange.endDate.toISOString().split('T')[0])
      }
    }
  }, [selectedRange, isOpen])

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => {
          calculateDropdownPosition()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Calendar className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {formatDateRange(selectedRange) || 'Select Date Range'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
            dropdownPosition === 'right' ? 'right-0' : 'left-0'
          }`}
          style={{
            width: `${dropdownWidth}px`,
            maxWidth: 'calc(100vw - 2rem)',
            minWidth: '280px'
          }}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-gray-900">Filter by Date Range</h3>
            </div>

            {/* Predefined ranges */}
            <div className="space-y-2 mb-4">
              {predefinedRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleRangeChange(range.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedRange === range.value
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom date range */}
            {selectedRange === 'custom' && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Custom Date Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setSelectedRange('last-30-days')
                      setCustomStartDate('')
                      setCustomEndDate('')
                    }}
                    className="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomDateChange}
                    disabled={!customStartDate || !customEndDate}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default DateFilter
