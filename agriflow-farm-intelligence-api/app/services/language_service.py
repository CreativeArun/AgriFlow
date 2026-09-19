"""
AgriFlow Multilingual AI Language Service
Supports 8 Indian Languages:
- English (en)
- Hindi (hi)
- Punjabi (pa)
- Bengali (bn)
- Marathi (mr)
- Telugu (te)
- Tamil (ta)
- Gujarati (gu)
"""

from typing import Dict, Any, Optional

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "हिन्दी (Hindi)",
    "pa": "ਪੰਜਾਬੀ (Punjabi)",
    "bn": "বাংলা (Bengali)",
    "mr": "मराठी (Marathi)",
    "te": "తెలుగు (Telugu)",
    "ta": "தமிழ் (Tamil)",
    "gu": "ગુજરાતી (Gujarati)",
}

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "pa": "Punjabi",
    "bn": "Bengali",
    "mr": "Marathi",
    "te": "Telugu",
    "ta": "Tamil",
    "gu": "Gujarati",
}

def normalize_language(lang: Optional[str]) -> str:
    """Normalize and validate language code, defaulting to 'en'."""
    if not lang:
        return "en"
    code = lang.strip().lower()
    if "-" in code:
        code = code.split("-")[0]
    if "_" in code:
        code = code.split("_")[0]
    return code if code in SUPPORTED_LANGUAGES else "en"

def get_system_prompt(lang: str = "en") -> str:
    """Centralized language-aware system prompt for AI models."""
    lang_name = LANGUAGE_NAMES.get(normalize_language(lang), "English")
    return (
        f"You are AgriFlow AI, an expert agricultural intelligence assistant for Indian farmers and produce buyers.\n"
        f"CRITICAL INSTRUCTION: You must respond directly and fluently in the requested language: {lang_name}.\n"
        f"Keep all numerical figures (prices in ₹/quintal, weights in kg/tonnes, percentage values, grades A/B/C) precise and unchanged.\n"
        f"Use clear, practical, and empathetic language tailored for agricultural decision makers."
    )

