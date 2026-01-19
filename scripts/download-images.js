#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const IMAGES_DIR = path.join(__dirname, "..", "public", "images", "products");

// Ensure directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`📁 Created directory: ${IMAGES_DIR}`);
}

// Image categories and queries
const imageCategories = {
  necklaces: ["necklace", "pendant", "choker"],
  rings: ["ring", "engagement ring", "gold ring"],
  bracelets: ["bracelet", "bangle", "gold bracelet"],
  earrings: ["earring", "drop earring", "stud earring"],
};

// Download image from URL
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filePath);

    protocol
      .get(url, { timeout: 10000 }, (response) => {
        // Handle redirects
        if (
          response.statusCode === 301 ||
          response.statusCode === 302 ||
          response.statusCode === 307
        ) {
          file.destroy();
          downloadImage(response.headers.location, filePath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          file.destroy();
          reject(
            new Error(
              `HTTP ${response.statusCode}: ${response.statusMessage}`
            )
          );
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          const fileSize = fs.statSync(filePath).size;
          const fileSizeKB = (fileSize / 1024).toFixed(2);
          console.log(`  ✓ ${path.basename(filePath)} (${fileSizeKB} KB)`);
          resolve();
        });

        file.on("error", (err) => {
          file.close();
          fs.unlink(filePath, () => {});
          reject(err);
        });
      })
      .on("error", (err) => {
        file.destroy();
        fs.unlink(filePath, () => {});
        reject(err);
      })
      .on("timeout", () => {
        file.destroy();
        fs.unlink(filePath, () => {});
        reject(new Error("Request timeout"));
      });
  });
}

// Get Unsplash direct image URL (no auth required)
function getUnsplashUrl(query) {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  return `https://source.unsplash.com/600x600/?${encodeURIComponent(query)},jewelry&sig=${timestamp}-${randomId}`;
}

async function downloadImagesForCategory(category, queries) {
  console.log(`\n📥 Downloading ${category.toUpperCase()} images...`);

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const fileName = `${category}-${i + 1}.jpg`;
    const filePath = path.join(IMAGES_DIR, fileName);

    try {
      const imageUrl = getUnsplashUrl(query);
      await downloadImage(imageUrl, filePath);
    } catch (error) {
      console.error(
        `  ✗ Failed to download ${fileName}: ${error.message}`
      );
    }

    // Add delay between requests to avoid rate limiting
    if (i < queries.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

async function main() {
  console.log("🎨 Downloading jewelry product images...");
  console.log(
    "   Using Unsplash (free stock photography)\n"
  );

  try {
    // Download images for each category
    for (const [category, queries] of Object.entries(imageCategories)) {
      await downloadImagesForCategory(category, queries);
    }

    console.log("\n✅ All downloads complete!");
    console.log(`\n📁 Images saved to: public/images/products/`);
    console.log("\n📝 Image files created:");
    fs.readdirSync(IMAGES_DIR).forEach((file) => {
      console.log(`   • ${file}`);
    });

    console.log("\n💡 Next steps:");
    console.log("   1. Review images in /public/images/products/");
    console.log("   2. Rename images to match your product names");
    console.log("   3. Update backend API to use: /images/products/[filename]");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

main();
