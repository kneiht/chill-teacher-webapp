import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseDir = path.join(__dirname, '..')
const targetFolder = 'wait-upload'
const excludeFolders = ['node_modules', '.git', 'dist', 'build', '.next']

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('-d')
const deleteOriginal = !args.includes('--keep-original') && !args.includes('-k')
const help = args.includes('--help') || args.includes('-h')

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']

// Function to convert image to WebP
async function convertToWebP(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath)
    const fileSizeKB = Math.round(stats.size / 1024)

    if (dryRun) {
      console.log(`🔍 DRY RUN: Would convert ${inputPath} -> ${outputPath}`)
      return
    }

    await sharp(inputPath)
      .webp({
        quality: 80, // Adjust quality as needed (0-100)
        effort: 4, // Higher effort = better compression but slower
      })
      .toFile(outputPath)

    const newStats = fs.statSync(outputPath)
    const newFileSizeKB = Math.round(newStats.size / 1024)
    const savings = Math.round(
      ((fileSizeKB - newFileSizeKB) / fileSizeKB) * 100,
    )

    console.log(`✓ Converted: ${inputPath} -> ${outputPath}`)
    console.log(
      `  Size: ${fileSizeKB}KB → ${newFileSizeKB}KB (${savings}% reduction)`,
    )

    // Delete the original image after successful conversion
    if (deleteOriginal) {
      fs.unlinkSync(inputPath)
      console.log(`  Deleted original: ${inputPath}`)
    } else {
      console.log(`  Kept original: ${inputPath}`)
    }
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message)
  }
}

// Function to recursively process all images in directory
async function processDirectory(dir, relativePath = '') {
  try {
    const files = fs.readdirSync(dir)
    let imageCount = 0

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      const fileRelativePath = path.join(relativePath, file)

      if (stat.isDirectory()) {
        // Skip excluded folders
        if (excludeFolders.includes(file)) {
          console.log(`⚠ Skipped excluded folder: ${fileRelativePath}`)
          continue
        }
        // Recursively process subdirectory
        await processDirectory(filePath, fileRelativePath)
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase()
        if (imageExtensions.includes(ext)) {
          imageCount++
          const baseName = path.basename(file, ext)
          const outputPath = path.join(dir, `${baseName}.webp`)

          // Skip if WebP already exists
          if (fs.existsSync(outputPath)) {
            console.log(`⚠ Skipped (already exists): ${fileRelativePath}`)
            continue
          }

          await convertToWebP(filePath, outputPath)
        }
      }
    }

    if (imageCount > 0) {
      console.log(
        `  Found and processed ${imageCount} images in ${relativePath || dir}`,
      )
    }
  } catch (error) {
    console.error(`✗ Error processing directory ${dir}:`, error.message)
  }
}

// Function to show help
function showHelp() {
  console.log(`
🖼️  Image to WebP Converter

Usage: node convert-images.js [options]

Options:
  --dry-run, -d     Show what would be converted without actually converting
  --keep-original, -k  Keep original images after conversion
  --help, -h        Show this help message

Examples:
  node convert-images.js                 # Convert images in wait-upload folder
  node convert-images.js --dry-run       # Preview what would be converted
  node convert-images.js --keep-original  # Convert but keep original files

Default behavior:
  - Processes images only in the 'wait-upload' folder
  - Converts supported image formats to WebP
  - Deletes original images after successful conversion (unless --keep-original)
  - Supported formats: .jpg, .jpeg, .png, .gif, .bmp, .tiff

Note:
  Place images you want to convert in the 'wait-upload' folder at the project root.
  The script will process all images in this folder and its subfolders.
`)
}

// Function to process all images recursively
async function processImages() {
  try {
    if (help) {
      showHelp()
      return
    }

    const targetDir = path.join(baseDir, targetFolder)
    if (!fs.existsSync(targetDir)) {
      console.error(`✗ Target folder not found: ${targetDir}`)
      console.error(
        `   Please create the '${targetFolder}' folder and add images to convert`,
      )
      return
    }

    console.log('🚀 Starting image conversion')
    console.log(`📁 Target folder: ${targetDir}`)
    console.log(`🖼️  Supported formats: ${imageExtensions.join(', ')}`)
    console.log(`🔍 Dry run: ${dryRun ? 'YES' : 'NO'}`)
    console.log(`🗑️  Delete originals: ${deleteOriginal ? 'YES' : 'NO'}`)
    console.log('─'.repeat(50))

    const startTime = Date.now()
    await processDirectory(targetDir, targetFolder)
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)

    console.log('─'.repeat(50))
    console.log('✅ Image conversion completed!')
    console.log(`⏱️  Total time: ${duration} seconds`)
  } catch (error) {
    console.error('✗ Error processing images:', error.message)
  }
}

// Run the script
processImages()
