/**
 * ESG Report Generator
 * Generates framework-specific PDF reports with preview functionality
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import esgDataManager from './esgDataManager';

// Framework-specific report templates
const FRAMEWORK_TEMPLATES = {
  gri: {
    name: 'GRI Standards 2021',
    sections: [
      { id: 'organizational-profile', title: '2. Organizational Profile', subsections: ['2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8', '2-9', '2-10'] },
      { id: 'strategy', title: '2. Strategy, Policies and Practices', subsections: ['2-12', '2-13', '2-14', '2-15', '2-16', '2-17', '2-18', '2-19', '2-20', '2-21', '2-22', '2-23', '2-24', '2-25', '2-26', '2-27', '2-28'] },
      { id: 'stakeholder', title: '2. Stakeholder Engagement', subsections: ['2-29', '2-30'] },
      { id: 'material-topics', title: '3. Material Topics', subsections: ['3-1', '3-2', '3-3'] },
      { id: 'environmental', title: 'Environmental Standards', subsections: ['GRI 301', 'GRI 302', 'GRI 303', 'GRI 304', 'GRI 305', 'GRI 306'] },
      { id: 'social', title: 'Social Standards', subsections: ['GRI 401', 'GRI 403', 'GRI 404', 'GRI 405', 'GRI 406'] },
      { id: 'governance', title: 'Governance Standards', subsections: ['GRI 205', 'GRI 206', 'GRI 207'] }
    ]
  },
  tcfd: {
    name: 'TCFD Recommendations',
    sections: [
      { id: 'governance', title: 'Governance', subsections: ['Board Oversight', 'Management Role'] },
      { id: 'strategy', title: 'Strategy', subsections: ['Climate Risks & Opportunities', 'Impact on Business', 'Scenario Analysis'] },
      { id: 'risk-management', title: 'Risk Management', subsections: ['Risk Identification', 'Risk Assessment', 'Risk Integration'] },
      { id: 'metrics-targets', title: 'Metrics and Targets', subsections: ['Climate Metrics', 'GHG Emissions', 'Climate Targets'] }
    ]
  },
  sbti: {
    name: 'Science Based Targets',
    sections: [
      { id: 'commitment', title: 'SBTi Commitment', subsections: ['Commitment Letter', 'Public Announcement'] },
      { id: 'baseline', title: 'Baseline Emissions', subsections: ['Scope 1 Baseline', 'Scope 2 Baseline', 'Scope 3 Baseline'] },
      { id: 'targets', title: 'Target Setting', subsections: ['Near-term Target (2030)', 'Long-term Target (2050)', 'Temperature Alignment'] },
      { id: 'progress', title: 'Progress Tracking', subsections: ['Annual Emissions', 'Reduction Achieved', 'Trajectory Analysis'] },
      { id: 'validation', title: 'SBTi Validation', subsections: ['Validation Status', 'Documentation', 'Public Disclosure'] }
    ]
  },
  csrd: {
    name: 'CSRD/ESRS',
    sections: [
      { id: 'general', title: 'ESRS 2: General Disclosures', subsections: ['Basis of Preparation', 'Governance', 'Strategy', 'Impact Assessment'] },
      { id: 'e1', title: 'ESRS E1: Climate Change', subsections: ['Transition Plan', 'Policies', 'Actions', 'Metrics'] },
      { id: 'e2', title: 'ESRS E2: Pollution', subsections: ['Air Pollution', 'Water Pollution', 'Soil Pollution'] },
      { id: 'e3', title: 'ESRS E3: Water & Marine', subsections: ['Water Consumption', 'Water Discharge', 'Marine Resources'] },
      { id: 'e4', title: 'ESRS E4: Biodiversity', subsections: ['Impact Assessment', 'Protected Areas', 'Species'] },
      { id: 'e5', title: 'ESRS E5: Circular Economy', subsections: ['Resource Inflows', 'Resource Outflows', 'Waste'] },
      { id: 's1', title: 'ESRS S1: Own Workforce', subsections: ['Working Conditions', 'Equal Treatment', 'Other Rights'] },
      { id: 'g1', title: 'ESRS G1: Business Conduct', subsections: ['Corporate Culture', 'Whistleblower', 'Animal Welfare'] }
    ]
  },
  cdp: {
    name: 'CDP Climate Change',
    sections: [
      { id: 'governance', title: 'C1: Governance', subsections: ['Board Oversight', 'Management Responsibility'] },
      { id: 'risks-opportunities', title: 'C2: Risks & Opportunities', subsections: ['Risk Identification', 'Opportunity Identification'] },
      { id: 'strategy', title: 'C3: Business Strategy', subsections: ['Strategic Planning', 'Financial Impact'] },
      { id: 'targets', title: 'C4: Targets & Performance', subsections: ['Emissions Targets', 'Target Progress'] },
      { id: 'emissions', title: 'C6-C7: Emissions', subsections: ['Scope 1', 'Scope 2', 'Scope 3'] },
      { id: 'engagement', title: 'C12: Engagement', subsections: ['Value Chain', 'Public Policy'] }
    ]
  },
  sdg: {
    name: 'UN SDG Alignment',
    sections: [
      { id: 'mapping', title: 'SDG Mapping', subsections: ['Relevant SDGs', 'Target Alignment'] },
      { id: 'contributions', title: 'SDG Contributions', subsections: ['Positive Impacts', 'Negative Impacts'] },
      { id: 'metrics', title: 'SDG Metrics', subsections: ['KPIs', 'Progress Measurement'] },
      { id: 'partnerships', title: 'SDG 17: Partnerships', subsections: ['Collaborations', 'Multi-stakeholder Initiatives'] }
    ]
  },
  sasb: {
    name: 'SASB Standards',
    sections: [
      { id: 'industry', title: 'Industry Classification', subsections: ['SICS Sector', 'SICS Industry'] },
      { id: 'material-topics', title: 'Material Topics', subsections: ['Environment', 'Social Capital', 'Human Capital', 'Business Model'] },
      { id: 'metrics', title: 'SASB Metrics', subsections: ['Accounting Metrics', 'Activity Metrics'] },
      { id: 'disclosure', title: 'Disclosure Analysis', subsections: ['Completeness', 'Comparability'] }
    ]
  },
  issb: {
    name: 'ISSB Standards',
    sections: [
      { id: 'governance', title: 'Governance', subsections: ['Oversight', 'Management Role'] },
      { id: 'strategy', title: 'Strategy', subsections: ['Sustainability-related Risks', 'Opportunities'] },
      { id: 'risk-management', title: 'Risk Management', subsections: ['Risk Processes', 'Integration'] },
      { id: 'metrics', title: 'Metrics & Targets', subsections: ['Performance Metrics', 'Targets'] }
    ]
  },
  pcaf: {
    name: 'PCAF Standard',
    sections: [
      { id: 'portfolio', title: 'Portfolio Overview', subsections: ['Total Portfolio Value', 'Asset Classes', 'Coverage'] },
      { id: 'financed-emissions', title: 'Financed Emissions', subsections: ['Scope 1 Financed', 'Scope 2 Financed', 'Scope 3 Financed'] },
      { id: 'attribution', title: 'Attribution Methodology', subsections: ['Attribution Factors', 'Calculation Method'] },
      { id: 'data-quality', title: 'Data Quality Score', subsections: ['Score 1 (Reported)', 'Score 2 (Physical)', 'Score 3 (Economic)', 'Score 4 (Sector)', 'Score 5 (Proxy)'] },
      { id: 'asset-classes', title: 'Asset Class Breakdown', subsections: ['Listed Equity', 'Corporate Bonds', 'Business Loans', 'Real Estate', 'Project Finance'] },
      { id: 'targets', title: 'Portfolio Alignment', subsections: ['SBTi Coverage', 'Net Zero Commitment', 'Temperature Alignment'] }
    ]
  }
};

class ReportGenerator {
  constructor(frameworkId) {
    this.frameworkId = frameworkId;
    this.template = FRAMEWORK_TEMPLATES[frameworkId];
    if (!this.template) {
      throw new Error(`Unsupported framework: ${frameworkId}`);
    }
    this.data = null;
    this.scores = null;
    this.doc = null;
  }

  async ensureDataLoaded() {
    if (!this.data) {
      try {
        this.data = await esgDataManager.getFrameworkData(this.frameworkId);
      } catch (error) {
        console.error(`Error loading data for framework ${this.frameworkId}:`, error);
        this.data = {};
      }
    }

    if (!this.scores) {
      try {
        this.scores = esgDataManager.getFrameworkScore(this.frameworkId) || {};
      } catch (error) {
        console.error(`Error loading scores for framework ${this.frameworkId}:`, error);
        this.scores = {};
      }
    }
  }

  // Generate preview HTML
  async generatePreview() {
    await this.ensureDataLoaded();

    const sections = this.template.sections.map(section => {
      const subsectionData = this._getSubsectionData(section);
      return {
        title: section.title,
        subsections: section.subsections.map(sub => ({
          name: sub,
          data: subsectionData[sub] || 'No data available'
        }))
      };
    });

    return {
      frameworkId: this.frameworkId,
      framework: this.template.name,
      generatedDate: new Date().toLocaleDateString(),
      progress: this.scores?.progress || 0,
      score: this.scores?.score || 0,
      sections
    };
  }

  // Generate and download PDF
  async generatePDF() {
    await this.ensureDataLoaded();

    this.doc = new jsPDF();
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title Page
    this._addTitlePage();
    this.doc.addPage();

    // Table of Contents
    yPosition = 20;
    this._addTableOfContents();
    this.doc.addPage();

    // Executive Summary
    yPosition = 20;
    this._addExecutiveSummary();
    this.doc.addPage();

    // Content Sections
    for (const section of this.template.sections) {
      yPosition = 20;
      yPosition = this._addSection(section, yPosition);
      this.doc.addPage();
    }

    // Appendix
    yPosition = 20;
    this._addAppendix();

    // Save PDF
    const fileName = `${this.frameworkId}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(fileName);
  }

  _addTitlePage() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();

    // Logo/Header area
    this.doc.setFillColor(7, 57, 60); // greenly-midnight
    this.doc.rect(0, 0, pageWidth, 60, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Carbon Depict', pageWidth / 2, 35, { align: 'center' });

    // Framework Title
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.template.name, pageWidth / 2, 100, { align: 'center' });

    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Sustainability Report', pageWidth / 2, 120, { align: 'center' });

    // Date
    this.doc.setFontSize(12);
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    this.doc.text(`Generated: ${reportDate}`, pageWidth / 2, 140, { align: 'center' });

    // Score badge
    if (this.scores?.score > 0) {
      this.doc.setFillColor(27, 153, 139); // greenly-teal
      this.doc.circle(pageWidth / 2, 180, 25, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(24);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${this.scores.score}`, pageWidth / 2, 185, { align: 'center' });
      this.doc.setFontSize(10);
      this.doc.text('Score', pageWidth / 2, 195, { align: 'center' });
    }

    // Footer
    this.doc.setTextColor(150, 150, 150);
    this.doc.setFontSize(10);
    this.doc.text('Confidential', pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  _addTableOfContents() {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Table of Contents', 20, 30);

    let y = 50;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');

    const toc = [
      'Executive Summary',
      ...this.template.sections.map(s => s.title),
      'Appendix'
    ];

    toc.forEach((item, index) => {
      this.doc.text(`${index + 1}. ${item}`, 25, y);
      y += 10;
    });
  }

  _addExecutiveSummary() {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Executive Summary', 20, 30);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    let y = 50;

    const summary = [
      `This report provides a comprehensive overview of our ${this.template.name} disclosure.`,
      `Data collection progress: ${this.scores?.progress || 0}%`,
      `Overall score: ${this.scores?.score || 0}/100`,
      `Report generated: ${new Date().toLocaleDateString()}`,
      '',
      'Key Highlights:',
    ];

    summary.forEach(line => {
      this.doc.text(line, 20, y);
      y += 8;
    });

    // Add summary table
    y += 10;
    const summaryData = this.template.sections.map(section => [
      section.title,
      `${section.subsections.length} items`,
      this._getSectionCompleteness(section)
    ]);

    this.doc.autoTable({
      startY: y,
      head: [['Section', 'Items', 'Completeness']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [7, 57, 60] },
      margin: { left: 20, right: 20 }
    });
  }

  _addSection(section, yPosition) {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(7, 57, 60);
    this.doc.text(section.title, 20, yPosition);
    yPosition += 15;

    const subsectionData = this._getSubsectionData(section);

    section.subsections.forEach(subsection => {
      const data = subsectionData[subsection];

      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(subsection, 25, yPosition);
      yPosition += 8;

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      if (data && data !== 'No data available') {
        const lines = this.doc.splitTextToSize(JSON.stringify(data, null, 2), 160);
        lines.forEach(line => {
          if (yPosition > 270) {
            this.doc.addPage();
            yPosition = 20;
          }
          this.doc.text(line, 30, yPosition);
          yPosition += 6;
        });
      } else {
        this.doc.setTextColor(150, 150, 150);
        this.doc.text('No data available for this subsection', 30, yPosition);
        this.doc.setTextColor(0, 0, 0);
        yPosition += 6;
      }

      yPosition += 5;
    });

    return yPosition;
  }

  _addAppendix() {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Appendix', 20, 30);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    let y = 50;

    const appendixContent = [
      'Methodology',
      'Data Sources',
      'Calculation Methods',
      'Assumptions and Limitations',
      'Glossary of Terms',
      'Contact Information'
    ];

    appendixContent.forEach(item => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item, 20, y);
      y += 8;
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Details to be provided...', 25, y);
      y += 15;
    });
  }

  _getSubsectionData(section) {
    const sectionData = {};
    const sourceData = this.data && typeof this.data === 'object' ? this.data : {};

    if (sourceData && typeof sourceData === 'object') {
      section.subsections.forEach(subsection => {
        // Try to find matching data in the stored data
        const key = subsection.toLowerCase().replace(/[^a-z0-9]/g, '-');
        sectionData[subsection] = sourceData[key] || sourceData[subsection] || null;
      });
    }

    return sectionData;
  }

  _getSectionCompleteness(section) {
    const subsectionData = this._getSubsectionData(section);
    const total = section.subsections.length;
    const completed = section.subsections.filter(sub => {
      const data = subsectionData[sub];
      return data && data !== 'No data available';
    }).length;
    return `${completed}/${total} (${Math.round((completed / total) * 100)}%)`;
  }
}

// Export report generation functions
export const generateReportPreview = async (frameworkId) => {
  const generator = new ReportGenerator(frameworkId);
  return generator.generatePreview();
};

export const downloadFrameworkReport = async (frameworkId) => {
  const generator = new ReportGenerator(frameworkId);
  await generator.generatePDF();
};

export const getFrameworkTemplate = (frameworkId) => {
  return FRAMEWORK_TEMPLATES[frameworkId];
};

export default ReportGenerator;
