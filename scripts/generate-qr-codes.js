/**
 * QRコード生成スクリプト
 * 
 * 使い方:
 * 1. npm install qrcode
 * 2. node scripts/generate-qr-codes.js
 * 
 * 生成されたQRコードは public/qr-codes/ に保存されます
 */

const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')

// デプロイ先のURLを設定してください
const BASE_URL = 'https://your-domain.com/checkin/'
const VENUES = ['A', 'B', 'C']

// 出力ディレクトリ
const OUTPUT_DIR = path.join(__dirname, '../public/qr-codes')

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// QRコード生成
async function generateQRCodes() {
  console.log('QRコードを生成中...')

  for (const venue of VENUES) {
    const url = `${BASE_URL}${venue}`
    const filename = `venue_${venue}.png`
    const filepath = path.join(OUTPUT_DIR, filename)

    try {
      await QRCode.toFile(filepath, url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })

      console.log(`✓ 会場${venue}のQRコードを生成しました: ${filename}`)
      console.log(`  URL: ${url}`)
    } catch (error) {
      console.error(`✗ 会場${venue}のQRコード生成に失敗しました:`, error)
    }
  }

  console.log('\n完了しました！')
  console.log(`出力先: ${OUTPUT_DIR}`)
}

generateQRCodes()

