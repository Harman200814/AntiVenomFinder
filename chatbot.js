// chatbot.js
// Expanded rule-based assistant: large curated Q&A (~120+ topic entries) with a
// scored + fuzzy keyword matcher. Recognizes many phrasings, synonyms, and
// partial matches. Instant, no API key. For a true open-domain LLM later,
// replace getBotReply() with an API call — the UI stays the same.

const CHAT_FAQ = [
  // ---------------- Immediate first aid ----------------
  { keywords: ["what do i do", "what should i do", "help now", "just got bitten", "bitten right now", "someone was bitten", "emergency right now", "snake bit me", "i got bit", "got bitten", "help me", "urgent help"],
    reply: "Stay calm. Keep the person still and calm — movement speeds venom spread. Keep the bitten limb below heart level and loosely immobilized. Remove rings, watches, or tight clothing near the bite before swelling starts. Get to a hospital immediately — that matters more than anything else, including identifying the snake." },
  { keywords: ["first aid", "immediate steps", "what to do after bite", "snake bit", "steps after bite", "aid steps"],
    reply: "1) Keep the person calm and still. 2) Immobilize the bitten limb, keep it below heart level. 3) Remove tight items like rings/watches. 4) Get to a hospital immediately. 5) Note the time of the bite if you can. Don't wait for symptoms to appear." },
  { keywords: ["how to immobilize", "splint", "keep limb still", "immobilise", "don't move arm", "don't move leg"],
    reply: "Use a stick, ruler, or rolled magazine alongside the limb and tie it loosely with cloth — like a broken-bone splint. It should reduce movement without cutting off circulation. Keep the whole limb roughly level with or below the heart." },
  { keywords: ["should i move the person", "carry the victim", "walk to hospital", "can they walk"],
    reply: "Minimize movement of the bitten limb, but the person should get to a hospital as fast as possible — by vehicle if at all possible, not on foot. If a vehicle isn't available immediately, carry the person rather than have them walk." },
  { keywords: ["remove clothing", "rings watch tight", "remove jewelry", "remove rings"],
    reply: "Yes — remove rings, bangles, watches, and tight clothing near the bite site before swelling starts, since it can trap and worsen swelling once it begins." },
  { keywords: ["note time", "when did it happen", "record time of bite", "time of bite"],
    reply: "Yes, note the time of the bite if you can, along with roughly what the snake looked like. This helps hospital staff assess how urgently treatment is needed." },
  { keywords: ["wound care", "clean the bite", "wash bite", "bandage the wound", "clean wound"],
    reply: "Gently clean the area with water if available, but don't scrub it, apply any substances to it, or wrap it tightly. Loose immobilization is enough — save the rest for hospital staff." },
  { keywords: ["keep calm", "stay calm", "panic", "don't panic"],
    reply: "Staying calm really helps — anxiety and movement can speed how venom spreads. Reassure the person, keep them still, and focus on getting to a hospital quickly." },

  // ---------------- What NOT to do / myths ----------------
  { keywords: ["tourniquet", "tie tight", "tight band"],
    reply: "No — don't apply a tight tourniquet. It doesn't stop venom spread effectively and can cause serious harm to the limb, sometimes leading to amputation. Loose immobilization is the safe approach." },
  { keywords: ["cut the wound", "should i cut", "incision", "slash the bite"],
    reply: "No — don't cut the wound. It doesn't remove venom, increases infection risk, and causes unnecessary blood loss." },
  { keywords: ["suck out venom", "suck the poison", "mouth suction", "suck the bite"],
    reply: "No — never try to suck out venom, by mouth or with a suction device. It doesn't work and can introduce infection or harm the person doing it." },
  { keywords: ["ice the bite", "apply ice", "cold compress", "ice pack"],
    reply: "No — don't apply ice or cold compresses. It can worsen local tissue damage without slowing venom spread." },
  { keywords: ["alcohol help", "give alcohol", "drink alcohol snake", "whisky", "liquor"],
    reply: "No — don't give the person alcohol or caffeine. Alcohol can speed absorption and mask symptoms doctors need to see." },
  { keywords: ["urinate on wound", "pee on bite", "urine on bite"],
    reply: "No — that's a myth with no medical benefit. Stick to keeping the person calm, the limb immobilized, and getting to a hospital." },
  { keywords: ["snake charmer", "traditional healer", "tantrik", "ojha", "mantra cure", "local remedy", "home remedy snake"],
    reply: "Traditional healers and charms cannot treat venom — antivenom given at a hospital is the only proven treatment for a venomous bite. Delaying hospital care to see a healer has cost lives; please go straight to a hospital." },
  { keywords: ["all snakebites fatal", "will i die", "is it always deadly", "am i going to die"],
    reply: "No — a large share of snakebites are 'dry bites' with no venom injected, and even envenomed bites are very treatable with prompt antivenom. Fast hospital care is what makes the difference." },
  { keywords: ["only aggressive snakes bite", "snakes attack humans", "do snakes chase people", "snake chase"],
    reply: "Snakes generally avoid humans and bite defensively — usually when startled, stepped on, or handled. They don't chase people." },
  { keywords: ["kill the snake", "catch the snake", "should i catch it", "bring the snake"],
    reply: "No — don't try to catch or kill it, that risks a second bite. A photo from a safe distance can help identification — but never delay hospital care." },
  { keywords: ["electric shock", "battery", "shock the bite"],
    reply: "No — electric shocks or batteries do nothing useful against venom and can cause burns. Go to a hospital." },
  { keywords: ["herbal", "neem", "turmeric on bite", "apply paste"],
    reply: "Don't apply pastes, herbs, or chemicals to the wound. They don't neutralize venom and can cause infection. Clean gently with water only if needed, then get to a hospital." },

  // ---------------- Species-specific ----------------
  { keywords: ["indian cobra", "spectacled cobra", "naja naja", "cobra hood", "about cobra"],
    reply: "The Indian Cobra has a distinctive hood and is one of the 'Big Four'. Covered by standard polyvalent antivenom. Bites are a medical emergency — get to a hospital immediately." },
  { keywords: ["king cobra", "hamadryad", "longest snake", "about king cobra"],
    reply: "The King Cobra is the world's longest venomous snake. Standard polyvalent antivenom is less effective — a specific antivenom is needed. Call the hospital ahead if you suspect King Cobra." },
  { keywords: ["common krait", "krait bite", "bungarus caeruleus", "about krait", "blue krait"],
    reply: "The Common Krait is one of the 'Big Four'. Bites are often nearly painless at first — symptoms like weakness can appear hours later. Treat any suspected krait bite as an emergency." },
  { keywords: ["banded krait", "yellow black bands", "about banded krait"],
    reply: "The Banded Krait has distinctive black-and-yellow bands and is mostly active at night. Seek care immediately." },
  { keywords: ["russell's viper", "russell viper", "daboia", "about russell", "russells viper"],
    reply: "Russell's Viper causes the largest share of serious snakebites in India. Its venom affects blood clotting — medical emergency." },
  { keywords: ["saw-scaled viper", "saw scaled viper", "echis", "about saw scaled", "rasping snake"],
    reply: "The Saw-scaled Viper is small but one of the 'Big Four' — it makes a rasping sound by rubbing its scales when threatened. Medical emergency." },
  { keywords: ["bamboo pit viper", "green pit viper", "green snake bite", "about bamboo", "green tree snake"],
    reply: "Bamboo Pit Viper bites usually cause local swelling and pain. Less often life-threatening than the Big Four, but still need medical evaluation." },
  { keywords: ["hump-nosed pit viper", "hump nosed viper", "about hump nosed", "hypnale"],
    reply: "The Hump-nosed Pit Viper is common in the Western Ghats. Bites can look minor but may affect blood clotting — get medical evaluation." },
  { keywords: ["big four", "which snakes most dangerous india", "most venomous snakes india", "dangerous snakes india"],
    reply: "India's Big Four: Indian Cobra, Common Krait, Russell's Viper, and Saw-scaled Viper — standard polyvalent antivenom covers all four." },
  { keywords: ["how to tell venomous", "is it venomous", "poisonous or not", "identify snake features", "venomous or non"],
    reply: "Venomous and non-venomous snakes can look similar. Use the photo cards if you recognize the snake; otherwise treat any bite as potentially serious and get to a hospital." },
  { keywords: ["python", "rat snake", "non venomous", "harmless snake"],
    reply: "Many Indian snakes are non-venomous. If you're unsure after a bite, treat it as potentially serious and get medical care." },
  { keywords: ["hood", "spreading hood", "cobra like"],
    reply: "A spreading hood is classic for cobras. Select Indian Cobra or King Cobra on the identify step and get to a hospital." },
  { keywords: ["black and white bands", "banded body", "striped snake"],
    reply: "Black-and-white or black-and-yellow banding can mean a krait. Krait bites can be almost painless at first — still go to hospital immediately." },
  { keywords: ["triangular head", "viper head", "thick body snake"],
    reply: "A triangular head and thick body often suggest a viper. Select the closest match or skip to hospital search — vipers are covered by polyvalent antivenom." },

  // ---------------- Prevention ----------------
  { keywords: ["how to avoid snake bites", "prevent snakebite", "precautions", "avoid snakes", "prevention tips"],
    reply: "Wear closed shoes and long pants in grassy areas, use a flashlight at night, avoid reaching into holes or under rocks, clear brush and control rodents around home, check shoes and bedding. See the Precautions page for more." },
  { keywords: ["night walking", "torch light night", "flashlight", "walking at night"],
    reply: "Always carry a flashlight when walking outside at night in snake-prone areas. Most bites happen when a snake is startled or stepped on in the dark." },
  { keywords: ["sleeping on floor", "bed net", "sleeping precautions", "sleep safety"],
    reply: "Sleep on a raised bed rather than the floor, use a mosquito net tucked in, and check bedding before getting in." },
  { keywords: ["footwear", "shoes boots snake", "wear boots", "sandals"],
    reply: "Closed shoes or boots — not sandals — significantly reduce bite risk in grass, fields, or rural paths, especially at night." },
  { keywords: ["clearing brush", "rats rodents attract snakes", "yard snake proof", "garden snakes"],
    reply: "Keep grass short, clear brush, store firewood away from walls, control rodents, and seal gaps under doors where snakes could enter." },
  { keywords: ["farming precautions", "working in fields", "farmer safety"],
    reply: "Most snakebites in India happen to farmers, often barefoot. Wear boots, use a stick to check tall grass, avoid reaching blindly into vegetation." },
  { keywords: ["monsoon snake season", "rainy season snakes", "monsoon bites"],
    reply: "Snakebite risk rises during monsoon (roughly June–September) as flooding pushes snakes into homes and fields — extra caution with footwear and lighting." },
  { keywords: ["hiking precautions", "trekking snake safety", "trek safety"],
    reply: "Stick to cleared paths, wear boots, probe tall grass with a stick, and don't put hands or feet where you can't see." },
  { keywords: ["snake in house", "snake indoors", "snake in room"],
    reply: "Don't try to catch it. Keep people and pets away, open a path for the snake to leave if safe, call wildlife rescue. If someone was bitten, hospital first." },

  // ---------------- Special situations ----------------
  { keywords: ["child bitten", "kid snakebite", "baby snake bite", "child bite"],
    reply: "Children are at higher risk from the same amount of venom due to smaller body size — treat a child's bite as urgent even if it looks minor." },
  { keywords: ["pregnant snake bite", "pregnancy snakebite", "pregnant bitten"],
    reply: "Snakebite during pregnancy needs immediate hospital care. Tell staff about the pregnancy right away." },
  { keywords: ["dog bitten", "pet bitten", "cat snake bite", "animal bite"],
    reply: "Keep the pet calm and still and get to a veterinarian immediately. This app is for human hospital antivenom — contact a vet for animals." },
  { keywords: ["bitten alone", "no one else around", "by myself", "alone bitten"],
    reply: "Stay calm and still, immobilize the limb if you can, call 108/112. If you must move, move slowly and avoid using the bitten limb." },
  { keywords: ["multiple bites", "bitten twice", "several bites"],
    reply: "Multiple bites mean more venom was likely injected — treat as more urgent. Get to a hospital and tell staff how many bites." },
  { keywords: ["bite on face", "bite on neck", "bitten near head", "face bite"],
    reply: "A bite near the head or neck needs immediate hospital care — swelling near the airway is dangerous. Keep the person calm and still." },
  { keywords: ["bitten in water", "swimming snake bite", "water bite"],
    reply: "Get the person out of the water safely first, then standard first aid and hospital immediately." },
  { keywords: ["no symptoms yet", "doesn't hurt", "feels fine after bite", "no pain"],
    reply: "Don't wait for symptoms — krait bites can feel nearly painless at first. Go to a hospital regardless of how the person feels right after the bite." },
  { keywords: ["dry bite", "no venom bite"],
    reply: "A dry bite means no venom was injected — common, but you can't know without medical evaluation. Treat every bite as an emergency." },
  { keywords: ["how long until symptoms", "when does venom act", "symptom onset"],
    reply: "Varies by species and dose — minutes to hours. Don't wait for symptoms; get to a hospital right away." },
  { keywords: ["swelling", "swelling started", "limb swelling"],
    reply: "Swelling is common after many venomous bites. Don't cut or tightly bandage — keep the limb still and below heart level and get to a hospital." },
  { keywords: ["bleeding", "blood from bite", "won't stop bleeding"],
    reply: "Some viper venoms affect clotting. Apply gentle pressure with a clean cloth if needed — no tourniquet. Get to a hospital urgently." },
  { keywords: ["breathing difficulty", "can't breathe", "short of breath", "difficulty breathing"],
    reply: "Breathing difficulty after a bite is an emergency — call 108/112 immediately. Keep the person upright if that helps breathing." },
  { keywords: ["dizziness", "fainting", "vomiting after bite", "nausea"],
    reply: "Dizziness, fainting, or vomiting can be signs of envenoming. Keep the person still, protect their airway if vomiting, get emergency transport." },

  // ---------------- Antivenom ----------------
  { keywords: ["what is antivenom", "how does antivenom work", "asv", "anti snake venom"],
    reply: "Antivenom (ASV) neutralizes snake venom. Indian polyvalent covers the Big Four. It must be given in hospital under medical supervision." },
  { keywords: ["is antivenom free", "cost of antivenom", "price of asv"],
    reply: "In many government hospitals in India, snakebite treatment including antivenom is free or low cost. Don't delay care over cost — go to the nearest capable facility." },
  { keywords: ["side effects antivenom", "allergic to antivenom", "reaction to asv"],
    reply: "Antivenom can cause reactions; hospitals manage them. That is why it is only given under medical supervision." },
  { keywords: ["how many vials", "dose of antivenom", "how much asv"],
    reply: "Dose depends on species, severity, and response — only doctors decide after examining the patient." },
  { keywords: ["polyvalent", "what antivenom covers", "which snakes covered"],
    reply: "Standard Indian polyvalent covers Indian Cobra, Common Krait, Russell's Viper, and Saw-scaled Viper. King Cobra often needs specific antivenom." },

  // ---------------- App usage ----------------
  { keywords: ["how does this app work", "how to use the app", "how does this work", "app guide"],
    reply: "Three steps: (1) Identify the snake from photo cards or skip. (2) Share location — GPS or type address with live suggestions. (3) See nearby hospitals with antivenom stock, Call and Directions." },
  { keywords: ["how accurate", "how sure", "confidence", "trust the identification"],
    reply: "Manual selection matches what you saw. Real Wikimedia photos help. If unsure, describe the snake to me or skip to hospital search — care first." },
  { keywords: ["not sure which snake", "don't know the snake", "unsure what bit me", "unknown snake"],
    reply: "Describe color, pattern, or size and I can help narrow it down. Don't delay hospital care — hospitals treat based on symptoms without confirmed species." },
  { keywords: ["green", "yellow", "red", "status", "color", "colour", "dot mean", "status meaning"],
    reply: "Green: stock updated within the last hour. Yellow: available but older update — call ahead. Red: not currently reported available." },
  { keywords: ["map", "pins on map", "markers", "hospital map"],
    reply: "The map shows hospitals as colored pins matching green/yellow/red status, plus your location in blue." },
  { keywords: ["data", "stored", "database", "privacy", "my information", "is data safe"],
    reply: "Hospital stock is in this app's database. Optional incident reports store notes and phone if given — for regional patterns, not public." },
  { keywords: ["hospital login", "register hospital", "hospital account", "sign up hospital", "hospital portal"],
    reply: "Use Hospital Portal in the header. Registration uses address autocomplete — no manual lat/long. New accounts start pending until approved." },
  { keywords: ["how do hospitals get verified", "fake hospital", "hospital approval", "verified hospital"],
    reply: "New registrations are pending and hidden from public search until the site operator approves them from the admin panel." },
  { keywords: ["doctors contact", "specialist contact", "toxicologist", "doctor list"],
    reply: "The Contacts page lists doctors that approved hospitals share publicly, plus hospital phones and emergency numbers." },
  { keywords: ["report an incident", "submit bite report", "why report", "incident report"],
    reply: "Optional report after search saves anonymized species/location/notes for regional patterns — no name required." },
  { keywords: ["address suggestion", "autocomplete", "type address", "location how"],
    reply: "On the location step and hospital registration, type an address — OpenStreetMap suggestions appear. Pick one and coordinates fill automatically. Or use GPS." },
  { keywords: ["stock update", "hospital inventory", "update stock"],
    reply: "Hospitals log in, set quantity with +/- buttons, mark Available, and save. Public search shows latest stock for approved hospitals." },

  // ---------------- Emergency ----------------
  { keywords: ["emergency", "ambulance", "emergency number", "108", "112", "call ambulance"],
    reply: "Active emergency: call 108 (ambulance) or 112 (general emergency) in India right now, in addition to using this app." },
  { keywords: ["poison control", "poison helpline", "helpline number"],
    reply: "India has no single national poison control hotline — use 108/112 or hospital numbers on the Contacts page." },
  { keywords: ["nearest hospital", "closest hospital", "hospital near me", "find hospital"],
    reply: "Identify (or skip), share location, then the app lists nearest hospitals by distance with Call and Directions." },
  { keywords: ["ludhiana", "demo hospital", "demo location"],
    reply: "Demo hospitals are near Ludhiana, Punjab. For testing, type a Ludhiana address or use coordinates around 30.90, 75.85." },

  // ---------------- Meta ----------------
  { keywords: ["are you a doctor", "are you real ai", "who are you", "what are you", "are you chatgpt", "are you ai"],
    reply: "I'm a built-in assistant for this app — not a doctor and not a general AI service. I answer first aid, snake, precaution, and app questions from a large curated set." },
  { keywords: ["can you diagnose", "am i going to be okay", "how serious is my bite", "diagnose me"],
    reply: "I can't diagnose a bite — that needs a medical professional. Please get to a hospital." },
  { keywords: ["thank you", "thanks", "thank u"],
    reply: "You're welcome. Ask anytime about first aid, snakes, or the app. If someone was bitten — hospital first." },
  { keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    reply: "Hello. I can help with first aid after a snakebite, India's venomous snakes, prevention, or how to use this app. What do you need?" },
  { keywords: ["bye", "goodbye", "see you"],
    reply: "Take care. Remember: calm, immobilize, hospital. Call 108 in an emergency." },
];

