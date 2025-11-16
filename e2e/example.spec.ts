import { test, expect } from '@playwright/test';

test.describe('Checkout Kata', () => {
  test('shows app shell with title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Checkout Kata/i);

    await expect(page.getByText('Checkout Kata')).toBeVisible();

    const productsLink = page.getByRole('link', { name: /products/i });
    await expect(productsLink).toBeVisible();
  });

  test('lists products and lets me add one to the cart', async ({ page }) => {
    await page.goto('/');

    const productsLink = page.getByRole('link', { name: /products/i });
    await productsLink.click();

    const firstProductCard = page.getByTestId('product-card').first();
    await expect(firstProductCard).toBeVisible();

    const addButton = firstProductCard.getByRole('button', {
      name: /add to cart/i,
    });
    await addButton.click();

    const checkoutButton = page.getByRole('button', {
      name: /proceed to checkout/i,
    });
    await expect(checkoutButton).toBeEnabled();

    const badge = checkoutButton.locator('.btn-badge');
    await expect(badge).toBeVisible();
    await expect(badge).not.toHaveText('');
  });

  test('full checkout flow: add item, go to checkout, pay, back to products', async ({
    page,
  }) => {
    await page.goto('/');

    const productsLink = page.getByRole('link', { name: /products/i });
    await productsLink.click();

    const firstProductCard = page.getByTestId('product-card').first();
    await expect(firstProductCard).toBeVisible();

    const addButton = firstProductCard.getByRole('button', {
      name: /add to cart/i,
    });
    await addButton.click();

    const checkoutButton = page.getByRole('button', {
      name: /proceed to checkout/i,
    });
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();

    await expect(page).toHaveURL(/\/checkout/);

    await expect(page.getByText('Cart summary')).toBeVisible();
    await expect(page.locator('.totals__row--emphasis')).toBeVisible();

    const payButton = page.getByRole('button', {
      name: /proceed to payment/i,
    });
    await expect(payButton).toBeEnabled();
    await payButton.click();

    const snackbar = page.getByText(/payment successful/i);
    await expect(snackbar).toBeVisible();

    await page.waitForURL('**/products', { timeout: 5000 });

    const productCardAfterRedirect = page.getByTestId('product-card').first();
    await expect(productCardAfterRedirect).toBeVisible();
  });
});
