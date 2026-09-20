// i18n.js — English / Hindi translator for the public UI
const I18N = {
  en: {
    brand: "AntiVenom Finder",
    navAbout: "About",
    navPrecautions: "Precautions",
    navContacts: "Contacts",
    navHelp: "Help",
    navHospital: "Hospital Portal",
    heroTitle: "You're in the right place",
    heroSub: "This takes under a minute: identify the snake, then find nearby hospitals with reported antivenom stock.",
    statBanner: "An estimated 58,000+ people die from snakebite in India every year — one of the highest tolls in the world — and most deaths are preventable with timely antivenom.",
    statSource: "Source: Suraweera et al., eLife 2020, nationally representative mortality study",
    trust1: "✔ Hospitals reviewed by site operator",
    trust2: "🔒 Passwords encrypted",
    trust3: "📍 Real-time distance",
    notice: "While you use this app: keep the person calm and still, keep the bitten limb below heart level, and call a hospital or ambulance right away. This app supports that call — it doesn't replace it.",
    step1: "Identify",
    step2: "Location",
    step3: "Hospitals",
    whichSnake: "Which snake was it?",
    whichSnakeHelp: "Tap the snake that matches what you saw. Real reference photos help confirmation. Not sure? Ask the chat assistant — or skip straight to finding a hospital.",
    skipHospital: "Skip — I just need a hospital",
    yourLocation: "Your location",
    useMyLocation: "📍 Use my location",
    addressHint: "Or type your address — suggestions appear as you type (OpenStreetMap):",
    addressLabel: "Address / place",
    addressPlaceholder: "e.g. Model Town, Ludhiana",
    advancedCoords: "Advanced: enter coordinates manually",
    findHospitals: "Find Hospitals",
    back: "← Back",
    nearbyHospitals: "Nearby hospitals",
    startOver: "Start Over",
    reportTitle: "Help improve this system (optional)",
    reportHelp: "Sharing a few details helps track regional snakebite patterns. No name required.",
    reportPhone: "Contact phone (optional)",
    reportNotes: "Notes (optional)",
    submit: "Submit",
    preventionTitle: "Prevention matters as much as treatment",
    preventionSub: "Most snakebites are preventable. Closed shoes, a flashlight at night, and clearing brush around your home cut risk significantly.",
    preventionLink: "See full precautions guide →",
    chatTitle: "Snakebite Assistant",
    chatPlaceholder: "Ask a question…",
    chatSend: "Send",
    langBtn: "हिंदी",
  },
  hi: {
    brand: "एंटीवेनम फाइंडर",
    navAbout: "परिचय",
    navPrecautions: "सावधानियाँ",
    navContacts: "संपर्क",
    navHelp: "मदद",
    navHospital: "अस्पताल पोर्टल",
    heroTitle: "आप सही जगह पर हैं",
    heroSub: "एक मिनट से कम: साँप पहचानें, फिर पास के अस्पताल खोजें जहाँ एंटीवेनम उपलब्ध बताया गया है।",
    statBanner: "भारत में हर साल लगभग 58,000+ लोग साँप के काटने से मरते हैं — दुनिया में सबसे अधिक में से एक — और समय पर एंटीवेनम से अधिकांश मौतें रोकी जा सकती हैं।",
    statSource: "स्रोत: Suraweera et al., eLife 2020",
    trust1: "✔ अस्पताल सत्यापित",
    trust2: "🔒 पासवर्ड सुरक्षित",
    trust3: "📍 वास्तविक दूरी",
    notice: "ऐप इस्तेमाल करते समय: व्यक्ति को शांत और स्थिर रखें, काटे हुए अंग को हृदय से नीचे रखें, और तुरंत अस्पताल/एम्बुलेंस बुलाएँ। यह ऐप मदद करता है — इलाज की जगह नहीं लेता।",
    step1: "पहचान",
    step2: "स्थान",
    step3: "अस्पताल",
    whichSnake: "कौन सा साँप था?",
    whichSnakeHelp: "जो साँप देखा हो उस पर टैप करें। असली तस्वीरें पहचान में मदद करती हैं। सुनिश्चित नहीं? चैट असिस्टेंट से पूछें — या सीधे अस्पताल खोजें।",
    skipHospital: "छोड़ें — सिर्फ अस्पताल चाहिए",
    yourLocation: "आपका स्थान",
    useMyLocation: "📍 मेरा स्थान उपयोग करें",
    addressHint: "या पता लिखें — टाइप करते ही सुझाव दिखेंगे:",
    addressLabel: "पता / जगह",
    addressPlaceholder: "जैसे मॉडल टाउन, लुधियाना",
    advancedCoords: "उन्नत: निर्देशांक मैन्युअल दर्ज करें",
    findHospitals: "अस्पताल खोजें",
    back: "← वापस",
    nearbyHospitals: "नज़दीकी अस्पताल",
    startOver: "फिर से शुरू",
    reportTitle: "सिस्टम सुधार में मदद (वैकल्पिक)",
    reportHelp: "कुछ विवरण क्षेत्रीय साँप काटने के पैटर्न समझने में मदद करते हैं। नाम ज़रूरी नहीं।",
    reportPhone: "संपर्क फ़ोन (वैकल्पिक)",
    reportNotes: "नोट्स (वैकल्पिक)",
    submit: "जमा करें",
    preventionTitle: "रोकथाम भी इलाज जितनी ज़रूरी है",
    preventionSub: "अधिकांश साँप काटना रोका जा सकता है। बंद जूते, रात में टॉर्च, घर के आसपास झाड़ियाँ साफ़ रखना जोखिम घटाता है।",
    preventionLink: "पूरी सावधानियाँ देखें →",
    chatTitle: "साँप काटने सहायक",
    chatPlaceholder: "प्रश्न पूछें…",
    chatSend: "भेजें",
    langBtn: "English",
  },
};

let currentLang = localStorage.getItem("avf_lang") || "en";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  const btn = document.getElementById("langToggle");
  if (btn) btn.textContent = t("langBtn");
  document.documentElement.lang = currentLang === "hi" ? "hi" : "en";
}

function toggleLang() {
  currentLang = currentLang === "en" ? "hi" : "en";
  localStorage.setItem("avf_lang", currentLang);
  applyTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  const btn = document.getElementById("langToggle");
  if (btn) btn.addEventListener("click", toggleLang);
});
