var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  PERMANENT_MASTER_KEY: () => PERMANENT_MASTER_KEY
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/data/initialData.ts
var initialShopSettings = {
  shopNameKu: "\u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627\u06CC \u0634\u0648\u0627\u0646",
  shopNameEn: "Peshangay Shwan",
  taglineKu: "\u0628\u0627\u0634\u062A\u0631\u06CC\u0646 \u0648 \u0646\u0648\u06CE\u062A\u0631\u06CC\u0646 \u06A9\u0627\u06B5\u0627 \u0645\u06C6\u062F\u06CE\u0631\u0646\u06D5\u06A9\u0627\u0646 \u0628\u06D5 \u06AF\u06D5\u0631\u06D5\u0646\u062A\u06CC \u0648 \u06AF\u06D5\u06CC\u0627\u0646\u062F\u0646\u06CC \u062E\u06CE\u0631\u0627 \u0628\u06C6 \u0647\u06D5\u0645\u0648\u0648 \u06A9\u0648\u0631\u062F\u0633\u062A\u0627\u0646",
  taglineEn: "Premium Showroom for Electronics, Lifestyle & Modern Goods in Kurdistan",
  ownerNameKu: "\u0634\u0648\u0627\u0646 (\u062E\u0627\u0648\u06D5\u0646\u06CC \u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627)",
  phonePrimary: "0750 123 4567",
  phoneSecondary: "0770 123 4567",
  whatsappNumber: "+9647501234567",
  viberNumber: "+9647501234567",
  instagramHandle: "peshangay_shwan",
  tiktokHandle: "peshangay_shwan",
  facebookPage: "peshangay.shwan",
  telegramUsername: "peshangay_shwan",
  addressKu: "\u06A9\u0648\u0631\u062F\u0633\u062A\u0627\u0646\u060C \u0647\u06D5\u0648\u0644\u06CE\u0631 - \u0634\u06D5\u0642\u0627\u0645\u06CC \u0666\u0660 \u0645\u06D5\u062A\u0631\u06CC\u060C \u0628\u06D5\u0631\u0627\u0645\u0628\u06D5\u0631 \u0645\u06C6\u06B5\u06CC \u06AF\u06D5\u0648\u0631\u06D5 (\u0644\u0642\u06D5\u06A9\u0627\u0646\u06CC \u062A\u0631\u06CC\u0634 \u0644\u06D5 \u0633\u0644\u06CE\u0645\u0627\u0646\u06CC \u0648 \u062F\u0647\u06C6\u06A9)",
  addressEn: "Erbil, Kurdistan - 60m Street, Shwan Showroom",
  usdToIqdRate: 1500,
  // $1 = 1,500 IQD ($100 = 150,000 IQD)
  adminPin: "1254",
  masterRecoveryKey: "SHWAN-9988",
  announcementKu: "\u{1F525} \u062F\u0627\u0634\u06A9\u0627\u0646\u062F\u0646\u06CC \u062A\u0627\u06CC\u0628\u06D5\u062A \u0628\u06D5\u0628\u06C6\u0646\u06D5\u06CC \u06A9\u0631\u062F\u0646\u06D5\u0648\u06D5\u06CC \u0644\u0642\u06CC \u0626\u06C6\u0646\u0644\u0627\u06CC\u0646 \u0628\u06C6 \u0647\u06D5\u0645\u0648\u0648 \u0634\u0627\u0631 \u0648 \u0634\u0627\u0631\u06C6\u0686\u06A9\u06D5\u06A9\u0627\u0646\u06CC \u06A9\u0648\u0631\u062F\u0633\u062A\u0627\u0646!",
  showAnnouncement: true,
  freeDeliveryThresholdIqd: 1e5,
  customStoreUrl: "https://ais-pre-cegnzsal62axn53jlnbzue-513231421546.europe-west2.run.app",
  fastPayNumber: "0750 123 4567",
  fibAccountNumber: "9647501234567",
  superQiNumber: "6000 1234 5678",
  paymentInstructionsKu: "\u062F\u0648\u0627\u06CC \u0646\u0627\u0631\u062F\u0646\u06CC \u0628\u0695\u06D5 \u067E\u0627\u0631\u06D5\u06A9\u06D5 \u0628\u06C6 \u06CC\u06D5\u06A9\u06CE\u06A9 \u0644\u06D5 \u0626\u06D5\u0698\u0645\u06CE\u0631\u06D5\u06A9\u0627\u0646\u06CC \u0633\u06D5\u0631\u06D5\u0648\u06D5\u060C \u0648\u06CE\u0646\u06D5\u06CC \u0648\u06D5\u0633\u06B5\u06D5\u06A9\u06D5 \u06CC\u0627\u0646 \u0698\u0645\u0627\u0631\u06D5\u06CC \u062D\u06D5\u0648\u0627\u06B5\u06D5\u06A9\u06D5 \u0644\u06D5 \u0648\u0627\u062A\u0633\u0626\u0627\u067E \u0628\u0646\u06CE\u0631\u06D5."
};
var initialCategories = [
  { id: "all", nameKu: "\u0647\u06D5\u0645\u0648\u0648 \u06A9\u0627\u06B5\u0627\u06A9\u0627\u0646", nameEn: "All Products", iconName: "LayoutGrid" },
  { id: "electronics", nameKu: "\u0626\u06D5\u0644\u06CC\u06A9\u062A\u0631\u06C6\u0646\u06CC \u0648 \u0645\u06C6\u0628\u0627\u06CC\u0644", nameEn: "Electronics & Gadgets", iconName: "Smartphone" },
  { id: "watches-perfumes", nameKu: "\u06A9\u0627\u062A\u0698\u0645\u06CE\u0631 \u0648 \u0628\u06C6\u0646", nameEn: "Watches & Perfumes", iconName: "Watch" },
  { id: "home-appliances", nameKu: "\u06A9\u06D5\u0631\u06D5\u0633\u062A\u06D5\u06CC \u0646\u0627\u0648\u0645\u0627\u06B5", nameEn: "Home & Kitchen", iconName: "Home" },
  { id: "fashion-bags", nameKu: "\u0645\u06C6\u062F\u06D5 \u0648 \u062C\u0627\u0646\u062A\u0627", nameEn: "Fashion & Bags", iconName: "ShoppingBag" },
  { id: "gaming-audio", nameKu: "\u062F\u06D5\u0646\u06AF \u0648 \u06AF\u06D5\u06CC\u0645\u06CC\u0646\u06AF", nameEn: "Audio & Gaming", iconName: "Headphones" }
];
var kurdistanCities = [
  { id: "erbil", nameKu: "\u0647\u06D5\u0648\u0644\u06CE\u0631 (\u0647\u06D5\u0645\u0648\u0648 \u06AF\u06D5\u0695\u06D5\u06A9\u06D5\u06A9\u0627\u0646)", nameEn: "Erbil", feeIqd: 3e3, feeUsd: 2, estimateKu: "\u0661 \u0628\u06C6 \u0662\u0664 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "slemani", nameKu: "\u0633\u0644\u06CE\u0645\u0627\u0646\u06CC (\u0646\u0627\u0648\u0634\u0627\u0631 \u0648 \u062F\u06D5\u0648\u0631\u0648\u0628\u06D5\u0631)", nameEn: "Sulaymaniyah", feeIqd: 4e3, feeUsd: 2.7, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "duhok", nameKu: "\u062F\u0647\u06C6\u06A9 \u0648 \u0632\u0627\u062E\u06C6", nameEn: "Duhok & Zakho", feeIqd: 4e3, feeUsd: 2.7, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "kirkuk", nameKu: "\u06A9\u06D5\u0631\u06A9\u0648\u0648\u06A9", nameEn: "Kirkuk", feeIqd: 4e3, feeUsd: 2.7, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "halabja", nameKu: "\u0647\u06D5\u06B5\u06D5\u0628\u062C\u06D5 \u0648 \u0634\u0627\u0631\u06D5\u0632\u0648\u0648\u0631", nameEn: "Halabja", feeIqd: 5e3, feeUsd: 3.3, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "soran", nameKu: "\u0633\u06C6\u0631\u0627\u0646\u060C \u0686\u06C6\u0645\u0627\u0646\u060C \u0695\u06D5\u0648\u0627\u0646\u062F\u0632", nameEn: "Soran & Rawanduz", feeIqd: 5e3, feeUsd: 3.3, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "ranya", nameKu: "\u0695\u0627\u0646\u06CC\u06D5 \u0648 \u0642\u06D5\u06B5\u0627\u062F\u0632\u06CE \u0648 \u067E\u0634\u062F\u06D5\u0631", nameEn: "Ranya & Qaladze", feeIqd: 5e3, feeUsd: 3.3, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "kalar", nameKu: "\u06A9\u06D5\u0644\u0627\u0631 \u0648 \u06AF\u06D5\u0631\u0645\u06CC\u0627\u0646 \u0648 \u06A9\u0641\u0631\u06CC", nameEn: "Kalar & Garmian", feeIqd: 5e3, feeUsd: 3.3, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" },
  { id: "akry", nameKu: "\u0626\u0627\u06A9\u0631\u06CE \u0648 \u0628\u06D5\u0631\u062F\u06D5\u0695\u06D5\u0634 \u0648 \u0626\u0627\u0645\u06CE\u062F\u06CC", nameEn: "Akre & Amedi", feeIqd: 5e3, feeUsd: 3.3, estimateKu: "\u0662\u0664 \u0628\u06C6 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631" }
];
var initialProducts = [
  {
    id: "prod-1",
    titleKu: "\u06A9\u0627\u062A\u0698\u0645\u06CE\u0631\u06CC \u0632\u06CC\u0631\u06D5\u06A9\u06CC \u0645\u06C6\u062F\u06CE\u0631\u0646 Ultra 2 Pro \u0628\u06D5 \u0628\u06D5\u0633\u062A\u06D5\u0631\u06CC \u062A\u06CC\u062A\u0627\u0646\u06CC\u06C6\u0645",
    titleEn: "Smart Watch Ultra 2 Pro Titanium Edition",
    category: "electronics",
    priceIqd: 45e3,
    priceUsd: 30,
    originalPriceIqd: 6e4,
    originalPriceUsd: 40,
    discountPercent: 25,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u06A9\u0627\u062A\u0698\u0645\u06CE\u0631\u06CC \u0632\u06CC\u0631\u06D5\u06A9\u06CC \u0633\u06D5\u0631\u062F\u06D5\u0645\u06CC\u0627\u0646\u06D5 \u0628\u06D5 \u0634\u0627\u0634\u06D5\u06CC \u06AF\u06D5\u0648\u0631\u06D5\u06CC AMOLED \u0628\u06D5 \u0695\u0648\u0648\u0646\u06CC \u0628\u06D5\u0631\u0632\u060C \u067E\u0634\u062A\u06AF\u06CC\u0631\u06CC \u067E\u06D5\u06CC\u0648\u06D5\u0646\u062F\u06CC \u0648 \u0644\u06CE\u062F\u0627\u0646\u06CC \u062F\u06B5 \u0648 \u0648\u06D5\u0631\u0632\u0634 \u0648 \u0646\u06D5\u062E\u0634\u06D5\u06CC \u06A9\u0648\u0631\u062F\u0633\u062A\u0627\u0646 \u062F\u06D5\u06A9\u0627\u062A. \u067E\u0627\u062A\u0631\u06CC \u062A\u0627 \u0667 \u0695\u06C6\u0698 \u0628\u06D5\u0631\u062F\u06D5\u0648\u0627\u0645 \u062F\u06D5\u0628\u06CE\u062A \u0644\u06D5\u06AF\u06D5\u06B5 \u062F\u0648\u0648 \u0642\u0627\u06CC\u0634 \u0628\u06D5 \u062F\u06CC\u0627\u0631\u06CC \u0644\u06D5\u0644\u0627\u06CC\u06D5\u0646 \u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627\u06CC \u0634\u0648\u0627\u0646.",
    descriptionEn: "Ultra 2 Pro Smart Watch with brilliant AMOLED display, Bluetooth calling, health & fitness sensors, 7-day battery life, and 2 interchangeable straps.",
    inStock: true,
    stockCount: 18,
    badgeKu: "\u067E\u0695\u0641\u0631\u06C6\u0634\u062A\u0631\u06CC\u0646 \u{1F525}",
    badgeType: "hot",
    sku: "SHW-W2001",
    featuresKu: ["\u0634\u0627\u0634\u06D5\u06CC \u0695\u0648\u0648\u0646\u06CC \u0628\u06D5\u0631\u0632 AMOLED", "\u067E\u0634\u062A\u06AF\u06CC\u0631\u06CC \u0632\u0645\u0627\u0646\u06CC \u06A9\u0648\u0631\u062F\u06CC \u0648 \u0639\u06D5\u0631\u06D5\u0628\u06CC", "\u062F\u0698\u06D5 \u0626\u0627\u0648 \u0628\u06D5 \u067E\u0644\u06D5\u06CC IP68", "\u067E\u0627\u062A\u0631\u06CC \u067E\u0695\u062A\u0648\u0627\u0646\u0627 \u062A\u0627 \u0667 \u0695\u06C6\u0698"],
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: true
  },
  {
    id: "prod-2",
    titleKu: "\u0647\u06CE\u062F\u0641\u06C6\u0646\u06CC \u0628\u06CE \u0648\u0627\u06CC\u06D5\u0631\u06CC \u067E\u0631\u06C6 \u0628\u06D5 \u062F\u06D5\u0646\u06AF\u06CC \u0633\u062A\u06C6\u062F\u06CC\u06C6 \u0648 \u062A\u0627\u06CC\u0628\u06D5\u062A\u0645\u06D5\u0646\u062F\u06CC ANC",
    titleEn: "Wireless Noise Cancelling Studio Headphones",
    category: "gaming-audio",
    priceIqd: 55e3,
    priceUsd: 36.6,
    originalPriceIqd: 75e3,
    originalPriceUsd: 50,
    discountPercent: 27,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u0647\u06CE\u062F\u0641\u06C6\u0646\u06CC \u0628\u06CE \u0648\u0627\u06CC\u06D5\u0631\u06CC \u062F\u06D5\u0646\u06AF \u0628\u06D5\u0631\u0632 \u0628\u06D5 \u06A9\u0648\u0627\u0644\u06CC\u062A\u06CC \u0628\u06CE \u0648\u06CE\u0646\u06D5 \u0648 \u0633\u06CC\u0633\u062A\u06D5\u0645\u06CC \u0633\u0695\u06CC\u0646\u06D5\u0648\u06D5\u06CC \u062F\u06D5\u0646\u06AF\u06CC \u062F\u06D5\u0631\u06D5\u0648\u06D5 (Active Noise Cancelling). \u0632\u06C6\u0631 \u0626\u0627\u0633\u0648\u0648\u062F\u06D5\u06CC\u06D5 \u0628\u06C6 \u06AF\u0648\u06CE\u06AF\u0631\u062A\u0646 \u0644\u06D5 \u0645\u06C6\u0633\u06CC\u0642\u0627\u060C \u06CC\u0627\u0631\u06CC \u0648 \u06A9\u06C6\u0628\u0648\u0648\u0646\u06D5\u0648\u06D5.",
    descriptionEn: "Studio grade wireless headphones with high fidelity audio, active noise cancellation, and ultra comfortable memory foam cushions.",
    inStock: true,
    stockCount: 12,
    badgeKu: "\u062F\u0627\u0634\u06A9\u0627\u0646\u062F\u0646\u06CC \u062A\u0627\u06CC\u0628\u06D5\u062A %\u0662\u0667",
    badgeType: "sale",
    sku: "SHW-AU104",
    featuresKu: ["\u0633\u0695\u06CC\u0646\u06D5\u0648\u06D5\u06CC \u0698\u0627\u0648\u06D5\u0698\u0627\u0648 ANC", "\u067E\u0627\u062A\u0631\u06CC \u062A\u0627 \u0664\u0660 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631", "\u0645\u0627\u06CC\u06A9\u0631\u06C6\u0641\u06C6\u0646\u06CC \u0695\u0648\u0648\u0646 \u0628\u06C6 \u067E\u06D5\u06CC\u0648\u06D5\u0646\u062F\u06CC", "\u067E\u06D5\u06CC\u0648\u06D5\u0633\u062A\u0628\u0648\u0648\u0646 \u0628\u06D5 \u062F\u0648\u0648 \u0626\u0627\u0645\u06CE\u0631 \u0644\u06D5 \u06CC\u06D5\u06A9 \u06A9\u0627\u062A\u062F\u0627"],
    rating: 4.8,
    reviewsCount: 31,
    isFeatured: true
  },
  {
    id: "prod-3",
    titleKu: "\u0628\u06C6\u0646\u06CC \u067E\u06CC\u0627\u0648\u0627\u0646\u06D5\u06CC \u0695\u06C6\u06CC\u0627\u06B5 \u0639\u0648\u0648\u062F \u0626\u06C6\u0631\u062C\u06CC\u0646\u0627\u06B5 \u0628\u06D5 \u0645\u0627\u0646\u06D5\u0648\u06D5\u06CC \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631\u06CC",
    titleEn: "Royal Oud Luxury Eau de Parfum 100ml",
    category: "watches-perfumes",
    priceIqd: 65e3,
    priceUsd: 43.3,
    originalPriceIqd: 85e3,
    originalPriceUsd: 56.6,
    discountPercent: 24,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u0628\u06C6\u0646\u06CE\u06A9\u06CC \u0634\u0627\u0647\u0627\u0646\u06D5 \u0648 \u0633\u06D5\u0631\u0646\u062C\u0695\u0627\u06A9\u06CE\u0634 \u0628\u06D5 \u062A\u06CE\u06A9\u06D5\u06B5\u06D5\u06CC \u0639\u0648\u0648\u062F \u0648 \u0639\u06D5\u0646\u0628\u06D5\u0631 \u0648 \u062F\u0627\u0631\u0633\u06CE\u0648. \u0628\u06D5 \u06AF\u0631\u06D5\u0646\u062A\u06CC \u0695\u06D5\u0633\u06D5\u0646\u0627\u06CC\u06D5\u062A\u06CC \u0644\u06D5 \u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627\u06CC \u0634\u0648\u0627\u0646\u060C \u0628\u06C6\u0646\u06D5\u06A9\u06D5\u06CC \u0628\u06D5 \u0634\u06CE\u0648\u06D5\u06CC\u06D5\u06A9\u06CC \u0646\u0627\u0648\u0627\u0632\u06D5 \u0628\u06D5 \u062C\u0644\u06D5\u0648\u06D5 \u062F\u06D5\u0645\u06CE\u0646\u06CE\u062A\u06D5\u0648\u06D5.",
    descriptionEn: "Premium luxury oud fragrance 100ml with rich amber and woody notes, offering enduring elegance and lasting projection.",
    inStock: true,
    stockCount: 9,
    badgeKu: "\u0646\u0627\u0648\u0627\u0632\u06D5 \u0648 \u062A\u0627\u06CC\u0628\u06D5\u062A \u2B50",
    badgeType: "exclusive",
    sku: "SHW-PRF309",
    featuresKu: ["\u0642\u06D5\u0628\u0627\u0631\u06D5\u06CC \u0661\u0660\u0660 \u0645\u0644", "\u0645\u0627\u0646\u06D5\u0648\u06D5 \u0628\u06C6 \u0645\u0627\u0648\u06D5\u06CC \u0632\u06CC\u0627\u062A\u0631 \u0644\u06D5 \u0664\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631", "\u0634\u0648\u0634\u06D5 \u0648 \u067E\u0627\u06A9\u06CE\u062C\u06CC \u06A9\u06D5\u0634\u062E\u06D5\u06CC \u062F\u06CC\u0627\u0631\u06CC", "\u0661\u0660\u0660\u066A \u0695\u06D5\u0633\u06D5\u0646"],
    rating: 5,
    reviewsCount: 56,
    isFeatured: true
  },
  {
    id: "prod-4",
    titleKu: "\u0626\u0627\u0645\u06CE\u0631\u06CC \u0626\u06CC\u0633\u067E\u0631\u06CE\u0633\u06C6 \u0648 \u06A9\u0627\u067E\u0648\u0686\u06CC\u0646\u06C6\u06CC \u0626\u06CC\u062A\u0627\u0644\u06CC \u0628\u06D5 \u067E\u06D5\u0633\u062A\u0627\u0646\u06CC \u0662\u0660 \u0628\u0627\u0631",
    titleEn: "Italian Espresso & Cappuccino Maker 20-Bar",
    category: "home-appliances",
    priceIqd: 11e4,
    priceUsd: 73.3,
    originalPriceIqd: 135e3,
    originalPriceUsd: 90,
    discountPercent: 19,
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u0626\u0627\u0645\u06CE\u0631\u06CC \u062F\u0631\u0648\u0633\u062A\u06A9\u0631\u062F\u0646\u06CC \u0642\u0627\u0648\u06D5\u06CC \u0626\u06CC\u0633\u067E\u0631\u06CE\u0633\u06C6 \u0648 \u06A9\u0627\u067E\u0648\u0686\u06CC\u0646\u06C6 \u0648 \u0644\u0627\u062A\u06CE \u0628\u06D5 \u06A9\u06D5\u0641\u06CC \u0641\u0648\u0645 \u0644\u06D5 \u0645\u0627\u06B5\u06D5\u0648\u06D5. \u062E\u06CE\u0631\u0627\u06CC\u06D5 \u0644\u06D5 \u06AF\u06D5\u0631\u0645\u0628\u0648\u0648\u0646 \u0648 \u067E\u0627\u06A9\u06A9\u0631\u062F\u0646\u06D5\u0648\u06D5\u06CC \u0632\u06C6\u0631 \u0626\u0627\u0633\u0627\u0646\u06D5. \u0628\u06D5 \u06AF\u0631\u06D5\u0646\u062A\u06CC \u06CC\u06D5\u06A9 \u0633\u0627\u06B5 \u0644\u06D5 \u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627\u06CC \u0634\u0648\u0627\u0646.",
    descriptionEn: "Compact high-performance 20-bar espresso coffee machine with stainless steel milk steam wand for professional barista coffee at home.",
    inStock: true,
    stockCount: 7,
    badgeKu: "\u06AF\u0631\u06D5\u0646\u062A\u06CC \u06CC\u06D5\u06A9 \u0633\u0627\u06B5 \u{1F6E1}\uFE0F",
    badgeType: "new",
    sku: "SHW-HM550",
    featuresKu: ["\u067E\u06D5\u0633\u062A\u0627\u0646\u06CC \u0628\u06D5\u0647\u06CE\u0632\u06CC \u0662\u0660 \u0628\u0627\u0631", "\u0644\u0648\u0644\u06CC \u06A9\u06D5\u0641\u06CC \u0634\u06CC\u0631 \u0628\u06D5 \u0647\u06D5\u06B5\u0645", "\u062A\u06D5\u0646\u06A9\u06CC \u0626\u0627\u0648\u06CC \u0661.\u0665 \u0644\u06CC\u062A\u0631\u06CC \u0644\u06CE\u0628\u06C6\u0648\u06D5", "\u062E\u0627\u0648\u06CE\u0646\u06A9\u0631\u062F\u0646\u06D5\u0648\u06D5\u06CC \u0626\u0627\u0633\u0627\u0646"],
    rating: 4.9,
    reviewsCount: 28,
    isFeatured: true
  },
  {
    id: "prod-5",
    titleKu: "\u062C\u0627\u0646\u062A\u0627 \u0648 \u06A9\u06C6\u06B5\u06D5\u067E\u0634\u062A\u06CC \u06AF\u06D5\u0634\u062A \u0648 \u0644\u0627\u067E\u062A\u06C6\u067E\u06CC \u062F\u0698\u06D5 \u0626\u0627\u0648 \u0628\u06D5 \u067E\u06C6\u0631\u062A\u06CC \u0634\u06D5\u062D\u0646",
    titleEn: "Waterproof Travel Laptop Backpack with USB Port",
    category: "fashion-bags",
    priceIqd: 35e3,
    priceUsd: 23.3,
    originalPriceIqd: 45e3,
    originalPriceUsd: 30,
    discountPercent: 22,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u06A9\u06C6\u06B5\u06D5\u067E\u0634\u062A\u06CC \u0634\u0627\u0632 \u0648 \u0645\u06C6\u062F\u06CE\u0631\u0646 \u0628\u06C6 \u0632\u0627\u0646\u06A9\u06C6\u060C \u06A9\u0627\u0631 \u0648 \u06AF\u06D5\u0634\u062A. \u0642\u0648\u0645\u0627\u0634\u06CC \u0626\u06D5\u0633\u062A\u0648\u0648\u0631\u06CC \u062F\u0698\u06D5 \u062F\u0695\u0627\u0646 \u0648 \u062F\u0698\u06D5 \u0626\u0627\u0648\u060C \u0634\u0648\u06CE\u0646\u06CC \u062A\u0627\u06CC\u0628\u06D5\u062A \u0628\u06D5 \u0644\u0627\u067E\u062A\u06C6\u067E \u062A\u0627 \u0661\u0666 \u0626\u06CC\u0646\u062C \u0648 \u062F\u06D5\u0631\u0686\u06D5\u06CC \u0634\u06D5\u062D\u0646\u06A9\u0631\u062F\u0646\u06D5\u0648\u06D5\u06CC \u0645\u06C6\u0628\u0627\u06CC\u0644.",
    descriptionEn: 'Ergonomic water-resistant multi-pocket backpack designed for 15.6-16" laptops, college, business travel with integrated USB charging port.',
    inStock: true,
    stockCount: 25,
    badgeKu: "\u062F\u06CC\u0632\u0627\u06CC\u0646\u06CC \u0662\u0660\u0662\u0665",
    badgeType: "new",
    sku: "SHW-BG882",
    featuresKu: ["\u0642\u0648\u0645\u0627\u0634\u06CC \u062F\u0698\u06D5 \u0626\u0627\u0648 \u0648 \u062F\u0695\u0627\u0646", "\u067E\u06C6\u0631\u062A\u06CC \u062F\u06D5\u0631\u06D5\u06A9\u06CC USB \u0628\u06C6 \u0634\u06D5\u062D\u0646", "\u0642\u0648\u0641\u06B5\u06CC \u0633\u06D5\u0644\u0627\u0645\u06D5\u062A\u06CC \u0628\u06C6 \u0632\u06CC\u067E\u06D5\u06A9\u0627\u0646", "\u067E\u0634\u062A\u06CC \u062A\u06D5\u0646\u062F\u0631\u0648\u0633\u062A\u06CC \u067E\u0634\u0648\u0648\u062F\u06D5\u0631"],
    rating: 4.7,
    reviewsCount: 39,
    isFeatured: false
  },
  {
    id: "prod-6",
    titleKu: "\u067E\u0627\u0648\u06D5\u0631\u0628\u0627\u0646\u06A9\u06CC \u0632\u06D5\u0628\u06D5\u0644\u0627\u062D\u06CC 30,000mAh \u0628\u06D5 \u0634\u06D5\u062D\u0646\u06CC \u062E\u06CE\u0631\u0627\u06CC 65W \u0628\u06C6 \u0644\u0627\u067E\u062A\u06C6\u067E \u0648 \u0645\u06C6\u0628\u0627\u06CC\u0644",
    titleEn: "30,000mAh 65W Fast Charge Power Bank",
    category: "electronics",
    priceIqd: 48e3,
    priceUsd: 32,
    originalPriceIqd: 65e3,
    originalPriceUsd: 43.3,
    discountPercent: 26,
    images: [
      "https://images.unsplash.com/photo-1609592424368-d069b08f51a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u067E\u0627\u0648\u06D5\u0631\u0628\u0627\u0646\u06A9\u06CC \u067E\u0695\u062A\u0648\u0627\u0646\u0627 \u0628\u06D5 \u0647\u06CE\u0632\u06CC \u0666\u0665 \u0648\u0627\u062A \u06A9\u06D5 \u062A\u0648\u0627\u0646\u0627\u06CC \u0634\u06D5\u062D\u0646\u06A9\u0631\u062F\u0646\u06D5\u0648\u06D5\u06CC \u0647\u0627\u0648\u06A9\u0627\u062A\u06CC \u0645\u06C6\u0628\u0627\u06CC\u0644\u060C \u0626\u0627\u06CC\u067E\u0627\u062F \u0648 \u062A\u06D5\u0646\u0627\u0646\u06D5\u062A \u0644\u0627\u067E\u062A\u06C6\u067E\u06CC \u0645\u0627\u06A9\u0628\u0648\u0648\u06A9 \u0648 \u0648\u06CC\u0646\u062F\u06C6\u0632\u06CC \u0647\u06D5\u06CC\u06D5 \u0628\u06D5 \u062E\u06CE\u0631\u0627\u062A\u0631\u06CC\u0646 \u0634\u06CE\u0648\u06D5. \u0628\u06D5 \u0634\u0627\u0634\u06D5\u06CC \u062F\u06CC\u062C\u06CC\u062A\u0627\u06B5\u06CC \u062F\u06CC\u0627\u0631\u06CC\u06A9\u0631\u062F\u0646\u06CC \u0695\u06CE\u0698\u06D5\u06CC \u0634\u06D5\u062D\u0646.",
    descriptionEn: "High capacity 30,000mAh power station with 65W PD Type-C output, digital percentage display, multi-device fast charge support.",
    inStock: true,
    stockCount: 14,
    badgeKu: "\u067E\u0695\u062A\u0648\u0627\u0646\u0627 \u26A1",
    badgeType: "hot",
    sku: "SHW-PB65W",
    featuresKu: ["\u062A\u0648\u0627\u0646\u0627\u06CC 65W \u0628\u06C6 \u0644\u0627\u067E\u062A\u06C6\u067E \u0648 \u0645\u06C6\u0628\u0627\u06CC\u0644", "\u0634\u0627\u0634\u06D5\u06CC \u062F\u06CC\u062C\u06CC\u062A\u0627\u06B5\u06CC \u0648\u0631\u062F\u06CC LED", "\u067E\u0627\u0631\u0627\u0633\u062A\u0646 \u0644\u06D5 \u06AF\u06D5\u0631\u0645\u0628\u0648\u0648\u0646 \u0648 \u06A9\u0648\u0631\u062A\u06D5", "\u0634\u06D5\u062D\u0646\u06A9\u0631\u062F\u0646\u06CC \u0663 \u0626\u0627\u0645\u06CE\u0631 \u0628\u06D5\u06CC\u06D5\u06A9\u06D5\u0648\u06D5"],
    rating: 4.9,
    reviewsCount: 47,
    isFeatured: true
  },
  {
    id: "prod-7",
    titleKu: "\u0633\u067E\u06CC\u06A9\u06D5\u0631\u06CC \u0628\u0644\u0648\u062A\u0648\u0632\u06CC \u062F\u0698\u06D5 \u0626\u0627\u0648 \u0628\u06D5 \u0695\u06C6\u0634\u0646\u0627\u06CC\u06CC RGB \u0648 \u0628\u06D5\u06CC\u0632\u06CC \u0642\u0648\u06B5",
    titleEn: "Portable Waterproof RGB Bluetooth Speaker",
    category: "gaming-audio",
    priceIqd: 38e3,
    priceUsd: 25.3,
    originalPriceIqd: 5e4,
    originalPriceUsd: 33.3,
    discountPercent: 24,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u0633\u067E\u06CC\u06A9\u06D5\u0631\u06CC \u06AF\u06D5\u0648\u0631\u06D5\u06CC \u0645\u06D5\u06CC\u062F\u0627\u0646\u06CC \u0628\u06C6 \u0633\u06D5\u06CC\u0631\u0627\u0646\u060C \u0645\u0627\u06B5 \u0648 \u0633\u06D5\u0641\u06D5\u0631. \u062F\u06D5\u0646\u06AF\u06CE\u06A9\u06CC \u0628\u06D5\u0631\u0632 \u0648 \u0628\u06CE \u06AF\u06D5\u0631\u062F \u0628\u06D5 \u0628\u06D5\u06CC\u0633\u06CC \u0628\u06D5\u0647\u06CE\u0632\u060C \u0695\u0648\u0648\u0646\u0627\u06A9\u06CC\u06CC \u0695\u0627\u0632\u0627\u0648\u06D5\u06CC RGB \u0644\u06D5\u06AF\u06D5\u06B5 \u0695\u06CC\u062A\u0645\u06CC \u06AF\u06C6\u0631\u0627\u0646\u06CC\u060C \u0628\u06D5\u0631\u06AF\u06D5\u06CC \u0626\u0627\u0648 \u0648 \u062A\u06C6\u0632 \u062F\u06D5\u06AF\u0631\u06CE\u062A.",
    descriptionEn: "Powerful outdoor Bluetooth speaker with rich bass radiators, customizable dynamic RGB lighting sync, and 18-hour continuous playtime.",
    inStock: true,
    stockCount: 20,
    badgeKu: "\u062A\u0627\u06CC\u0628\u06D5\u062A \u0628\u06D5 \u0633\u06D5\u06CC\u0631\u0627\u0646 \u{1F3D5}\uFE0F",
    badgeType: "sale",
    sku: "SHW-SP80",
    featuresKu: ["\u067E\u0627\u062A\u0631\u06CC \u062A\u0627 \u0661\u0668 \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631 \u06A9\u0627\u0631\u06A9\u0631\u062F\u0646", "\u0695\u06C6\u0634\u0646\u0627\u06CC\u06CC RGB \u0645\u06C6\u062F\u06CE\u0631\u0646", "\u062F\u0698\u06D5 \u0626\u0627\u0648 \u0628\u06C6 \u06A9\u06D5\u0634\u0648\u0647\u06D5\u0648\u0627\u06CC \u062F\u06D5\u0631\u06D5\u0648\u06D5", "\u067E\u0634\u062A\u06AF\u06CC\u0631\u06CC \u0628\u0644\u0648\u062A\u0648\u0632 \u0648 \u0645\u06CC\u0645\u06C6\u0631\u06CC \u0648 AUX"],
    rating: 4.8,
    reviewsCount: 29,
    isFeatured: false
  },
  {
    id: "prod-8",
    titleKu: "\u0633\u06CE\u062A\u06CC \u06A9\u0627\u062A\u0698\u0645\u06CE\u0631\u06CC \u0641\u06D5\u062E\u0645\u06CC \u0626\u06D5\u06B5\u0642\u06D5 \u0648 \u0642\u06C6\u06B5\u0628\u06D5\u0633\u062A\u06CC \u0698\u0646\u0627\u0646\u06D5\u06CC \u0695\u06C6\u0632 \u06AF\u06C6\u06B5\u062F",
    titleEn: "Luxury Rose Gold Women Watch & Bracelet Gift Set",
    category: "watches-perfumes",
    priceIqd: 42e3,
    priceUsd: 28,
    originalPriceIqd: 55e3,
    originalPriceUsd: 36.6,
    discountPercent: 23,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionKu: "\u0633\u06CE\u062A\u06CC \u062F\u06CC\u0627\u0631\u06CC \u0632\u06C6\u0631 \u06A9\u06D5\u0634\u062E\u06D5\u06CC \u062E\u0627\u0646\u0645\u0627\u0646 \u0628\u06D5 \u0695\u06D5\u0646\u06AF\u06CC \u0695\u06C6\u0632 \u06AF\u06C6\u06B5\u062F \u0628\u06D5 \u0628\u06D5\u0631\u062F\u06CC \u062F\u0631\u06D5\u0648\u0634\u0627\u0648\u06D5\u06CC \u0632\u06CE\u0631\u06A9\u06C6\u0646\u060C \u0644\u06D5\u06AF\u06D5\u06B5 \u0642\u06C6\u06B5\u0628\u06D5\u0633\u062A \u0648 \u0626\u06D5\u06B5\u0642\u06D5\u06CC \u0695\u06CE\u06A9\u062E\u0631\u0627\u0648 \u0644\u06D5\u0646\u0627\u0648 \u0642\u0627\u067E \u0648 \u0633\u0646\u062F\u0648\u0642\u06CC \u062A\u0627\u06CC\u0628\u06D5\u062A\u06CC \u062F\u06CC\u0627\u0631\u06CC \u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627\u06CC \u0634\u0648\u0627\u0646.",
    descriptionEn: "Elegant rose gold women watch and bracelet matching gift set adorned with crystal accents in a luxury presentation box.",
    inStock: true,
    stockCount: 15,
    badgeKu: "\u0633\u06CE\u062A\u06CC \u062F\u06CC\u0627\u0631\u06CC \u{1F381}",
    badgeType: "exclusive",
    sku: "SHW-WST09",
    featuresKu: ["\u0645\u06D5\u06A9\u06CC\u0646\u06D5\u06CC \u06A9\u0648\u0627\u0631\u062A\u0632\u06CC \u06CC\u0627\u0628\u0627\u0646\u06CC", "\u0695\u06D5\u0646\u06AF\u06CC \u0695\u06C6\u0632 \u06AF\u06C6\u06B5\u062F\u06CC \u0646\u06D5\u06AF\u06C6\u0695", "\u0633\u0646\u062F\u0648\u0642\u06CC \u0695\u0627\u0632\u0627\u0648\u06D5\u06CC \u062F\u06CC\u0627\u0631\u06CC", "\u062F\u0698\u06D5 \u067E\u0631\u0698\u06D5\u06CC \u0626\u0627\u0648"],
    rating: 4.9,
    reviewsCount: 34,
    isFeatured: false
  }
];

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var STORE_FILE = import_path.default.join(DATA_DIR, "store.json");
var PERMANENT_MASTER_KEY = "SHWAN-9988";
var storeVersion = Date.now();
var sseClients = /* @__PURE__ */ new Set();
function broadcastStoreUpdate(data) {
  storeVersion = Date.now();
  const payload = JSON.stringify({ version: storeVersion, store: data });
  for (const client of sseClients) {
    try {
      client.write(`event: update
data: ${payload}

`);
    } catch {
      sseClients.delete(client);
    }
  }
}
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
function getInitialStore() {
  return {
    products: initialProducts,
    categories: initialCategories,
    cities: kurdistanCities,
    settings: {
      ...initialShopSettings,
      adminPin: "1254",
      // Default updated to user's desired 1254
      masterRecoveryKey: PERMANENT_MASTER_KEY
    },
    orders: []
  };
}
function readStore() {
  try {
    if (import_fs.default.existsSync(STORE_FILE)) {
      const raw = import_fs.default.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (!parsed.settings.masterRecoveryKey) {
        parsed.settings.masterRecoveryKey = PERMANENT_MASTER_KEY;
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading store.json, falling back to initial data", err);
  }
  const initial = getInitialStore();
  writeStore(initial, false);
  return initial;
}
function writeStore(data, broadcast = true) {
  try {
    import_fs.default.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    if (broadcast) {
      broadcastStoreUpdate(data);
    }
  } catch (err) {
    console.error("Error writing store.json", err);
  }
}
app.use(import_express.default.json({ limit: "20mb" }));
app.get("/api/store/live", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  const store = readStore();
  res.write(`event: init
data: ${JSON.stringify({ version: storeVersion, store })}

`);
  sseClients.add(res);
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15e3);
  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});
app.get("/api/store/version", (req, res) => {
  res.json({ version: storeVersion });
});
app.get("/api/store", (req, res) => {
  const store = readStore();
  res.json({ ...store, version: storeVersion });
});
app.post("/api/store", (req, res) => {
  const current = readStore();
  const { products, categories, cities, settings, orders } = req.body;
  if (products) current.products = products;
  if (categories) current.categories = categories;
  if (cities) current.cities = cities;
  if (settings) {
    current.settings = {
      ...current.settings,
      ...settings,
      // Ensure master recovery key cannot be accidentally deleted
      masterRecoveryKey: settings.masterRecoveryKey || current.settings.masterRecoveryKey || PERMANENT_MASTER_KEY
    };
  }
  if (orders) current.orders = orders;
  writeStore(current, true);
  res.json({ success: true, version: storeVersion, store: current });
});
app.post("/api/admin/verify", (req, res) => {
  const { pin } = req.body;
  const store = readStore();
  const cleanPin = String(pin || "").trim();
  const currentAdminPin = String(store.settings.adminPin || "").trim();
  const masterKey = String(store.settings.masterRecoveryKey || PERMANENT_MASTER_KEY).trim();
  if (cleanPin && (cleanPin === currentAdminPin || cleanPin === masterKey || cleanPin === PERMANENT_MASTER_KEY)) {
    const isMaster = cleanPin === masterKey || cleanPin === PERMANENT_MASTER_KEY;
    res.json({ success: true, isMaster });
  } else {
    res.status(401).json({ success: false, message: "\u06A9\u06C6\u062F\u06CC \u062A\u06CE\u067E\u06D5\u0695\u06D5\u0648\u0634\u06D5 \u0647\u06D5\u06B5\u06D5\u06CC\u06D5" });
  }
});
app.post("/api/admin/master-reset", (req, res) => {
  const { masterKey, newPin } = req.body;
  const store = readStore();
  const cleanMasterKey = String(masterKey || "").trim();
  const configuredMasterKey = String(store.settings.masterRecoveryKey || PERMANENT_MASTER_KEY).trim();
  if (cleanMasterKey === configuredMasterKey || cleanMasterKey === PERMANENT_MASTER_KEY) {
    if (!newPin || String(newPin).trim().length < 3) {
      return res.status(400).json({ success: false, message: "\u062A\u06A9\u0627\u06CC\u06D5 \u062A\u06CE\u067E\u06D5\u0695\u06D5\u0648\u0634\u06D5\u06CC\u06D5\u06A9\u06CC \u062F\u0631\u0648\u0633\u062A \u0648 \u0628\u06D5\u0647\u06CE\u0632 \u062F\u0627\u0628\u0646\u06CE (\u06A9\u06D5\u0645\u062A\u0631 \u0644\u06D5 \u0663 \u067E\u06CC\u062A \u0646\u06D5\u0628\u06CE\u062A)" });
    }
    const updatedPin = String(newPin).trim();
    store.settings.adminPin = updatedPin;
    writeStore(store, true);
    console.log(`[SECURITY] Master Reset Executed! Admin PIN reset to: ${updatedPin}`);
    return res.json({
      success: true,
      message: "\u06A9\u06C6\u0646\u062A\u0631\u06C6\u06B5\u06CC \u067E\u06CE\u0634\u06D5\u0646\u06AF\u0627\u06A9\u06D5\u062A \u0628\u06D5 \u0633\u06D5\u0631\u06A9\u06D5\u0648\u062A\u0648\u0648\u06CC\u06CC \u06AF\u06D5\u0695\u06CE\u0646\u0631\u0627\u06CC\u06D5\u0648\u06D5 \u0648 \u062A\u06CE\u067E\u06D5\u0695\u06D5\u0648\u0634\u06D5\u06CC \u0646\u0648\u06CE \u062C\u06CE\u06AF\u06CC\u0631\u06A9\u0631\u0627!",
      newPin: updatedPin,
      store
    });
  }
  return res.status(403).json({ success: false, message: "\u06A9\u0644\u06CC\u0644\u06CC \u0645\u0627\u0633\u062A\u06D5\u0631 \u0647\u06D5\u06B5\u06D5\u06CC\u06D5! \u0646\u0627\u062A\u0648\u0627\u0646\u06CC\u062A \u06A9\u06C6\u0646\u062A\u0631\u06C6\u06B5 \u0628\u06AF\u06D5\u0695\u06CE\u0646\u06CC\u062A\u06D5\u0648\u06D5." });
});
app.post("/api/orders", (req, res) => {
  const { order } = req.body;
  if (!order) {
    return res.status(400).json({ success: false, message: "Order data missing" });
  }
  const store = readStore();
  store.orders = [order, ...store.orders];
  writeStore(store, true);
  res.json({ success: true, order, version: storeVersion });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString(), connectedAdmins: sseClients.size });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}
startServer();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PERMANENT_MASTER_KEY
});
//# sourceMappingURL=server.cjs.map
