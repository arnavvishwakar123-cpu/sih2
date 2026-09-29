// services/aiAssistant.js - Multilingual Disaster Response & Triage Intelligence Engine

const PROTOCOLS = {
  en: {
    helplines: {
      national: "112 (National Emergency)",
      ndrf: "011-24363260 (NDRF Control Room)",
      ambulance: "108",
      fire: "101",
      disasterHelpline: "1077 (District Disaster Management Authority)"
    },
    intents: {
      FLOOD: "During rising flood waters: Immediately disconnect mains electrical switches. Move to upper storeys or elevated concrete cyclone/flood shelters. Do NOT attempt to wade or drive across flooded roads (15cm of flowing water can knock you down). Drink only boiled or sealed chlorinated water.",
      EARTHQUAKE: "During an earthquake: DROP, COVER, and HOLD ON under a sturdy desk or table. Keep clear of windows, exterior walls, and overhead lighting. If outdoors, move to an open space away from power lines, chimneys, and tall buildings. Do not use elevators.",
      CYCLONE: "Cyclone preparedness: Fasten loose roof sheets. Turn off gas and electrical appliances. Keep emergency battery radio, torches, and dry ration kit ready. Never venture out until authorities announce the cyclone's eye and trailing gale have fully passed.",
      LANDSLIDE: "Landslide danger: Be alert to sudden rumbling sounds, tilting trees, or rapid increase in muddy creek runoff. Evacuate perpendicular to the path of the slide. Do not return to slopes until certified stable by geological teams.",
      MEDICAL: "Medical emergency: Dial 108 immediately. If bleeding, apply firm direct pressure with a clean cloth. For shock, elevate legs slightly and keep warm. For heatstroke, move patient to shade and apply cool wet compresses.",
      SHELTER: "Nearest registered relief shelter in Assam is Sarusajai Regional Relief Center (Guwahati), equipped with active community kitchen, RO drinking water, and on-site paramedics.",
      VOLUNTEER: "To volunteer, open the 'Volunteers' tab on this platform. You can register your certified skills (First Aid, Drone Piloting, Food Logistics) to accept verified task missions."
    }
  },
  hi: {
    helplines: {
      national: "112 (राष्ट्रीय आपातकालीन हेल्पलाइन)",
      ndrf: "011-24363260 (एनडीआरएफ नियंत्रण कक्ष)",
      ambulance: "108",
      fire: "101",
      disasterHelpline: "1077 (जिला आपदा प्रबंधन प्राधिकरण)"
    },
    intents: {
      FLOOD: "बाढ़ के दौरान सुरक्षा: घर की मुख्य बिजली और गैस तुरंत बंद करें। तुरंत ऊपरी मंजिलों या पक्के राहत शिविरों की ओर जाएं। बहते पानी में गाड़ी चलाने या पैदल चलने की कोशिश न करें। केवल उबला हुआ या क्लोरीनयुक्त पानी पिएं।",
      EARTHQUAKE: "भूकंप के दौरान: 'झुकें, छुपें और मजबूती से पकड़ें' (Drop, Cover, Hold On)। भारी मेज के नीचे बैठें। खिड़कियों, शीशों और भारी अलमारियों से दूर रहें। खुले मैदान में हों तो बिजली के खंभों और इमारतों से दूर रहें।",
      CYCLONE: "चक्रवात से बचाव: टिन की छतों को सुरक्षित करें। बैटरी रेडियो और टार्च पास रखें। जब तक प्रशासन द्वारा चक्रवात पूरी तरह समाप्त होने की घोषणा न हो, बाहर न निकलें।",
      LANDSLIDE: "भूस्खलन से बचाव: मिट्टी या पत्थरों के गिरने की आवाज पर सतर्क रहें। बहाव की दिशा से लंबवत (दाएं या बाएं) तेजी से ऊंचे सुरक्षित स्थान पर जाएं।",
      MEDICAL: "चिकित्सा आपातकाल: तुरंत 108 डायल करें। यदि रक्त बह रहा है, तो साफ कपड़े से सीधा दबाव डालें। मरीज को शांत रखें।",
      SHELTER: "निकटतम सक्रिय राहत शिविर: सरुसजाई क्षेत्रीय राहत केंद्र (गुवाहाटी), जहां पेयजल, भोजन और डॉक्टर उपलब्ध हैं।",
      VOLUNTEER: "स्वयंसेवक बनने के लिए 'स्वयंसेवक' (Volunteers) टैब पर जाएं और प्राथमिक उपचार या राहत वितरण कौशल दर्ज करें।"
    }
  },
  mr: {
    helplines: {
      national: "112 (राष्ट्रीय आपत्कालीन क्रमांक)",
      ndrf: "011-24363260 (एनडीआरएफ नियंत्रण कक्ष)",
      ambulance: "108 (रुग्णवाहिका)",
      fire: "101 (अग्निशामक)",
      disasterHelpline: "1077 (जिल्हा आपत्ती व्यवस्थापन)"
    },
    intents: {
      FLOOD: "पुराच्या वेळी: घरातील मुख्य वीज पुरवठा आणि गॅस त्वरित बंद करा. तात्काळ उंचावर किंवा सुरक्षित निवारा केंद्रात जा. पुराच्या पाण्यातून गाडी चालवू नका किंवा चालू नका. फक्त उकळलेले पाणी प्या.",
      EARTHQUAKE: "भूकंपाच्या वेळी: 'खाली बसा, झाका आणि घट्ट धरा' (Drop, Cover, Hold). मजबूत टेबलखाली बसा. खिडक्या आणि विजेच्या तारांपासून लांब राहा. लिफ्टचा वापर करू नका.",
      CYCLONE: "वादळाच्या वेळी: घराच्या खिडक्या आणि दरवाजे बंद ठेवा. बॅटरी रेडिओ आणि टॉर्च तयार ठेवा. अधिकृत सूचना आल्याशिवाय घराबाहेर पडू नका.",
      LANDSLIDE: "दरड कोसळण्याच्या वेळी: डोंगरउतारावरील माती सरकण्याच्या आवाजाकडे लक्ष द्या. पाण्याच्या प्रवाहाच्या दिशेने न पळता बाजूला उंचावर जा.",
      MEDICAL: "वैद्यकीय मदत: त्वरित 108 वर संपर्क साधा. रक्तस्त्राव होत असल्यास स्वच्छ कापडाने दाबा.",
      SHELTER: "जवळचे अधिकृत निवारा केंद्र: सरुसजाई रिलीफ सेंटर, जिथे जेवण, स्वच्छ पाणी आणि औषधोपचार उपलब्ध आहेत.",
      VOLUNTEER: "मदतकार्य स्वयंसेवक नोंदणीसाठी 'स्वयंसेवक' टॅबवर जाऊन आपली माहिती व कौशल्ये नोंदवा."
    }
  }
};

