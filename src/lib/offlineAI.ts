// Offline AI engine for AgriSense
// Gives realistic, helpful farming answers without any API connection

export function isOffline(): boolean {
    if (typeof navigator === 'undefined') return false;
    return !navigator.onLine;
}

// ── Chat responses ────────────────────────────────────────────────────────────

interface QARule {
    keywords: string[];
    answer: string;
}

const FARMING_QA: QARule[] = [
    {
        keywords: ['moisture', 'water', 'irrigation', 'irrigate', 'dry', 'wet', 'drought'],
        answer: `For optimal crop growth, soil moisture should stay between 65 and 80 percent. If moisture drops below 65 percent, irrigate in the early morning or evening to reduce evaporation. Avoid irrigating midday. For most crops, drip irrigation is the most efficient method and can reduce water use by 30 to 50 percent compared to flood irrigation. Check your sensors daily during dry spells.`,
    },
    {
        keywords: ['fertilizer', 'fertilise', 'nutrient', 'nitrogen', 'npk', 'compost', 'manure'],
        answer: `Nutrient management depends on your crop stage. In the vegetative stage, nitrogen is most critical. In flowering and fruiting stages, phosphorus and potassium matter more. For organic options, vermicompost (2 to 3 tons per hectare) or green manure cover crops are excellent. Apply fertilizer after irrigation so it penetrates the soil. Always do a soil test before adding nutrients to avoid over-application.`,
    },
    {
        keywords: ['pest', 'insect', 'bug', 'aphid', 'caterpillar', 'spray', 'pesticide'],
        answer: `For organic pest control: neem oil spray at 5ml per liter of water every 7 days is effective against most soft-bodied insects. For caterpillars, Bacillus thuringiensis (Bt) spray is highly effective and safe for beneficial insects. Always scout your fields every 3 to 4 days to catch infestations early. Remove infected plant material immediately. Intercropping with marigold or coriander can repel many common pests naturally.`,
    },
    {
        keywords: ['disease', 'blight', 'fungus', 'rust', 'rot', 'wilt', 'yellow', 'brown', 'spot'],
        answer: `Most fungal diseases spread in humid, warm conditions. Key prevention steps: ensure good air circulation between plants by maintaining proper spacing, avoid overhead irrigation, remove and destroy any infected plant material immediately. For organic treatment, copper-based fungicide (Bordeaux mixture at 1%) is effective against most fungal and bacterial diseases. Apply in the early morning so the plants dry before nightfall.`,
    },
    {
        keywords: ['ph', 'acid', 'alkaline', 'lime', 'soil test'],
        answer: `Most crops grow best at pH 6.0 to 7.0. If your soil is too acidic (below 6.0), add agricultural lime at 1 to 2 tons per hectare and wait 2 to 3 months before planting. If soil is too alkaline (above 7.5), apply sulfur at 200 to 500 kg per hectare. Always retest pH 60 days after treatment. Your AgriSense sensor gives you real-time pH readings so you can monitor changes without waiting for lab results.`,
    },
    {
        keywords: ['wheat', 'rabi', 'winter crop'],
        answer: `Wheat grows best in cool temperatures between 15 and 22 degrees Celsius. Key advice: sow at the right time for your region (October to December for most of India), maintain soil moisture between 60 and 75 percent especially at the tillering and grain-filling stages, and watch for yellow rust which appears as orange-yellow stripes on leaves. Apply fertilizer in two splits: half at sowing, half at first irrigation.`,
    },
    {
        keywords: ['rice', 'paddy', 'kharif'],
        answer: `Rice requires consistent moisture, ideally 3 to 5 cm of standing water during vegetative stages. Key advice: maintain soil temperature between 20 and 35 degrees Celsius, apply nitrogen fertilizer in three splits (at transplanting, tillering, and panicle initiation), and scout regularly for rice blast, which appears as diamond-shaped grey lesions. Drain fields 2 weeks before harvest to firm the soil and improve grain quality.`,
    },
    {
        keywords: ['cotton'],
        answer: `Cotton is a heavy feeder and needs well-drained soil with pH 6.0 to 7.5. Water stress at flowering and boll development stages reduces yield significantly. Key advice: maintain soil moisture at 65 to 75 percent, apply potassium-rich fertilizer during boll formation, and scout weekly for pink bollworm and whitefly. Spray neem oil at first sign of sucking pests. Cotton responds very well to drip irrigation which also reduces fungal disease risk.`,
    },
    {
        keywords: ['maize', 'corn'],
        answer: `Maize needs full sun and consistent moisture especially at the silking and tasseling stage. Soil moisture below 50 percent during this critical stage can cut yields by up to 40 percent. Apply nitrogen in two splits: at planting and at the knee-high stage. Watch for fall armyworm, which can destroy an entire crop in days. Check the whorl of young plants for small feeding holes and frass, and treat immediately with Bt spray if found.`,
    },
    {
        keywords: ['harvest', 'when to harvest', 'ready to harvest'],
        answer: `Harvest timing depends on your crop and end use. For grains like wheat and rice, moisture content at harvest should be 14 to 20 percent for fresh harvest, then dried to 12 to 14 percent for storage. Harvesting too early reduces yield; harvesting too late increases field losses. Use your AgriSense app weather alerts to plan your harvest around dry weather windows. Avoid harvesting after heavy rain as it increases grain moisture and storage risk.`,
    },
    {
        keywords: ['market', 'price', 'sell', 'msp', 'mandi'],
        answer: `For the best prices, check the eNAM platform (National Agriculture Market) to compare prices across mandis before selling. The MSP (Minimum Support Price) set by the government is the floor price for major crops. To get above-MSP prices, consider: timing your sale 2 to 4 weeks after peak harvest season when prices recover, joining a Farmer Producer Organization (FPO) for collective bargaining, or direct selling to processors. The AgriSense market tab shows live prices for your region.`,
    },
    {
        keywords: ['weather', 'rain', 'forecast', 'temperature', 'climate'],
        answer: `Check the AgriSense weather tab for a 7-day forecast specific to your area. Key farming decisions tied to weather: delay irrigation if rain is expected within 48 hours, avoid spraying pesticides or fertilizers before predicted rain (it washes off), plan harvesting during the dry windows in the forecast, and cover or protect seedlings if night temperatures are forecast to drop below 10 degrees Celsius.`,
    },
    {
        keywords: ['drone', 'uav', 'aerial', 'survey', 'imaging'],
        answer: `Drone scanning is most useful at three crop stages: early vegetative (to spot germination gaps), mid-season (to identify pest and disease hotspots before they spread), and pre-harvest (to assess yield and plan logistics). Book a drone session from the Services tab in the app. A single scan of a 2-hectare farm takes about 20 minutes and gives you a detailed crop health map with NDVI analysis that shows exactly where your field needs attention.`,
    },
    {
        keywords: ['scheme', 'subsidy', 'government', 'pm kisan', 'loan', 'credit', 'kcc'],
        answer: `Key government schemes available to you: PM-KISAN gives 6,000 rupees per year in three installments directly to your account. PM Fasal Bima Yojana provides crop insurance at subsidized premiums. The Kisan Credit Card gives you up to 3 lakh rupees in short-term credit at 4 percent interest. Drip and sprinkler irrigation systems get up to 55 percent subsidy under PM Krishi Sinchai Yojana. Visit the Govt. Schemes section of the app for direct links to apply.`,
    },
    {
        keywords: ['sensor', 'how does', 'what is', 'explain', 'agrisense'],
        answer: `Your AgriSense IoT sensor kit measures four things in real time: soil moisture (how much water is in the soil), soil temperature (critical for germination and root health), soil pH (acidity or alkalinity), and nutrient levels (overall NPK status). The sensor connects to the app via Bluetooth and updates every 4 seconds. All data is stored for 7 days so you can see trends. If sensors show a problem, the AI advisor generates specific recommendations automatically.`,
    },
];

