import puppeteer from "puppeteer";
import fs from "fs"

async function getDataOfDynamicWeb() {
    const browser = await puppeteer.launch({
        headless: true, //Change to false to view the page
        slowMo: 0 //Change to 400 to view the page
    });
    const page = await browser.newPage();
    await page.goto("", { waitUntil: 'networkidle2' });

    let allData = [];

        try {
            await page.waitForSelector(".card", { visible: true });
            
            const data = await page.evaluate(() => {
                const articles = document.querySelectorAll(".card");
                
                // page.screenshot({path: 'exampleImg.png'})
                
                const subData = [...articles].map((article) => {
                    const articleImg = article.querySelector("#cardHeader").innerHTML;
                    const title = article.querySelector("div.card-body h2.card-title").innerHTML;
                    const description = article.querySelector("div.card-body p.card-description").innerHTML;
                    return { articleImg, title, description };
                });
                
                return subData;
            });
            
            allData = allData.concat(data);
        }
        catch (error) {
            console.error('Error al procesar la página:', error);
            viewMore = false;
        }

    console.log(allData);
    await fs.promises.writeFile("quotes.json", JSON.stringify(allData, null, 2)); //MongoDB, SQL
    await browser.close();
};

getDataOfDynamicWeb();