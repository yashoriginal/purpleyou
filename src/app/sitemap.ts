import { MetadataRoute } from "next";
import { products, categories } from "@/lib/data";

const SITE_URL = "https://purpleyou.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/collections/all`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  // TODO: API Integration - Fetch categories from backend
  // Example:
  // const categoriesFromAPI = await fetch(
  //   'https://api.example.com/categories',
  //   { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
  // ).then((res) => res.json());

  categories.forEach((category) => {
    collectionPages.push({
      url: `${baseUrl}/collections/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    });
  });

  // Product pages
  const productPages: MetadataRoute.Sitemap = [];

  // TODO: API Integration - Fetch products from backend
  // Example:
  // const productsFromAPI = await fetch(
  //   'https://api.example.com/products',
  //   { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
  // ).then((res) => res.json());

  products.forEach((product) => {
    productPages.push({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  // Policy pages
  const policyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-and-cancellation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-and-delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [
    ...staticPages,
    ...collectionPages,
    ...productPages,
    ...policyPages,
  ];
}