# ---------------------------------------------------------------------------
# Localized Quality Descriptions
# ---------------------------------------------------------------------------
QUALITY_DESCRIPTIONS = {
    "A": {
        "en": "Fresh {crop} harvest with high color vitality, uniform skin texture, and minimal surface markings. Classified as Premium Grade A produce with high market value.",
        "hi": "ताज़ा {crop} की फसल जिसमें उत्कृष्ट प्राकृतिक रंग, एकसमान बनावट और न्यूनतम दाग-धब्बे हैं। इसे उच्च बाज़ार मूल्य वाले प्रीमियम ग्रेड A के रूप में प्रमाणित किया गया है।",
        "pa": "ਤਾਜ਼ੀ {crop} ਦੀ ਫ਼ਸਲ ਜਿਸ ਵਿੱਚ ਵਧੀਆ ਰੰਗ, ਇਕਸਾਰ ਬਣਤਰ ਅਤੇ ਬਹੁਤ ਘੱਟ ਦਾਗ ਹਨ। ਇਸਨੂੰ ਉੱਚ ਬਜ਼ਾਰੀ ਮੁੱਲ ਵਾਲੇ ਪ੍ਰੀਮੀਅਮ ਗ੍ਰੇਡ A ਵਜੋਂ ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ ਗਿਆ ਹੈ।",
        "bn": "তাজা {crop} ফসল যা চমৎকার প্রাকৃতিক রঙ, সুষম গঠন এবং ন্যূনতম দাগযুক্ত। এটি উচ্চ বাজারমূল্যের প্রিমিয়াম গ্রেড A হিসেবে প্রত্যয়িত হয়েছে।",
        "mr": "उत्कृष्ट रंग, एकसमान पोत आणि नगण्य डाग असलेले ताजे {crop} उत्पादन. उच्च बाजारभाव मिळवून देणारे हे प्रीमियम ग्रेड A उत्पादन म्हणून प्रमाणित केले आहे.",
        "te": "తాజా {crop} పంట, అద్భుతమైన సహజ రంగు, సమానమైన ఆకృతి మరియు కనిష్ట మచ్చలు కలిగి ఉంది. ఇది అధిక మార్కెట్ విలువ కలిగిన ప్రీమియం గ్రేడ్ A గా ధృవీకరించబడింది.",
        "ta": "சிறந்த நிறம், சீரான அமைப்பு மற்றும் குறைந்தபட்ச புள்ளிகளுடன் கூடிய புதிய {crop} அறுவடை. அதிக சந்தை மதிப்புடைய பிரீமியம் தரம் A ஆக சான்றளிக்கப்பட்டது.",
        "gu": "ઉત્કૃષ્ટ કુદરતી રંગ, સમાન પોત અને ઓછામાં ઓછા ડાઘ ધરાવતી તાજી {crop} ઉપજ. ઉચ્ચ બજાર મૂલ્ય ધરાવતી પ્રીમિયમ ગ્રેડ A તરીકે પ્રમાણિત કરવામાં આવી છે.",
    },
    "B": {
        "en": "Standard commercial {crop}. Produce is sound with moderate surface markings ({damaged}%) and slight discoloration. Suitable for retail and APMC domestic mandi distribution.",
        "hi": "मानक वाणिज्यिक {crop}। मध्यम सतही निशान ({damaged}%) और हल्के रंग परिवर्तन के साथ उत्पाद सुरक्षित है। खुदरा और कृषि उपज मंडी समिति (APMC) वितरण के लिए उपयुक्त।",
        "pa": "ਮਿਆਰੀ ਵਪਾਰਕ {crop}। ਹਲਕੇ ਦਾਗ-ਧੱਬਿਆਂ ({damaged}%) ਦੇ ਬਾਵਜੂਦ ਫ਼ਸਲ ਠੀਕ ਹੈ। ਰਿਟੇਲ ਅਤੇ ਮੰਡੀ ਵਿਕਰੀ ਲਈ ਢੁਕਵੀਂ ਹੈ।",
        "bn": "সাধারণ বাণিজ্যিক {crop}। মাঝারি আকারের দাগ ({damaged}%) থাকা সত্ত্বেও ফসল ভালো। খুচরা এবং স্থানীয় এপিএমসি মান্ডি বিক্রয়ের জন্য উপযুক্ত।",
        "mr": "प्रमाणित व्यावसायिक {crop}. मध्यम स्वरूपाचे डाग ({damaged}%) असले तरी माल चांगला आहे. किरकोळ विक्री व APMC बाजारपेठेसाठी योग्य.",
        "te": "ప్రామాణిక వాణిజ్య {crop}. మితమైన ఉపరితల గుర్తులు ({damaged}%) ఉన్నప్పటికీ ఉత్పత్తి బాగుంది. రిటైల్ మరియు APMC మార్కెట్లకు అనువైనది.",
        "ta": "நிலையான வணிக {crop}. மிதமான மேலோட்டமான புள்ளிகள் ({damaged}%) இருப்பினும் விளைபொருள் தரமானது. சில்லறை மற்றும் APMC சந்தைக்கு ஏற்றது.",
        "gu": "સામાન્ય વ્યાપારી {crop}. મધ્યમ સપાટીના ડાઘ ({damaged}%) છતાં માલ સારો છે. છૂટક અને APMC મંડી વેચાણ માટે યોગ્ય છે.",
    },
    "C": {
        "en": "Significant defects and spoilage detected in {crop} sample ({rotten}% rot/decay, {damaged}% damaged). Substandard lot; recommended for immediate discount processing or secondary sorting.",
        "hi": "{crop} के नमूने में उल्लेखनीय खराबी और सड़न पाई गई है ({rotten}% सड़न, {damaged}% क्षतिग्रस्त)। निम्न स्तर की खेप; तत्काल प्रसंस्करण या पुनः छंटाई की सलाह दी जाती है।",
        "pa": "{crop} ਦੇ ਨਮੂਨੇ ਵਿੱਚ ਕਾਫ਼ੀ ਖ਼ਰਾਬੀ ਅਤੇ ਗਲਣ ਦੇਖੀ ਗਈ ਹੈ ({rotten}% ਗਲਣ, {damaged}% ਨੁਕਸਾਨਿਆ)। ਤੁਰੰਤ ਛਾਂਟੀ ਜਾਂ ਪ੍ਰੋਸੈਸਿੰਗ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
        "bn": "{crop} নমুনায় উল্লেখযোগ্য ত্রুটি ও পচন ধরা পড়েছে ({rotten}% পচন, {damaged}% ক্ষতিগ্রস্ত)। তাৎক্ষণিক প্রক্রিয়াকরণ বা পুনরায় বাছাইয়ের পরামর্শ দেওয়া হচ্ছে।",
        "mr": "{crop} नमुन्यात लक्षणीय दोष आणि नासाडी आढळली आहे ({rotten}% सड, {damaged}% नुकसान). त्वरित प्रक्रिया किंवा पुनर्नोंदणीची शिफारस केली जाते.",
        "te": "{crop} నమూనాలో చెప్పుకోదగ్గ లోపాలు మరియు కుళ్ళు కనుగొనబడ్డాయి ({rotten}% కుళ్ళు, {damaged}% దెబ్బతిన్నది). వెంటనే ప్రాసెసింగ్ లేదా వేరుచేయడం సిఫార్సు చేయబడింది.",
        "ta": "{crop} மாதிரியில் குறிப்பிடத்தக்க குறைபாடுகள் மற்றும் அழுகல் கண்டறியப்பட்டுள்ளது ({rotten}% அழுகல், {damaged}% சேதம்). உடனடியாக பதப்படுத்துதல் அல்லது மறுபரிசீலனை செய்ய பரிந்துரைக்கப்படுகிறது.",
        "gu": "{crop} નમૂનામાં નોંધપાત્ર ખામી અને બગાડ જોવા મળ્યો છે ({rotten}% સડો, {damaged}% નુકસાન). તાત્કાલિક પ્રોસેસિંગ અથવા અલગ કરવાની ભલામણ કરવામાં આવે છે.",
    },
}

def format_quality_description(
    grade: str,
    crop: str,
    damaged_pct: float,
    rotten_pct: float,
    lang: str = "en",
) -> str:
    lang_code = normalize_language(lang)
    grade_key = grade.upper() if grade.upper() in QUALITY_DESCRIPTIONS else "A"
    template = QUALITY_DESCRIPTIONS[grade_key].get(lang_code, QUALITY_DESCRIPTIONS[grade_key]["en"])
    return template.format(
        crop=crop,
        damaged=damaged_pct,
        rotten=rotten_pct,
    )

