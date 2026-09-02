import { AssistantLanguage, DialogStep, QuickPrompt } from "./types";

export interface StepPrompt {
  promptText: string;
  quickPrompts: QuickPrompt[];
}

export const DIALOG_PROMPTS: Record<
  AssistantLanguage,
  Record<DialogStep, StepPrompt>
> = {
  "en-IN": {
    GREETING: {
      promptText:
        "Namaste! I am your SchemeSetu Concessional Credit Advisor. I connect Scheduled Caste entrepreneurs and students with tailored concessional credit schemes covering up to 90% of costs at 4.0% to 8.0% interest rates.\n\nWhat kind of business enterprise or educational program are you planning to start?",
      quickPrompts: [
        { id: "p-retail", label: "Retail / Kirana", value: "Small grocery and retail kiosk", iconName: "store" },
        { id: "p-tailor", label: "Tailoring Shop", value: "Tailoring and garment fabrication", iconName: "scissors" },
        { id: "p-dairy", label: "Dairy & Livestock", value: "Dairy farming and livestock", iconName: "milk" },
        { id: "p-transport", label: "Transport Vehicle", value: "Commercial transport and logistics", iconName: "truck" },
        { id: "p-edu", label: "Higher Education", value: "Higher education and professional studies", iconName: "graduation" },
      ],
    },
    COLLECT_ACTIVITY: {
      promptText:
        "That sounds like a promising enterprise! What is your estimated total project or startup cost (including equipment, materials, or working capital)?",
      quickPrompts: [
        { id: "c-50k", label: "₹50,000", value: "₹50,000", iconName: "rupee" },
        { id: "c-100k", label: "₹1,00,000", value: "₹1,00,000", iconName: "rupee" },
        { id: "c-140k", label: "₹1.40 Lakhs (Max Micro)", value: "₹1,40,000", iconName: "rupee" },
        { id: "c-500k", label: "₹5 Lakhs (Medium)", value: "₹5,00,000", iconName: "rupee" },
        { id: "c-2000k", label: "₹20 Lakhs (Capital)", value: "₹20,00,000", iconName: "rupee" },
      ],
    },
    COLLECT_COST: {
      promptText:
        "Understood. To verify eligibility for MoSJE concessional credit, what is your annual family income from all sources? (The statutory limit is ₹5.00 Lakhs per annum)",
      quickPrompts: [
        { id: "i-120k", label: "Under ₹1.5 Lakhs", value: "₹1,20,000 per annum", iconName: "rupee" },
        { id: "i-240k", label: "₹2.40 Lakhs", value: "₹2,40,000 per annum", iconName: "rupee" },
        { id: "i-360k", label: "₹3.60 Lakhs", value: "₹3,60,000 per annum", iconName: "rupee" },
        { id: "i-480k", label: "₹4.80 Lakhs (Near Limit)", value: "₹4,80,000 per annum", iconName: "rupee" },
      ],
    },
    COLLECT_INCOME: {
      promptText:
        "Thank you. Lastly, to check for special affirmative benefits (such as the 4.0% Mahila Samriddhi Yojana for women or student education rebates), please tell me your gender or if you are a student.",
      quickPrompts: [
        { id: "g-female", label: "Female Entrepreneur (MSY 4%)", value: "Female entrepreneur", iconName: "briefcase" },
        { id: "g-male", label: "Male Entrepreneur", value: "Male entrepreneur", iconName: "briefcase" },
        { id: "g-student", label: "Student Applicant", value: "Student applying for higher education", iconName: "graduation" },
      ],
    },
    COLLECT_CATEGORY: {
      promptText:
        "Evaluating your requirements against statutory MoSJE guidelines...",
      quickPrompts: [],
    },
    EVALUATION_COMPLETE: {
      promptText:
        "I have evaluated your profile against all official MoSJE and NSFDC programs! Below is your personalized scheme recommendation and institutional funding breakdown. You can adjust the sliders directly to explore variations.",
      quickPrompts: [
        { id: "a-restart", label: "Start New Evaluation", value: "I want to start a new evaluation", iconName: "store" },
        { id: "a-mcf", label: "Check Micro Credit Limit", value: "Tell me more about Micro Credit Finance", iconName: "rupee" },
      ],
    },
  },
  "hi-IN": {
    GREETING: {
      promptText:
        "नमस्ते! मैं आपका स्कीमसेतु रियायती ऋण सलाहकार हूँ। मैं अनुसूचित जाति के उद्यमियों और विद्यार्थियों को 4.0% से 8.0% रियायती ब्याज दर पर 90% तक सरकारी ऋण प्राप्त करने में सहायता करता हूँ।\n\nआप किस प्रकार का व्यवसाय या शिक्षा कार्यक्रम शुरू करना चाहते हैं?",
      quickPrompts: [
        { id: "p-retail", label: "किराना / खुदरा दुकान", value: "किराना और खुदरा दुकान", iconName: "store" },
        { id: "p-tailor", label: "सिलाई केंद्र", value: "सिलाई और कपड़ा निर्माण", iconName: "scissors" },
        { id: "p-dairy", label: "डेयरी / पशुपालन", value: "दुग्ध व्यवसाय और पशुपालन", iconName: "milk" },
        { id: "p-transport", label: "वाहन / परिवहन", value: "व्यावसायिक परिवहन सेवा", iconName: "truck" },
        { id: "p-edu", label: "उच्च शिक्षा ऋण", value: "उच्च शिक्षा और डिग्री", iconName: "graduation" },
      ],
    },
    COLLECT_ACTIVITY: {
      promptText:
        "यह एक उत्तम व्यवसाय विचार है! इस व्यवसाय को शुरू करने के लिए आपकी कुल अनुमानित परियोजना या उपकरण लागत कितनी है?",
      quickPrompts: [
        { id: "c-50k", label: "₹50,000", value: "₹50,000", iconName: "rupee" },
        { id: "c-100k", label: "₹1,00,000", value: "₹1,00,000", iconName: "rupee" },
        { id: "c-140k", label: "₹1.40 लाख (माइक्रो अधिकतम)", value: "₹1,40,000", iconName: "rupee" },
        { id: "c-500k", label: "₹5 लाख (मध्यम)", value: "₹5,00,000", iconName: "rupee" },
        { id: "c-2000k", label: "₹20 लाख (बड़ा)", value: "₹20,00,000", iconName: "rupee" },
      ],
    },
    COLLECT_COST: {
      promptText:
        "समझ गया। सामाजिक न्याय और अधिकारिता मंत्रालय के नियमों के अनुसार, सभी स्रोतों से आपकी वार्षिक पारिवारिक आय कितनी है? (अधिकतम सीमा ₹5.00 लाख प्रति वर्ष है)",
      quickPrompts: [
        { id: "i-120k", label: "₹1.5 लाख से कम", value: "वार्षिक आय ₹1,20,000", iconName: "rupee" },
        { id: "i-240k", label: "₹2.40 लाख", value: "वार्षिक आय ₹2,40,000", iconName: "rupee" },
        { id: "i-360k", label: "₹3.60 लाख", value: "वार्षिक आय ₹3,60,000", iconName: "rupee" },
        { id: "i-480k", label: "₹4.80 लाख (सीमा के पास)", value: "वार्षिक आय ₹4,80,000", iconName: "rupee" },
      ],
    },
    COLLECT_INCOME: {
      promptText:
        "धन्यवाद। विशेष लाभ (जैसे महिला उद्यमियों के लिए 4% महिला समृद्धि योजना या छात्रों के लिए शिक्षा छूट) जांचने के लिए, कृपया अपना लिंग या विद्यार्थी स्थिति बताएं।",
      quickPrompts: [
        { id: "g-female", label: "महिला उद्यमी (4% एमएसवाई)", value: "महिला उद्यमी", iconName: "briefcase" },
        { id: "g-male", label: "पुरुष उद्यमी", value: "पुरुष उद्यमी", iconName: "briefcase" },
        { id: "g-student", label: "विद्यार्थी", value: "विद्यार्थी", iconName: "graduation" },
      ],
    },
    COLLECT_CATEGORY: {
      promptText:
        "आपके विवरण का सरकारी नियमों के अनुसार मूल्यांकन किया जा रहा है...",
      quickPrompts: [],
    },
    EVALUATION_COMPLETE: {
      promptText:
        "मैंने आपके प्रोफाइल का सभी आधिकारिक MoSJE और NSFDC कार्यक्रमों के साथ मिलान कर लिया है! नीचे आपकी अनुशंसित योजना और संस्थागत फंडिंग का विवरण दिया गया है।",
      quickPrompts: [
        { id: "a-restart", label: "नई शुरुआत करें", value: "मैं नया मूल्यांकन करना चाहता हूँ", iconName: "store" },
      ],
    },
  },
};
