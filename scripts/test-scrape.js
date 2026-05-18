const puppeteer = require('puppeteer');
const BASE_URL = 'https://www.bakingo.com';

async function test() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const testUrl = 'https://www.bakingo.com/p/choco-truffle-cake0005choc';
  console.log(`Testing URL: ${testUrl}`);
  
  await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000)); // Wait for JS

  const data = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      dataSrc: img.dataset.src,
      class: img.className,
      id: img.id
    })).filter(img => (img.src || img.dataSrc) && (img.src.includes('product') || img.dataSrc?.includes('product')));
    
    return {
      title: document.querySelector('h1')?.innerText,
      imgs: imgs.slice(0, 10)
    };
  });

  console.log('Scraped Data:', JSON.stringify(data, null, 2));
  await browser.close();
}

test();
