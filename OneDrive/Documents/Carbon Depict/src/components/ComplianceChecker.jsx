// Cache bust 2025-10-23
import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Badge,
} from '@mui/material'
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Upload,
  SaveAlt,
  Publish,
  Refresh,
  Description,
  Link as LinkIcon,
  AttachFile,
  DeleteOutline,
  VisibilityOutlined,
} from '@mui/icons-material'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const ComplianceChecker = ({ initialData, metricId, framework, onSave, onPublish }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialData || {})
  const [selectedFramework, setSelectedFramework] = useState(framework || 'GRI')
  const [complianceResult, setComplianceResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [saveMode, setSaveMode] = useState('draft') // 'draft' or 'published'
  const [proofDialogOpen, setProofDialogOpen] = useState(false)
  const [uploadedProofs, setUploadedProofs] = useState([])
  const [frameworks, setFrameworks] = useState([])
  const [loading, setLoading] = useState(false)

  // Load available frameworks
  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const response = await axios.get('/api/compliance/frameworks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setFrameworks(response.data.frameworks || [])
      } catch (error) {
        console.error('Error loading frameworks:', error)
      }
    }
    fetchFrameworks()
  }, [])

  // Real-time compliance check as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        checkCompliance(false) // Silent check without notifications
      }
    }, 2000) // Debounce 2 seconds

    return () => clearTimeout(timer)
  }, [formData, selectedFramework])

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const checkCompliance = async (showNotification = true) => {
    if (!formData || Object.keys(formData).length === 0) {
      return
    }

    setAnalyzing(true)
    try {
      const response = await axios.post('/api/compliance/analyze', {
        framework: selectedFramework,
        data: formData,
        saveAs: null // Just analyze, don't save
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      setComplianceResult(response.data.analysis)
      
      if (showNotification) {
        // Show toast notification
        console.log('Compliance check complete:', response.data.analysis.score)
      }
    } catch (error) {
      console.error('Compliance check error:', error)
      // Graceful fallback - don't block user
      setComplianceResult({
        success: false,
        score: { overall: 0, isCompliant: false },
        feedback: {
          summary: 'Unable to check compliance. You can still save as draft.',
          recommendations: []
        }
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = async (mode = 'draft') => {
    setLoading(true)
    setSaveMode(mode)

    try {
      const response = await axios.post('/api/compliance/analyze', {
        framework: selectedFramework,
        data: formData,
        saveAs: mode,
        metricId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (response.data.success) {
        setComplianceResult(response.data.analysis)
        
        if (mode === 'draft') {
          alert('✅ Saved as draft. Review compliance feedback before publishing.')
          if (onSave) onSave(response.data.metric)
        } else {
          if (response.data.analysis.score?.isCompliant) {
            alert('🎉 Published successfully! Compliant with ' + selectedFramework)
            if (onPublish) onPublish(response.data.metric)
          } else {
            alert('⚠️ Cannot publish: Compliance score too low. Address feedback first.')
          }
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleReanalyze = async () => {
    await checkCompliance(true)
  }

  const handleUploadProof = async (proofType, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('metricId', metricId)
      formData.append('proofType', proofType)

      // Upload file (you'll need a file upload endpoint)
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      // Record proof
      await axios.post('/api/compliance/upload-proof', {
        metricId,
        proofType,
        fileUrl: uploadResponse.data.url,
        fileName: file.name,
        description: proofType
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      setUploadedProofs(prev => [...prev, {
        type: proofType,
        fileName: file.name,
        url: uploadResponse.data.url
      }])

      alert('✅ Proof uploaded successfully')
    } catch (error) {
      console.error('Upload proof error:', error)
      alert('Error uploading proof: ' + error.message)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 75) return 'info'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getGradeIcon = (isCompliant) => {
  if (isCompliant) return <Check strokeWidth={2} />
    return <Warning color="warning" />
  }

  return (
    <Box>
      {/* Framework Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Framework Compliance Checker
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Framework</InputLabel>
            <Select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              label="Select Framework"
            >
              {frameworks.map((fw) => (
                <MenuItem key={fw.framework} value={fw.framework}>
                  {fw.name} ({fw.framework})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {analyzing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Analyzing compliance...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Compliance Score Card */}
      {complianceResult && (
        <Card sx={{ mb: 3, bgcolor: complianceResult.score?.isCompliant ? 'success.light' : 'warning.light' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getGradeIcon(complianceResult.score?.isCompliant)}
                  <Box>
                    <Typography variant="h6">
                      {complianceResult.feedback?.summary || 'Compliance Analysis'}
                    </Typography>
                    <Typography variant="body2">
                      Score: {complianceResult.score?.overall}/100 
                      {complianceResult.score?.grade && ` (Grade: ${complianceResult.score.grade})`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={complianceResult.score?.isCompliant ? 'Compliant' : 'Non-Compliant'}
                    color={complianceResult.score?.isCompliant ? 'success' : 'warning'}
                    size="large"
                  />
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={complianceResult.score?.overall || 0}
                      color={getScoreColor(complianceResult.score?.overall || 0)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Missing Elements Alert */}
      {complianceResult?.feedback?.missingElements?.length > 0 && (
        <>
          <Alert strokeWidth={2} />
          <div className="mt-2">
            <Typography variant="subtitle2" gutterBottom>
              Missing or Incomplete Elements ({complianceResult.feedback.missingElements.length})
            </Typography>
            <List dense>
              {complianceResult.feedback.missingElements.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Chip
                      label={item.severity}
                      size="small"
                      color={item.severity === 'critical' ? 'error' : 'warning'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.field}
                    secondary={
                      <>
                        <strong>Required:</strong> {item.requirement}<br />
                        <strong>Guidance:</strong> {item.guidance}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </>
      )}

      {/* Recommendations */}
      {complianceResult?.feedback?.recommendations?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Info strokeWidth={2} />
              Recommendations
            </Typography>
            <List>
              {complianceResult.feedback.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Chip
                      label={rec.priority}
                      size="small"
                      color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'default'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={rec.action}
                    secondary={rec.impact}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Proof Requirements */}
      {complianceResult?.feedback?.proofRequired?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AttachFile sx={{ verticalAlign: 'middle', mr: 1 }} />
              Required Documentation & Proof
            </Typography>
            <List>
              {complianceResult.feedback.proofRequired.map((proof, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Upload strokeWidth={2} />}
                      component="label"
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleUploadProof(proof.type, e.target.files[0])}
                      />
                    </Button>
                  }
                >
                  <ListItemIcon>
                    {proof.mandatory ? (
                      <Error color="error" />
                    ) : (
                      <Description color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        {proof.type} {proof.mandatory && <Chip label="Required" color="error" size="small" />}
                      </>
                    }
                    secondary={
                      <>
                        <strong>Description:</strong> {proof.description}<br />
                        <strong>Purpose:</strong> {proof.purpose}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {uploadedProofs.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Uploaded Proofs
                </Typography>
                <List dense>
                  {uploadedProofs.map((proof, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Check strokeWidth={2} />
                      </ListItemIcon>
                      <ListItemText
                        primary={proof.fileName}
                        secondary={proof.type}
                      />
                      <IconButton size="small" href={proof.url} target="_blank">
                        <VisibilityOutlined />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReanalyze}
                disabled={analyzing || loading}
              >
                Re-analyze
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Save strokeWidth={2} />}
                onClick={() => handleSave('draft')}
                disabled={analyzing || loading}
              >
                Save as Draft
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Tooltip
                title={
                  complianceResult?.score?.isCompliant
                    ? 'Publish to dashboard'
                    : 'Compliance score too low to publish'
                }
              >
                <span>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<Publish />}
                    onClick={() => handleSave('published')}
                    disabled={
                      analyzing ||
                      loading ||
                      !complianceResult?.score?.isCompliant
                    }
                  >
                    Publish
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>

          {!complianceResult?.score?.isCompliant && complianceResult && (
            <>
              <Alert strokeWidth={2} />
              <div className="mt-2">
                <Typography variant="body2">
                  💡 <strong>Tip:</strong> Address the missing elements and upload required proof to improve your compliance score before publishing.
                </Typography>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Regulatory Notes */}
      {complianceResult?.feedback?.regulatoryNotes?.length > 0 && (
        <Card sx={{ mt: 3, bgcolor: 'info.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="info.dark">
              📋 Regulatory Notes
            </Typography>
            <List>
              {complianceResult.feedback.regulatoryNotes.map((note, index) => (
                <ListItem key={index}>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ComplianceChecker