const FALLBACK_RESPONSES = [
    `That is a great question. Based on general best practices for Indian farming conditions: focus on maintaining optimal soil moisture between 65 and 80 percent, monitor your pH levels in the 6.0 to 7.0 range, and use organic inputs where possible to build long-term soil health. For a more specific answer, please connect to the internet and I can give you AI-powered advice tailored to your exact sensor readings.`,
    `For most crop health issues, the first step is always to check your three core sensor readings: moisture, temperature, and pH. If all three are in optimal range and you are still seeing problems, the issue is likely pest or disease related. Use the Crop Doctor feature to scan an affected leaf and get an instant diagnosis. I can give more detailed advice once you are back online.`,
    `Good farming practice comes down to consistency. Check your sensor readings daily, irrigate based on actual moisture data rather than calendar schedules, and scout your fields every 3 to 4 days for early pest and disease signs. Early detection almost always means lower cost of treatment. Let me know if you have a more specific question and I will do my best to help.`,
];

export function getOfflineChatResponse(question: string): string {
    const q = question.toLowerCase();

    for (const rule of FARMING_QA) {
        if (rule.keywords.some(k => q.includes(k))) {
            return rule.answer;
        }
    }

    // Return a rotating fallback
    const idx = Math.floor(Date.now() / 1000) % FALLBACK_RESPONSES.length;
    return FALLBACK_RESPONSES[idx];
}

