import puppeteer from "puppeteer";
import fs from "fs"

async function getDataOfDynamicWeb() {
    const browser = await puppeteer.launch({
        headless: true, //Change to false to view the page 
        slowMo: 0 //Change to 400 to view the page
    });
    const page = await browser.newPage();
    await page.goto("https://quotes.toscrape.com");

    let allData = [];
    let hasNextPage = true;

    while (hasNextPage) {
        try {
            const data = await page.evaluate(() => {
                const quotes = document.querySelectorAll(".quote");
                
                // page.screenshot({path: 'exampleImg.png'})
                
                const subData = [...quotes].map((quote) => {
                    const quoteText = quote.querySelector(".text").innerHTML;
                    const author = quote.querySelector(".author").innerHTML;
                    const tags = [...quote.querySelectorAll(".tag")].map((tag) => tag.innerHTML);
                    return { quoteText, author, tags };
                });
                
                return subData;
            });
            allData = allData.concat(data);
            
            hasNextPage = await page.evaluate(() => {
                const nextButton = document.querySelector("li.next a");
                return nextButton ? true : false;
            });
            
            if (hasNextPage) {
                await page.click("li.next a");
            };
        }
        catch (error) {
            console.error('Error al procesar la página:', error);
            hasNextPage = false;
        }
    }

    console.log(allData);
    await fs.writeFileSync("quotes.json", JSON.stringify(allData, null, 2)) //MongoDB, SQL
    await browser.close();
};

getDataOfDynamicWeb();