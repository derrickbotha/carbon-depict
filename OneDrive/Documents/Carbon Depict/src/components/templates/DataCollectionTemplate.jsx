import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Factory, CheckCircle2, Circle, AlertCircle, Info, Loader, Trash2, Save } from 'lucide-react'
import ExportButton from '@components/molecules/ExportButton'

export default function DataCollectionTemplate({
    title,
    description,
    categories,
    initialData,
    guidance,
    onSave,
    onDelete,
    onExport,
    loading = false,
    saving = false,
    existingId,
    backLink = '/dashboard/emissions',
    headerIcon: HeaderIcon = Factory,
    headerLabel = 'SCOPE DATA',
}) {
    const [currentCategory, setCurrentCategory] = useState(categories[0].id)
    const [formData, setFormData] = useState(initialData)

    // Update form data when initialData changes (e.g., after loading from API)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])

    const handleInputChange = (category, fieldKey, value) => {
        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [fieldKey]: {
                    ...prev[category][fieldKey],
                    value: value,
                    completed: value.trim() !== '',
                },
            },
        }))
    }

    const calculateCategoryProgress = (category) => {
        const fields = Object.values(formData[category])
        const completedFields = fields.filter((f) => f.completed).length
        return fields.length > 0 ? Math.round((completedFields / fields.length) * 100) : 0
    }

    const totalProgress = useMemo(() => {
        let totalFields = 0
        let completedFields = 0
        Object.values(formData).forEach((category) => {
            const fields = Object.values(category)
            totalFields += fields.length
            completedFields += fields.filter((f) => f.completed).length
        })
        return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
    }, [formData])

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-greenly-mint'
        if (progress >= 50) return 'bg-greenly-teal'
        if (progress >= 25) return 'bg-greenly-cedar'
        return 'bg-gray-300'
    }

    const currentCategoryData = categories.find((cat) => cat.id === currentCategory)

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 text-greenly-primary animate-spin mx-auto mb-4" />
                    <p className="text-greenly-slate">Loading emissions data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to={backLink}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-greenly-light bg-white text-greenly-slate transition-colors hover:bg-greenly-off-white hover:text-greenly-midnight"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <HeaderIcon className="h-6 w-6 text-greenly-midnight" />
                            <span className="text-sm font-semibold text-greenly-midnight uppercase">{headerLabel}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-greenly-midnight">{title}</h1>
                        <p className="text-greenly-slate">{description}</p>
                    </div>
                </div>

                {/* Action Buttons in Header */}
                <div className="flex items-center gap-2">
                    {onExport && (
                        <ExportButton onExport={onExport} disabled={saving || loading} loading={saving} />
                    )}
                    {onDelete && existingId && (
                        <button
                            onClick={onDelete}
                            disabled={saving || loading}
                            className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Overall Progress */}
            <div className="rounded-lg border border-greenly-midnight/20 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-greenly-midnight">Overall Progress</h3>
                        <p className="text-sm text-greenly-slate">
                            {Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).length, 0)} total fields across {categories.length} categories
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-greenly-midnight">{totalProgress}%</div>
                        <div className="text-sm text-greenly-slate">Complete</div>
                    </div>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(totalProgress)}`}
                        style={{ width: `${totalProgress}%` }}
                    />
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-greenly-slate">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                        {Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter((f) => f.completed).length, 0)} fields completed
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar - Category Navigation */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-greenly-slate">
                            Categories
                        </h3>
                        {categories.map((cat) => {
                            const progress = calculateCategoryProgress(cat.id)
                            const isActive = currentCategory === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setCurrentCategory(cat.id)}
                                    className={`w-full rounded-lg border p-4 text-left transition-all ${isActive
                                            ? 'border-greenly-midnight bg-greenly-midnight text-white shadow-md'
                                            : 'border-greenly-light bg-white text-greenly-midnight hover:border-greenly-midnight/30 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-2xl">{cat.icon}</span>
                                        <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-greenly-midnight'}`}>
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-greenly-midnight'}`}>
                                        {cat.name}
                                    </div>
                                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-greenly-slate'}`}>
                                        {Object.keys(formData[cat.id]).length} fields
                                    </div>
                                    <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                                        <div
                                            className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-greenly-midnight'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </button>
                            )
                        })}

                        {/* DEFRA Info */}
                        <div className="mt-6 rounded-lg border border-greenly-teal/20 bg-greenly-teal/5 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-greenly-midnight">
                                <Info className="h-4 w-4" />
                                DEFRA 2025
                            </div>
                            <p className="text-xs text-greenly-slate">
                                All fields use UK Government DEFRA 2025 emission factors for accurate carbon accounting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-greenly-light bg-white p-6 shadow-sm">
                        {/* Category Header */}
                        <div className="mb-6 border-b border-greenly-light pb-4">
                            <div className="mb-2 flex items-center gap-3">
                                <span className="text-3xl">{currentCategoryData.icon}</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-greenly-midnight">{currentCategoryData.name}</h2>
                                    <p className="text-sm text-greenly-slate">{currentCategoryData.description}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-sm text-greenly-slate">
                                <AlertCircle className="h-4 w-4" />
                                <span>Enter consumption data for the reporting period (e.g., monthly, quarterly, annually)</span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {Object.entries(formData[currentCategory]).map(([fieldKey, field]) => (
                                <div key={fieldKey} className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        {field.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-greenly-mint" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="mb-1 block text-sm font-medium text-greenly-midnight">
                                            {field.name}
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={field.value}
                                                onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                                                className="flex-1 rounded-lg border border-greenly-light bg-white px-4 py-2 text-greenly-midnight placeholder-greenly-slate/50 focus:border-greenly-midnight focus:outline-none focus:ring-2 focus:ring-greenly-midnight/20"
                                                placeholder={`Enter amount in ${field.unit}`}
                                            />
                                            <div className="flex w-24 items-center justify-center rounded-lg border border-greenly-light bg-greenly-off-white px-3 text-sm text-greenly-slate">
                                                {field.unit}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Category-Specific Guidance */}
                        {guidance && guidance[currentCategory] && (
                            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                                    <Info className="h-4 w-4" />
                                    {currentCategoryData.name} Guidance
                                </div>
                                <ul className="space-y-1 text-xs text-blue-800">
                                    {guidance[currentCategory].map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-4 border-t border-greenly-light pt-6">
                            <button
                                className="flex-1 rounded-lg bg-greenly-midnight px-6 py-3 font-semibold text-white transition-colors hover:bg-greenly-midnight/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={() => onSave ? onSave(formData) : alert('Data saved! (API integration pending)')}
                                disabled={saving || loading}
                            >
                                {saving ? (
                                    <>
                                        <Loader className="h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        {existingId ? 'Update Progress' : 'Save Progress'}
                                    </>
                                )}
                            </button>
                            <button
                                className="flex-1 rounded-lg border border-greenly-light bg-white px-6 py-3 font-semibold text-greenly-midnight transition-colors hover:bg-greenly-off-white disabled:opacity-50"
                                onClick={() => alert('Calculate emissions (calculation engine coming soon)')}
                                disabled={saving || loading}
                            >
                                Calculate Emissions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
