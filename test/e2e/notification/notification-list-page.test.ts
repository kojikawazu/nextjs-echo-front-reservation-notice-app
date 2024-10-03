import { test, expect, Page } from '@playwright/test';

test.describe('NotificationListPage', () => {
    test.beforeEach(async ({ page }) => {
        // ログインページにアクセス
        await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/user/login`);

        // フォームにメールアドレスとパスワードを入力
        await page.fill(
            'input[type="email"]',
            `${process.env.NEXT_PUBLIC_LOGIN_EMAIL}`
        );
        await page.fill(
            'input[type="password"]',
            `${process.env.NEXT_PUBLIC_LOGIN_PASSWORD}`
        );

        // ログインボタンをクリック
        await page.click('button[type="submit"]');

        // ログイン後、URLが予約フォームページに変わることを確認
        await expect(page).toHaveURL(
            `${process.env.NEXT_PUBLIC_MY_URL}/reservation`,
            { timeout: 10000 }
        );

        // ページの完全なロードを待つ
        await page.waitForLoadState('networkidle');
    });

    test('should display NotificationList when authenticated', async ({
        page,
    }) => {
        // API のレスポンスをモック
        await page.route(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
            (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify([
                        { id: 1, message: '過去の通知1' },
                        { id: 2, message: '過去の通知2' },
                    ]),
                });
            }
        );

        // テスト対象ページに移動
        await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/notification`);

        // ヘッダーにユーザー名が表示されていることを確認
        await expect(
            page.locator(`text=${process.env.NEXT_PUBLIC_LOGIN_USER}`)
        ).toBeVisible();

        // 通知リストページに遷移したことを確認
        await expect(page.locator('h1:text("通知リスト")')).toBeVisible();

        // 通知リストが表示されているか確認
        await expect(page.locator('text=過去の通知1')).toBeVisible();
        await expect(page.locator('text=過去の通知2')).toBeVisible();
    });

    test('Displays an error message when notification data cannot be fetched', async ({
        page,
    }) => {
        // API のレスポンスをモック
        await page.route(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
            (route) => {
                route.fulfill({
                    status: 500, // ステータスコード500を返す
                    body: JSON.stringify({ message: 'Internal Server Error' }), // エラーメッセージをJSON形式で設定
                    headers: {
                        'Content-Type': 'application/json', // ヘッダーも設定
                    },
                });
            }
        );

        // テスト対象ページに移動
        await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/notification`);

        // ヘッダーにユーザー名が表示されていることを確認
        await expect(
            page.locator(`text=${process.env.NEXT_PUBLIC_LOGIN_USER}`)
        ).toBeVisible();

        // 通知リストページに遷移したことを確認
        await expect(page.locator('h1:text("通知リスト")')).toBeVisible();

        // APIがエラーを返すことを想定して、テストを実行
        await expect(
            page.locator('text=通知情報の取得に失敗しました')
        ).toBeVisible();
    });
});
