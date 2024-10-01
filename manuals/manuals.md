# マニュアル

## Next.js プロジェクトのセットアップ

```bash
npx create-next-app@latest frontend --typescript
cd frontend
```

## Tailwind CSS のインストール

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## TailWind CSS をグローバルCSSに追加

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## テストコード導入

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest @types/jest @types/testing-library__react
```