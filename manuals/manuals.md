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