const Queue = require('bull')
const Redis = require('ioredis')

// Check if Redis is enabled
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false'

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    if (!REDIS_ENABLED) return null // Don't retry if disabled
    const delay = Math.min(times * 50, 2000)
    return delay
  }
}

// Create Redis clients for Bull
const createClient = (type) => {
  if (!REDIS_ENABLED) {
    // Return a mock client that does nothing
    return null
  }

  const client = new Redis(redisConfig)
  
  // Suppress repeated connection errors in development
  let errorLogged = false
  client.on('error', (error) => {
    if (!errorLogged && error.code === 'ECONNREFUSED') {
      console.warn(`⚠️  Redis not available - job queues disabled (${error.message})`)
      errorLogged = true
    } else if (error.code !== 'ECONNREFUSED') {
      console.error(`Redis ${type} client error:`, error)
    }
  })
  
  client.on('connect', () => {
    console.log(`✅ Redis ${type} client connected`)
  })
  
  return client
}

// Queue definitions
const queues = {}

/**
 * Initialize job queues
 */
const initializeQueues = () => {
  if (!REDIS_ENABLED) {
    console.log('ℹ️  Redis disabled - job queues will run synchronously')
    return ['email', 'reports', 'dataProcessing', 'aiPredictions', 'notifications', 'exports', 'scheduled']
  }

  // Email queue for sending emails
  queues.email = new Queue('email', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 500 // Keep last 500 failed jobs
    }
  })

  // Report generation queue
  queues.reports = new Queue('reports', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 2,
      timeout: 300000, // 5 minutes
      removeOnComplete: 50,
      removeOnFail: 200
    }
  })

  // Data processing queue (emissions calculations, aggregations)
  queues.dataProcessing = new Queue('dataProcessing', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 3,
      timeout: 600000, // 10 minutes
      removeOnComplete: 100,
      removeOnFail: 300
    }
  })

  // AI/ML predictions queue
  queues.aiPredictions = new Queue('aiPredictions', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 2,
      timeout: 900000, // 15 minutes
      removeOnComplete: 50,
      removeOnFail: 100
    }
  })

  // Notifications queue for real-time notifications
  queues.notifications = new Queue('notifications', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: 200,
      removeOnFail: 500
    }
  })

  // Data export queue
  queues.exports = new Queue('exports', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 2,
      timeout: 600000, // 10 minutes
      removeOnComplete: 30,
      removeOnFail: 100
    }
  })

  // Scheduled tasks queue (cron-like jobs)
  queues.scheduled = new Queue('scheduled', {
    createClient: (type) => createClient(type),
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: 100,
      removeOnFail: 200
    }
  })

  console.log('Job queues initialized:', Object.keys(queues))
  
  return queues
}

/**
 * Get queue by name
 */
const getQueue = (queueName) => {
  if (!REDIS_ENABLED) {
    // Return a mock queue object when Redis is disabled
    return {
      add: async () => ({ id: 'sync-job' }),
      process: () => {},
      on: () => {},
      close: async () => {},
    }
  }

  if (!queues[queueName]) {
    throw new Error(`Queue '${queueName}' not found`)
  }
  return queues[queueName]
}

/**
 * Add email job
 */
const addEmailJob = async (type, data, options = {}) => {
  const job = await queues.email.add(type, data, {
    priority: options.priority || 5,
    delay: options.delay || 0,
    ...options
  })
  
  console.log(`Email job added: ${type} (Job ID: ${job.id})`)
  return job
}

/**
 * Send verification email job
 */
const sendVerificationEmail = async (email, token, firstName) => {
  return addEmailJob('verification', {
    to: email,
    token,
    firstName,
    subject: 'Verify your Carbon Depict account'
  }, { priority: 1 })
}

/**
 * Send welcome email job
 */
const sendWelcomeEmail = async (email, firstName, companyName) => {
  return addEmailJob('welcome', {
    to: email,
    firstName,
    companyName,
    subject: 'Welcome to Carbon Depict'
  }, { priority: 3 })
}

/**
 * Send password reset email job
 */
const sendPasswordResetEmail = async (email, token, firstName) => {
  return addEmailJob('passwordReset', {
    to: email,
    token,
    firstName,
    subject: 'Reset your Carbon Depict password'
  }, { priority: 1 })
}

/**
 * Add report generation job
 */
const generateReport = async (reportType, companyId, userId, params = {}) => {
  const job = await queues.reports.add('generate', {
    reportType,
    companyId,
    userId,
    params,
    createdAt: new Date()
  })
  
  console.log(`Report generation job added: ${reportType} (Job ID: ${job.id})`)
  return job
}

/**
 * Add data processing job
 */
const processData = async (processingType, companyId, data, options = {}) => {
  const job = await queues.dataProcessing.add(processingType, {
    companyId,
    data,
    createdAt: new Date()
  }, options)
  
  console.log(`Data processing job added: ${processingType} (Job ID: ${job.id})`)
  return job
}

/**
 * Calculate emissions aggregate
 */