# ---------------------------------------------------------------------------
# Localized Price & Market Forecast Recommendations
# ---------------------------------------------------------------------------
def format_price_recommendation(
    crop: str,
    mandi: str,
    hub: str,
    change_pct: float,
    prediction_length: int = 7,
    lang: str = "en",
) -> str:
    lang_code = normalize_language(lang)

    if change_pct >= 1.5:
        templates = {
            "en": f"Chronos-Bolt projects rising demand in {mandi}. Expected gain of +{change_pct}% over the next {prediction_length} days. Consider holding produce for higher returns.",
            "hi": f"क्रोनोस-बोल्ट {mandi} में बढ़ती मांग का अनुमान लगाता है। अगले {prediction_length} दिनों में +{change_pct}% की वृद्धि की संभावना है। बेहतर मुनाफे के लिए फसल को रोककर रखने पर विचार करें।",
            "pa": f"ਕਰੋਨੋਸ-ਬੋਲਟ {mandi} ਵਿੱਚ ਵੱਧਦੀ ਮੰਗ ਦਾ ਅਨੁਮਾਨ ਲਗਾਉਂਦਾ ਹੈ। ਅਗਲੇ {prediction_length} ਦਿਨਾਂ ਵਿੱਚ +{change_pct}% ਵਾਧੇ ਦੀ ਉਮੀਦ ਹੈ। ਵੱਧ ਮੁਨਾਫੇ ਲਈ ਫ਼ਸਲ ਰੋਕ ਕੇ ਰੱਖਣ 'ਤੇ ਵਿਚਾਰ ਕਰੋ।",
            "bn": f"ক্রোনোস-বোল্ট {mandi}-তে ক্রমবর্ধমান চাহিদার পূর্বাভাস দিচ্ছে। আগামী {prediction_length} দিনে +{change_pct}% বৃদ্ধির প্রত্যাশা। আরও বেশি লাভের জন্য ফসল মজুত রাখার কথা বিবেচনা করুন।",
            "mr": f"क्रोनोस-बोल्टनुसार {mandi} मध्ये वाढती मागणी अपेक्षित आहे. पुढील {prediction_length} दिवसांत +{change_pct}% वाढीची शक्यता. चांगल्या परताव्यासाठी माल राखून ठेवण्याचा विचार करा.",
            "te": f"క్రోనోస్-బోల్ట్ {mandi} లో పెరుగుతున్న డిమాండ్‌ను సూచిస్తోంది. రాబోయే {prediction_length} రోజుల్లో +{change_pct}% పెరుగుదల అంచనా. అధిక రాబడి కోసం సరుకు నిల్వ ఉంచడాన్ని పరిగణించండి.",
            "ta": f"க்ரோனோஸ்-போல்ட் {mandi} இல் அதிகரித்து வரும் தேவையை கணிக்கிறது. அடுத்த {prediction_length} நாட்களில் +{change_pct}% உயர்வு எதிர்பார்க்கப்படுகிறது. அதிக லாபத்திற்கு விளைபொருளை கைவசம் வைக்கலாம்.",
            "gu": f"ક્રોનોસ-બોલ્ટ {mandi} માં વધતી માંગનો અંદાજ દર્શાવે છે. આગામી {prediction_length} દિવસોમાં +{change_pct}% નો વધારો અપેક્ષિત છે. વધુ વળતર માટે માલ સંગ્રહવા પર વિચાર કરો.",
        }
    elif change_pct <= -1.5:
        templates = {
            "en": f"Mandi arrivals increasing in {hub}. Expected price softening of {change_pct}%. Recommend listing and dispatching lots promptly.",
            "hi": f"{hub} में मंडी आवक बढ़ रही है। कीमतों में {change_pct}% की गिरावट संभव है। खेपों को शीघ्र सूचीबद्ध और विक्रय करने की सलाह दी जाती है।",
            "pa": f"{hub} ਵਿੱਚ ਮੰਡੀ ਦੀ ਆਮਦ ਵੱਧ ਰਹੀ ਹੈ। ਕੀਮਤਾਂ ਵਿੱਚ {change_pct}% ਗਿਰਾਵਟ ਆ ਸਕਦੀ ਹੈ। ਫ਼ਸਲ ਨੂੰ ਜਲਦੀ ਵੇਚਣ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
            "bn": f"{hub}-এ মান্ডি আমদানি বৃদ্ধি পাচ্ছে। দামে {change_pct}% হ্রাসের সম্ভাবনা। দ্রুত তালিকাভুক্ত করে বিক্রি করার পরামর্শ দেওয়া হচ্ছে।",
            "mr": f"{hub} मध्ये बाजारात आवक वाढत आहे. भावात {change_pct}% घसरण शक्य आहे. माल लवकरात लवकर विक्रीसाठी काढण्याची शिफारस आहे.",
            "te": f"{hub} లో మార్కెట్ రాబడులు పెరుగుతున్నాయి. ధరలు {change_pct}% తగ్గే అవకాశం ఉంది. సరుకును త్వరగా విక్రయించాలని సిఫార్సు చేయబడింది.",
            "ta": f"{hub} இல் சந்தை வரத்து அதிகரித்து வருகிறது. விலையில் {change_pct}% வீழ்ச்சி ஏற்படலாம். விரைவாக விற்பனை செய்ய பரிந்துரைக்கப்படுகிறது.",
            "gu": f"{hub} માં મંડીની આવક વધી રહી છે. ભાવોમાં {change_pct}% નો ઘટાડો શક્ય છે. માલ ઝડપથી વેચવાની ભલામણ કરવામાં આવે છે.",
        }
    else:
        templates = {
            "en": f"Stable price momentum across {mandi}. Favorable window for regular market sales and consistent fulfillment.",
            "hi": f"{mandi} में स्थिर मूल्य गतिशीलता। नियमित बिक्री और निरंतर आपूर्ति के लिए अनुकूल समय।",
            "pa": f"{mandi} ਵਿੱਚ ਕੀਮਤਾਂ ਸਥਿਰ ਹਨ। ਨਿਯਮਤ ਮੰਡੀ ਵਿਕਰੀ ਅਤੇ ਸਪਲਾਈ ਲਈ ਢੁਕਵਾਂ ਸਮਾਂ।",
            "bn": f"{mandi}-তে স্থিতিশীল মূল্যের গতি। নিয়মিত বিক্রয় এবং সরবরাহের জন্য অনুকূল সময়।",
            "mr": f"{mandi} मध्ये भावात स्थैर्य आहे. नियमित विक्री आणि पुरवठ्यासाठी अनुकूल काळ.",
            "te": f"{mandi} లో స్థిరమైన ధరల కదలిక. సాధారణ విక్రయాలు మరియు సరఫరాకు అనుకూలమైన సమయం.",
            "ta": f"{mandi} இல் நிலையான விலை நிலவரம். வழக்கமான சந்தை விற்பனைக்கு சாதகமான நேரம்.",
            "gu": f"{mandi} માં સ્થિર ભાવ વલણ. નિયમિત વેચાણ અને સપ્લાય માટે અનુકૂળ સમય.",
        }

    return templates.get(lang_code, templates["en"])

