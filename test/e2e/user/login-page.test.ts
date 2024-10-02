import { test, expect } from '@playwright/test';

test('Users can log in', async ({ page }) => {
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
    await expect(page.locator('h1:text("予約リスト")')).toBeVisible();
});

test('Invalid email format shows error message', async ({ page }) => {
    await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/user/login`);

    await page.fill('input[type="email"]', 'invalid@example'); // 無効なメールアドレス
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    await expect(
        page.locator('text=正しいメールアドレスを入力してください')
    ).toBeVisible();
});

test('Password too short shows error message', async ({ page }) => {
    await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/user/login`);

    await page.fill(
        'input[type="email"]',
        `${process.env.NEXT_PUBLIC_LOGIN_EMAIL}`
    );
    await page.fill('input[type="password"]', 'short'); // 短すぎるパスワード
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    await expect(
        page.locator('text=パスワードは6文字以上にしてください')
    ).toBeVisible();
});

test('Login fails with incorrect credentials', async ({ page }) => {
    await page.goto(`${process.env.NEXT_PUBLIC_MY_URL}/user/login`);

    await page.fill(
        'input[type="email"]',
        `${process.env.NEXT_PUBLIC_LOGIN_EMAIL}`
    );
    await page.fill('input[type="password"]', 'wrongpassword'); // 誤ったパスワード
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    await expect(
        page.locator('text=ログインに失敗しました。もう一度お試しください。')
    ).toBeVisible();
});
