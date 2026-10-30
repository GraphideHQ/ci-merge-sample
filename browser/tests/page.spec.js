// A page rendered in headless Chromium, with no network: what a small end-to-end suite does.
const { test, expect } = require('@playwright/test');

test('renders a page and runs its script', async ({ page }) => {
  await page.setContent(`
    <h1>graphide-ci</h1>
    <button id="b">count</button><span id="n">0</span>
    <script>
      document.getElementById('b').onclick = () => {
        const n = document.getElementById('n');
        n.textContent = String(Number(n.textContent) + 1);
      };
    </script>`);
  await expect(page.locator('h1')).toHaveText('graphide-ci');
  for (let i = 0; i < 3; i++) await page.click('#b');
  await expect(page.locator('#n')).toHaveText('3');
});

test('draws on a canvas', async ({ page }) => {
  await page.setContent('<canvas id="c" width="40" height="40"></canvas>');
  const red = await page.evaluate(() => {
    const ctx = document.getElementById('c').getContext('2d');
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 40, 40);
    return ctx.getImageData(20, 20, 1, 1).data[0];
  });
  expect(red).toBe(255);
});
