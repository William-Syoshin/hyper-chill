# QRコード生成ガイド

イベントで使用するQRコードの生成方法を説明します。

## QRコードのURL

各会場用に以下のURLでQRコードを生成してください：

- **会場A**: `https://your-domain.com/checkin/A`
- **会場B**: `https://your-domain.com/checkin/B`
- **会場C**: `https://your-domain.com/checkin/C`

**注意**: `your-domain.com`は実際のデプロイ先のドメインに置き換えてください。

## QRコード生成方法

### オプション1: オンラインジェネレーター（推奨）

#### QR Code Generator

1. https://www.qr-code-generator.com/ にアクセス
2. 「URL」を選択
3. URLを入力（例: `https://your-domain.com/checkin/A`）
4. デザインやサイズをカスタマイズ
5. 「Download」で画像をダウンロード
6. 会場B、Cについても同様に作成

#### The QR Code Generator

1. https://www.the-qrcode-generator.com/ にアクセス
2. 「URL」タブを選択
3. URLを入力
4. 「Generate QR Code」をクリック
5. 画像をダウンロード

### オプション2: Node.jsスクリプト

プロジェクトに含まれるスクリプトを使用：

```bash
npm install qrcode

node scripts/generate-qr-codes.js
```

生成されたQRコードは`public/qr-codes/`に保存されます。

### オプション3: Pythonスクリプト

```python
import qrcode

venues = ['A', 'B', 'C']
base_url = 'https://your-domain.com/checkin/'

for venue in venues:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(base_url + venue)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(f'venue_{venue}_qr.png')
    
print('QRコードを生成しました')
```

## QRコードのサイズとフォーマット

### 推奨サイズ

- **最小サイズ**: 5cm × 5cm
- **推奨サイズ**: 10cm × 10cm 〜 15cm × 15cm
- **大型ディスプレイ用**: 30cm × 30cm 以上

### ファイルフォーマット

- **印刷用**: PNG（高解像度、300dpi以上）または SVG
- **デジタル表示用**: PNG または JPEG

## QRコードのデザイン

### カスタマイズのポイント

1. **会場ごとに色分け**
   - 会場A: 赤系
   - 会場B: 緑系
   - 会場C: 青系

2. **ラベルの追加**
   - QRコードの下に「会場A」などのテキストを追加
   - 大きく読みやすいフォントを使用

3. **スキャン可能性の確認**
   - デザインを追加する場合は、必ずスマートフォンでスキャンテストを実施
   - 読み取りエラー訂正レベルは「H」（高）を推奨

## 設置場所

### 推奨設置場所

- 各会場の入口
- 目立つ場所（目線の高さ）
- 照明が適切な場所（暗すぎず、反射しない）

### 設置方法

1. **スタンド**
   - A4サイズのスタンドを使用
   - QRコードを中央に配置

2. **壁面**
   - ポスターとして印刷
   - 高さ120cm〜150cm程度に設置

3. **デジタルディスプレイ**
   - タブレットやモニターで表示
   - 画面の明るさを調整

## テスト方法

### 事前テスト

1. 各QRコードをスマートフォンでスキャン
2. 正しいURL（/checkin/A など）にアクセスできるか確認
3. チェックイン処理が正常に動作するか確認
4. 複数の端末でテスト（iOS、Android）

### 当日の確認

- イベント開始前に全会場のQRコードをスキャンテスト
- 予備のQRコードを用意しておく

## サンプルポスターレイアウト

```
┌─────────────────────────────┐
│                             │
│     [ロゴまたはイベント名]     │
│                             │
│    ┌─────────────────┐      │
│    │                 │      │
│    │   [QR CODE]     │      │
│    │                 │      │
│    └─────────────────┘      │
│                             │
│      会場A チェックイン       │
│                             │
│   スマートフォンで読み取って   │
│     チェックインしてください   │
│                             │
└─────────────────────────────┘
```

## トラブルシューティング

### QRコードが読み取れない

- QRコードのサイズが小さすぎないか確認
- 照明が適切か確認
- カメラのピントが合っているか確認
- QRコードが汚れていないか確認

### 誤った会場にチェックインされる

- QRコードのURLが正しいか確認
- 会場ごとに異なるQRコードを使用しているか確認

## 参考リンク

- [QR Code Generator](https://www.qr-code-generator.com/)
- [The QR Code Generator](https://www.the-qrcode-generator.com/)
- [QR Code Monkey](https://www.qrcode-monkey.com/)

