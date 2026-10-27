// أدوات مشتركة لقراءة حقول المنتج وإظهارها في الواجهة
import { BRANDS } from "@/lib/brands";

export const GIFT_TAGS = ["جديد", "الأكثر مبيعاً"];

export const productPrice = (product) =>
  Number(product.base_price ?? product.price ?? 0);

export const productImages = (product) => {
  const images = (product.images || []).filter(Boolean);
  if (images.length) return images;
  return product.image_url ? [product.image_url] : [];
};

export const productImage = (product) => productImages(product)[0] || "";

export const productTags = (product) => (product.tags || []).filter(Boolean);

export const isCustomizable = (product) =>
  product.is_customizable === true ||
  (product.personalization_type && product.personalization_type !== "none");

export const brandForProduct = (product) =>
  BRANDS[product.store] ||
  (product.category === "هدايا" ? BRANDS.mersal : BRANDS.zarqa);

// قيم خيار الإكسسوار (مفصولة بفواصل)
export const accessoryOptionValues = (option) =>
  (option.option_values || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

// مجموع الأسعار الإضافية للخيارات المختارة (extra_price لكل خيار له قيمة)
export const accessoryTotal = (options, selections) =>
  options.reduce((sum, option) => {
    const raw = (selections[option.option_name] || "").trim();
    if (!raw) return sum;
    return sum + Number(option.extra_price || 0);
  }, 0);

// شكل المنتج كما تحتاجه السلة (الاسم، السعر، الصورة، العملة)
export const cartProduct = (product) => ({
  ...product,
  price: productPrice(product),
  image_url: productImage(product),
  currency: product.currency || "USD",
});