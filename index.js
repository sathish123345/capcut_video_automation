//"C:\Users\DELL\Downloads\chrome-win\chrome-win\chrome.exe" --remote-debugging-port=9222 --user-data-dir="D:\puppeteer-profile"
import { list } from './data';

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



async function runVideosSequentially(list) {
  for (const item of list) {
    try {
      await automateCapCutVideo(item);
      console.log(`✅ Completed: ${item.topic}`);
    } catch (error) {
      console.error(`❌ Error processing ${item.topic}:`, error);
    }
  }
}

runVideosSequentially(list);