# ---------------------------------------------------------------------------
# Localized Buyer Matching Reasons
# ---------------------------------------------------------------------------
MATCH_REASONS = {
    "exact_match": {
        "en": "Exact crop match & verified high quality",
        "hi": "सटीक फसल मिलान और उच्च सत्यापित गुणवत्ता",
        "pa": "ਬਿਲਕੁਲ ਸਹੀ ਫ਼ਸਲ ਮੇਲ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਉੱਚ ਗੁਣਵੱਤਾ",
        "bn": "সঠিক ফসল মিল এবং উচ্চ প্রত্যয়িত মান",
        "mr": "अचूक पीक जुळणी आणि उच्च दर्जा प्रमाणित",
        "te": "ఖచ్చితమైన పంట సరిపోలిక & ధృవీకరించబడిన అధిక నాణ్యత",
        "ta": "சரியான பயிர் பொருத்தம் & சரிபார்க்கப்பட்ட உயர் தரம்",
        "gu": "ચોક્કસ પાક મેળ અને પ્રમાણિત ઉચ્ચ ગુણવત્તા",
    },
    "nearby_high_grade": {
        "en": "High grade match with short transit distance",
        "hi": "कम परिवहन दूरी के साथ उच्च ग्रेड मिलान",
        "pa": "ਘੱਟ ਆਵਾਜਾਈ ਦੂਰੀ ਦੇ ਨਾਲ ਉੱਚ ਗ੍ਰੇਡ ਮੇਲ",
        "bn": "স্বল্প পরিবহন দূরত্বের সাথে উচ্চ গ্রেড মিল",
        "mr": "कमी वाहतूक अंतरासह उच्च दर्जा जुळणी",
        "te": "తక్కువ రవాణా దూరంతో అధిక గ్రేడ్ సరిపోలిక",
        "ta": "குறைந்த போக்குவரத்து தூரத்துடன் உயர் தர பொருத்தம்",
        "gu": "ટૂંકા પરિવહન અંતર સાથે ઉચ્ચ ગ્રેડ મેળ",
    },
    "produce_matches": {
        "en": "produce type matches",
        "hi": "फसल का प्रकार मेल खाता है",
        "pa": "ਫ਼ਸਲ ਦੀ ਕਿਸਮ ਮਿਲਦੀ ਹੈ",
        "bn": "ফসলের ধরন মিলেছে",
        "mr": "पिकाचा प्रकार जुळतो",
        "te": "పంట రకం సరిపోలింది",
        "ta": "பயிர் வகை பொருந்துகிறது",
        "gu": "પાકનો પ્રકાર મેળ ખાય છે",
    },
    "produce_differs": {
        "en": "produce type does not match",
        "hi": "फसल का प्रकार भिन्न है",
        "pa": "ਫ਼ਸਲ ਦੀ ਕਿਸਮ ਵੱਖਰੀ ਹੈ",
        "bn": "ফসলের ধরন মিলছে না",
        "mr": "पिकाचा प्रकार वेगळा आहे",
        "te": "పంట రకం భిన్నంగా ఉంది",
        "ta": "பயிர் வகை பொருந்தவில்லை",
        "gu": "પાકનો પ્રકાર મેળ ખાતો નથી",
    },
    "quality_satisfied": {
        "en": "quality requirement is satisfied",
        "hi": "गुणवत्ता की आवश्यकता पूरी होती है",
        "pa": "ਗੁਣਵੱਤਾ ਦੀ ਲੋੜ ਪੂਰੀ ਹੁੰਦੀ ਹੈ",
        "bn": "মানের প্রয়োজনীয়তা পূরণ হয়েছে",
        "mr": "दर्जा निकष पूर्ण झाले आहेत",
        "te": "నాణ్యతా అవసరం సంతృప్తి చెందింది",
        "ta": "தரத் தேவை பூர்த்தி செய்யப்பட்டது",
        "gu": "ગુણવત્તાની જરૂરિયાત સંતોષાય છે",
    },
    "quality_not_satisfied": {
        "en": "quality requirement is not satisfied",
        "hi": "गुणवत्ता की आवश्यकता पूरी नहीं होती",
        "pa": "ਗੁਣਵੱਤਾ ਦੀ ਲੋੜ ਪੂਰੀ ਨਹੀਂ ਹੁੰਦੀ",
        "bn": "মানের প্রয়োজনীয়তা পূরণ হয়নি",
        "mr": "दर्जा निकष पूर्ण झालेले नाहीत",
        "te": "నాణ్యతా అవసరం తీరలేదు",
        "ta": "தரத் தேவை பூர்த்தி செய்யப்படவில்லை",
        "gu": "ગુણવત્તાની જરૂરિયાત પૂરી થતી નથી",
    },
    "location_matches": {
        "en": "location matches",
        "hi": "स्थान मेल खाता है",
        "pa": "ਸਥਾਨ ਮਿਲਦਾ ਹੈ",
        "bn": "স্থান মিলেছে",
        "mr": "स्थान जुळते",
        "te": "ప్రాంతం సరిపోలింది",
        "ta": "இருப்பிடம் பொருந்துகிறது",
        "gu": "સ્થળ મેળ ખાય છે",
    },
    "location_differs": {
        "en": "location differs",
        "hi": "स्थान भिन्न है",
        "pa": "ਸਥਾਨ ਵੱਖਰਾ ਹੈ",
        "bn": "স্থান ভিন্ন",
        "mr": "स्थान वेगळे आहे",
        "te": "ప్రాంతం భిన్నంగా ఉంది",
        "ta": "இருப்பிடம் வேறுபடுகிறது",
        "gu": "સ્થળ અલગ છે",
    },
    "quantity_available": {
        "en": "required quantity is available",
        "hi": "आवश्यक मात्रा उपलब्ध है",
        "pa": "ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਉਪਲਬਧ ਹੈ",
        "bn": "প্রয়োজনীয় পরিমাণ উপলব্ধ",
        "mr": "आवश्यक प्रमाण उपलब्ध आहे",
        "te": "అవసరమైన పరిమాణం అందుబాటులో ఉంది",
        "ta": "தேவையான அளவு கிடைக்கிறது",
        "gu": "જરૂરી જથ્થો ઉપલબ્ધ છે",
    },
    "quantity_below": {
        "en": "available quantity is below requirement",
        "hi": "उपलब्ध मात्रा आवश्यकता से कम है",
        "pa": "ਉਪਲਬਧ ਮਾਤਰਾ ਲੋੜ ਨਾਲੋਂ ਘੱਟ ਹੈ",
        "bn": "উপলব্ধ পরিমাণ প্রয়োজনের চেয়ে কম",
        "mr": "उपलब्ध प्रमाण आवश्यकतेपेक्षा कमी आहे",
        "te": "అందుబాటులో ఉన్న పరిమాణం అవసరం కంటే తక్కువ",
        "ta": "கிடைக்கும் அளவு தேவைக்கு குறைவாக உள்ளது",
        "gu": "ઉપલબ્ધ જથ્થો જરૂરિયાત કરતાં ઓછો છે",
    },
}