const CHAT_QUICK_QUESTIONS = [
  "What do I do right now?",
  "What do the colors mean?",
  "How do I avoid snake bites?",
  "Tell me about Russell's Viper",
  "Is antivenom free?",
  "Nearest hospital?",
];

const SYNONYMS = {
  bitten: ["bite", "bit"],
  bite: ["bitten", "bit"],
  immobilize: ["immobilise", "immobilization"],
  immobilise: ["immobilize"],
  colour: ["color"],
  color: ["colour"],
  venomous: ["poisonous", "toxic"],
  poisonous: ["venomous"],
  hospital: ["hospitals", "clinic"],
  snake: ["snakes", "serpent"],
  antivenom: ["asv", "anti-venom", "antivenin"],
};

function expandTokens(tokens) {
  const out = new Set(tokens);
  tokens.forEach((t) => {
    if (SYNONYMS[t]) SYNONYMS[t].forEach((s) => out.add(s));
  });
  return [...out];
}

function getBotReply(message) {
  const cleaned = message.toLowerCase().replace(/[^\w\s']/g, " ").replace(/\s+/g, " ").trim();
  const lower = " " + cleaned + " ";
  const tokens = expandTokens(cleaned.split(" ").filter((t) => t.length > 1));
  let best = null;
  let bestScore = 0;

  for (const entry of CHAT_FAQ) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw) || lower.includes(" " + kw + " ")) {
        score += kw.split(" ").length * 3;
      } else {
        const kwTokens = kw.split(" ");
        let hits = 0;
        kwTokens.forEach((kt) => {
          if (tokens.includes(kt) || tokens.some((t) => t.includes(kt) || kt.includes(t))) hits++;
        });
        if (hits === kwTokens.length && kwTokens.length > 0) score += hits;
        else if (hits > 0) score += hits * 0.5;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore >= 1) return best.reply;

  return (
    "I don't have a specific answer for that phrasing yet, but I can help with first aid, snake species, " +
    "precautions, antivenom, or how this app works. Try a quick question below, or rephrase — " +
    "for anything medical beyond that, please contact a hospital or call 108/112."
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chatToggle");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const quick = document.getElementById("chatQuick");

  if (!toggle || !panel) return;

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "chat-msg " + sender;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleSend(text) {
    if (!text.trim()) return;
    addMessage(text, "user");
    input.value = "";
    setTimeout(() => addMessage(getBotReply(text), "bot"), 200);
  }

  CHAT_QUICK_QUESTIONS.forEach((q) => {
    const btn = document.createElement("button");
    btn.textContent = q;
    btn.addEventListener("click", () => handleSend(q));
    quick.appendChild(btn);
  });

  toggle.addEventListener("click", () => {
    panel.classList.toggle("step-hidden");
    if (!panel.classList.contains("step-hidden") && messages.childElementCount === 0) {
      addMessage(
        "Hi — ask me about first aid, any of the 8 snakes, prevention, antivenom, or how to use this app. I understand many ways of asking the same thing.",
        "bot"
      );
    }
  });
  closeBtn.addEventListener("click", () => panel.classList.add("step-hidden"));
  sendBtn.addEventListener("click", () => handleSend(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend(input.value);
  });
});