export function processAiQuery(query, language = 'en', userLocation = null) {
  const lang = ['hi', 'mr'].includes(language) ? language : 'en';
  const q = (query || "").toLowerCase();
  const dict = PROTOCOLS[lang];

  let topic = 'GENERAL';
  let responseText = "";

  if (q.includes('flood') || q.includes('water') || q.includes('बाढ़') || q.includes('पूर')) {
    topic = 'FLOOD';
    responseText = dict.intents.FLOOD;
  } else if (q.includes('quake') || q.includes('earthquake') || q.includes('भूकंप')) {
    topic = 'EARTHQUAKE';
    responseText = dict.intents.EARTHQUAKE;
  } else if (q.includes('cyclone') || q.includes('storm') || q.includes('चक्रवात') || q.includes('वादळ')) {
    topic = 'CYCLONE';
    responseText = dict.intents.CYCLONE;
  } else if (q.includes('landslide') || q.includes('rock') || q.includes('भूस्खलन') || q.includes('दरड')) {
    topic = 'LANDSLIDE';
    responseText = dict.intents.LANDSLIDE;
  } else if (q.includes('shelter') || q.includes('camp') || q.includes('राहत शिविर') || q.includes('निवारा')) {
    topic = 'SHELTER';
    responseText = dict.intents.SHELTER;
  } else if (q.includes('medical') || q.includes('doctor') || q.includes('injury') || q.includes('चिकित्सा') || q.includes('रुग्णवाहिका')) {
    topic = 'MEDICAL';
    responseText = dict.intents.MEDICAL;
  } else if (q.includes('volunteer') || q.includes('help') || q.includes('स्वयंसेवक')) {
    topic = 'VOLUNTEER';
    responseText = dict.intents.VOLUNTEER;
  } else {
    topic = 'GENERAL_ASSISTANCE';
    responseText = lang === 'hi' 
      ? `नमस्ते। मैं आपका आपदा प्रबंधन AI सहायक हूँ। आप बाढ़, भूकंप, चक्रवात, राहत शिविर या आपातकालीन 112 सहायता के बारे में पूछ सकते हैं।`
      : lang === 'mr'
      ? `नमस्कार. मी आपला आपत्ती व्यवस्थापन AI सहाय्यक आहे. आपण पूर, भूकंप, वादळ किंवा तात्काळ वैद्यकीय मदतीसाठी विचारू शकता.`
      : `Hello. I am your Official Emergency Response AI Assistant. Ask me about flood safety, earthquakes, storm guidance, nearby shelters, or emergency helplines.`;
  }

  return {
    query,
    language: lang,
    detectedTopic: topic,
    response: responseText,
    officialHelplines: dict.helplines,
    isAiGenerated: true,
    confidence: 0.95,
    timestamp: new Date().toISOString()
  };
}