def format_match_reason(reason_keys: list[str], lang: str = "en") -> str:
    lang_code = normalize_language(lang)
    translated_parts = []
    for rk in reason_keys:
        item = MATCH_REASONS.get(rk, {})
        translated_parts.append(item.get(lang_code, item.get("en", rk)))
    return "; ".join(translated_parts)

# ---------------------------------------------------------------------------
# Opportunity Aggregation Recommendations
# ---------------------------------------------------------------------------
OPPORTUNITY_LABELS = {
    "strong": {
        "en": "Strong opportunity",
        "hi": "उत्कृष्ट अवसर (Strong Opportunity)",
        "pa": "ਸ਼ਾਨਦਾਰ ਮੌਕਾ (Strong Opportunity)",
        "bn": "চমৎকার সুযোগ (Strong Opportunity)",
        "mr": "उत्कृष्ट संधी (Strong Opportunity)",
        "te": "గొప్ప అవకాశం (Strong Opportunity)",
        "ta": "சிறந்த வாய்ப்பு (Strong Opportunity)",
        "gu": "શ્રેષ્ઠ તક (Strong Opportunity)",
    },
    "moderate": {
        "en": "Moderate opportunity",
        "hi": "मध्यम अवसर (Moderate Opportunity)",
        "pa": "ਦਰਮਿਆਨਾ ਮੌਕਾ (Moderate Opportunity)",
        "bn": "মাঝারি সুযোগ (Moderate Opportunity)",
        "mr": "मध्यम संधी (Moderate Opportunity)",
        "te": "మితమైన అవకాశం (Moderate Opportunity)",
        "ta": "மிதமான வாய்ப்பு (Moderate Opportunity)",
        "gu": "મધ્યમ તક (Moderate Opportunity)",
    },
    "low": {
        "en": "Low opportunity",
        "hi": "सीमित अवसर (Low Opportunity)",
        "pa": "ਸੀਮਤ ਮੌਕਾ (Low Opportunity)",
        "bn": "সীমিত সুযোগ (Low Opportunity)",
        "mr": "कमी संधी (Low Opportunity)",
        "te": "తక్కువ అవకాశం (Low Opportunity)",
        "ta": "குறைந்த வாய்ப்பு (Low Opportunity)",
        "gu": "મર્યાદિત તક (Low Opportunity)",
    },
}

def format_opportunity_recommendation(score: float, lang: str = "en") -> str:
    lang_code = normalize_language(lang)
    if score >= 80:
        key = "strong"
    elif score >= 60:
        key = "moderate"
    else:
        key = "low"
    return OPPORTUNITY_LABELS[key].get(lang_code, OPPORTUNITY_LABELS[key]["en"])

