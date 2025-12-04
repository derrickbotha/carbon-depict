#!/usr/bin/env node

/**
 * Console.log Replacement Script
 * Phase 2 Week 5: Replace all console.log with proper logger
 *
 * This script automatically replaces console.* calls with logger calls
 * across the entire server codebase.
 *
 * Usage: node scripts/replace-console-logs.js [--dry-run] [--path=<path>]
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const pathArg = args.find(arg => arg.startsWith('--path='))
const targetPath = pathArg ? pathArg.split('=')[1] : 'server/**/*.js'

// Exclude patterns
const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/logs/**',
  '**/scripts/replace-console-logs.js', // Don't modify self
  '**/utils/logger.js' // Don't modify logger itself
]

// Statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  consoleLogReplaced: 0,
  consoleErrorReplaced: 0,
  consoleWarnReplaced: 0,
  consoleInfoReplaced: 0,
  consoleDebugReplaced: 0,
  errors: []
}

/**
 * Check if file should be excluded
 */
function shouldExclude(filePath) {
  return excludePatterns.some(pattern => {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
    const regex = new RegExp(regexPattern)
    return regex.test(filePath)
  })
}

/**
 * Check if file already has logger import
 */
function hasLoggerImport(content) {
  return content.includes("require('../utils/logger')") ||
         content.includes("require('./utils/logger')") ||
         content.includes("from '../utils/logger'") ||
         content.includes("from './utils/logger'") ||
         content.match(/const\s+logger\s*=\s*require/)
}

/**
 * Add logger import to file
 */
function addLoggerImport(content, filePath) {
  // Determine relative path to logger
  const fileDir = path.dirname(filePath)
  const loggerPath = path.relative(fileDir, path.join(__dirname, '../utils/logger.js'))
  const loggerImport = `const logger = require('${loggerPath.replace(/\\/g, '/')}')\n`

  // Find the right place to insert import
  const lines = content.split('\n')
  let insertIndex = 0

  // Skip shebang and comments at the top
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('#!') || line.startsWith('//') || line.startsWith('/*') || line === '') {
      insertIndex = i + 1
    } else {
      break
    }
  }

  // Insert after first require/import block
  for (let i = insertIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('const') || line.startsWith('require') || line.startsWith('import')) {
      continue
    } else {
      insertIndex = i
      break
    }
  }

  lines.splice(insertIndex, 0, loggerImport)
  return lines.join('\n')
}

/**
 * Replace console.* calls with logger calls
 */
function replaceConsoleCalls(content) {
  let modified = content
  let replacements = 0

  // Track replacements
  const patterns = [
    { regex: /console\.log\(/g, replacement: 'logger.info(', stat: 'consoleLogReplaced' },
    { regex: /console\.error\(/g, replacement: 'logger.error(', stat: 'consoleErrorReplaced' },
    { regex: /console\.warn\(/g, replacement: 'logger.warn(', stat: 'consoleWarnReplaced' },
    { regex: /console\.info\(/g, replacement: 'logger.info(', stat: 'consoleInfoReplaced' },
    { regex: /console\.debug\(/g, replacement: 'logger.debug(', stat: 'consoleDebugReplaced' }
  ]

  patterns.forEach(({ regex, replacement, stat }) => {
    const matches = (modified.match(regex) || []).length
    if (matches > 0) {
      modified = modified.replace(regex, replacement)
      stats[stat] += matches
      replacements += matches
    }
  })

  return { modified, replacements }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++

    // Read file
    const content = fs.readFileSync(filePath, 'utf8')

    // Replace console calls
    const { modified, replacements } = replaceConsoleCalls(content)

    if (replacements === 0) {
      return // No changes needed
    }

    // Add logger import if needed
    let finalContent = modified
    if (!hasLoggerImport(modified)) {
      finalContent = addLoggerImport(modified, filePath)
    }

    // Write file (if not dry run)
    if (!isDryRun) {
      fs.writeFileSync(filePath, finalContent, 'utf8')
    }

    stats.filesModified++
    console.log(`✓ ${isDryRun ? '[DRY RUN] ' : ''}Updated ${filePath} (${replacements} replacements)`)

  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message })
    console.error(`✗ Error processing ${filePath}: ${error.message}`)
  }
}

/**
 * Main execution
 */
function main() {
  console.log('='.repeat(60))
  console.log('Console.log Replacement Script')
  console.log('='.repeat(60))
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log(`Path: ${targetPath}`)
  console.log('='.repeat(60))
  console.log()

  // Find all JavaScript files
  const files = glob.sync(targetPath, {
    ignore: excludePatterns,
    absolute: true
  })

  console.log(`Found ${files.length} files to scan\n`)

  // Process each file
  files.forEach(file => {
    if (!shouldExclude(file)) {
      processFile(file)
    }
  })

  // Print statistics
  console.log()
  console.log('='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`Files scanned:        ${stats.filesScanned}`)
  console.log(`Files modified:       ${stats.filesModified}`)
  console.log(`console.log:          ${stats.consoleLogReplaced}`)
  console.log(`console.error:        ${stats.consoleErrorReplaced}`)
  console.log(`console.warn:         ${stats.consoleWarnReplaced}`)
  console.log(`console.info:         ${stats.consoleInfoReplaced}`)
  console.log(`console.debug:        ${stats.consoleDebugReplaced}`)
  console.log(`Total replacements:   ${
    stats.consoleLogReplaced +
    stats.consoleErrorReplaced +
    stats.consoleWarnReplaced +
    stats.consoleInfoReplaced +
    stats.consoleDebugReplaced
  }`)
  console.log(`Errors:               ${stats.errors.length}`)
  console.log('='.repeat(60))

  if (stats.errors.length > 0) {
    console.log('\nErrors:')
    stats.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`)
    })
  }

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN MODE - No files were actually modified')
    console.log('   Run without --dry-run to apply changes')
  } else {
    console.log('\n✅ Console.log replacement complete!')
  }
}

// Run the script
main()
