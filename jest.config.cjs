module.exports = {
    preset: 'ts-jest/presets/default-esm', // ESM用のプリセットを使用
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // セットアップファイルをTypeScriptに変更
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            { tsconfig: '<rootDir>/tsconfig.jest.json' },
        ], // ts-jestの設定をtransformフィールドに移動
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1', // tsconfigのpathsに対応
    },
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/test/e2e/'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'], // TypeScriptファイルをESMとして扱う
    verbose: true, // 詳細なログ出力を有効化
};
