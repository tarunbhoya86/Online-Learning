const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set screen size
    await page.setViewport({ width: 1920, height: 1080 });

    const baseUrl = 'http://localhost:5173';
    const outputDir = 'admin_screenshots_light';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Force Light Mode via LocalStorage
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('theme', 'light');
    });

    const pages = [
        { url: '/admin', name: 'admin_dashboard' },
        { url: '/admin/users', name: 'admin_users' },
        { url: '/admin/mentors', name: 'admin_mentors' },
        { url: '/admin/courses', name: 'admin_courses' },
        { url: '/admin/settings', name: 'admin_settings' }
    ];

    console.log('Starting screenshot capture...');

    for (const pageInfo of pages) {
        try {
            console.log(`Capturing ${pageInfo.name}...`);
            await page.goto(`${baseUrl}${pageInfo.url}`, { waitUntil: 'networkidle0' });
            // Wait for animations/renders
            await new Promise(r => setTimeout(r, 3000));

            // Handle 100vh layouts with internal scrolling
            const dimensions = await page.evaluate(() => {
                // Try to find the scrollable content container in AdminLayout
                // Structure: main > AdminHeader + div (content)
                // We look for the main content div which has overflow-y: auto
                const main = document.querySelector('main');
                if (!main) return { width: 1920, height: 1080 };

                const contentDiv = main.querySelector('div:last-child'); // The div after header

                let height = 1080;
                if (contentDiv && contentDiv.scrollHeight > height) {
                    height = contentDiv.scrollHeight + 100; // Add padding
                }

                // Also check body scroll height just in case
                if (document.body.scrollHeight > height) {
                    height = document.body.scrollHeight;
                }

                return { width: 1920, height: height };
            });

            console.log(`Resizing viewport to ${dimensions.width}x${dimensions.height} for ${pageInfo.name}`);
            await page.setViewport(dimensions);

            // Wait for resize layout update
            await new Promise(r => setTimeout(r, 1000));

            // Take screenshot
            await page.screenshot({
                path: path.join(outputDir, `${pageInfo.name}.jpg`),
                fullPage: true, // Now that viewport covers content, fullPage works or just viewport
                type: 'jpeg',
                quality: 90
            });
            console.log(`Saved ${pageInfo.name}.jpg`);

            // Reset viewport for next page (optional, but good practice)
            await page.setViewport({ width: 1920, height: 1080 });

        } catch (error) {
            console.error(`Error capturing ${pageInfo.name}:`, error.message);
        }
    }

    await browser.close();
    console.log('All screenshots captured in "admin_screenshots" folder!');
})();
