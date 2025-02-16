const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function takeScreenshots() {
    // Create screenshots directory if it doesn't exist
    await fs.mkdir('screenshots', { recursive: true });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2
    });

    // Get list of game files
    const files = await fs.readdir('.');
    const gameFiles = files.filter(file => file.match(/^game\d+\.html$/));

    // Take screenshot of each game
    for (const file of gameFiles) {
        try {
            console.log(`Taking screenshot of ${file}`);
            await page.goto(`http://localhost:8080/${file}`);
            
            // Wait for any animations/loading to complete
            await page.waitForTimeout(2000);
            
            // Take the screenshot
            const screenshotPath = path.join('screenshots', file.replace('.html', '.png'));
            await page.screenshot({
                path: screenshotPath,
                quality: 80
            });
            
            console.log(`Screenshot saved: ${screenshotPath}`);
        } catch (error) {
            console.error(`Error capturing ${file}:`, error);
        }
    }

    await browser.close();
}

takeScreenshots().catch(console.error);