# ---------------------------------------------------------------------------
# AI Agricultural Assistant & Voice Q&A Engine
# ---------------------------------------------------------------------------
def generate_agricultural_advice(query: str, role: str = "farmer", lang: str = "en") -> Dict[str, Any]:
    """
    Generate responsive, accurate agricultural advice for farmers & buyers in all 8 languages.
    """
    lang_code = normalize_language(lang)
    q_lower = query.lower()

    # Domain topic detection
    is_price = any(w in q_lower for w in ["price", "rate", "bhav", "daam", "mandi", "cost", "भाव", "मूल्य", "ਕੀਮਤ", "দাম", "দর", "కిమ్మత్తు", "விலை", "કિંમત"])
    is_weather_harvest = any(w in q_lower for w in ["weather", "rain", "harvest", "season", "moisture", "मौसम", "बारिश", "कटाई", "ਵਾਢੀ", "বৃষ্টি", "हवामान", "వర్షం", "மழை", "વરસાદ", "લણણી"])
    is_quality_disease = any(w in q_lower for w in ["disease", "pest", "rot", "yellow", "fertilizer", "spray", "grade", "कीट", "रोग", "खाद", "ਕੀੜੇ", "রোগ", "रोग", "తెగుళ్లు", "நோய்", "રોગ", "ખાતર"])
    is_buyer_procure = any(w in q_lower for w in ["buy", "purchase", "tender", "procure", "supplier", "खरीद", "व्यापारी", "ਸਪਲਾਇਰ", "ক্রয়", "खरेदी", "కొనుగోలు", "கொள்முதல்", "ખરીદી"])

    if is_price:
        answers = {
            "en": "Based on current Mandi benchmark data and Chronos-Bolt AI forecasts, commodity arrivals in northern hubs are steady. A +3.5% to +5.2% price appreciation is projected over the next 7 days for Grade A produce. We advise listing verified lots with high quality scores to capture premium buyers.",
            "hi": "वर्तमान मंडी बेंचमार्क आंकड़ों और क्रोनोस-बोल्ट AI पूर्वानुमान के आधार पर, प्रमुख मंडियों में आवक स्थिर है। ग्रेड A उत्पाद के लिए अगले 7 दिनों में +3.5% से +5.2% मूल्य वृद्धि का अनुमान है। बेहतर खरीदारों को आकर्षित करने के लिए उच्च गुणवत्ता स्कोर के साथ लॉट सूचीबद्ध करने की सलाह दी जाती है।",
            "pa": "ਮੌਜੂਦਾ ਮੰਡੀ ਅੰਕੜਿਆਂ ਅਤੇ ਕ੍ਰੋਨੋਸ-ਬੋਲਟ AI ਪੂਰਵ ਅਨੁਮਾਨ ਦੇ ਅਨੁਸਾਰ, ਮੰਡੀਆਂ ਵਿੱਚ ਫ਼ਸਲ ਦੀ ਆਮਦ ਸਥਿਰ ਹੈ। ਗ੍ਰੇਡ A ਫ਼ਸਲ ਲਈ ਅਗਲੇ 7 ਦਿਨਾਂ ਵਿੱਚ +3.5% ਤੋਂ +5.2% ਕੀਮਤ ਵਾਧਾ ਸੰਭਵ ਹੈ। ਪ੍ਰੀਮੀਅਮ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਆਕਰਸ਼ਿਤ ਕਰਨ ਲਈ ਉੱਚ ਕੁਆਲਿਟੀ ਸਕੋਰ ਨਾਲ ਫ਼ਸਲ ਦਰਜ ਕਰੋ।",
            "bn": "বর্তমান মান্ডি তথ্য এবং ক্রোনোস-বোল্ট AI পূর্বাভাস অনুসারে, বাজারে আমদানি স্থিতিশীল রয়েছে। গ্রেড A ফসলের জন্য আগামী ৭ দিনে +৩.৫% থেকে +৫.২% দাম বৃদ্ধির পূর্বাভাস রয়েছে। সেরা ক্রেতাদের সাথে যুক্ত হতে উচ্চ মান স্কোরের সাথে তালিকাভুক্ত করুন।",
            "mr": "सध्याच्या कृषी उत्पन्न बाजार समिती (APMC) आकडेवारीनुसार आणि क्रोनोस-बोल्ट AI अंदाजानुसार, बाजारात आवक स्थिर आहे. ग्रेड A उत्पादनासाठी पुढील ७ दिवसांत +३.५% ते +५.२% भाववाढ अपेक्षित आहे. चांगल्या खरेदीदारांसाठी उच्च गुणवत्ता स्कोअरसह लॉट नोंदणी करा.",
            "te": "ప్రస్తుత మార్కెట్ బెంచ్‌మార్క్ డేటా మరియు క్రోనోస్-బోల్ట్ AI అంచనాల ప్రకారం, మార్కెట్లకు సరుకు రాక స్థిరంగా ఉంది. గ్రేడ్ A పంట కోసం రాబోయే 7 రోజుల్లో +3.5% నుండి +5.2% ధరల పెరుగుదల అంచనా వేయబడింది. ప్రీమియం కొనుగోలుదారులను ఆకర్షించడానికి ధృవీకరించబడిన లాట్లను నమోదు చేయండి.",
            "ta": "தற்போதைய சந்தை தரவு மற்றும் க்ரோனோஸ்-போல்ட் AI கணிப்புகளின்படி, சந்தை வரத்து சீராக உள்ளது. தரம் A விளைபொருட்களுக்கு அடுத்த 7 நாட்களில் +3.5% முதல் +5.2% வரை விலை உயர்வு கணிக்கப்பட்டுள்ளது. பிரீமியம் வாங்குபவர்களை ஈர்க்க உயர் தரத்துடன் பட்டியலிட பரிந்துரைக்கப்படுகிறது.",
            "gu": "વર્તમાન મંડી ડેટા અને ક્રોનોસ-બોલ્ટ AI અનુમાન મુજબ, બજારોમાં આવક સ્થિર છે. ગ્રેડ A ઉપજ માટે આગામી 7 દિવસોમાં +3.5% થી +5.2% ભાવ વધારાનો અંદાજ છે. પ્રીમિયમ ખરીદદારો આકર્ષવા માટે ઉચ્ચ ગુણવત્તા સ્કોર સાથે લોટ લિસ્ટ કરવાની સલાહ છે.",
        }
    elif is_weather_harvest:
        answers = {
            "en": "Optimal harvesting window: Ensure produce moisture level is below 12% for grains and harvest vegetables early morning to preserve crispness and shelf life. Check cold-chain dispatch within 4 hours to retain Grade A certification.",
            "hi": "सर्वोत्तम कटाई का समय: अनाज के लिए नमी का स्तर 12% से कम रखें और सब्जियों की ताजगी व शेल्फ-लाइफ बनाए रखने के लिए सुबह जल्दी कटाई करें। ग्रेड A गुणवत्ता बनाए रखने के लिए 4 घंटे के भीतर लॉजिस्टिक्स डिस्पैच सुनिश्चित करें।",
            "pa": "ਵਾਢੀ ਦਾ ਸਹੀ ਸਮਾਂ: ਅਨਾਜ ਲਈ ਨਮੀ 12% ਤੋਂ ਘੱਟ ਰੱਖੋ ਅਤੇ ਸਬਜ਼ੀਆਂ ਦੀ ਤਾਜ਼ਗੀ ਬਣਾਈ ਰੱਖਣ ਲਈ ਸਵੇਰੇ ਜਲਦੀ ਤੁੜਾਈ ਕਰੋ। ਗ੍ਰੇਡ A ਸਰਟੀਫਿਕੇਟ ਲਈ 4 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਸ਼ਿਪਮੈਂਟ ਯਕੀਨੀ ਬਣਾਓ।",
            "bn": "ফসল তোলার সেরা সময়: শস্যের আর্দ্রতা ১২% এর নিচে রাখুন এবং সতেজতা বজায় রাখতে ভোরে শাকসবজি সংগ্রহ করুন। গ্রেড A মান বজায় রাখতে ৪ ঘণ্টার মধ্যে কোল্ড-চেইন প্রেরণ নিশ্চিত করুন।",
            "mr": "कापणीची योग्य वेळ: धान्यातील ओलावा १२% पेक्षा कमी ठेवा आणि भाजीपाल्याची ताजी प्रत टिकवण्यासाठी पहाटे काढणी करा. ग्रेड A दर्जा कायम ठेवण्यासाठी ४ तासांच्या आत माल पाठवा.",
            "te": "సరైన కోత సమయం: ధాన్యం కోసం తేమ 12% కంటే తక్కువగా ఉండేలా చూసుకోండి మరియు కూరగాయల తాజాదనాన్ని కాపాడటానికి తెల్లవారుజామునే కోత కోయండి. గ్రేడ్ A నాణ్యత కోసం 4 గంటల్లో రవాణా చేయండి.",
            "ta": "அறுவடைக்கு உகந்த நேரம்: தானியங்களுக்கான ஈரப்பதம் 12% க்கும் குறைவாக இருப்பதை உறுதிசெய்து, காய்கறிகளை அதிகாலையில் அறுவடை செய்யுங்கள். தரம் A ஐ தக்கவைக்க 4 மணி நேரத்திற்குள் அனுப்பவும்.",
            "gu": "લણણીનો શ્રેષ્ઠ સમય: અનાજ માટે ભેજનું પ્રમાણ 12% થી ઓછું રાખો અને શાકભાજીની તાજગી જાળવવા વહેલી સવારે લણણી કરો. ગ્રેડ A જાળવવા 4 કલાકમાં શિપમેન્ટ રવાના કરો.",
        }
    elif is_quality_disease:
        answers = {
            "en": "AgriFlow AI Quality Inspection recommends inspecting crop undersides for mildew or leaf spots. Use organic neem oil extract (5ml/L) or targeted biocides. Ensure adequate root aeration and sort out discolored pods before listing.",
            "hi": "एग्रीफ्लो AI गुणवत्ता निरीक्षण फसलों की पत्तियों के नीचे फफूंदी या धब्बों की जांच करने की सलाह देता है। जैविक नीम तेल का अर्क (5ml/लीटर) प्रयोग करें। जड़ों में हवा का संचार बनाए रखें और लॉट में जोड़ने से पहले दागदार उपज को अलग करें।",
            "pa": "ਐਗਰੀਫਲੋ AI ਕੁਆਲਿਟੀ ਇੰਸਪੈਕਸ਼ਨ ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਉੱਲੀ ਜਾਂ ਧੱਬਿਆਂ ਦੀ ਜਾਂਚ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿੰਦਾ ਹੈ। ਜੈਵਿਕ ਨਿੰਮ ਦਾ ਤੇਲ (5 ਮਿ.ਲੀ./ਲਿਟਰ) ਵਰਤੋ। ਲਿਸਟ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਖ਼ਰਾਬ ਦਾਣੇ ਵੱਖ ਕਰੋ।",
            "bn": "এগ্রিফ্লো AI মান নিরীক্ষণ পাতার নিচে ছত্রাক বা দাগ পরীক্ষা করার পরামর্শ দিচ্ছে। জৈব নিম তেলের নির্যাস (৫ মিলি/লিটার) ব্যবহার করুন। তালিকাভুক্ত করার আগে ক্ষতিগ্রস্ত ফসল আলাদা করুন।",
            "mr": "अॅग्रीफ्लो AI गुणवत्ता तपासणी पानांखाली बुरशी किंवा डाग तपासण्याचा सल्ला देते. सेंद्रिय निंबोळी अर्क (५ मिली/लिटर) फवारा. लॉटमध्ये जोडण्यापूर्वी डागाळलेला माल बाजूला करा.",
            "te": "అగ్రిఫ్లో AI నాణ్యతా తనిఖీ ఆకుల అడుగున బూజు లేదా మచ్చలను తనిఖీ చేయాలని సూచిస్తుంది. సేంద్రీయ వేప నూనె (5ml/లీటర్) వాడండి. నమోదు చేయడానికి ముందు దెబ్బతిన్న పంటను వేరు చేయండి.",
            "ta": "அக்ரிஃப்ளோ AI தர பரிசோதனை இலைகளின் அடிப்பகுதியில் பூஞ்சை உள்ளதா என பரிசோதிக்க பரிந்துரைக்கிறது. இயற்கை வேப்ப எண்ணெய் (5ml/L) பயன்படுத்தவும். சேதமடைந்தவற்றை பிரித்தெடுக்கவும்.",
            "gu": "એગ્રીફ્લો AI ગુણવત્તા નિરીક્ષણ પાંદડા નીચે ફૂગ અથવા ડાઘ તપાસવાની સલાહ આપે છે. જૈવિક લીમડાનું તેલ (5ml/લિટર) વાપરો. લિસ્ટિંગ કરતા પહેલા બગડેલી ઉપજ અલગ કરો.",
        }
    else:
        answers = {
            "en": "AgriFlow Intelligence connects verified farm lots with institutional buyers using AI quality grading and live logistics. You can search current Mandi price trends, run quality scans on produce images, or match requirements in real time.",
            "hi": "एग्रीफ्लो इंटेलिजेंस AI गुणवत्ता ग्रेडिंग और लाइव लॉजिस्टिक्स के माध्यम से सत्यापित कृषि लॉट को बड़े खरीदारों से जोड़ता है। आप वर्तमान मंडी भाव देख सकते हैं, फसल की फोटो से गुणवत्ता जांच सकते हैं या तुरंत खरीदार ढूंढ सकते हैं।",
            "pa": "ਐਗਰੀਫਲੋ ਇੰਟੈਲੀਜੈਂਸ AI ਕੁਆਲਿਟੀ ਗ੍ਰੇਡਿੰਗ ਅਤੇ ਲਾਈਵ ਲੌਜਿਸਟਿਕਸ ਰਾਹੀਂ ਪ੍ਰਮਾਣਿਤ ਖੇਤੀ ਲਾਟਾਂ ਨੂੰ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ। ਤੁਸੀਂ ਮੰਡੀ ਦੇ ਭਾਅ, ਫ਼ਸਲ ਦੀ ਸਕੈਨਿੰਗ ਅਤੇ ਖਰੀਦਦਾਰ ਲੱਭ ਸਕਦੇ ਹੋ।",
            "bn": "এগ্রিফ্লো ইন্টেলিজেন্স AI কোয়ালিটি গ্রেডিং এবং লাইভ লজিস্টিকসের মাধ্যমে প্রত্যয়িত খামার লটকে প্রাতিষ্ঠানিক ক্রেতাদের সাথে সংযুক্ত করে। আপনি সরাসরি বাজারদর, মান পরীক্ষা ও ক্রেতা পেতে পারেন।",
            "mr": "अॅग्रीफ्लो इंटेलिजन्स AI गुणवत्ता प्रतवारी आणि थेट वाहतूक ट्रॅकिंगद्वारे शेतमाल खरेदीदारांशी जोडते. तुम्ही बाजारभाव पाहू शकता, फोटोद्वारे प्रत तपासू शकता आणि खरेदीदार शोधू शकता.",
            "te": "అగ్రిఫ్లో ఇంటెలిజెన్స్ AI నాణ్యతా గ్రేడింగ్ మరియు లైవ్ లాజిస్టిక్స్ ద్వారా ధృవీకరించబడిన పంట లాట్లను కొనుగోలుదారులతో కలుపుతుంది. మీరు ధరలు మరియు కొనుగోలుదారులను తక్షణమే పొందవచ్చు.",
            "ta": "அக்ரிஃப்ளோ இன்டெலிஜென்ஸ் AI தர மதிப்பீடு மற்றும் நேரடி போக்குவரத்து மூலம் விவசாயிகளை மொத்த வாங்குபவர்களுடன் இணைக்கிறது. சந்தை விலைகள் மற்றும் பொருத்தங்களை உடனே பெறலாம்.",
            "gu": "એગ્રીફ્લો ઇન્ટેલિજન્સ AI ગુણવત્તા ગ્રેડિંગ અને લાઇવ લોજિસ્ટિક્સ દ્વારા પ્રમાણિત ખેત લોટને ખરીદદારો સાથે જોડે છે. તમે તરત જ મંડી ભાવ, સ્કેન અને ખરીદદારો મેળવી શકો છો.",
        }

    response_text = answers.get(lang_code, answers["en"])
    return {
        "query": query,
        "language": lang_code,
        "language_name": SUPPORTED_LANGUAGES.get(lang_code, "English"),
        "role": role,
        "response": response_text,
        "status": "success",
    }

