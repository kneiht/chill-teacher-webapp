/**
 * Script upload files lên Cloudflare R2 Storage
 *
 * Cách sử dụng:
 * 1. Tạo file .env trong thư mục root với các biến:
 *    R2_ACCOUNT_ID=your_account_id
 *    R2_ACCESS_KEY_ID=your_access_key_id
 *    R2_SECRET_ACCESS_KEY=your_secret_access_key
 *    R2_BUCKET_NAME=your_bucket_name
 *    R2_PUBLIC_URL=https://your-domain.com (optional)
 *
 * 2. Đặt các file cần upload vào folder wait-upload/
 *
 * 3. Chạy script:
 *    npm run upload-r2
 *    hoặc
 *    node upload-to-r2.js
 *
 * Script sẽ:
 * - Upload tất cả files trong wait-upload/ (bao gồm subfolders) lên R2
 * - Ghi log các file đã upload vào wait-upload/upload-log.txt
 * - Bỏ qua các file đã upload (dựa vào log)
 *
 * Cài đặt dependencies:
 *    pnpm install
 *    hoặc
 *    npm install
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Lấy root directory (parent của scripts/)
const rootDir = path.resolve(__dirname, '..')

// Đọc .env file nếu có (Node.js 20.6+ hỗ trợ --env-file, nhưng cũng load thủ công)
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
  console.log(`📄 Đọc file .env từ: ${envPath}`)
  const envContent = fs.readFileSync(envPath, 'utf-8')
  let loadedCount = 0
  envContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts
          .join('=')
          .trim()
          .replace(/^["']|["']$/g, '')
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value
          loadedCount++
        }
      }
    }
  })
  console.log(`✅ Đã load ${loadedCount} biến môi trường từ .env\n`)
} else {
  console.log(`⚠️  Không tìm thấy file .env tại: ${envPath}\n`)
}

// Cấu hình Cloudflare R2
// Lấy từ environment variables hoặc .env file
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ''
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ''
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '' // URL công khai của R2 bucket

// Đường dẫn folder chứa files cần upload (ở root directory)
const WAIT_UPLOAD_DIR = path.join(rootDir, 'wait-upload')
const LOG_FILE = path.join(WAIT_UPLOAD_DIR, 'upload-log.txt')

// Khởi tạo S3 client cho Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// Kiểm tra và tạo folder wait-upload nếu chưa có
if (!fs.existsSync(WAIT_UPLOAD_DIR)) {
  fs.mkdirSync(WAIT_UPLOAD_DIR, { recursive: true })
  console.log(`Đã tạo folder: ${WAIT_UPLOAD_DIR}`)
}

// Đọc danh sách file đã upload từ log
function getUploadedFiles() {
  if (!fs.existsSync(LOG_FILE)) {
    return new Set()
  }

  try {
    const logContent = fs.readFileSync(LOG_FILE, 'utf-8')
    const uploadedFiles = new Set()

    // Đọc từng dòng trong log file
    logContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        // Format: relative-path|r2-path|timestamp
        const parts = trimmedLine.split('|')
        if (parts.length >= 2) {
          uploadedFiles.add(parts[0]) // Lưu relative path
        }
      }
    })

    return uploadedFiles
  } catch (error) {
    console.error('Lỗi khi đọc log file:', error.message)
    return new Set()
  }
}

// Ghi log file đã upload
function logUploadedFile(relativePath, r2Path) {
  const timestamp = new Date().toISOString()
  const logEntry = `${relativePath}|${r2Path}|${timestamp}\n`

  try {
    // Thêm vào cuối file log
    fs.appendFileSync(LOG_FILE, logEntry, 'utf-8')
    console.log(`Đã ghi log: ${relativePath}`)
  } catch (error) {
    console.error(`Lỗi khi ghi log cho ${relativePath}:`, error.message)
  }
}

// Upload file lên R2
async function uploadFileToR2(filePath, r2Key) {
  try {
    const fileContent = fs.readFileSync(filePath)
    const contentType = getContentType(filePath)

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
      ContentType: contentType,
    })

    await s3Client.send(command)

    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${r2Key}`.replace(/\/+/g, '/')
      : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${r2Key}`

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error(`Lỗi khi upload ${filePath}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Xác định content type từ extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ts': 'application/typescript',
  }

  return contentTypes[ext] || 'application/octet-stream'
}

// Kiểm tra file có nên bỏ qua không
function shouldSkipFile(fileName) {
  const skipFiles = [
    'upload-log.txt',
    '.DS_Store',
    'Thumbs.db',
    '.gitkeep',
    '.gitignore',
  ]
  return skipFiles.includes(fileName)
}

// Lấy tất cả files trong folder (recursive)
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)

    // Bỏ qua các file hệ thống và log file
    if (shouldSkipFile(file)) {
      return
    }

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

// Hàm chính
async function main() {
  // Kiểm tra cấu hình
  if (
    !R2_ACCOUNT_ID ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET_NAME
  ) {
    console.error('❌ Thiếu cấu hình R2!')
    console.error('Vui lòng set các environment variables:')
    console.error('  - R2_ACCOUNT_ID')
    console.error('  - R2_ACCESS_KEY_ID')
    console.error('  - R2_SECRET_ACCESS_KEY')
    console.error('  - R2_BUCKET_NAME')
    console.error('  - R2_PUBLIC_URL (optional)')
    process.exit(1)
  }

  console.log('🚀 Bắt đầu upload files lên Cloudflare R2...\n')
  console.log(`📁 Folder wait-upload: ${WAIT_UPLOAD_DIR}\n`)

  // Kiểm tra folder wait-upload có tồn tại không
  if (!fs.existsSync(WAIT_UPLOAD_DIR)) {
    console.error(`❌ Folder không tồn tại: ${WAIT_UPLOAD_DIR}`)
    console.error(`   Vui lòng tạo folder wait-upload trong thư mục root`)
    process.exit(1)
  }

  // Đọc danh sách file đã upload
  const uploadedFiles = getUploadedFiles()
  console.log(`📋 Đã có ${uploadedFiles.size} files trong log\n`)

  // Lấy tất cả files cần upload
  const allFiles = getAllFiles(WAIT_UPLOAD_DIR)

  // Lọc ra các files chưa upload và bỏ qua các file hệ thống
  const filesToUpload = allFiles.filter((filePath) => {
    const fileName = path.basename(filePath)
    // Bỏ qua các file hệ thống
    if (shouldSkipFile(fileName)) {
      return false
    }

    const relativePath = path
      .relative(WAIT_UPLOAD_DIR, filePath)
      .replace(/\\/g, '/')
    return !uploadedFiles.has(relativePath)
  })

  if (filesToUpload.length === 0) {
    console.log('✅ Không có file nào cần upload!')
    return
  }

  console.log(`📁 Tìm thấy ${filesToUpload.length} files cần upload:\n`)

  // Khởi tạo log file nếu chưa có
  if (!fs.existsSync(LOG_FILE)) {
    const header = `# Upload Log - Cloudflare R2\n# Format: relative-path|r2-path|timestamp\n# Generated: ${new Date().toISOString()}\n\n`
    fs.writeFileSync(LOG_FILE, header, 'utf-8')
  }

  // Upload từng file
  let successCount = 0
  let failCount = 0

  for (const filePath of filesToUpload) {
    const relativePath = path
      .relative(WAIT_UPLOAD_DIR, filePath)
      .replace(/\\/g, '/')

    // Tạo key cho R2 (giữ nguyên cấu trúc folder)
    const r2Key = relativePath

    console.log(`📤 Uploading: ${relativePath}`)

    const result = await uploadFileToR2(filePath, r2Key)

    if (result.success) {
      console.log(`✅ Đã upload: ${r2Key}`)
      if (result.url) {
        console.log(`   URL: ${result.url}`)
      }

      // Ghi log với relative path
      logUploadedFile(relativePath, r2Key)
      successCount++
    } else {
      console.error(`❌ Lỗi: ${relativePath} - ${result.error}`)
      failCount++
    }

    console.log('')
  }

  // Tổng kết
  console.log('='.repeat(50))
  console.log('📊 Tổng kết:')
  console.log(`   ✅ Thành công: ${successCount}`)
  console.log(`   ❌ Thất bại: ${failCount}`)
  console.log(`   📝 Log file: ${LOG_FILE}`)
  console.log('='.repeat(50))
}

// Chạy script
main().catch((error) => {
  console.error('❌ Lỗi khi chạy script:', error)
  process.exit(1)
})
