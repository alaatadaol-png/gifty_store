// هوية المتجرين — أي تغيير هنا ينعكس على الموقع بأكمله
export const BRANDS = {
  zarqa: {
    key: "zarqa",
    name: "خرزة زرقة",
    tagline: "اكسسوارات يدوية",
    short: "خرزة زرقة",
    line: "كل خرزة تُحاك باليد، لتحمل معها حكاية",
    intro:
      "قلادات وأساور وخواتم ومسابح وحقائب وسلاسل مفاتيح وتعليقات، تُصنع قطعةً قطعة بحبّ في مشغلنا الصغير. أحجار طبيعية، خيوط حريرية، وتفاصيل لا تتكرّر.",
    cta: "استكشف الاكسسوارات",
    path: "/accessories",
    heroImage:
      "https://media.base44.com/images/public/6ade70594be1e5e281a39932/09259baa1_generated_67ec1470.png",
    accent: "royal",
    accentText: "text-royal",
    accentBg: "bg-royal",
    accentSoftBg: "bg-royal/5",
    accentBorder: "border-royal/15",
    dot: "bg-royal",
  },
  mersal: {
    key: "mersal",
    name: "MERSAL ALHOB",
    nameAr: "مرسال الحب",
    tagline: "هدايا وورود وتغليف فاخر",
    short: "مرسال الحب",
    line: "لأن الهدية رسالة، نُنسّقها بورود وتغليف يحمل شعورك",
    intro:
      "بوكيهات ورد طبيعي ومجفّف، صناديق هدايا مُنسّقة يدوياً، وتغليف فاخر يليق بالمناسبات الكبيرة والصغيرة. كل هدية تُجهّز في يومها.",
    cta: "استكشف الهدايا",
    path: "/gifts",
    heroImage:
      "https://media.base44.com/images/public/6ade70594be1e5e281a39932/bcae5c74f_generated_3628f153.png",
    accent: "rose",
    accentText: "text-[#9c5c5c]",
    accentBg: "bg-[#9c5c5c]",
    accentSoftBg: "bg-rose/10",
    accentBorder: "border-rose/30",
    dot: "bg-rose",
  },
};

export const ACCESSORY_CATEGORIES = [
  "الكل",
  "قلادات",
  "أساور",
  "خواتم",
  "مسابح",
  "حقائب",
  "سلاسل مفاتيح",
  "تعليقات سيارات",
  "تعليقات حقائب",
];

export const GIFT_CATEGORIES = [
  "الكل",
  "بوكيهات ورد",
  "صناديق هدايا",
  "تغليف فاخر",
  "هدايا صغيرة",
];

export const CURRENCIES = [
  { value: "USD", label: "دولار أمريكي", symbol: "$" },
  { value: "SYP", label: "ليرة سورية", symbol: "ل.س" },
];

export const currencySymbol = (currency) =>
  (CURRENCIES.find((option) => option.value === currency) || CURRENCIES[0]).symbol;

export const SITE = {
  name: "خرزة زرقة · MERSAL ALHOB",
  phoneLabel: "الدعم عبر الواتساب",
  whatsapp: "9647700000000",
  instagram: "https://www.instagram.com/mersalalhob",
  facebook: "https://www.facebook.com/mersalalhob",
  email: "hello@mersalalhob.com",
  craftImage:
    "https://media.base44.com/images/public/6ade70594be1e5e281a39932/1efbc01cd_generated_332f6a96.png",
};

export const NAV_ITEMS = [
  { label: "الرئيسية", path: "/" },
  { label: "الهدايا والورود", path: "/gifts" },
  { label: "الاكسسوارات", path: "/accessories" },
  { label: "من نحن", path: "/about" },
  { label: "الأسئلة الشائعة", path: "/faq" },
  { label: "تواصل معنا", path: "/contact" },
];

export const formatPrice = (value, currency = "USD") =>
  `${Number(value || 0).toLocaleString("en-US")} ${currencySymbol(currency)}`;

// عرض إجمالي عملات متعددة (مثلاً: "1,200 $ · 50,000 ل.س")
export const formatMultiCurrency = (totalsByCurrency) => {
  const entries = Object.entries(totalsByCurrency || {}).filter(
    ([, amount]) => Number(amount) > 0
  );
  if (entries.length <= 1) {
    const [currency, amount] = entries[0] || ["USD", 0];
    return formatPrice(amount, currency);
  }
  return entries.map(([currency, amount]) => formatPrice(amount, currency)).join(" · ");
};