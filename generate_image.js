#!/usr/bin/env node
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { createInterface } from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const API_URL = 'https://api.whomeai.com/v1/images/generations'

/**
 * Ensure filename ends with .png extension
 */
function ensurePngExtension(filename) {
  if (!filename.toLowerCase().endsWith('.png')) {
    return `${filename}.png`
  }
  return filename
}

/**
 * Write base64 image data to file
 */
async function writeImageB64ToFile(b64Data, outputPath) {
  const imageBytes = Buffer.from(b64Data, 'base64')
  await fs.writeFile(outputPath, imageBytes)
}

/**
 * Sleep for specified seconds
 */
function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

/**
 * Countdown timer with progress display
 */
async function countdown(seconds, message) {
  for (let sec = seconds; sec > 0; sec--) {
    process.stdout.write(`\r${message.replace('{sec}', sec)}`)
    await sleep(1)
  }
  process.stdout.write('\n')
}

/**
 * Generate an image from text using whomeai API and save it to disk.
 * Returns the absolute path to the saved file.
 * @param {string} prompt - Text prompt describing the desired image
 * @param {string} outputFilename - Output filename
 * @param {Object} options - Options object
 * @param {string|null} options.apiKey - API key (defaults to env WHOMEAI_API_KEY or 'sk-demo')
 * @param {string} options.model - Model to use (default: 'nano-banana')
 * @param {string} options.size - Image size (default: '1792x1024')
 * @param {boolean} options.retryOn429 - Auto-retry on rate limit (default: true)
 * @returns {Promise<string>} Absolute path to saved file
 */
async function generateImage(
  prompt,
  outputFilename,
  {
    apiKey = null,
    model = 'nano-banana',
    size = '1792x1024',
    retryOn429 = true,
  } = {},
) {
  const token = (apiKey || process.env.WHOMEAI_API_KEY || 'sk-demo').trim()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const payload = {
    model,
    prompt,
    n: 1,
    size,
    // API defaults response_format to b64_json
  }

  let retried429 = false

  while (true) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 120s timeout

      const resp = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (resp.status === 429 && retryOn429 && !retried429) {
        try {
          const errJson = await resp.json()
          const waitSec = parseInt(errJson.retry_after || 60, 10)
          console.log(
            `Rate limit hit, waiting ${waitSec} seconds then retrying...`,
          )
          await countdown(waitSec, '  ...retrying in {sec}s   ')
          retried429 = true
          continue
        } catch (err) {
          const text = await resp.text()
          console.error(`API error (429): ${text}`)
          process.exit(1)
        }
      }

      if (resp.status !== 200) {
        let errMsg
        try {
          const errJson = await resp.json()
          errMsg = JSON.stringify(errJson)
        } catch {
          errMsg = await resp.text()
        }
        console.error(`API error (${resp.status}): ${errMsg}`)
        process.exit(1)
      }

      const payloadJson = await resp.json()
      const dataList = payloadJson.data || []

      if (dataList.length === 0) {
        throw new Error("Empty 'data' in API response")
      }

      const b64Img = dataList[0].b64_json
      if (!b64Img) {
        throw new Error("Missing 'b64_json' in first data item")
      }

      const finalFilename = ensurePngExtension(outputFilename)
      const outputPath = resolve(finalFilename)

      await writeImageB64ToFile(b64Img, outputPath)
      return outputPath
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('Request failed: Timeout after 120 seconds')
        process.exit(1)
      }
      if (err instanceof TypeError || err.message?.includes('fetch')) {
        console.error(`Request failed: ${err.message}`)
        process.exit(1)
      }
      // If it's a parse error or other issue
      const errorText = err.message || String(err)
      console.error(
        `Failed to parse API response: ${err.message}\nRaw: ${errorText.slice(0, 500)}`,
      )
      process.exit(1)
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2)
  const result = {
    prompt: null,
    output: null,
    promptsFile: null,
    apiKey: null,
    model: 'nano-banana',
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--prompts') {
      result.promptsFile = args[++i]
    } else if (arg === '--api-key') {
      result.apiKey = args[++i]
    } else if (arg === '--model') {
      result.model = args[++i]
    } else if (!result.prompt) {
      result.prompt = arg
    } else if (!result.output) {
      result.output = arg
    }
  }

  return result
}

/**
 * Main function
 */
async function main() {
  const args = parseArgs()

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\nInterrupted by user')
    process.exit(130)
  })

  // Batch mode
  if (args.promptsFile) {
    const jsonPath = resolve(args.promptsFile)
    try {
      await fs.access(jsonPath)
    } catch {
      console.error(`prompts file not found: ${jsonPath}`)
      process.exit(1)
    }

    let entries
    try {
      const content = await fs.readFile(jsonPath, 'utf-8')
      entries = JSON.parse(content)
    } catch (readErr) {
      console.error(`Failed to read prompts file: ${readErr.message}`)
      process.exit(1)
    }

    if (!Array.isArray(entries)) {
      console.error('prompts file must contain a JSON array of {name,prompt}')
      process.exit(1)
    }

    const imagesDir = resolve(join(process.cwd(), 'images'))
    await fs.mkdir(imagesDir, { recursive: true })

    const savedFiles = []
    for (let idx = 0; idx < entries.length; idx++) {
      const item = entries[idx]
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        console.error(
          `Invalid item at index ${idx}: expected object with name/prompt`,
        )
        process.exit(1)
      }

      const name = item.name
      const promptText = item.prompt

      if (!name || !promptText) {
        console.error(`Missing name or prompt at index ${idx}`)
        process.exit(1)
      }

      const outputPath = join(imagesDir, `${name}.png`)
      const saved = await generateImage(promptText, outputPath, {
        apiKey: args.apiKey,
        model: args.model,
        size: '1792x1024',
        retryOn429: true,
      })

      console.log(saved)
      savedFiles.push(saved)

      // Delay 25s before next unless last
      if (idx < entries.length - 1) {
        console.log('Waiting 25s before next image...')
        await countdown(25, '  ...next request in {sec}s   ')
      }
    }

    // Print summary
    if (savedFiles.length > 0) {
      console.log(`Saved ${savedFiles.length} images to ${imagesDir}`)
    }
    return
  }

  // Single mode
  if (!args.prompt || !args.output) {
    console.error(
      'Provide either: <prompt> <output> for single mode, or --prompts prompts.json for batch mode',
    )
    process.exit(1)
  }

  const savedPath = await generateImage(args.prompt, args.output, {
    apiKey: args.apiKey,
    model: args.model,
    size: '1792x1024',
  })
  console.log(savedPath)
}

// Run main function
main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
