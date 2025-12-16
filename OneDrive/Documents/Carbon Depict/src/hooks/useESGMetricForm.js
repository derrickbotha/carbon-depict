/**
 * Reusable hook for ESG forms that use the ESGMetric model
 * Used by 23+ simple forms (energy, water, waste, etc.)
 */
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@utils/api';

/**
 * @param {string} sourceType - The sourceType for ESGMetric filtering
 * @param {string} reportingPeriod - Current reporting period
 * @returns {object} Form state and methods
 */
export const useESGMetricForm = (sourceType, reportingPeriod = new Date().getFullYear().toString()) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load existing data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get('/api/esg/metrics', {
          params: {
            sourceType,
            reportingPeriod,
            sort: '-createdAt'
          }
        });

        if (response.data.success) {
          setData(response.data.data || []);
        }
      } catch (err) {
        console.error(`Failed to load ${sourceType} data:`, err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (sourceType) {
      loadData();
    }
  }, [sourceType, reportingPeriod]);

  // Create new metric
  const createMetric = useCallback(async (metricData) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...metricData,
        sourceType,
        reportingPeriod,
        status: metricData.status || 'draft'
      };

      const response = await apiClient.post('/api/esg/metrics', payload);

      if (response.data.success) {
        setData(prev => [response.data.data, ...prev]);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Failed to create metric:', err);
      setError(err.message || 'Failed to create metric');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [sourceType, reportingPeriod]);

  // Update existing metric
  const updateMetric = useCallback(async (id, metricData) => {
    try {
      setSaving(true);
      setError(null);

      const response = await apiClient.put(`/api/esg/metrics/${id}`, metricData);

      if (response.data.success) {
        setData(prev => prev.map(item =>
          item._id === id ? response.data.data : item
        ));
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Failed to update metric:', err);
      setError(err.message || 'Failed to update metric');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, []);

  // Delete metric
  const deleteMetric = useCallback(async (id) => {
    try {
      setSaving(true);
      setError(null);

      const response = await apiClient.delete(`/api/esg/metrics/${id}`);

      if (response.data.success) {
        setData(prev => prev.filter(item => item._id !== id));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete metric:', err);
      setError(err.message || 'Failed to delete metric');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, []);

  // Export data
  const exportData = useCallback(async (format) => {
    try {
      const response = await apiClient.get(`/api/esg/metrics/export/${format}`, {
        params: {
          sourceType,
          reportingPeriod
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${sourceType}-${reportingPeriod}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      console.error('Failed to export:', err);
      setError(err.message || 'Failed to export data');
      return { success: false, error: err.message };
    }
  }, [sourceType, reportingPeriod]);

  // Refresh data
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/esg/metrics', {
        params: {
          sourceType,
          reportingPeriod,
          sort: '-createdAt'
        }
      });

      if (response.data.success) {
        setData(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to refetch data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sourceType, reportingPeriod]);

  return {
    data,
    loading,
    saving,
    error,
    createMetric,
    updateMetric,
    deleteMetric,
    exportData,
    refetch
  };
};

export default useESGMetricForm;
