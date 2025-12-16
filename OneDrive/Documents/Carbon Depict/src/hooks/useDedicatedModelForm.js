/**
 * Reusable hook for forms with dedicated models
 * Used by: Materiality, Scope3, Risks, Targets, SBTi, PCAF
 */
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@utils/api';

/**
 * @param {string} endpoint - API endpoint (e.g., '/api/materiality', '/api/scope3')
 * @param {string} reportingPeriod - Current reporting period
 * @param {boolean} singleResource - If true, expects single resource (like SBTi)
 * @returns {object} Form state and methods
 */
export const useDedicatedModelForm = (endpoint, reportingPeriod = new Date().getFullYear().toString(), singleResource = false) => {
  const [data, setData] = useState(singleResource ? null : []);
  const [resourceId, setResourceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load existing data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (singleResource) {
          // For single resources like SBTi (GET /api/sbti)
          response = await apiClient.get(endpoint);
        } else {
          // For list resources (GET /api/materiality?reportingPeriod=2025)
          response = await apiClient.get(endpoint, {
            params: {
              reportingPeriod,
              sort: '-createdAt'
            }
          });
        }

        if (response.data.success) {
          if (singleResource) {
            setData(response.data.data);
            if (response.data.data?._id) {
              setResourceId(response.data.data._id);
            }
          } else {
            setData(response.data.data || []);
          }
        }
      } catch (err) {
        // 404 is okay for resources that don't exist yet
        if (err.response?.status === 404) {
          setData(singleResource ? null : []);
        } else {
          console.error(`Failed to load ${endpoint} data:`, err);
          setError(err.message || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      loadData();
    }
  }, [endpoint, reportingPeriod, singleResource]);

  // Create new resource
  const createResource = useCallback(async (resourceData) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...resourceData,
        reportingPeriod: resourceData.reportingPeriod || reportingPeriod,
        status: resourceData.status || 'draft'
      };

      const response = await apiClient.post(endpoint, payload);

      if (response.data.success) {
        if (singleResource) {
          setData(response.data.data);
          setResourceId(response.data.data._id);
        } else {
          setData(prev => [response.data.data, ...prev]);
        }
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Failed to create resource:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create resource');
      return { success: false, error: err.response?.data?.error || err.message };
    } finally {
      setSaving(false);
    }
  }, [endpoint, reportingPeriod, singleResource]);

  // Update existing resource
  const updateResource = useCallback(async (id, resourceData) => {
    try {
      setSaving(true);
      setError(null);

      let updateEndpoint = endpoint;
      if (id && !singleResource) {
        updateEndpoint = `${endpoint}/${id}`;
      } else if (singleResource) {
        // For single resources like SBTi, use PUT /api/sbti (no ID)
        updateEndpoint = endpoint;
      }

      const response = await apiClient.put(updateEndpoint, resourceData);

      if (response.data.success) {
        if (singleResource) {
          setData(response.data.data);
        } else {
          setData(prev => prev.map(item =>
            item._id === id ? response.data.data : item
          ));
        }
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Failed to update resource:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update resource');
      return { success: false, error: err.response?.data?.error || err.message };
    } finally {
      setSaving(false);
    }
  }, [endpoint, singleResource]);

  // Delete resource
  const deleteResource = useCallback(async (id) => {
    try {
      setSaving(true);
      setError(null);

      let deleteEndpoint = singleResource ? endpoint : `${endpoint}/${id}`;

      const response = await apiClient.delete(deleteEndpoint);

      if (response.data.success) {
        if (singleResource) {
          setData(null);
          setResourceId(null);
        } else {
          setData(prev => prev.filter(item => item._id !== id));
        }
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete resource:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete resource');
      return { success: false, error: err.response?.data?.error || err.message };
    } finally {
      setSaving(false);
    }
  }, [endpoint, singleResource]);

  // Export data
  const exportData = useCallback(async (format) => {
    try {
      const exportEndpoint = `${endpoint}/export/${format}`;
      const response = await apiClient.get(exportEndpoint, {
        params: singleResource ? {} : {
          reportingPeriod
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const resourceName = endpoint.split('/').pop();
      link.setAttribute('download', `${resourceName}-${reportingPeriod}.${format}`);
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
  }, [endpoint, reportingPeriod, singleResource]);

  // Refresh data
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      if (singleResource) {
        response = await apiClient.get(endpoint);
      } else {
        response = await apiClient.get(endpoint, {
          params: {
            reportingPeriod,
            sort: '-createdAt'
          }
        });
      }

      if (response.data.success) {
        if (singleResource) {
          setData(response.data.data);
          if (response.data.data?._id) {
            setResourceId(response.data.data._id);
          }
        } else {
          setData(response.data.data || []);
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setData(singleResource ? null : []);
      } else {
        console.error('Failed to refetch data:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, reportingPeriod, singleResource]);

  return {
    data,
    resourceId,
    loading,
    saving,
    error,
    createResource,
    updateResource,
    deleteResource,
    exportData,
    refetch
  };
};

export default useDedicatedModelForm;
