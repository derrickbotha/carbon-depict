const nodemailer = require('nodemailer')
const { getQueue } = require('../services/queueService')

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

// Verify transporter configuration (only if credentials are provided)
if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && 
    !process.env.SMTP_USER.includes('your-email') && 
    !process.env.SMTP_PASSWORD.includes('your-gmail')) {
  transporter.verify((error, success) => {
    if (error) {
      console.warn('⚠️  Email transporter verification failed:', error.message)
      console.warn('   Email functionality will be disabled until valid credentials are provided.')
    } else {
      console.log('✅ Email transporter ready to send emails')
    }
  })
} else {
  console.log('ℹ️  Email transporter not configured (using placeholder credentials)')
  console.log('   Update SMTP_USER and SMTP_PASSWORD in .env to enable email functionality')
}

/**
 * Email templates
 */
const emailTemplates = {
  verification: (data) => ({
    subject: 'Verify your Carbon Depict account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Carbon Depict</h1>
              <p>Verify Your Account</p>
            </div>
            <div class="content">
              <p>Hi ${data.firstName},</p>
              <p>Thank you for registering with Carbon Depict! Please verify your email address to activate your account.</p>
              <p style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${data.token}" class="button">
                  Verify Email Address
                </a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">
                ${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${data.token}
              </p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with Carbon Depict, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Carbon Depict. All rights reserved.</p>
              <p>Empowering organizations to track, report, and reduce their carbon footprint.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to Carbon Depict',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Welcome to Carbon Depict!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.firstName},</p>
              <p>Welcome to <strong>${data.companyName}</strong>'s Carbon Depict account! We're excited to help you on your sustainability journey.</p>
              
              <h3>Get Started:</h3>
              
              <div class="feature">
                <strong>📊 Track Emissions</strong><br>
                Monitor Scope 1, 2, and 3 emissions across your organization
              </div>
              
              <div class="feature">
                <strong>📈 Generate Reports</strong><br>
                Create comprehensive ESG reports compliant with GRI, SASB, and TCFD
              </div>
              
              <div class="feature">
                <strong>🤖 AI Insights</strong><br>
                Leverage AI-powered predictions and recommendations
              </div>
              
              <div class="feature">
                <strong>🎯 Set Targets</strong><br>
                Define and track progress towards your net-zero goals
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="button">
                  Go to Dashboard
                </a>
              </p>
              
              <p>Need help getting started? Check out our <a href="${process.env.CLIENT_URL}/docs">documentation</a> or contact our support team.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Carbon Depict. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset your Carbon Depict password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p>Hi ${data.firstName},</p>
              <p>We received a request to reset your Carbon Depict password.</p>
              
              <p style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${data.token}" class="button">
                  Reset Password
                </a>
              </p>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">
                ${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${data.token}
              </p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Carbon Depict. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

/**
 * Process email jobs
 */
const processEmailJob = async (job) => {
  const { name, data } = job
  
  try {
    console.log(`Processing email job: ${name} (Job ID: ${job.id})`)
    
    // Get email template
    const template = emailTemplates[name]
    
    if (!template) {
      throw new Error(`Email template '${name}' not found`)
    }
    
    const { subject, html } = template(data)
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Carbon Depict" <${process.env.SMTP_FROM || 'noreply@carbondepict.com'}>`,
      to: data.to,
      subject: data.subject || subject,
      html
    })
    
    console.log(`Email sent: ${info.messageId}`)
    
    // Update job progress
    job.progress(100)
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    }
  } catch (error) {
    console.error(`Email job failed: ${name} (Job ID: ${job.id})`, error)
    throw error
  }
}

/**
 * Start email worker
 */
const startEmailWorker = () => {
  const emailQueue = getQueue('email')
  
  emailQueue.process('*', 5, processEmailJob) // Process 5 jobs concurrently
  
  // Event listeners
  emailQueue.on('completed', (job, result) => {
    console.log(`Email job completed: ${job.name} (Job ID: ${job.id})`)
  })
  
  emailQueue.on('failed', (job, error) => {
    console.error(`Email job failed: ${job.name} (Job ID: ${job.id})`, error.message)
  })
  
  emailQueue.on('stalled', (job) => {
    console.warn(`Email job stalled: ${job.name} (Job ID: ${job.id})`)
  })
  
  console.log('Email worker started')
}

module.exports = {
  startEmailWorker,
  processEmailJob
}
