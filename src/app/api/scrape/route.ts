import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto('https://www.datasciencedegreeprograms.net/professors/', {
      waitUntil: 'domcontentloaded',
    });

    // Extract the article content by targeting the elements containing the text
    const articleContent = await page.evaluate(() => {
      // Query the elements that contain the main article content
      const contentElements = document.querySelectorAll('article p, article h1, article h2, article h3, article h4, article h5, article h6, article code, h1, h2, h3, h4, h5, h6, p');
      return Array.from(contentElements).map(el => el.textContent).join('\n');
    });

    console.log('Fetched article content:');
    console.log(articleContent);

    return NextResponse.json({ content: articleContent });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
