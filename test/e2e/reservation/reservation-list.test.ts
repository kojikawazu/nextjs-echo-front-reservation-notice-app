import { test, expect } from '@playwright/test';

// コンソールログをリッスン
//page.on('console', (msg) => console.log(`PAGE LOG: ${msg.text()}`));

test('Users can access the reservation list page.', async ({ page }) => {
    // アプリケーションのURLを指定
    await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/reservation`);

    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL(
        `${process.env.NEXT_PUBLIC_MY_URL}/user/login`
    );
    await expect(page.locator('h2:text("ログイン")')).toBeVisible();
});

test('Users can log in and access the reservation list page.', async ({
    page,
}) => {
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

    // 予約リストページにリダイレクトされることを確認
    await expect(page).toHaveURL(
        `${process.env.NEXT_PUBLIC_MY_URL}/reservation`
    );
    await expect(page.locator('h1:text("予約リスト")')).toBeVisible(); // 予約リストのヘッダーが表示されていることを確認
});

// 予約情報が取得できない場合のエラーハンドリングを確認
test('Displays an error message when reservation data cannot be fetched', async ({
    page,
}) => {
    // モックされたAPIレスポンスの設定
    await page.route(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reservations`,
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

    // 予約リストページにリダイレクトされることを確認
    await expect(page).toHaveURL(
        `${process.env.NEXT_PUBLIC_MY_URL}/reservation`
    );
    // APIがエラーを返すことを想定して、テストを実行
    await expect(
        page.locator('text=予約情報の取得に失敗しました')
    ).toBeVisible();
});

// ヘッダーが正しく表示されることを確認
test('Header displays the username', async ({ page }) => {
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

    // 予約リストページにリダイレクトされることを確認
    await expect(page).toHaveURL(
        `${process.env.NEXT_PUBLIC_MY_URL}/reservation`
    );

    // ヘッダーにユーザー名が表示されていることを確認
    await expect(
        page.locator(`text=${process.env.NEXT_PUBLIC_LOGIN_USER}`)
    ).toBeVisible(); // ユーザー名は適宜変更してください
});
