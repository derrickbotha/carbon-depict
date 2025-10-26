// Cache bust 2025-10-26
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Download, Eye, X, FileDown, CheckCircle, AlertCircle, Loader2 } from '@atoms/Icon'
import { enterpriseAPI } from '../../services/enterpriseAPI'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx'
import { saveAs } from 'file-saver'

export default function ReportGenerator() {
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState(null)
  const [formData, setFormData] = useState({
    framework: 'GRI',
    reportType: 'Annual',
    year: new Date().getFullYear(),
    includeData: true,
    includeCharts: true,
    format: 'pdf'
  })

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    
    setIsGenerating(true)
    setGenerationStatus(null)
    
    try {
      // Call backend API to generate report
      const response = await enterpriseAPI.reports.generate({
        framework: formData.framework,
        reportType: formData.reportType,
        year: formData.year,
        format: formData.format,
        includeData: formData.includeData,
        includeCharts: formData.includeCharts
      })
      
      if (response.data.success) {
        // Generate actual file based on format
        if (formData.format === 'html') {
          await generateHTMLReport()
        } else if (formData.format === 'pdf') {
          await generatePDFReport()
        } else if (formData.format === 'docx') {
          await generateDOCXReport()
        }
        
        setGenerationStatus({
          type: 'success',
          message: 'Report generated successfully!'
        })
        
        setTimeout(() => {
          setGenerationStatus(null)
          navigate('/dashboard/esg/reports')
        }, 2000)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      setGenerationStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to generate report'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePDFReport = async () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Helper function to add new page if needed
    const checkPageBreak = (spaceNeeded) => {
      if (yPosition + spaceNeeded > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
        return true
      }
      return false
    }

    // Helper function to add text with word wrap
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      doc.setTextColor(...color)
      const lines = doc.splitTextToSize(text, pageWidth - 40)
      lines.forEach(line => {
        checkPageBreak(fontSize * 0.5)
        doc.text(line, 20, yPosition)
        yPosition += fontSize * 0.5
      })
    }

    // Cover Page
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(`${formData.reportType.charAt(0).toUpperCase() + formData.reportType.slice(1)} ESG Report`, pageWidth / 2, 60, { align: 'center' })
    
    doc.setFontSize(18)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(`${formData.year}`, pageWidth / 2, 75, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(20, 184, 166)
    doc.setFillColor(209, 250, 229)
    doc.roundedRect(pageWidth / 2 - 40, 85, 80, 12, 3, 3, 'F')
    doc.text(getFrameworkName(), pageWidth / 2, 92, { align: 'center' })
    
    yPosition = 120

    // Executive Summary
    addText('Executive Summary', 16, true, [15, 23, 42])
    yPosition += 5
    addText(`This report presents our organization's environmental, social, and governance (ESG) performance for the year ${formData.year}. We have structured this report in accordance with ${getFrameworkName()} requirements to provide transparency and accountability to our stakeholders.`, 11)
    yPosition += 10

    // Key Metrics
    const metrics = [
      { label: 'Emissions Reduction', value: '42%', color: [22, 163, 74] },
      { label: 'Employee Satisfaction', value: '95%', color: [37, 99, 235] },
      { label: 'Board Independence', value: '100%', color: [147, 51, 234] }
    ]
    
    metrics.forEach((metric, idx) => {
      const x = 20 + (idx * 60)
      checkPageBreak(25)
      doc.setFillColor(240, 253, 244)
      doc.roundedRect(x, yPosition, 50, 20, 3, 3, 'F')
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...metric.color)
      doc.text(metric.value, x + 25, yPosition + 10, { align: 'center' })
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(metric.label, x + 25, yPosition + 16, { align: 'center' })
    })
    yPosition += 30

    // Company Profile
    checkPageBreak(40)
    addText('Company Profile', 14, true, [15, 23, 42])
    yPosition += 3
    
    const profileData = [
      ['Organization Name:', 'Carbon Depict Inc.'],
      ['Industry Sector:', 'Technology & Sustainability'],
      ['Reporting Period:', `January 1 - December 31, ${formData.year}`],
      ['Reporting Standard:', getFrameworkName()]
    ]
    
    profileData.forEach(([label, value]) => {
      checkPageBreak(8)
      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139)
      doc.text(label, 20, yPosition)
      doc.setTextColor(15, 23, 42)
      doc.setFont('helvetica', 'bold')
      doc.text(value, 80, yPosition)
      doc.setFont('helvetica', 'normal')
      yPosition += 7
    })
    yPosition += 5

    // Materiality Assessment
    checkPageBreak(30)
    addText('Materiality Assessment', 14, true, [15, 23, 42])
    yPosition += 3
    addText('We conducted a comprehensive double materiality assessment to identify and prioritize ESG topics that are most significant to our business and stakeholders.', 11)
    yPosition += 5
    
    const topics = [
      'Climate Change & GHG Emissions (High Priority)',
      'Energy Management (High Priority)',
      'Employee Health & Safety (High Priority)',
      'Data Privacy & Security (Medium Priority)',
      'Board Composition & Independence (Medium Priority)'
    ]
    
    topics.forEach(topic => {
      checkPageBreak(7)
      doc.setFontSize(10)
      doc.setTextColor(71, 85, 105)
      doc.text(`• ${topic}`, 25, yPosition)
      yPosition += 6
    })
    yPosition += 5

    // Environmental Performance
    checkPageBreak(30)
    addText('Environmental Performance', 14, true, [15, 23, 42])
    yPosition += 5

    if (formData.includeData) {
      const tableData = [
        ['Metric', `Baseline\n(${formData.year - 1})`, `Current\n(${formData.year})`, 'Change'],
        ['Total GHG Emissions (tCO2e)', '1,250', '725', '-42%'],
        ['Energy Consumption (MWh)', '3,500', '2,800', '-20%'],
        ['Renewable Energy (%)', '45%', '78%', '+33pp'],
        ['Water Consumption (m³)', '12,500', '10,200', '-18%']
      ]

      tableData.forEach((row, idx) => {
        checkPageBreak(10)
        const isHeader = idx === 0
        doc.setFontSize(9)
        doc.setFont('helvetica', isHeader ? 'bold' : 'normal')
        doc.setTextColor(15, 23, 42)
        
        if (isHeader) {
          doc.setFillColor(241, 245, 249)
          doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F')
        }
        
        doc.text(row[0], 22, yPosition)
        doc.text(row[1], 95, yPosition, { align: 'right' })
        doc.text(row[2], 135, yPosition, { align: 'right' })
        
        if (!isHeader) {
          doc.setTextColor(22, 163, 74)
        }
        doc.text(row[3], 175, yPosition, { align: 'right' })
        doc.setTextColor(15, 23, 42)
        
        yPosition += 8
      })
    }
    yPosition += 10

    // Social Performance
    checkPageBreak(40)
    addText('Social Performance', 14, true, [15, 23, 42])
    yPosition += 5

    const socialMetrics = [
      ['Total Employees', '248'],
      ['Gender Diversity (Women)', '47%'],
      ['Training Hours/Employee', '42'],
      ['Lost Time Injury Rate', '0.12']
    ]

    socialMetrics.forEach(([label, value], idx) => {
      if (idx % 2 === 0 && idx > 0) yPosition += 20
      const x = idx % 2 === 0 ? 20 : 110
      checkPageBreak(20)
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(x, yPosition, 80, 18, 2, 2, 'F')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(label, x + 5, yPosition + 7)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(value, x + 5, yPosition + 14)
      doc.setFont('helvetica', 'normal')
    })
    yPosition += 25

    // Governance
    checkPageBreak(30)
    addText('Governance & Ethics', 14, true, [15, 23, 42])
    yPosition += 5

    const governance = [
      'Independent Board Chair',
      '100% Independent Audit Committee',
      'ESG Committee established',
      'Anti-corruption policies implemented',
      'Whistleblower protection program active'
    ]

    governance.forEach(item => {
      checkPageBreak(7)
      doc.setFontSize(10)
      doc.setTextColor(71, 85, 105)
      doc.text(`✓ ${item}`, 25, yPosition)
      yPosition += 6
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(`© ${formData.year} Carbon Depict Inc. All rights reserved.`, pageWidth / 2, pageHeight - 15, { align: 'center' })
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' })

    // Save PDF
    doc.save(`ESG_Report_${formData.framework.toUpperCase()}_${formData.year}.pdf`)
  }

  const generateDOCXReport = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: `${formData.reportType.charAt(0).toUpperCase() + formData.reportType.slice(1)} ESG Report`,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `${formData.year}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: getFrameworkName(),
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Executive Summary
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: `This report presents our organization's environmental, social, and governance (ESG) performance for the year ${formData.year}. We have structured this report in accordance with ${getFrameworkName()} requirements to provide transparency and accountability to our stakeholders.`,
            spacing: { after: 200 }
          }),

          // Key Metrics
          new Paragraph({
            children: [
              new TextRun({ text: 'Emissions Reduction: ', bold: true }),
              new TextRun({ text: '42%  |  ' }),
              new TextRun({ text: 'Employee Satisfaction: ', bold: true }),
              new TextRun({ text: '95%  |  ' }),
              new TextRun({ text: 'Board Independence: ', bold: true }),
              new TextRun({ text: '100%' })
            ],
            spacing: { after: 400 }
          }),

          // Company Profile
          new Paragraph({
            text: 'Company Profile',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Organization Name: ', bold: true }),
              new TextRun({ text: 'Carbon Depict Inc.' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Industry Sector: ', bold: true }),
              new TextRun({ text: 'Technology & Sustainability' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Reporting Period: ', bold: true }),
              new TextRun({ text: `January 1 - December 31, ${formData.year}` })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Reporting Standard: ', bold: true }),
              new TextRun({ text: getFrameworkName() })
            ],
            spacing: { after: 400 }
          }),

          // Materiality Assessment
          new Paragraph({
            text: 'Materiality Assessment',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: 'We conducted a comprehensive double materiality assessment to identify and prioritize ESG topics that are most significant to our business and stakeholders.',
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: 'Key Material Topics:',
            bold: true,
            spacing: { after: 100 }
          }),
          new Paragraph({ text: '• Climate Change & GHG Emissions (High Priority)', spacing: { after: 50 } }),
          new Paragraph({ text: '• Energy Management (High Priority)', spacing: { after: 50 } }),
          new Paragraph({ text: '• Employee Health & Safety (High Priority)', spacing: { after: 50 } }),
          new Paragraph({ text: '• Data Privacy & Security (Medium Priority)', spacing: { after: 50 } }),
          new Paragraph({ text: '• Board Composition & Independence (Medium Priority)', spacing: { after: 400 } }),

          // Environmental Performance
          new Paragraph({
            text: 'Environmental Performance',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          
          ...(formData.includeData ? [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Metric', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: `Baseline (${formData.year - 1})`, bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: `Current (${formData.year})`, bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Change', bold: true })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Total GHG Emissions (tCO2e)')] }),
                    new TableCell({ children: [new Paragraph('1,250')] }),
                    new TableCell({ children: [new Paragraph('725')] }),
                    new TableCell({ children: [new Paragraph('-42%')] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Energy Consumption (MWh)')] }),
                    new TableCell({ children: [new Paragraph('3,500')] }),
                    new TableCell({ children: [new Paragraph('2,800')] }),
                    new TableCell({ children: [new Paragraph('-20%')] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Renewable Energy (%)')] }),
                    new TableCell({ children: [new Paragraph('45%')] }),
                    new TableCell({ children: [new Paragraph('78%')] }),
                    new TableCell({ children: [new Paragraph('+33pp')] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Water Consumption (m³)')] }),
                    new TableCell({ children: [new Paragraph('12,500')] }),
                    new TableCell({ children: [new Paragraph('10,200')] }),
                    new TableCell({ children: [new Paragraph('-18%')] })
                  ]
                })
              ]
            })
          ] : []),

          new Paragraph({ text: '', spacing: { after: 400 } }),

          // Social Performance
          new Paragraph({
            text: 'Social Performance',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Total Employees: ', bold: true }),
              new TextRun({ text: '248' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Gender Diversity (Women): ', bold: true }),
              new TextRun({ text: '47%' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Training Hours/Employee: ', bold: true }),
              new TextRun({ text: '42' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Lost Time Injury Rate: ', bold: true }),
              new TextRun({ text: '0.12' })
            ],
            spacing: { after: 400 }
          }),

          // Governance
          new Paragraph({
            text: 'Governance & Ethics',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ text: '✓ Independent Board Chair', spacing: { after: 50 } }),
          new Paragraph({ text: '✓ 100% Independent Audit Committee', spacing: { after: 50 } }),
          new Paragraph({ text: '✓ ESG Committee established', spacing: { after: 50 } }),
          new Paragraph({ text: '✓ Anti-corruption policies implemented', spacing: { after: 50 } }),
          new Paragraph({ text: '✓ Whistleblower protection program active', spacing: { after: 400 } }),

          // Footer
          new Paragraph({
            text: `© ${formData.year} Carbon Depict Inc. All rights reserved. Generated on ${new Date().toLocaleDateString()}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 }
          })
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `ESG_Report_${formData.framework.toUpperCase()}_${formData.year}.docx`)
  }

  const generateHTMLReport = () => {
    const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.reportType.charAt(0).toUpperCase() + formData.reportType.slice(1)} ESG Report ${formData.year}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; max-width: 1000px; margin: 0 auto; background: #f8fafc; }
    .report-container { background: white; padding: 60px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h1 { font-size: 42px; color: #0f172a; margin-bottom: 20px; text-align: center; border-bottom: 4px solid #14b8a6; padding-bottom: 20px; }
    h2 { font-size: 28px; color: #0f172a; margin: 40px 0 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    h3 { font-size: 20px; color: #334155; margin: 24px 0 12px; }
    .subtitle { text-align: center; font-size: 20px; color: #64748b; margin-bottom: 40px; }
    .badge { display: inline-block; background: #d1fae5; color: #14b8a6; padding: 8px 16px; border-radius: 8px; font-weight: 600; margin: 20px auto; }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
    .metric-card { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 12px; text-align: center; }
    .metric-value { font-size: 36px; font-weight: bold; color: #16a34a; }
    .metric-label { font-size: 14px; color: #64748b; margin-top: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 12px; background: #f8fafc; border-radius: 6px; }
    .info-label { color: #64748b; font-size: 14px; }
    .info-value { font-weight: 600; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #cbd5e1; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .positive { color: #16a34a; font-weight: 600; }
    .highlight-box { background: #f8fafc; border-left: 4px solid #14b8a6; padding: 20px; margin: 20px 0; border-radius: 4px; }
    ul { margin: 16px 0; padding-left: 24px; }
    li { margin: 8px 0; color: #475569; }
    .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #14b8a6; text-align: center; font-size: 12px; color: #94a3b8; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
    .stat-box { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
    .stat-value { font-size: 28px; font-weight: bold; color: #0f172a; margin-top: 8px; }
    .stat-label { font-size: 14px; color: #64748b; }
    @media print { body { padding: 0; background: white; } .report-container { padding: 40px; box-shadow: none; } }
  </style>
</head>
<body>
  <div class="report-container">
    <h1>${formData.reportType.charAt(0).toUpperCase() + formData.reportType.slice(1)} ESG Report</h1>
    <div class="subtitle">${formData.year}</div>
    <div style="text-align: center;">
      <span class="badge">${getFrameworkName()}</span>
    </div>

    <h2>Executive Summary</h2>
    <p>This report presents our organization's environmental, social, and governance (ESG) performance for the year ${formData.year}. We have structured this report in accordance with ${getFrameworkName()} requirements to provide transparency and accountability to our stakeholders.</p>
    
    <div class="metrics">
      <div class="metric-card" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
        <div class="metric-value" style="color: #16a34a;">42%</div>
        <div class="metric-label">Emissions Reduction</div>
      </div>
      <div class="metric-card" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
        <div class="metric-value" style="color: #2563eb;">95%</div>
        <div class="metric-label">Employee Satisfaction</div>
      </div>
      <div class="metric-card" style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);">
        <div class="metric-value" style="color: #9333ea;">100%</div>
        <div class="metric-label">Board Independence</div>
      </div>
    </div>

    <h2>Company Profile</h2>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Organization Name:</span>
        <span class="info-value">Carbon Depict Inc.</span>
      </div>
      <div class="info-row">
        <span class="info-label">Industry Sector:</span>
        <span class="info-value">Technology & Sustainability</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reporting Period:</span>
        <span class="info-value">January 1 - December 31, ${formData.year}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reporting Standard:</span>
        <span class="info-value">${getFrameworkName()}</span>
      </div>
    </div>

    <h2>Materiality Assessment</h2>
    <p>We conducted a comprehensive double materiality assessment to identify and prioritize ESG topics that are most significant to our business and stakeholders.</p>
    <div class="highlight-box">
      <h3>Key Material Topics:</h3>
      <ul>
        <li>Climate Change & GHG Emissions (High Priority)</li>
        <li>Energy Management (High Priority)</li>
        <li>Employee Health & Safety (High Priority)</li>
        <li>Data Privacy & Security (Medium Priority)</li>
        <li>Board Composition & Independence (Medium Priority)</li>
      </ul>
    </div>

    <h2>Environmental Performance</h2>
    ${formData.includeData ? `
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th style="text-align: right;">Baseline (${formData.year - 1})</th>
          <th style="text-align: right;">Current (${formData.year})</th>
          <th style="text-align: right;">Change</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total GHG Emissions (tCO2e)</td>
          <td style="text-align: right;">1,250</td>
          <td style="text-align: right;">725</td>
          <td style="text-align: right;" class="positive">-42%</td>
        </tr>
        <tr>
          <td>Energy Consumption (MWh)</td>
          <td style="text-align: right;">3,500</td>
          <td style="text-align: right;">2,800</td>
          <td style="text-align: right;" class="positive">-20%</td>
        </tr>
        <tr>
          <td>Renewable Energy (%)</td>
          <td style="text-align: right;">45%</td>
          <td style="text-align: right;">78%</td>
          <td style="text-align: right;" class="positive">+33pp</td>
        </tr>
        <tr>
          <td>Water Consumption (m³)</td>
          <td style="text-align: right;">12,500</td>
          <td style="text-align: right;">10,200</td>
          <td style="text-align: right;" class="positive">-18%</td>
        </tr>
      </tbody>
    </table>
    ` : '<p>Environmental performance metrics are available in the detailed data tables.</p>'}

    ${formData.includeCharts ? `
    <div class="highlight-box" style="text-align: center; padding: 40px;">
      <p>📊 <strong>Chart: Emissions Trend ${formData.year - 3} - ${formData.year}</strong></p>
      <p style="font-size: 14px; color: #64748b; margin-top: 8px;">(Charts available in interactive version)</p>
    </div>
    ` : ''}

    <h2>Social Performance</h2>
    <div class="grid-2">
      <div class="stat-box">
        <div class="stat-label">Total Employees</div>
        <div class="stat-value">248</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Gender Diversity (Women)</div>
        <div class="stat-value">47%</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Training Hours/Employee</div>
        <div class="stat-value">42</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Lost Time Injury Rate</div>
        <div class="stat-value">0.12</div>
      </div>
    </div>

    <h2>Governance & Ethics</h2>
    <ul>
      <li>✓ Independent Board Chair</li>
      <li>✓ 100% Independent Audit Committee</li>
      <li>✓ ESG Committee established</li>
      <li>✓ Anti-corruption policies implemented</li>
      <li>✓ Whistleblower protection program active</li>
      <li>✓ Regular sustainability reporting cadence</li>
    </ul>

    <div class="footer">
      <p><strong>This is a generated report. Final verification and assurance pending.</strong></p>
      <p style="margin-top: 8px;">© ${formData.year} Carbon Depict Inc. All rights reserved.</p>
      <p style="margin-top: 4px;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>
    `

    // Create blob and download
    const blob = new Blob([reportHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ESG_Report_${formData.framework.toUpperCase()}_${formData.year}_${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const getFrameworkName = () => {
    const frameworks = {
      GRI: 'GRI Standards 2021',
      TCFD: 'TCFD Climate Disclosures',
      CDP: 'CDP Climate Change',
      CSRD: 'CSRD (ESRS)',
      SBTi: 'SBTi Science-Based Targets',
      SDG: 'UN SDG Progress Report'
    }
    return frameworks[formData.framework] || formData.framework
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/esg/reports')}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-cd-midnight">Generate Report</h1>
          <p className="mt-2 text-cd-muted">
            Create framework-compliant ESG reports with automated data population
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-cd-sm space-y-6">
              <h2 className="text-lg font-semibold text-cd-midnight">Report Configuration</h2>

              {/* Framework Selection */}
              <div>
                <label className="block text-sm font-medium text-cd-midnight mb-2">
                  Reporting Framework *
                </label>
                <select
                  value={formData.framework}
                  onChange={(e) => setFormData({...formData, framework: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                  required
                >
                  <option value="GRI">GRI Standards 2021</option>
                  <option value="TCFD">TCFD Climate Disclosures</option>
                  <option value="CDP">CDP Climate Change</option>
                  <option value="CSRD">CSRD (ESRS)</option>
                  <option value="SBTi">SBTi Science-Based Targets</option>
                  <option value="SDG">UN SDG Progress Report</option>
                </select>
              </div>

              {/* Report Type */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-cd-midnight mb-2">
                    Report Type *
                  </label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({...formData, reportType: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                  >
                    <option value="annual">Annual Report</option>
                    <option value="quarterly">Quarterly Report</option>
                    <option value="summary">Executive Summary</option>
                    <option value="detailed">Detailed Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cd-midnight mb-2">
                    Reporting Year *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                  />
                </div>
              </div>

              {/* Include Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.includeData}
                    onChange={(e) => setFormData({...formData, includeData: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-cd-teal focus:ring-cd-teal"
                  />
                  <span className="text-sm text-cd-midnight">Include detailed data tables</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.includeCharts}
                    onChange={(e) => setFormData({...formData, includeCharts: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-cd-teal focus:ring-cd-teal"
                  />
                  <span className="text-sm text-cd-midnight">Include charts and visualizations</span>
                </label>
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-cd-midnight mb-2">
                  Export Format *
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {['pdf', 'docx', 'html'].map(format => (
                    <label key={format} className="flex items-center gap-2 rounded-lg border border-gray-300 p-3 cursor-pointer hover:border-cd-teal">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={formData.format === format}
                        onChange={(e) => setFormData({...formData, format: e.target.value})}
                        className="text-cd-teal focus:ring-cd-teal"
                      />
                      <span className="text-sm font-medium uppercase">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 transition-colors"
                disabled={isGenerating}
              >
                <Eye className="h-5 w-5" />
                Preview
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-lg bg-cd-teal px-6 py-2 text-white hover:bg-cd-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download strokeWidth={2} />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Status Messages */}
          {generationStatus && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
              generationStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {generationStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{String(generationStatus.message || '')}</span>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="text-lg font-semibold text-cd-midnight mb-4">Report Preview</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-cd-muted">Framework</p>
              <p className="font-medium text-cd-midnight">
                {formData.framework === 'gri' && 'GRI Standards 2021'}
                {formData.framework === 'tcfd' && 'TCFD Recommendations'}
                {formData.framework === 'csrd' && 'CSRD (ESRS)'}
                {formData.framework === 'cdp' && 'CDP Climate Change'}
                {formData.framework === 'sdg' && 'UN SDG Report'}
                {formData.framework === 'sasb' && 'SASB Standards'}
              </p>
            </div>
            <div>
              <p className="text-cd-muted">Type</p>
              <p className="font-medium text-cd-midnight capitalize">{formData.reportType}</p>
            </div>
            <div>
              <p className="text-cd-muted">Year</p>
              <p className="font-medium text-cd-midnight">{formData.year}</p>
            </div>
            <div>
              <p className="text-cd-muted">Format</p>
              <p className="font-medium text-cd-midnight uppercase">{formData.format}</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-cd-muted mb-2">Sections Included:</p>
              <ul className="space-y-1 text-cd-midnight">
                <li>• Executive Summary</li>
                <li>• Company Profile</li>
                <li>• Materiality Assessment</li>
                {formData.includeData && <li>• Data Tables</li>}
                {formData.includeCharts && <li>• Charts & Graphs</li>}
                <li>• Framework Compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-cd-midnight">Report Preview</h2>
                <p className="text-sm text-cd-muted mt-1">
                  {getFrameworkName()} - {formData.reportType.charAt(0).toUpperCase() + formData.reportType.slice(1)} Report {formData.year}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Report Preview */}
            <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <div className="mx-auto max-w-3xl space-y-8 bg-white">
                {/* Cover Page */}
                <div className="border-b-2 border-cd-teal pb-8">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-cd-midnight">
                      {formData.reportType.charAt(0).toUpperCase() + formData.reportType.slice(1)} ESG Report
                    </h1>
                    <p className="text-xl text-cd-muted">{formData.year}</p>
                    <div className="mt-6 inline-block rounded-lg bg-cd-teal/10 px-6 py-3">
                      <p className="text-sm font-semibold text-cd-teal">{getFrameworkName()}</p>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-cd-midnight border-b border-gray-200 pb-2">
                    Executive Summary
                  </h2>
                  <p className="text-cd-muted leading-relaxed">
                    This report presents our organization's environmental, social, and governance (ESG) performance
                    for the year {formData.year}. We have structured this report in accordance with {getFrameworkName()} 
                    requirements to provide transparency and accountability to our stakeholders.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="rounded-lg bg-green-50 p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">42%</p>
                      <p className="text-sm text-cd-muted mt-1">Emissions Reduction</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">95%</p>
                      <p className="text-sm text-cd-muted mt-1">Employee Satisfaction</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">100%</p>
                      <p className="text-sm text-cd-muted mt-1">Board Independence</p>
                    </div>
                  </div>
                </section>

                {/* Company Profile */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-cd-midnight border-b border-gray-200 pb-2">
                    Company Profile
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cd-muted">Organization Name:</span>
                      <span className="font-medium text-cd-midnight">Carbon Depict Inc.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cd-muted">Industry Sector:</span>
                      <span className="font-medium text-cd-midnight">Technology & Sustainability</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cd-muted">Reporting Period:</span>
                      <span className="font-medium text-cd-midnight">January 1 - December 31, {formData.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cd-muted">Reporting Standard:</span>
                      <span className="font-medium text-cd-midnight">{getFrameworkName()}</span>
                    </div>
                  </div>
                </section>

                {/* Materiality Assessment */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-cd-midnight border-b border-gray-200 pb-2">
                    Materiality Assessment
                  </h2>
                  <p className="text-cd-muted leading-relaxed">
                    We conducted a comprehensive double materiality assessment to identify and prioritize ESG topics
                    that are most significant to our business and stakeholders.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="font-semibold text-cd-midnight mb-3">Key Material Topics:</h3>
                    <ul className="space-y-2 text-sm text-cd-muted">
                      <li>• Climate Change & GHG Emissions (High Priority)</li>
                      <li>• Energy Management (High Priority)</li>
                      <li>• Employee Health & Safety (High Priority)</li>
                      <li>• Data Privacy & Security (Medium Priority)</li>
                      <li>• Board Composition & Independence (Medium Priority)</li>
                    </ul>
                  </div>
                </section>

                {/* Environmental Performance */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-cd-midnight border-b border-gray-200 pb-2">
                    Environmental Performance
                  </h2>
                  {formData.includeData && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-cd-midnight">Metric</th>
                            <th className="px-4 py-3 text-right font-semibold text-cd-midnight">Baseline ({formData.year - 1})</th>
                            <th className="px-4 py-3 text-right font-semibold text-cd-midnight">Current ({formData.year})</th>
                            <th className="px-4 py-3 text-right font-semibold text-cd-midnight">Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-cd-muted">Total GHG Emissions (tCO2e)</td>
                            <td className="px-4 py-3 text-right text-cd-midnight">1,250</td>
                            <td className="px-4 py-3 text-right text-cd-midnight">725</td>
                            <td className="px-4 py-3 text-right text-green-600 font-medium">-42%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-cd-muted">Energy Consumption (MWh)</td>
                            <td className="px-4 py-3 text-right text-cd-midnight">3,500</td>
                            <td className="px-4 py-3 text-right text-cd-midnight">2,800</td>
                            <td className="px-4 py-3 text-right text-green-600 font-medium">-20%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-cd-muted">Renewable Energy (%)</td>
                            <td className="px-4 py-3 text-right text-cd-midnight">45%</td>
                            <td className="px-4 py-3 text-right text-cd-midnight">78%</td>
                            <td className="px-4 py-3 text-right text-green-600 font-medium">+33pp</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {formData.includeCharts && (
                    <div className="rounded-lg bg-gradient-to-br from-green-50 to-blue-50 p-6 text-center">
                      <p className="text-sm text-cd-muted mb-2">📊 Chart: Emissions Trend {formData.year - 3} - {formData.year}</p>
                      <p className="text-xs text-cd-muted">(Charts will be generated in final report)</p>
                    </div>
                  )}
                </section>

                {/* Social Performance */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-cd-midnight border-b border-gray-200 pb-2">
                    Social Performance
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <p className="text-sm text-cd-muted">Total Employees</p>
                      <p className="text-2xl font-bold text-cd-midnight mt-1">248</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <p className="text-sm text-cd-muted">Gender Diversity (Women)</p>
                      <p className="text-2xl font-bold text-cd-midnight mt-1">47%</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <p className="text-sm text-cd-muted">Training Hours/Employee</p>
                      <p className="text-2xl font-bold text-cd-midnight mt-1">42</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <p className="text-sm text-cd-muted">Lost Time Injury Rate</p>
                      <p className="text-2xl font-bold text-cd-midnight mt-1">0.12</p>
                    </div>
                  </div>
                </section>

                {/* Governance */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-cd-midnight border-b border-gray-200 pb-2">
                    Governance & Ethics
                  </h2>
                  <ul className="space-y-2 text-sm text-cd-muted">
                    <li>✓ Independent Board Chair</li>
                    <li>✓ 100% Independent Audit Committee</li>
                    <li>✓ ESG Committee established</li>
                    <li>✓ Anti-corruption policies implemented</li>
                    <li>✓ Whistleblower protection program active</li>
                  </ul>
                </section>

                {/* Footer */}
                <div className="border-t-2 border-cd-teal pt-6 text-center text-xs text-cd-muted">
                  <p>This is a preview. The final report will include additional details and verification.</p>
                  <p className="mt-2">© {formData.year} Carbon Depict Inc. All rights reserved.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-cd-muted">
                Export format: <span className="font-medium text-cd-midnight uppercase">{formData.format}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 rounded-lg bg-cd-teal px-6 py-2 text-white hover:bg-cd-teal/90 transition-colors"
                >
                  <FileDown strokeWidth={2} />
                  Generate & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

