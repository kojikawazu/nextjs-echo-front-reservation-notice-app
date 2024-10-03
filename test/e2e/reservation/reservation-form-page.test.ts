import { test, expect } from '@playwright/test';

test.describe('Reservation Form', () => {
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

    test('should create a reservation successfully', async ({ page }) => {
        // APIのレスポンスを正常なレスポンスにモックする
        await page.route(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reservation`,
            (route) => {
                route.fulfill({
                    status: 200,
                    body: JSON.stringify({
                        message: '予約が正常に作成されました',
                    }),
                });
            }
        );

        // ログイン後に予約フォームページに遷移
        await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/reservation/form`);
        // ページの完全なロードを待つ
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(
            `${process.env.NEXT_PUBLIC_MY_URL}/reservation/form`
        );

        await expect(page.locator('h1:text("予約情報を作成")')).toBeVisible();

        // 予約日を設定
        const reservationDateInput = page.locator(
            'input[type="datetime-local"]'
        );
        await reservationDateInput.fill('2024-10-03T18:00');

        // 人数を設定
        const numPeopleInput = page.locator('input[type="number"]');
        await numPeopleInput.fill('4');

        // 特別リクエストを設定
        const specialRequestInput = page.locator('input[type="text"]');
        await specialRequestInput.fill('窓際の席を希望');

        // 予約作成ボタンをクリック
        const submitButton = page.locator('button', { hasText: '予約を作成' });
        await submitButton.click();

        // 成功メッセージの表示を確認
        const message = page.locator('text=予約が正常に作成されました');
        await expect(message).toBeVisible();
    });

    test('should show error message if reservation fails', async ({ page }) => {
        // APIのレスポンスを強制的にエラーにモックする
        await page.route(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reservation`,
            (route) => {
                route.fulfill({
                    status: 500, // エラーコードを返す
                    body: JSON.stringify({ message: 'Internal Server Error' }),
                });
            }
        );

        // ログイン後に予約フォームページに遷移
        await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/reservation/form`);
        // ページの完全なロードを待つ
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(
            `${process.env.NEXT_PUBLIC_MY_URL}/reservation/form`
        );
        await expect(page.locator('h1:text("予約情報を作成")')).toBeVisible();

        // 予約日を無効な形式で設定
        const reservationDateInput = page.locator(
            'input[type="datetime-local"]'
        );
        await reservationDateInput.fill('2020-01-01T18:00');

        // 人数を設定
        const numPeopleInput = page.locator('input[type="number"]');
        await numPeopleInput.fill('4');

        // 特別リクエストを設定
        const specialRequestInput = page.locator('input[type="text"]');
        await specialRequestInput.fill('窓際の席を希望');

        // 予約作成ボタンをクリック
        const submitButton = page.locator('button', { hasText: '予約を作成' });
        await submitButton.click();

        // 失敗メッセージの表示を確認
        const errorMessage = page.locator('text=予約の作成に失敗しました');
        await expect(errorMessage).toBeVisible();
    });
});
