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
};
```

## TailWind CSS をグローバルCSSに追加

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## ESLintとFormatterの導入

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

以下を追加すること

-   .eslintrc.json
-   .prettierrc

## テストコード導入

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest @types/jest @types/testing-library__react
```

以下を追加すること

-   jest.config.cjs
-   jest.setup.ts

## Playwrightのインストール

```bash
npm install -D playwright
npm install --save-dev @playwright/test
npx playwright install
npx playwright test --config
```

以下を追加すること

-   playwright.config.ts

```bash
# テストの実行
npx playwright test
```

## 注意点

1. tsconfig.jsonの修正

以下を修正すること

```json
"jsx": "react-jsx",
```
