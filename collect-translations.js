import fs from 'fs'
import path from 'path'

function collectTranslations() {
  const srcDir = 'src'
  const outputFile = 'translations.txt'

  const translations = new Set()

  // Regex to match t('text')
  const regex = /t\('([^']+)'\)/g

  // Recursive function to scan directories
  function scanDir(dir) {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        scanDir(fullPath)
      } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(item)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        let match
        while ((match = regex.exec(content)) !== null) {
          translations.add(match[1])
        }
      }
    }
  }

  scanDir(srcDir)

  // Write to translations.txt
  const output = Array.from(translations).join('\n')
  fs.writeFileSync(outputFile, output)

  console.log(
    `Collected ${translations.size} unique translations and saved to ${outputFile}`,
  )
}

collectTranslations()
