// حسابات سعر الهدية المخصصة وقواعد التوافق
export const price = (value) => Number(value || 0);

export const SMALL_SIZE = "صغير";

export const blockedSizeNames = (box) =>
  box?.is_sunflower_compatible ? [SMALL_SIZE] : [];

export const stemLimits = (size) => ({
  min: Math.max(1, Number(size?.min_flowers || 1)),
  max: Number(size?.max_flowers || 0),
});

export const defaultStems = (size) => {
  const { min, max } = stemLimits(size);
  const target = 10;
  return max ? Math.min(max, Math.max(min, target)) : min;
};

const addCurrency = (map, amount, currency) => {
  const key = currency || "USD";
  map[key] = (map[key] || 0) + amount;
};

export function computeGiftTotals({ box, size, flower, stems, wrapping, addons = [] }) {
  const boxPrice = price(box?.price);
  const sizePrice = price(size?.price);
  const flowerCount = Number(stems || 0);
  const flowersPrice = price(flower?.price_per_stem) * flowerCount;
  const wrappingPrice = price(wrapping?.price);
  const addonsPrice = addons.reduce((sum, addon) => sum + price(addon.price), 0);

  const total = boxPrice + sizePrice + flowersPrice + wrappingPrice + addonsPrice;

  const totalsByCurrency = {};
  const addonsByCurrency = {};
  addCurrency(totalsByCurrency, boxPrice, box?.currency);
  addCurrency(totalsByCurrency, sizePrice, size?.currency);
  addCurrency(totalsByCurrency, flowersPrice, flower?.currency);
  addCurrency(totalsByCurrency, wrappingPrice, wrapping?.currency);
  addons.forEach((addon) => {
    const addonPrice = price(addon.price);
    addCurrency(totalsByCurrency, addonPrice, addon?.currency);
    addCurrency(addonsByCurrency, addonPrice, addon?.currency);
  });

  return {
    boxPrice,
    sizePrice,
    flowerCount,
    flowersPrice,
    wrappingPrice,
    addonsPrice,
    total,
    totalsByCurrency,
    addonsByCurrency,
  };
}