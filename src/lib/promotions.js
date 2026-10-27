import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";

let cache = null;
let promise = null;

export function useActivePromotions() {
  const [promotions, setPromotions] = useState(cache || []);

  useEffect(() => {
    if (cache) {
      setPromotions(cache);
      return;
    }
    if (!promise) {
      promise = supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false }) // تم التعديل هنا
        .limit(50)
        .then(({ data, error }) => {
          if (error || !data) {
            cache = [];
            return [];
          }
          cache = data;
          return data;
        });
    }
    promise.then(setPromotions);
  }, []);

  return promotions;
}

const today = () => new Date();

export const isPromotionRunning = (promo, now = today()) => {
  if (!promo?.is_active) return false;
  const start = promo.start_date ? new Date(promo.start_date) : null;
  const end = promo.end_date ? new Date(promo.end_date) : null;
  if (start && now < start) return false;
  if (end) {
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);
    if (now > endOfDay) return false;
  }
  return true;
};

export const promotionForProduct = (product, promotions) =>
  promotions.find((promo) => {
    if (!isPromotionRunning(promo)) return false;
    const products = promo.applicable_products || [];
    if (products.length === 0) return true;
    return products.includes(product.id);
  });

export const latestActivePromotion = (promotions) =>
  promotions.find((promo) => isPromotionRunning(promo));

export const discountPrice = (price, promo) =>
  Number(price || 0) * (1 - (promo?.discount_percentage || 0) / 100);