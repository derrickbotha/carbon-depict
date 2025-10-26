/**
 * Enterprise Data Hooks
 * Custom React hooks for data management and state handling
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { enterpriseAPI } from '../services/enterpriseAPI'

// Generic data fetching hook
export const useEnterpriseData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      setData(response.data)
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Generic mutation hook
export const useEnterpriseMutation = (apiCall) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(data)
      return response.data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  return { mutate, loading, error }
}

// Company Management Hooks
export const useCompany = () => {
  return useEnterpriseData(() => enterpriseAPI.companies.getProfile())
}

export const useCompanySettings = () => {
  return useEnterpriseData(() => enterpriseAPI.companies.getSettings())
}

export const useUpdateCompany = () => {
  return useEnterpriseMutation(enterpriseAPI.companies.updateProfile)
}

export const useUpdateCompanySettings = () => {
  return useEnterpriseMutation(enterpriseAPI.companies.updateSettings)
}

// Location Management Hooks
export const useLocations = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.locations.getAll(params), [JSON.stringify(params)])
}

export const useLocation = (id) => {
  return useEnterpriseData(() => enterpriseAPI.locations.getById(id), [id])
}

export const useCreateLocation = () => {
  return useEnterpriseMutation(enterpriseAPI.locations.create)
}

export const useUpdateLocation = () => {
  return useEnterpriseMutation(enterpriseAPI.locations.update)
}

export const useDeleteLocation = () => {
  return useEnterpriseMutation(enterpriseAPI.locations.delete)
}

// Facility Management Hooks
export const useFacilities = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.facilities.getAll(params), [JSON.stringify(params)])
}

export const useFacility = (id) => {
  return useEnterpriseData(() => enterpriseAPI.facilities.getById(id), [id])
}

export const useFacilitiesByLocation = (locationId) => {
  return useEnterpriseData(() => enterpriseAPI.facilities.getByLocation(locationId), [locationId])
}

export const useCreateFacility = () => {
  return useEnterpriseMutation(enterpriseAPI.facilities.create)
}

export const useUpdateFacility = () => {
  return useEnterpriseMutation(enterpriseAPI.facilities.update)
}

export const useDeleteFacility = () => {
  return useEnterpriseMutation(enterpriseAPI.facilities.delete)
}

// GHG Emissions Hooks
export const useEmissions = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getAll(params), [JSON.stringify(params)])
}

export const useEmission = (id) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getById(id), [id])
}

export const useEmissionsSummary = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getSummary(params), [JSON.stringify(params)])
}

export const useEmissionsBySource = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getBySource(params), [JSON.stringify(params)])
}

export const useEmissionsTrends = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getTrends(params), [JSON.stringify(params)])
}

export const useEmissionsByScope = (scope, params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getByScope(scope, params), [scope, JSON.stringify(params)])
}

export const useCreateEmission = () => {
  return useEnterpriseMutation(enterpriseAPI.emissions.create)
}

export const useUpdateEmission = () => {
  return useEnterpriseMutation(enterpriseAPI.emissions.update)
}

export const useDeleteEmission = () => {
  return useEnterpriseMutation(enterpriseAPI.emissions.delete)
}

export const useBulkImportEmissions = () => {
  return useEnterpriseMutation(enterpriseAPI.emissions.bulkImport)
}

// ESG Metrics Hooks
export const useESGMetrics = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.esgMetrics.getAll(params), [JSON.stringify(params)])
}

export const useESGMetric = (id) => {
  return useEnterpriseData(() => enterpriseAPI.esgMetrics.getById(id), [id])
}

export const useESGMetricsByFramework = (framework, params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.esgMetrics.getByFramework(framework, params), [framework, JSON.stringify(params)])
}

export const useESGMetricsByPillar = (pillar, params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.esgMetrics.getByPillar(pillar, params), [pillar, JSON.stringify(params)])
}

export const useESGMetricsSummary = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.esgMetrics.getSummary(params), [JSON.stringify(params)])
}

export const useCreateESGMetric = () => {
  return useEnterpriseMutation(enterpriseAPI.esgMetrics.create)
}

export const useUpdateESGMetric = () => {
  return useEnterpriseMutation(enterpriseAPI.esgMetrics.update)
}

export const useDeleteESGMetric = () => {
  return useEnterpriseMutation(enterpriseAPI.esgMetrics.delete)
}

export const usePublishESGMetric = () => {
  return useEnterpriseMutation(enterpriseAPI.esgMetrics.publish)
}

export const useBulkImportESGMetrics = () => {
  return useEnterpriseMutation(enterpriseAPI.esgMetrics.bulkImport)
}

// ESG Targets Hooks
export const useESGTargets = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.esgTargets.getAll(params), [JSON.stringify(params)])
}

export const useESGTarget = (id) => {
  return useEnterpriseData(() => enterpriseAPI.esgTargets.getById(id), [id])
}

export const useESGTargetsByFramework = (framework, params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.esgTargets.getByFramework(framework, params), [framework, JSON.stringify(params)])
}

export const useESGTargetProgress = (id) => {
  return useEnterpriseData(() => enterpriseAPI.esgTargets.getProgress(id), [id])
}

export const useCreateESGTarget = () => {
  return useEnterpriseMutation(enterpriseAPI.esgTargets.create)
}

export const useUpdateESGTarget = () => {
  return useEnterpriseMutation(enterpriseAPI.esgTargets.update)
}

export const useUpdateESGTargetProgress = () => {
  return useEnterpriseMutation(enterpriseAPI.esgTargets.updateProgress)
}

export const useSubmitESGTarget = () => {
  return useEnterpriseMutation(enterpriseAPI.esgTargets.submitForApproval)
}

// Materiality Assessment Hooks
export const useMaterialityAssessment = () => {
  return useEnterpriseData(() => enterpriseAPI.materiality.getCurrent())
}

export const useMaterialityByYear = (year) => {
  return useEnterpriseData(() => enterpriseAPI.materiality.getByYear(year), [year])
}

export const useCreateMaterialityAssessment = () => {
  return useEnterpriseMutation(enterpriseAPI.materiality.create)
}

export const useUpdateMaterialityAssessment = () => {
  return useEnterpriseMutation(enterpriseAPI.materiality.update)
}

export const useAddStakeholderInput = () => {
  return useEnterpriseMutation(enterpriseAPI.materiality.addStakeholderInput)
}

export const useGenerateMaterialityMatrix = () => {
  return useEnterpriseMutation(enterpriseAPI.materiality.generateMatrix)
}

export const usePublishMaterialityAssessment = () => {
  return useEnterpriseMutation(enterpriseAPI.materiality.publish)
}

// Framework-Specific Hooks
export const useGRIStandards = () => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.gri.getStandards())
}

export const useGRIDisclosures = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.gri.getDisclosures(params), [JSON.stringify(params)])
}

export const useCreateGRIDisclosure = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.gri.createDisclosure)
}

export const useUpdateGRIDisclosure = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.gri.updateDisclosure)
}

export const useTCFDRecommendations = () => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.tcfd.getRecommendations())
}

export const useTCFDDisclosures = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.tcfd.getDisclosures(params), [JSON.stringify(params)])
}

export const useCreateTCFDDisclosure = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.tcfd.createDisclosure)
}

export const useUpdateTCFDDisclosure = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.tcfd.updateDisclosure)
}

export const useSBTITargets = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.sbti.getTargets(params), [JSON.stringify(params)])
}

export const useCreateSBTITarget = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.sbti.createTarget)
}

export const useUpdateSBTITarget = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.sbti.updateTarget)
}

export const useSubmitSBTITarget = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.sbti.submitForValidation)
}

export const useCSRDESRS = () => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.csrd.getESRS())
}

export const useCSRDDisclosures = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.csrd.getDisclosures(params), [JSON.stringify(params)])
}

export const useCreateCSRDDisclosure = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.csrd.createDisclosure)
}

export const useUpdateCSRDDisclosure = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.csrd.updateDisclosure)
}

export const useCDPQuestionnaire = (year) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.cdp.getQuestionnaire(year), [year])
}

export const useCDPResponses = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.cdp.getResponses(params), [JSON.stringify(params)])
}

export const useCreateCDPResponse = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.cdp.createResponse)
}

export const useUpdateCDPResponse = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.cdp.updateResponse)
}

export const useSDGGoals = () => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.sdg.getGoals())
}

export const useSDGTargets = (goalId) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.sdg.getTargets(goalId), [goalId])
}

export const useSDGContributions = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.frameworks.sdg.getContributions(params), [JSON.stringify(params)])
}

export const useCreateSDGContribution = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.sdg.createContribution)
}

export const useUpdateSDGContribution = () => {
  return useEnterpriseMutation(enterpriseAPI.frameworks.sdg.updateContribution)
}

// Data Collection Hooks
export const useGHGInventoryData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.environmental.ghgInventory.getData(params), [JSON.stringify(params)])
}

export const useSaveGHGInventoryData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.ghgInventory.saveData)
}

export const useUpdateGHGInventoryData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.ghgInventory.updateData)
}

export const useEnergyManagementData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.environmental.energyManagement.getData(params), [JSON.stringify(params)])
}

export const useSaveEnergyManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.energyManagement.saveData)
}

export const useUpdateEnergyManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.energyManagement.updateData)
}

export const useWaterManagementData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.environmental.waterManagement.getData(params), [JSON.stringify(params)])
}

export const useSaveWaterManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.waterManagement.saveData)
}

export const useUpdateWaterManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.waterManagement.updateData)
}

export const useWasteManagementData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.environmental.wasteManagement.getData(params), [JSON.stringify(params)])
}

export const useSaveWasteManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.wasteManagement.saveData)
}

export const useUpdateWasteManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.wasteManagement.updateData)
}

export const useBiodiversityLandUseData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.environmental.biodiversityLandUse.getData(params), [JSON.stringify(params)])
}

export const useSaveBiodiversityLandUseData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.biodiversityLandUse.saveData)
}

export const useUpdateBiodiversityLandUseData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.biodiversityLandUse.updateData)
}

export const useMaterialsCircularEconomyData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.environmental.materialsCircularEconomy.getData(params), [JSON.stringify(params)])
}

export const useSaveMaterialsCircularEconomyData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.materialsCircularEconomy.saveData)
}

export const useUpdateMaterialsCircularEconomyData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.environmental.materialsCircularEconomy.updateData)
}

export const useEmployeeDemographicsData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.social.employeeDemographics.getData(params), [JSON.stringify(params)])
}

export const useSaveEmployeeDemographicsData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.employeeDemographics.saveData)
}

export const useUpdateEmployeeDemographicsData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.employeeDemographics.updateData)
}

export const useHealthSafetyData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.social.healthSafety.getData(params), [JSON.stringify(params)])
}

export const useSaveHealthSafetyData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.healthSafety.saveData)
}

export const useUpdateHealthSafetyData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.healthSafety.updateData)
}

export const useTrainingDevelopmentData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.social.trainingDevelopment.getData(params), [JSON.stringify(params)])
}

export const useSaveTrainingDevelopmentData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.trainingDevelopment.saveData)
}

export const useUpdateTrainingDevelopmentData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.trainingDevelopment.updateData)
}

export const useDiversityInclusionData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.social.diversityInclusion.getData(params), [JSON.stringify(params)])
}

export const useSaveDiversityInclusionData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.diversityInclusion.saveData)
}

export const useUpdateDiversityInclusionData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.social.diversityInclusion.updateData)
}

export const useBoardCompositionData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.governance.boardComposition.getData(params), [JSON.stringify(params)])
}

export const useSaveBoardCompositionData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.governance.boardComposition.saveData)
}

export const useUpdateBoardCompositionData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.governance.boardComposition.updateData)
}

export const useEthicsAntiCorruptionData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.governance.ethicsAntiCorruption.getData(params), [JSON.stringify(params)])
}

export const useSaveEthicsAntiCorruptionData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.governance.ethicsAntiCorruption.saveData)
}

export const useUpdateEthicsAntiCorruptionData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.governance.ethicsAntiCorruption.updateData)
}

export const useRiskManagementData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.dataCollection.governance.riskManagement.getData(params), [JSON.stringify(params)])
}

export const useSaveRiskManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.governance.riskManagement.saveData)
}

export const useUpdateRiskManagementData = () => {
  return useEnterpriseMutation(enterpriseAPI.dataCollection.governance.riskManagement.updateData)
}

// Reports Hooks
export const useReports = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.reports.getAll(params), [JSON.stringify(params)])
}

export const useReport = (id) => {
  return useEnterpriseData(() => enterpriseAPI.reports.getById(id), [id])
}

export const useCreateReport = () => {
  return useEnterpriseMutation(enterpriseAPI.reports.create)
}

export const useUpdateReport = () => {
  return useEnterpriseMutation(enterpriseAPI.reports.update)
}

export const useGenerateReport = () => {
  return useEnterpriseMutation(enterpriseAPI.reports.generate)
}

export const useReportTemplates = () => {
  return useEnterpriseData(() => enterpriseAPI.reports.getTemplates())
}

// Analytics Hooks
export const useDashboardData = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.analytics.getDashboardData(params), [JSON.stringify(params)])
}

export const useEmissionsAnalytics = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.emissions.getSummary(params), [JSON.stringify(params)])
}

export const useESGAnalytics = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.analytics.getESGAnalytics(params), [JSON.stringify(params)])
}

export const useComplianceAnalytics = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.analytics.getComplianceAnalytics(params), [JSON.stringify(params)])
}

export const useAnalyticsTrends = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.analytics.getTrends(params), [JSON.stringify(params)])
}

export const useBenchmarks = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.analytics.getBenchmarks(params), [JSON.stringify(params)])
}

// File Management Hooks
export const useFileUpload = () => {
  return useEnterpriseMutation(enterpriseAPI.files.upload)
}

export const useFilesByType = (type, params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.files.getByType(type, params), [type, JSON.stringify(params)])
}

// System Hooks
export const useSystemHealth = () => {
  return useEnterpriseData(() => enterpriseAPI.system.health())
}

export const useSystemStats = () => {
  return useEnterpriseData(() => enterpriseAPI.system.getStats())
}

export const useSystemLogs = (params = {}) => {
  return useEnterpriseData(() => enterpriseAPI.system.getLogs(params), [JSON.stringify(params)])
}

// Utility hook for optimistic updates
export const useOptimisticUpdate = (updateFn, refetchFn) => {
  const [optimisticData, setOptimisticData] = useState(null)
  const [isOptimistic, setIsOptimistic] = useState(false)

  const optimisticUpdate = useCallback(async (data) => {
    setIsOptimistic(true)
    setOptimisticData(data)
    
    try {
      const result = await updateFn(data)
      await refetchFn()
      return result
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticData(null)
      throw error
    } finally {
      setIsOptimistic(false)
      setOptimisticData(null)
    }
  }, [updateFn, refetchFn])

  return { optimisticUpdate, optimisticData, isOptimistic }
}

// Hook for pagination
export const usePagination = (apiCall, initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    ...initialParams
  })
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(params)
      setData(response.data.data || response.data)
      setTotal(response.data.total || response.data.count || 0)
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }, [apiCall, JSON.stringify(params)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const nextPage = useCallback(() => {
    setParams(prev => ({ ...prev, page: prev.page + 1 }))
  }, [])

  const prevPage = useCallback(() => {
    setParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))
  }, [])

  const goToPage = useCallback((page) => {
    setParams(prev => ({ ...prev, page }))
  }, [])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  const pagination = useMemo(() => ({
    currentPage: params.page,
    totalPages: Math.ceil(total / params.limit),
    hasNext: params.page < Math.ceil(total / params.limit),
    hasPrev: params.page > 1,
    total,
    limit: params.limit
  }), [params.page, params.limit, total])

  return {
    data,
    loading,
    error,
    pagination,
    updateParams,
    nextPage,
    prevPage,
    goToPage,
    refetch
  }
}