// ── Recommendations ───────────────────────────────────────────────────────────

export function getOfflineRecommendations(
    moisture: number,
    temp: number,
    ph: number,
    nutrientLevel: string,
    cropType: string
) {
    const recs = [];

    // Moisture check
    if (moisture < 65) {
        recs.push({
            priority: 'High' as const,
            icon: '💧',
            title: 'Irrigate Now',
            action: `Soil moisture is at ${moisture.toFixed(1)}%, below the optimal 65 to 80% range. Water in the early morning or evening. For ${cropType}, aim to bring moisture back to 70 to 75%.`,
        });
    } else if (moisture > 85) {
        recs.push({
            priority: 'Medium' as const,
            icon: '🚿',
            title: 'Reduce Irrigation',
            action: `Moisture is at ${moisture.toFixed(1)}%, slightly above optimal. Skip the next irrigation cycle. Check field drainage to prevent root rot.`,
        });
    } else {
        recs.push({
            priority: 'Low' as const,
            icon: '💧',
            title: 'Moisture On Track',
            action: `Soil moisture at ${moisture.toFixed(1)}% is within optimal range. Maintain current irrigation schedule and check again in 24 hours.`,
        });
    }

    // pH check
    if (ph < 5.8) {
        recs.push({
            priority: 'High' as const,
            icon: '🧪',
            title: 'Correct Soil Acidity',
            action: `pH at ${ph.toFixed(1)} is too acidic for ${cropType}. Apply agricultural lime at 1 to 2 tons per hectare and retest in 30 days. Most crops need pH between 6.0 and 7.0.`,
        });
    } else if (ph > 7.5) {
        recs.push({
            priority: 'Medium' as const,
            icon: '🧪',
            title: 'Soil Too Alkaline',
            action: `pH at ${ph.toFixed(1)} is above optimal range. Apply sulfur at 200 kg per hectare to gradually lower pH. Recheck in 4 to 6 weeks.`,
        });
    } else {
        recs.push({
            priority: 'Low' as const,
            icon: '🧪',
            title: 'pH Balanced',
            action: `Soil pH at ${ph.toFixed(1)} is ideal for ${cropType}. No corrective action needed. Continue monitoring weekly.`,
        });
    }

    // Temperature check
    if (temp > 32) {
        recs.push({
            priority: 'Medium' as const,
            icon: '🌡️',
            title: 'High Soil Temperature',
            action: `Soil temperature at ${temp.toFixed(1)}°C is above optimal. Apply mulch around plant bases to reduce soil temperature. Irrigate in the early morning to cool the root zone.`,
        });
    } else if (temp < 18) {
        recs.push({
            priority: 'Medium' as const,
            icon: '🌡️',
            title: 'Low Soil Temperature',
            action: `Soil at ${temp.toFixed(1)}°C may slow germination and root activity. Consider black plastic mulch to trap heat. Delay fertilizer application until temperature rises above 20°C.`,
        });
    }

    // Nutrient check
    if (nutrientLevel === 'Low') {
        recs.push({
            priority: 'High' as const,
            icon: '🌱',
            title: 'Apply Nutrients Now',
            action: `Nutrient levels are low. Apply vermicompost at 2 tons per hectare or a balanced NPK fertilizer. For quick results, use foliar spray of diluted fish emulsion (2%). Avoid over-application — test again in 3 weeks.`,
        });
    } else if (nutrientLevel === 'Medium') {
        recs.push({
            priority: 'Low' as const,
            icon: '🌱',
            title: 'Monitor Nutrients',
            action: `Nutrient levels are at medium. No immediate action needed, but consider a light top-dress of compost within the next 2 weeks to maintain soil health through the growing season.`,
        });
    }

    // Always add a weather-aware tip
    recs.push({
        priority: 'Low' as const,
        icon: '☀️',
        title: 'Scout Your Fields',
        action: `Walk your ${cropType} field every 3 to 4 days to check for early signs of pests or disease. Early detection reduces treatment cost significantly. Use the Crop Doctor feature to scan any suspicious leaves for instant diagnosis.`,
    });

    return recs.slice(0, 3);
}
