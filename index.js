//"C:\Users\DELL\Downloads\chrome-win\chrome-win\chrome.exe" --remote-debugging-port=9222 --user-data-dir="D:\puppeteer-profile"

const puppeteer = require("puppeteer-core");

async function automateCapCutVideo({ topic, keyPoint }) {
  try {
    const browser = await puppeteer.connect({
      browserURL: "http://localhost:9222",
      defaultViewport: null,
    });

    console.log("✅ Browser connected.");

    //if need override existing one use bellow code
    // const pages = await browser.pages();
    // const page = pages.length ? pages[0] : await browser.newPage();
    const page = await browser.newPage();

    try {
      await page.goto("https://www.capcut.com/ai-creator/storyboard", {
        waitUntil: "networkidle2",
        timeout: 0,
      });
    } catch (error) {
      console.log(error, "error");
    }
    console.log("✅ CapCut loaded with VPN session.");

    // Step 1: Click the "Script" tab
    await page.evaluate(() => {
      const tabs = Array.from(
        document.querySelectorAll("div.menu-item-rajoXF")
      );
      const scriptTab = tabs.find((el) =>
        el.innerText.trim().includes("Script")
      );
      if (scriptTab) scriptTab.click();
    });

    console.log("📄 Script tab clicked.");

    // Step 2: Type topic
    await page.waitForSelector('textarea[placeholder="Enter a topic"]', {
      timeout: 10000,
    });
    await page.type('textarea[placeholder="Enter a topic"]', topic, {
      delay: 50,
    });
    console.log("✏️ Topic typed.");

    // Step 3: Type key points
    await page.waitForSelector('[contenteditable="true"]', { timeout: 10000 });
    await page.evaluate(() => {
      const editor = document.querySelector('[contenteditable="true"]');
      editor.focus();
    });
    await page.keyboard.type(keyPoint, { delay: 50 });
    console.log("🧠 Key points typed.");

    // Step 4: Set duration to 1 min
    await page.evaluate(() => {
      const options = Array.from(
        document.querySelectorAll("div.optionItem-_aq33l")
      );
      const oneMinOption = options.find((el) =>
        el.textContent.includes("1 min")
      );
      if (oneMinOption) oneMinOption.click();
    });
    console.log("⏱️ Duration set to 1 min.");

    // Step 5: Click Create
    await page.waitForFunction(
      () => {
        const btn = document.querySelector("button.generateScript-vEE_by");
        return (
          btn && !btn.disabled && !btn.classList.contains("lv-btn-disabled")
        );
      },
      { timeout: 600000 }
    );

    await new Promise((resolve) => setTimeout(resolve, 10000)); // 1 minutes

    await page.evaluate(() => {
      const btn = document.querySelector("button.generateScript-vEE_by");
      if (btn) {
        btn.scrollIntoView({ behavior: "smooth", block: "center" });
        btn.click();
      }
    });
    console.log("🚀 Clicked Create.");

    // Step 6: Wait for "Use" button and click it
    try {
      console.log("⏳ Waiting for 'Use' button...");
      await page.waitForSelector("button.blackButton-bmnyyO span", {
        visible: true,
        timeout: 120000, // wait up to 30s for script generation
      });

      await page.evaluate(() => {
        const useBtn = Array.from(
          document.querySelectorAll("button.blackButton-bmnyyO span")
        ).find((el) => el.innerText.trim() === "Use");
        if (useBtn) {
          const button = useBtn.closest("button");
          if (button) button.click();
        }
      });

      console.log("✅ Clicked 'Use' button.");

      // Click Scenes tab
      await page.waitForSelector("div.menu-item-rajoXF");
      await page.evaluate(() => {
        const scenesTab = [
          ...document.querySelectorAll("div.menu-item-rajoXF"),
        ].find((el) => el.innerText.includes("Scenes"));
        if (scenesTab) scenesTab.click();
      });
      console.log("🎬 Scenes tab clicked.");

      // Click Voice tab
      await page.waitForSelector("span.lv-tabs-header-title-text");
      await page.evaluate(() => {
        const voiceTab = [
          ...document.querySelectorAll("span.lv-tabs-header-title-text"),
        ].find((el) => el.innerText.includes("Voice"));
        if (voiceTab) voiceTab.click();
      });
      console.log("🔊 Voice tab clicked.");

      // Click Favorites
      await page.waitForSelector("div.category-XC_vvK");
      await page.evaluate(() => {
        const favorites = [
          ...document.querySelectorAll("div.category-XC_vvK"),
        ].find((el) => el.innerText.includes("Favorites"));
        if (favorites) favorites.click();
      });
      console.log("⭐ Favorites clicked.");

      // Click Voice "Spill the Tea"
      await page.waitForSelector("div.cardContainer-xBI_Va");
      await page.evaluate(() => {
        const card = document.querySelector("div.cardContainer-xBI_Va");
        if (card) card.click();
      });
      console.log("🎤 Voice card selected.");

      // Step: Click "Apply to All Scenes" (Audio)
      await page.waitForSelector("button.generate-jttebB", { visible: true });
      await page.evaluate(() => {
        const applyBtn = document.querySelector("button.generate-jttebB");
        if (applyBtn && !applyBtn.disabled) applyBtn.click();
      });
      console.log("✅ Audio Apply clicked.");

      // Step: Wait for generation to complete (button becomes enabled again)
      console.log("⏳ Waiting for audio auto-generation to finish...");
      await page.waitForFunction(
        () => {
          const btn = document.querySelector("button.generate-jttebB");
          return btn && !btn.disabled;
        },
        { timeout: 120000 }
      ); // waits up to 60 seconds

      console.log("🎉 Audio generation completed.");

      // Step: Click "Media" tab
      await page.waitForSelector(".tab-VmuwRo .text-PR26YU", { visible: true });
      await page.evaluate(() => {
        const mediaTab = Array.from(
          document.querySelectorAll(".tab-VmuwRo .text-PR26YU")
        ).find((el) => el.innerText.trim() === "Media");
        if (mediaTab) mediaTab.click();
      });
      console.log("🎞️ Clicked Media tab.");

      // Step: Click "Generate AI media"
      await page.evaluate(() => {
        const entryButton = Array.from(
          document.querySelectorAll(".entry-button-LXjiPD .title-nFQK_9")
        ).find((el) => el.innerText.includes("Generate AI media"));
        if (entryButton) entryButton.click();
      });
      console.log("🖼️ Clicked Generate AI Media.");

      // Step: Click Aspect Ratio (9:16)
      await page.evaluate(() => {
        const ratioBtn = Array.from(
          document.querySelectorAll(".ratioIcon-EEWXU9 div")
        ).find((el) => el.innerText.trim() === "9:16");
        if (ratioBtn) ratioBtn.click();
      });
      console.log("📐 Aspect ratio 9:16 selected.");

      // Step: Click Style Card (Fluffy 3D)
      await page.evaluate(() => {
        const card = Array.from(
          document.querySelectorAll(".card-JBoqIB .styleName-Mobr9C")
        ).find((el) => el.innerText.includes("Fluffy 3D"));
        if (card) card.click();
      });
      // console.log("✨ Style 'Fluffy 3D' selected.");

      // // Step: Click "Apply to all scenes"
      await page.evaluate(() => {
        const applyBtn = document.querySelector("button.generateButton-ZBHxTA");
        if (applyBtn) applyBtn.click();
      });
      console.log("✅ Clicked Apply to all video scenes.");

      await page.waitForFunction(
        () => {
          const genBtn = document.querySelector("button.generateButton-ZBHxTA");
          return genBtn && genBtn.disabled;
        },
        { timeout: 15000 }
      );

      console.log("🎬 Media applied to all scenes.");

      await page.waitForFunction(
        () => {
          const loadingText = document.querySelector(".loadingText-uQ6Ch6");
          if (!loadingText) return true; // No loading text = generation complete

          const text = loadingText.innerText || "";
          return text.includes("100%") || !text.includes("Generating media");
        },
        { timeout: 300000 }
      ); // Wait up to 5 minutes

      console.log("✅ Media generation complete.");

      // Manual wait using setTimeout
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minutes

      console.log("⏳ Waited 1 minutes after media generation.");

      // --- ELEMENTS TAB ---
      await page.evaluate(() => {
        const tab = [...document.querySelectorAll("div.menu-item-rajoXF")].find(
          (el) => el.innerText.includes("Elements")
        );
        if (tab) tab.click();
      });

      await page.waitForSelector("div.presetItem-aTPkqf", {
        visible: true,
        timeout: 10000,
      });

      const presets = await page.$$("div.presetItem-aTPkqf");
      if (presets.length > 0) {
        // Click the first available preset (or change index if you need a specific one)
        await presets[1].evaluate((el) =>
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        );
        await presets[1].click();

        console.log("✅ Preset clicked.");
      } else {
        console.warn("❌ No preset found.");
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5sec minutes

      console.log("⏳ Waited s minutes after media generation.");
      // Click Export button
      await page.waitForSelector("button.button-OuKHcj");
      await page.evaluate(() => {
        document.querySelector("button.button-OuKHcj")?.click();
      });

      // Wait for dropdowns to be ready
      await page.waitForSelector(".lv-select", {
        visible: true,
        timeout: 10000,
      });
      const dropdowns = await page.$$(".lv-select");
      console.log(`🔍 Found ${dropdowns.length} dropdowns.`);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (dropdowns.length < 2) {
        console.warn("❌ Not enough dropdowns found.");
      } else {
        // ------- Quality Dropdown (High) -------
        await dropdowns[0].evaluate((el) =>
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        );
        await dropdowns[0].click();
        console.log("✅ Clicked Quality dropdown.");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        await page.waitForFunction(
          () => {
            return [...document.querySelectorAll("li")].some((li) =>
              li.innerText.toLowerCase().includes("high")
            );
          },
          { timeout: 15000 }
        );
        console.log("✅ Quality options appeared.");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const qualityOptions = await page.$$("li");
        for (const option of qualityOptions) {
          const text = await option.evaluate((el) =>
            el.innerText.trim().toLowerCase()
          );
          if (text.includes("high")) {
            await option.click();
            console.log("✅ Selected: High");
            break;
          }
        }

        // await new Promise(resolve => setTimeout(resolve, 5000));

        // ------- Resolution Dropdown (4K) -------

        // 1️⃣ Find all dropdowns
        // const dropdowns = await page.$$('.lv-select');
        // console.log(`🔍 Found ${dropdowns.length} dropdowns.`);

        // // 2️⃣ Assuming Resolution is the second dropdown (index 1), adjust if needed
        // const resolutionDropdown = dropdowns[1];
        // if (resolutionDropdown) {
        //   await resolutionDropdown.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        //   await resolutionDropdown.click();
        //   console.log("✅ Clicked Resolution dropdown.");

        //   // 3️⃣ Wait for dropdown options to appear
        //   await page.waitForSelector('li', { visible: true, timeout: 10000 });

        //   const options = await page.$$('li');
        //   console.log(`🔍 Found ${options.length} resolution options.`);

        //   // 4️⃣ Use Real Mouse Click for "4K"
        //   let found = false;
        //   for (const option of options) {
        //     const text = await option.evaluate(el => el.innerText.trim().toLowerCase());
        //     console.log("➡️ Option:", text);
        //     if (text.includes('4k')) {
        //       const box = await option.boundingBox();
        //       if (box) {
        //         await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        //         console.log("✅ 4K selected using mouse click.");
        //         found = true;
        //         break;
        //       }
        //     }
        //   }

        //   if (!found) console.warn("❌ 4K option not found.");

        //   // 5️⃣ Optional: Wait a bit for UI to update
        //   await page.waitForTimeout(1500);

        //   // 6️⃣ Check what value is showing now
        //   const selectedResolution = await resolutionDropdown.$eval('.lv-select-view-value', el => el.innerText.trim());
        //   console.log(`🎯 Confirmed Resolution: ${selectedResolution}`);
        // } else {
        //   console.warn("❌ Resolution dropdown not found.");
        // }
      }

      // await new Promise(resolve => setTimeout(resolve, 10000));  // 10sec minutes
      //   // Final Export
      //   await page.waitForSelector('button.footerButton-Cg0S4H');
      //   await page.evaluate(() => {
      //     document.querySelector('button.footerButton-Cg0S4H')?.click();
      //   });
    } catch (err) {
      console.error("❌ 'Use' button not found or click failed:", err.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

const canadaFactsBatch2 = [
  // { topic: "Canada Friendly People", keyPoint: "Canadians are globally known for being polite and friendly." },
  // { topic: "Canada Poutine Love", keyPoint: "Poutine—fries, cheese curds, and gravy—is a beloved Canadian dish." },
  // { topic: "Canada Wildlife Rich", keyPoint: "Canada is home to moose, polar bears, whales, and more." },
  // { topic: "Canada Multicultural Mosaic", keyPoint: "Canada welcomes people from over 200 ethnic origins." },
  // { topic: "Canada Largest Freshwater Island", keyPoint: "Manitoulin Island is the largest freshwater island in the world." },
  // { topic: "Canada Looney and Tooney", keyPoint: "Canada’s $1 and $2 coins are nicknamed Loonie and Toonie." },
  {
    topic: "Canada Terry Fox Legacy",
    keyPoint:
      "Terry Fox inspired millions with his Marathon of Hope against cancer.",
  },
  {
    topic: "Canada Longest Street",
    keyPoint:
      "Yonge Street in Ontario was once considered the world's longest street.",
  },
  {
    topic: "Canada Royal Family",
    keyPoint:
      "Canada is a constitutional monarchy with ties to the British Royal Family.",
  },
  {
    topic: "Canada Santa Claus Address",
    keyPoint: "Canada has an official postal code for Santa: H0H 0H0.",
  },
];

async function runVideosSequentially() {
  for (const item of canadaFactsBatch2) {
    try {
      await automateCapCutVideo(item);
      console.log(`✅ Completed: ${item.topic}`);
    } catch (error) {
      console.error(`❌ Error processing ${item.topic}:`, error);
    }
  }
}

runVideosSequentially();

const canadaFactsBatch3 = [
  {
    topic: "Largest National Park",
    keyPoint: "Wood Buffalo National Park is Canada’s largest national park.",
  },
  {
    topic: "Northern Lights",
    keyPoint:
      "Canada is one of the best places on Earth to see the Aurora Borealis.",
  },
  {
    topic: "Indigenous Heritage",
    keyPoint: "Over 1.6 million Canadians identify as Indigenous.",
  },
  {
    topic: "Largest Mall",
    keyPoint:
      "West Edmonton Mall was once the largest shopping mall in the world.",
  },
  {
    topic: "Inuksuk Symbol",
    keyPoint:
      "The Inuksuk, a stone landmark, is an important Inuit cultural symbol.",
  },
  {
    topic: "Bears Everywhere",
    keyPoint: "Canada is home to black bears, grizzlies, and polar bears.",
  },
  {
    topic: "Longest Border",
    keyPoint: "Canada and the USA share the world's longest undefended border.",
  },
  {
    topic: "Highest Tides",
    keyPoint:
      "Bay of Fundy has the highest tides in the world—up to 16 meters!",
  },
  {
    topic: "Apology Culture",
    keyPoint:
      "Canadians are famous for saying 'sorry'—even legally protected in some cases!",
  },
  {
    topic: "World’s Largest Skating Rink",
    keyPoint:
      "Ottawa's Rideau Canal becomes the largest skating rink in winter.",
  },
];

const canadaFactsBatch4 = [
  {
    topic: "Tim Hortons Craze",
    keyPoint: "Tim Hortons is Canada's favorite coffee and donut chain.",
  },
  {
    topic: "Moose Accidents",
    keyPoint:
      "Moose-related road accidents are common in some Canadian regions.",
  },
  {
    topic: "Blue Nose Stamp",
    keyPoint: "Canada’s Blue Nose schooner stamp is a famous collector's item.",
  },
  {
    topic: "Quebec Ice Hotel",
    keyPoint: "Quebec has a hotel entirely made of ice and snow every winter.",
  },
  {
    topic: "Polar Bear Capital",
    keyPoint:
      "Churchill, Manitoba, is known as the Polar Bear Capital of the World.",
  },
  {
    topic: "Two National Sports",
    keyPoint: "Canada has two official sports: Ice Hockey and Lacrosse.",
  },
  {
    topic: "Oldest Company",
    keyPoint:
      "Hudson's Bay Company, founded in 1670, is Canada’s oldest business.",
  },
  {
    topic: "Transparent Money",
    keyPoint:
      "Canada’s bills have transparent sections for security and style.",
  },
  {
    topic: "Longest Ice Road",
    keyPoint: "Canada has some of the world's longest seasonal ice roads.",
  },
  {
    topic: "Legal Sorry",
    keyPoint:
      "In Ontario, saying 'sorry' legally doesn’t mean admitting guilt.",
  },
];

const canadaFactsBatch5 = [
  {
    topic: "Drake's Influence",
    keyPoint: "Canadian rapper Drake put Toronto on the global music map.",
  },
  {
    topic: "Clean Air",
    keyPoint: "Canada ranks among the top countries with the cleanest air.",
  },
  {
    topic: "Montreal Underground",
    keyPoint: "Montreal has a vast 33 km underground city called Reso.",
  },
  {
    topic: "Indigenous Art",
    keyPoint:
      "Canada's Indigenous art is globally celebrated for its rich symbolism.",
  },
  {
    topic: "Montreal French City",
    keyPoint: "Montreal is the largest French-speaking city outside of Paris.",
  },
  {
    topic: "Canada's Forests",
    keyPoint: "Almost half of Canada's land is covered by dense forests.",
  },
  {
    topic: "Discovery of Insulin",
    keyPoint:
      "Insulin was discovered by Canadians Frederick Banting and Charles Best.",
  },
  {
    topic: "Baffin Island",
    keyPoint:
      "Baffin Island is Canada's largest island, bigger than many countries.",
  },
  {
    topic: "Longest Lake Name",
    keyPoint:
      "Pekwachnamaykoskwaskwaypinwanik Lake holds Canada's longest place name.",
  },
  {
    topic: "Snake-Free Newfoundland",
    keyPoint: "Newfoundland has no native snake species—none at all!",
  },
];

const canadaFactsBatch6 = [
  {
    topic: "Peacekeeping Nation",
    keyPoint:
      "Canada is known for its leadership in international peacekeeping missions.",
  },
  {
    topic: "Cannabis Legalization",
    keyPoint: "Canada legalized recreational cannabis in 2018.",
  },
  {
    topic: "Goodbye Penny",
    keyPoint: "Canada phased out the penny in 2013 to save money.",
  },
  {
    topic: "Canada Goose Coats",
    keyPoint: "Canada Goose jackets are world-famous for extreme warmth.",
  },
  {
    topic: "Trivial Pursuit",
    keyPoint: "The popular game Trivial Pursuit was invented in Canada.",
  },
  {
    topic: "Butter Tarts",
    keyPoint: "Butter tarts are a sweet Canadian dessert loved nationwide.",
  },
  {
    topic: "Winnie the Pooh",
    keyPoint: "Winnie the Pooh was inspired by a real Canadian bear.",
  },
  {
    topic: "Smallest Jail",
    keyPoint: "Rodney, Ontario, has the world's smallest jailhouse.",
  },
  {
    topic: "Toonie Bear",
    keyPoint: "The polar bear is featured on Canada’s $2 coin, the Toonie.",
  },
  {
    topic: "Big Nickel",
    keyPoint:
      "Sudbury, Ontario, is home to the world's largest coin—a giant nickel.",
  },
];

const canadaFactsBatch7 = [
  {
    topic: "World’s Largest Axe",
    keyPoint: "Nackawic, NB, boasts the world’s largest axe monument.",
  },
  {
    topic: "Whale & Dolphin Ban",
    keyPoint: "Canada banned whale and dolphin captivity in 2019.",
  },
  {
    topic: "Most Donut Shops",
    keyPoint: "Canada has the most donut shops per capita worldwide.",
  },
  {
    topic: "IMAX Invention",
    keyPoint: "IMAX technology was created in Canada.",
  },
  {
    topic: "Blackfly Season",
    keyPoint: "Parts of Canada experience intense blackfly seasons.",
  },
  {
    topic: "Cheddar Capital",
    keyPoint: "St. Albert, Ontario, is known for top-quality cheddar cheese.",
  },
  {
    topic: "Zipper Innovation",
    keyPoint: "The modern zipper was co-invented by Canadian Gideon Sundback.",
  },
  {
    topic: "Tallest Totem",
    keyPoint: "BC has the tallest totem pole ever built—nearly 60 meters high.",
  },
  {
    topic: "Same-Sex Marriage",
    keyPoint: "Canada legalized same-sex marriage in 2005—fourth in the world.",
  },
  {
    topic: "Giant Lobster",
    keyPoint: "Shediac, NB, is home to the world's largest lobster sculpture.",
  },
];

const canadaFactsBatch8 = [
  {
    topic: "RCMP Mounties",
    keyPoint: "The Royal Canadian Mounted Police are iconic symbols of Canada.",
  },
  {
    topic: "Calgary Stampede",
    keyPoint: "The Calgary Stampede is the largest outdoor rodeo in the world.",
  },
  {
    topic: "Beer Stores",
    keyPoint:
      "In some provinces, beer is sold only in government-run 'Beer Stores'.",
  },
  {
    topic: "Blue Jays",
    keyPoint: "Toronto Blue Jays are Canada's only MLB baseball team.",
  },
  {
    topic: "Ketchup Chips",
    keyPoint: "Ketchup chips are a uniquely Canadian snack favorite.",
  },
  {
    topic: "Magnetic Hill",
    keyPoint:
      "Magnetic Hill in Moncton creates the illusion of cars rolling uphill.",
  },
  {
    topic: "Dinosaur Statue",
    keyPoint:
      "Drumheller, Alberta, has the world's largest dinosaur sculpture.",
  },
  {
    topic: "Loon Call",
    keyPoint: "The haunting loon call is an iconic sound in Canadian lakes.",
  },
  {
    topic: "Snowiest City",
    keyPoint: "St. John's is one of the snowiest cities on the planet.",
  },
  {
    topic: "Northernmost Town",
    keyPoint:
      "Alert, Nunavut, is the northernmost permanently inhabited place on Earth.",
  },
];

const canadaFactsBatch9 = [
  {
    topic: "First Female PM",
    keyPoint:
      "Kim Campbell became Canada's first female Prime Minister in 1993.",
  },
  {
    topic: "Walkie-Talkie",
    keyPoint: "The walkie-talkie was invented in Canada in the 1930s.",
  },
  {
    topic: "Giant Rubber Boot",
    keyPoint: "Edmundston, NB, has the world’s largest rubber boot on display.",
  },
  {
    topic: "No Tipping Up North",
    keyPoint: "In Canada’s Arctic, tipping in restaurants is not common.",
  },
  {
    topic: "Narwhal Sightings",
    keyPoint:
      "Narwhals, the unicorns of the sea, swim in Canada’s Arctic waters.",
  },
  {
    topic: "Parks Bigger Than Countries",
    keyPoint: "Some Canadian parks are larger than entire European countries!",
  },
  {
    topic: "Treaty History",
    keyPoint: "Canada’s history is shaped by treaties with Indigenous nations.",
  },
  {
    topic: "Ice Wine",
    keyPoint: "Canada is a global leader in ice wine production.",
  },
  {
    topic: "Big Beaver",
    keyPoint:
      "Beaverlodge, Alberta, features a giant beaver statue as a landmark.",
  },
  {
    topic: "Capilano Bridge",
    keyPoint: "Capilano Suspension Bridge in BC is a top tourist thrill spot.",
  },
];

const canadaFactsBatch10 = [
  {
    topic: "World's Largest Hockey Stick",
    keyPoint: "Duncan, BC, has the world's largest hockey stick and puck.",
  },
  {
    topic: "Lake Louise Beauty",
    keyPoint:
      "Lake Louise in Alberta is famous for its stunning turquoise waters.",
  },
  {
    topic: "PEI Potatoes",
    keyPoint: "Prince Edward Island is famous for its top-quality potatoes.",
  },
  {
    topic: "Butter Tart Trail",
    keyPoint: "Ontario has an official 'Butter Tart Trail' for dessert lovers.",
  },
  {
    topic: "Caribou Migration",
    keyPoint: "Canada hosts one of the world's largest caribou migrations.",
  },
  {
    topic: "Ice Roads TV",
    keyPoint: "'Ice Road Truckers' TV show was filmed in Canada’s Arctic.",
  },
  {
    topic: "Fiddlehead Ferns",
    keyPoint: "Fiddleheads are a popular spring delicacy in Eastern Canada.",
  },
  {
    topic: "World’s Largest Teepee",
    keyPoint: "Medicine Hat, Alberta, has the world's tallest teepee.",
  },
  {
    topic: "Bagged Milk",
    keyPoint: "Bagged milk is a common sight in parts of Canada like Ontario.",
  },
  {
    topic: "Trans-Canada Highway",
    keyPoint:
      "The Trans-Canada Highway is one of the longest national highways in the world.",
  },
];
