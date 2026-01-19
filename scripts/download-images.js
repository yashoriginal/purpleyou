#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

// Image categories and naming
const imageCategories = {
  necklaces: ["necklace", "pendant", "choker"],
  rings: ["ring", "engagement ring", "band"],
  bracelets: ["bracelet", "bangle", "wristband"],
  earrings: ["earring", "stud", "drop earring"],
};

const PUBLIC_DIR = path.join(__dirname, "..", "public", "images", "products");

// Ensure directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Download image from URL
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        // Follow redirects
        if (
          response.statusCode === 301 ||
          response.statusCode === 302 ||
          response.statusCode === 307
        ) {
          downloadImage(response.headers.location, filePath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filePath)}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {}); // Delete incomplete file
        reject(err);
      });
  });
}

// Get Unsplash image URL
function getUnsplashImageUrl(query, imageNumber) {
  // Using Unsplash's search endpoint with random parameter
  const randomId = Math.floor(Math.random() * 10000);
  return `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1&page=${randomId}&client_id=YOUR_CLIENT_ID`;
}

// Alternative: Direct Unsplash source URL (doesn't require auth)
function getRandomUnsplashDirectUrl(query) {
  const randomId = Math.floor(Math.random() * 10000);
  return `https://source.unsplash.com/600x600/?${encodeURIComponent(query)}&${randomId}`;
}

async function downloadImagesForCategory(category, queries) {
  console.log(`\n📥 Downloading ${category} images...`);

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const fileName = `${category}-${i + 1}.jpg`;
    const filePath = path.join(PUBLIC_DIR, fileName);

    try {
      const imageUrl = getRandomUnsplashDirectUrl(query);
      await downloadImage(imageUrl, filePath);
    } catch (error) {
      console.error(
        `✗ Failed to download ${category}-${i + 1}: ${error.message}`
      );
    }
  }
}

async function main() {
  console.log("🎨 Downloading jewelry images from Unsplash...\n");

  try {
    // Download images for each category
    for (const [category, queries] of Object.entries(imageCategories)) {
      await downloadImagesForCategory(category, queries);
    }

    console.log("\n✅ Download complete!");
    console.log(
      `📁 Images saved to: ${path.relative(process.cwd(), PUBLIC_DIR)}`
    );
    console.log(
      "\n💡 Tip: Update your backend API to use these local images"
    );
    console.log("   Image paths: /images/products/[category]-[number].jpg");
  } catch (error) {
    console.error("❌ Error during download:", error.message);
    process.exit(1);
  }
}

main();