const calculateEmissionsAggregate = async (companyId, dateRange) => {
  return processData('emissionsAggregate', companyId, { dateRange })
}

/**
 * Calculate ESG scores
 */
const calculateESGScores = async (companyId, year) => {
  return processData('esgScores', companyId, { year })
}

/**
 * Add AI prediction job
 */
const generateAIPrediction = async (modelType, companyId, inputData, options = {}) => {
  const job = await queues.aiPredictions.add('predict', {
    modelType,
    companyId,
    inputData,
    createdAt: new Date()
  }, options)
  
  console.log(`AI prediction job added: ${modelType} (Job ID: ${job.id})`)
  return job
}

/**
 * Add notification job
 */
const sendNotification = async (userId, notificationType, data, options = {}) => {
  const job = await queues.notifications.add(notificationType, {
    userId,
    data,
    createdAt: new Date()
  }, {
    priority: options.priority || 5,
    ...options
  })
  
  return job
}

/**
 * Add data export job
 */
const exportData = async (exportType, companyId, userId, params = {}) => {
  const job = await queues.exports.add('export', {
    exportType,
    companyId,
    userId,
    params,
    createdAt: new Date()
  })
  
  console.log(`Data export job added: ${exportType} (Job ID: ${job.id})`)
  return job
}

/**
 * Add scheduled/recurring job
 */
const addScheduledJob = async (jobName, data, cronExpression) => {
  const job = await queues.scheduled.add(jobName, data, {
    repeat: {
      cron: cronExpression
    }
  })
  
  console.log(`Scheduled job added: ${jobName} (Cron: ${cronExpression})`)
  return job
}

/**
 * Get job status
 */
const getJobStatus = async (queueName, jobId) => {
  const queue = getQueue(queueName)
  const job = await queue.getJob(jobId)
  
  if (!job) {
    return null
  }
  
  const state = await job.getState()
  const progress = job.progress()
  
  return {
    id: job.id,
    name: job.name,
    data: job.data,
    state,
    progress,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
    finishedOn: job.finishedOn,
    processedOn: job.processedOn,
    timestamp: job.timestamp
  }
}

/**
 * Get queue statistics
 */
const getQueueStats = async (queueName) => {
  const queue = getQueue(queueName)
  
  const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
    queue.getPausedCount()
  ])
  
  return {
    queueName,
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused,
    total: waiting + active + completed + failed + delayed
  }
}

/**
 * Get all queues statistics
 */
const getAllQueuesStats = async () => {
  const stats = {}
  
  for (const queueName of Object.keys(queues)) {
    stats[queueName] = await getQueueStats(queueName)
  }
  
  return stats
}

/**
 * Pause queue
 */
const pauseQueue = async (queueName) => {
  const queue = getQueue(queueName)
  await queue.pause()
  console.log(`Queue paused: ${queueName}`)
}

/**
 * Resume queue
 */
const resumeQueue = async (queueName) => {
  const queue = getQueue(queueName)
  await queue.resume()
  console.log(`Queue resumed: ${queueName}`)
}

/**
 * Clean old jobs
 */
const cleanQueue = async (queueName, grace = 86400000, status = 'completed') => {
  const queue = getQueue(queueName)
  const cleaned = await queue.clean(grace, status)
  console.log(`Cleaned ${cleaned.length} ${status} jobs from ${queueName}`)
  return cleaned
}

/**
 * Retry failed job
 */
const retryJob = async (queueName, jobId) => {
  const queue = getQueue(queueName)
  const job = await queue.getJob(jobId)
  
  if (!job) {
    throw new Error(`Job ${jobId} not found in queue ${queueName}`)
  }
  
  await job.retry()
  console.log(`Job ${jobId} retried in queue ${queueName}`)
}

/**
 * Remove job
 */
const removeJob = async (queueName, jobId) => {
  const queue = getQueue(queueName)
  const job = await queue.getJob(jobId)
  
  if (!job) {
    throw new Error(`Job ${jobId} not found in queue ${queueName}`)
  }
  
  await job.remove()
  console.log(`Job ${jobId} removed from queue ${queueName}`)
}

/**
 * Close all queues
 */
const closeQueues = async () => {
  console.log('Closing all queues...')
  
  await Promise.all(
    Object.values(queues).map(queue => queue.close())
  )
  
  console.log('All queues closed')
}

module.exports = {
  initializeQueues,
  getQueue,
  queues,
  
  // Email jobs
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  addEmailJob,
  
  // Report jobs
  generateReport,
  
  // Data processing jobs
  processData,
  calculateEmissionsAggregate,
  calculateESGScores,
  
  // AI jobs
  generateAIPrediction,
  
  // Notification jobs
  sendNotification,
  
  // Export jobs
  exportData,
  
  // Scheduled jobs
  addScheduledJob,
  
  // Queue management
  getJobStatus,
  getQueueStats,
  getAllQueuesStats,
  pauseQueue,
  resumeQueue,
  cleanQueue,
  retryJob,
  removeJob,
  closeQueues
}
