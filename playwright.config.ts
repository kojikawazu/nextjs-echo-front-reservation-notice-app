import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// .env.testファイルを読み込む
dotenv.config({ path: '.env.test' });

export default defineConfig({
    testDir: 'test/e2e', // E2Eテストのディレクトリを指定
    // その他の設定...
});
