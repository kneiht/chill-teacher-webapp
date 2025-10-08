import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const folders = ['vocab-images', 'backgrounds', 'textures']
const baseDir = path.join(__dirname, 'public')

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']

// Function to convert image to WebP
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 }) // Adjust quality as needed (0-100)
      .toFile(outputPath)
    console.log(`Converted: ${inputPath} -> ${outputPath}`)
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message)
  }
}

// Function to process all images in directory
async function processImages() {
  try {
    for (const folder of folders) {
      const inputDir = path.join(baseDir, folder)
      if (!fs.existsSync(inputDir)) {
        console.log(`Folder not found: ${inputDir}`)
        continue
      }

      const files = fs.readdirSync(inputDir)
      console.log(`Processing folder: ${folder}`)

      for (const file of files) {
        const ext = path.extname(file).toLowerCase()
        if (imageExtensions.includes(ext)) {
          const inputPath = path.join(inputDir, file)
          const baseName = path.basename(file, ext)
          const outputPath = path.join(inputDir, `${baseName}.webp`)

          // Skip if WebP already exists
          if (fs.existsSync(outputPath)) {
            console.log(`Skipped (already exists): ${outputPath}`)
            continue
          }

          await convertToWebP(inputPath, outputPath)
        }
      }
    }

    console.log('Image conversion completed!')
  } catch (error) {
    console.error('Error processing images:', error.message)
  }
}

// Run the script
processImages()
