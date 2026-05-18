const puppeteer = require('puppeteer');

async function test() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const testUrl = 'https://www.bakingo.com/p/choco-truffle-cake0005choc';
  console.log(`Testing URL: ${testUrl}`);
  
  await page.goto(testUrl, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'debug-screenshot.png' });
  
  const html = await page.content();
  console.log('HTML Length:', html.length);
  console.log('Title:', await page.title());
  
  await browser.close();
}

test();
