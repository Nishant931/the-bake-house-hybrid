const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BASE_URL = 'https://www.bakingo.com';
const UPLOAD_DIR = path.join(__dirname, '../public/uploads/products');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    const filePath = path.join(UPLOAD_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/uploads/products/${filename}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download image: ${url}`, error.message);
    return null;
  }
}

async function scrape() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  
  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('Starting scrape...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000)); // Wait for extra load

    // 1. Defined categories to scrape based on site structure
    const categories = [
      { name: 'Cakes', slug: 'cakes', url: '/cakes' },
      { name: 'Desserts', slug: 'desserts-hampers', url: '/desserts-hampers' },
      { name: 'Cupcakes', slug: 'cupcakes', url: '/cupcakes' },
      { name: 'Bento Cakes', slug: 'bento-cakes', url: '/bento-cakes' }
    ];

    for (const catData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: catData.slug },
        update: { name: catData.name },
        create: {
          name: catData.name,
          slug: catData.slug
        }
      });

      console.log(`Scraping category: ${catData.name}`);
      try {
        await page.goto(`${BASE_URL}${catData.url}`, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 3000)); // Wait for content
      } catch (e) {
        console.error(`Failed to load category ${catData.name}, skipping...`);
        continue;
      }

      // Scroll to load more products if lazy loading is present
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          let distance = 100;
          let timer = setInterval(() => {
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if(totalHeight >= scrollHeight || totalHeight > 2000){ // Limit scroll
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      // Get product links from listing page
      const productLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('a[href*="/products/"], a[href*="/p/"]').forEach(a => {
          if (a.href && !a.href.includes('javascript')) {
            links.push(a.href);
          }
        });
        return [...new Set(links)].slice(0, 15); // Limit per category for initial seed
      });

      console.log(`Found ${productLinks.length} products in ${catData.name}`);

      for (const link of productLinks) {
        try {
          console.log(`Visiting link: ${link}`);
          await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
          await new Promise(r => setTimeout(r, 2000)); // Wait for render
          const productData = await page.evaluate(() => {
            const name = document.querySelector('h1, .product-title, .product-name')?.innerText?.trim() || '';
            const description = document.querySelector('.product-description, #product-details, .prod-desc')?.innerText?.trim() || '';

            const priceText = document.querySelector('.price, .current-price, .product-price, .amount')?.innerText || '0';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

            // Bakingo specific: images are often in a slider or have specific attributes
            const imgElements = Array.from(document.querySelectorAll('img'));
            const images = imgElements
              .map(img => img.src || img.dataset.src || img.dataset.lazy || img.getAttribute('data-original'))
              .filter(src => {
                if (!src || !src.startsWith('http')) return false;
                // Exclude common UI icons/logos
                const lower = src.toLowerCase();
                if (lower.includes('icon') || lower.includes('logo') || lower.includes('banner')) return false;
                return lower.includes('product') || lower.includes('cake') || lower.includes('dessert') || lower.includes('bakingo.com/sites/default/files');
              });

            const isEggless = document.body.innerText.toLowerCase().includes('eggless');

            const variants = [];
            document.querySelectorAll('.weight-option, .size-option, [data-weight], .weight-selector li').forEach(el => {
              const weight = el.innerText.trim();
              const vPriceText = el.getAttribute('data-price') || el.innerText;
              const vPrice = parseFloat(vPriceText.replace(/[^0-9.]/g, '')) || price;
              if (weight && !isNaN(vPrice)) variants.push({ weight, price: vPrice });
            });

            return { name, description, price, images: [...new Set(images)], variants, isEggless };
          });

          if (!productData.name) {
             console.log(`Skipping invalid product at ${link}`);
             continue;
          }

          const slug = link.split('/').pop().replace(/\?.*$/, '');
          
          const downloadedImages = [];
          for (let i = 0; i < Math.min(productData.images.length, 3); i++) {
            const imgUrl = productData.images[i];
            const ext = '.jpg';
            const filename = `${slug}-${i}${ext}`;
            const localUrl = await downloadImage(imgUrl, filename);
            if (localUrl) {
              downloadedImages.push({ url: localUrl, isThumbnail: i === 0 });
            }
          }

          await prisma.product.upsert({
            where: { slug },
            update: {
                name: productData.name,
                description: productData.description,
                isEggless: productData.isEggless,
            },
            create: {
              name: productData.name,
              slug,
              description: productData.description,
              isEggless: productData.isEggless,
              categoryId: category.id,
              images: {
                create: downloadedImages
              },
              variants: {
                create: productData.variants.length > 0 ? productData.variants : [{ weight: '0.5 Kg', price: productData.price }]
              }
            }
          });

          console.log(`Successfully saved: ${productData.name}`);
        } catch (err) {
          console.error(`Error scraping product at ${link}:`, err.message);
        }
      }
    }

  } catch (error) {
    console.error('Scraping process failed:', error);
  } finally {
    await browser.close();
    await prisma.$disconnect();
    console.log('Scrape complete.');
  }
}

scrape();
