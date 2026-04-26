const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    // Do not wait for networkidle, just wait for DOM parsing to complete
    await page.goto('http://localhost:5175/order?type=delivery', { waitUntil: 'domcontentloaded' });

    // Wait an additional second for react to mount and throw
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
    process.exit(0);
})();
