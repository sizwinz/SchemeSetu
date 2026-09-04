"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Landmark,
  User,
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Save,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  Menu,
  BookOpen,
  Calculator,
  MapPin,
  MessageSquareText,
  FileText,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import {
  ApplicantProfileData,
  getStoredApplicantProfile,
  saveStoredApplicantProfile,
  DEFAULT_PROFILE,
} from "@/lib/user/profileStore";
import {
  speakText,
  pauseSpeech,
  resumeSpeech,
  cancelSpeech,
  isAudioMuted,
  setAudioMuted,
  AudioPlaybackState,
} from "@/lib/audio/speechSynthesis";
import { LanguageDropdown } from "@/components/layout/LanguageDropdown";
import { useLanguage } from "@/lib/i18n/languageContext";

const AUDIO_ENABLED_ANNOUNCEMENTS: Record<string, string> = {
  "en-IN": "Audio enabled. SchemeSetu read aloud is active.",
  "hi-IN": "ऑडियो चालू है। स्कीमसेतु बोलकर सुनाने के लिए तैयार है।",
  "mr-IN": "ऑडिओ सुरू केला आहे. स्कीमसेतू ऐकण्यासाठी सज्ज आहे.",
  "gu-IN": "ઑડિયો ચાલુ કર્યો છે. સ્કીમસેતુ સાંભળવા માટે તૈયાર છે.",
  "ta-IN": "ஆடியோ இயக்கப்பட்டது. வாசித்துக் காட்ட ஸ்கீம்சேது தயார்.",
  "te-IN": "ఆడియో ప్రారంభించబడింది. చదివి వినిపించడానికి స్కీమ్‌సేతు సిద్ధంగా ఉంది.",
  "bn-IN": "অডিও চালু করা হয়েছে। স্কিমসেতু প্রস্তুত।",
  "kn-IN": "ಆಡಿಯೊ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ. ಸ್ಕೀಮ್‌ಸೇತು ಸಿದ್ಧವಾಗಿದೆ.",
  "pa-IN": "ਆਡੀਓ ਚਾਲੂ ਹੈ। ਸਕੀਮਸੇਤੂ ਤਿਆਰ ਹੈ।",
};

const PAGE_SUMMARIES: Record<string, Record<string, string>> = {
  "/": {
    "en-IN": "SchemeSetu homepage. Concessional credit matching for Scheduled Caste entrepreneurs and students with 4.0% to 8.0% interest rates.",
    "hi-IN": "स्कीमसेतु होमपेज। अनुसूचित जाति के उद्यमियों और छात्रों के लिए 4 से 8 प्रतिशत ब्याज दरों पर रियायती ऋण सहायता।",
    "mr-IN": "स्कीमसेतू मुख्यपृष्ठ. अनुसूचित जातीच्या उद्योजकांसाठी आणि विद्यार्थ्यांसाठी 4 ते 8 टक्के व्याजदरावर सवलतीचे कर्ज.",
    "gu-IN": "સ્કીમસેતુ હોમપેજ. અનુસૂચિત જાતિના ઉદ્યોગસાહસિકો અને વિદ્યાર્થીઓ માટે 4 થી 8 ટકા વ્યાજે કન્સેશનલ લોન સહાય.",
    "ta-IN": "ஸ்கீம்சேது முகப்புப்பக்கம். பட்டியலின தொழில்முனைவோர் மற்றும் மாணவர்களுக்கான சலுகைக் கடன் திட்டம்.",
    "te-IN": "స్కీమ్‌సేతు హోమ్‌పేజీ. షెడ్యూల్డ్ కులాల పారిశ్రామికవేత్తలు మరియు విద్యార్థుల కోసం రాయితీ రుణ సదుపాయం.",
    "bn-IN": "স্কিমসেতু হোমপেজ। তফসিলি জাতির উদ্যোক্তা এবং শিক্ষার্থীদের জন্য স্বল্প সুদের ঋণ সহায়তা।",
    "kn-IN": "ಸ್ಕೀಮ್‌ಸೇತು ಮುಖಪುಟ. ಪರಿಶಿಷ್ಟ ಜಾತಿಯ ಉದ್ಯಮಿಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ರಿಯಾಯಿತಿ ಸಾಲ ನೆರವು.",
    "pa-IN": "ਸਕੀਮਸੇਤੂ ਹੋਮਪੇਜ। ਅਨੁਸੂਚਿਤ ਜਾਤੀ ਦੇ ਉੱਦਮੀਆਂ ਅਤੇ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਰਿਆਇਤੀ ਕਰਜ਼ਾ ਸਹਾਇਤਾ।",
  },
  "/calculator": {
    "en-IN": "Concessional Loan and Moratorium Calculator. Model subsidized credit at 4.0% to 8.0% interest with up to 12 months grace period.",
    "hi-IN": "रियायती ऋण और मोराटोरियम कैलकुलेटर। 4 से 8 प्रतिशत ब्याज दर और 12 महीने तक की छूट अवधि के साथ अपने ऋण की गणना करें।",
    "mr-IN": "सवलतीचे कर्ज आणि मोरेटोरियम कॅल्क्युलेटर. 4 ते 8 टक्के व्याजदरावर आणि 12 महिन्यांपर्यंतच्या सवलतीच्या कालावधीसह कर्जाची गणना करा.",
    "gu-IN": "કન્સેશનલ લોન અને મોરેટોરિયમ કેલ્ક્યુલેટર. 4 થી 8 ટકા વ્યાજ અને 12 મહિના સુધીની છૂટ સાથે લોનની ગણતરી કરો.",
    "ta-IN": "கடன் மற்றும் சலுகைக் காலக் கணக்கீடு. 4 முதல் 8 சதவீத வட்டியில் கடன் திட்டங்களைக் கணக்கிடுங்கள்.",
    "te-IN": "రాయితీ రుణం మరియు మొరటోరియం కాలిక్యులేటర్. 4 నుండి 8 శాతం వడ్డీతో రుణాన్ని లెక్కించండి.",
    "bn-IN": "স্বল্প সুদের ঋণ এবং মোরেটোরিয়াম ক্যালকুলেটর। 4 থেকে 8 শতাংশ সুদে ঋণ গণনা করুন।",
    "kn-IN": "ರಿಯಾಯಿತಿ ಸಾಲ ಮತ್ತು ಮೊರಟೋರಿಯಂ ಕ್ಯಾಲ್ಕುಲೇಟರ್. 4 ರಿಂದ 8 ಶೇಕಡಾ ಬಡ್ಡಿದರದಲ್ಲಿ ಸಾಲವನ್ನು ಲೆಕ್ಕಹಾಕಿ.",
    "pa-IN": "ਰਿਆਇਤੀ ਕਰਜ਼ਾ ਅਤੇ ਮੋਰਟੋਰੀਅਮ ਕੈਲਕੁਲੇਟਰ। 4 ਤੋਂ 8 ਫ਼ੀਸਦੀ ਵਿਆਜ ਦਰ ਨਾਲ ਆਪਣੇ ਕਰਜ਼ੇ ਦੀ ਗਣਨਾ ਕਰੋ।",
  },
  "/locator": {
    "en-IN": "Channel Partner Locator. Discover verified solvent banks and state agencies with non-performing assets under 10 percent near your district.",
    "hi-IN": "चैनल पार्टनर लोकेटर। अपने जिले के निकट 10 प्रतिशत से कम एनपीए वाले वित्तीय रूप से सक्षम बैंक और राज्य एजेंसियां खोजें।",
    "mr-IN": "चॅनल पार्टनर लोकेटर. आपल्या जिल्ह्यातील 10 टक्क्यांपेक्षा कमी एनपीए असलेल्या सक्षम बँका आणि संस्था शोधा.",
    "gu-IN": "ચેનલ પાર્ટનર લોકેટર. તમારા જિલ્લા નજીક 10 ટકાથી ઓછા એનપીએ વાળા સક્ષમ બેંક અને સરકારી સંસ્થાઓ શોધો.",
    "ta-IN": "சேவை மைய இருப்பிடக் கண்டுபிடிப்பான். உங்கள் மாவட்டத்திற்கு அருகிலுள்ள வங்கிகள் மற்றும் நிதி நிறுவனங்களைக் கண்டறியவும்.",
    "te-IN": "ఛానల్ భాగస్వామి లొకేటర్. మీ జిల్లా సమీపంలోని తక్కువ ఎన్‌పీఏ కలిగిన బ్యాంకులు మరియు ఆర్థిక సంస్థలను కనుగొనండి.",
    "bn-IN": "চ্যানেল পার্টনার সন্ধানকারী। আপনার জেলার কাছে অনুমোদিত এবং আর্থিকভাবে শক্তিশালী ব্যাংক শাখা খুঁজুন।",
    "kn-IN": "ಚಾನೆಲ್ ಪಾಲುದಾರ ಲೊಕೇಟರ್. ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಸಮೀಪವಿರುವ ಅಧಿಕೃತ ಮತ್ತು ಸಕ್ಷಮ ಬ್ಯಾಂಕ್ ಶಾಖೆಗಳನ್ನು ಹುಡುಕಿ.",
    "pa-IN": "ਚੈਨਲ ਪਾਰਟਨਰ ਲੋਕੇਟਰ। ਆਪਣੇ ਜ਼ਿਲ੍ਹੇ ਦੇ ਨੇੜੇ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਅਤੇ ਆਰਥਿਕ ਤੌਰ ਤੇ ਮਜ਼ਬੂਤ ਬੈਂਕ ਸ਼ਾਖਾਵਾਂ ਲੱਭੋ।",
  },
  "/dossier": {
    "en-IN": "Pre-screened Application Dossier. Ready-to-print official slip with verifiable QR code for fast counter approval at channel partners.",
    "hi-IN": "प्री-स्क्रीन किया गया आवेदन डोजियर। चैनल पार्टनर बैंक में त्वरित सत्यापन के लिए सत्यापन योग्य क्यूआर कोड युक्त आधिकारिक रसीद।",
    "mr-IN": "पूर्व-तपासणी केलेला अर्ज डॉसियर. बँकेत त्वरित मंजुरीसाठी पडताळणी करण्यायोग्य क्यूआर कोडसह अधिकृत कागदपत्र.",
    "gu-IN": "પ્રી-સ્ક્રીન કરેલ અરજી ડોઝિયર. બેંકમાં ઝડપી મંજૂરી માટે ચકાસણી યોગ્ય ક્યુઆર કોડ સાથે અધિકૃત સ્લિપ.",
    "ta-IN": "முன்-சரிபார்க்கப்பட்ட விண்ணப்ப ஆவணம். வங்கியில் விரைவான ஒப்புதலுக்கான சரிபார்க்கக்கூடிய க்யூಆர் குறியீட்டுடன் கூடிய அதிகாரப்பூர்வ சீட்டு.",
    "te-IN": "ముందస్తుగా పరిశీలించిన దరఖాస్తు పత్రం. బ్యాంక్ వద్ద త్వరిత అనుమతి కోసం క్యూఆర్ కోడ్‌తో కూడిన అధికారిక రసీదు.",
    "bn-IN": "প্রি-স্ক্রিন করা আবেদনপত্র ডসিয়ার। ব্যাংকে দ্রুত অনুমোদনের জন্য কিউআর কোড সহ অফিসিয়াল স্লিপ।",
    "kn-IN": "ಪೂರ್ವ ಪರಿಶೀಲಿಸಿದ ಅರ್ಜಿ ಡಾಕ್ಯುಮೆಂಟ್. ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ತ್ವರಿತ ಅನುಮೋದನೆಗಾಗಿ ಕ್ಯೂಆರ್ ಕೋಡ್ ಹೊಂದಿರುವ ಅಧಿಕೃತ ರಸೀದಿ.",
    "pa-IN": "ਪੂਰਵ-ਜਾਂਚਿਆ ਬਿਨੈ-ਪੱਤਰ ਡੋਜ਼ੀਅਰ। ਬੈਂਕ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਪ੍ਰਵਾਨਗੀ ਲਈ ਕਿਊਆਰ ਕੋਡ ਵਾਲੀ ਅਧਿਕਾਰਤ ਪਰਚੀ।",
  },
  "/assistant": {
    "en-IN": "AI Scheme Assistant. Interactive voice and chat-guided pre-screening for MoSJE concessional credit programs.",
    "hi-IN": "एआई योजना सहायक। सामाजिक न्याय और अधिकारिता मंत्रालय के रियायती ऋण कार्यक्रमों के लिए संवादात्मक मार्गदर्शन।",
    "mr-IN": "एआय योजना सहाय्यक. सवलतीच्या कर्ज योजनांसाठी संवादात्मक मार्गदर्शन आणि पात्रता तपासणी.",
    "gu-IN": "એઆઈ યોજના સહાયક. કન્સેશનલ લોન યોજનાઓ માટે ઇન્ટરેક્ટિવ માર્ગદર્શન અને પાત્રતા ચકાસણી.",
    "ta-IN": "செயற்கை நுண்ணறிவு திட்ட உதவியாளர். அரசு சலுகைக் கடன் திட்டங்களுக்கான வழிகாட்டுதல்.",
    "te-IN": "ఏఐ స్కీమ్ అసిస్టెంట్. ప్రభుత్వ రాయితీ రుణ పథకాల కోసం ఇంటరాక్టివ్ మార్గదర్శకత్వం.",
    "bn-IN": "এআই প্রকল্প সহায়ক। সরকারি স্বল্প সুদের ঋণ কর্মসূচির জন্য ইন্টারেক্টিভ পরামর্শ।",
    "kn-IN": "ಎಐ ಯೋಜನೆ ಸಹಾಯಕ. ರಿಯಾಯಿತಿ ಸಾಲ ಕಾರ್ಯಕ್ರಮಗಳಿಗಾಗಿ ಸಂವಾದಾತ್ಮಕ ಮಾರ್ಗದರ್ಶನ.",
    "pa-IN": "ਏਆਈ ਸਕੀਮ ਸਹਾਇਕ। ਸਰਕਾਰੀ ਰਿਆਇਤੀ ਕਰਜ਼ਾ ਪ੍ਰੋਗਰਾਮਾਂ ਲਈ ਗੱਲਬਾਤ ਰਾਹੀਂ ਮਾਰਗਦਰਸ਼ਨ।",
  },
};

export function Header() {
  const pathname = usePathname();
  const { currentLanguageOption } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<ApplicantProfileData>(DEFAULT_PROFILE);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const [audioState, setAudioState] = useState<AudioPlaybackState>({
    isSpeaking: false,
    isPaused: false,
    isMuted: isAudioMuted(),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      setProfile(getStoredApplicantProfile());

      const handleAudioState = (e: any) => {
        setAudioState(e.detail);
      };
      window.addEventListener("schemesetu_audio_state", handleAudioState);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("schemesetu_audio_state", handleAudioState);
      };
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredApplicantProfile(profile);
    setSaveSuccess(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("schemesetu_profile_updated", { detail: profile }));
    }
    setTimeout(() => {
      setSaveSuccess(false);
      setShowProfileModal(false);
    }, 900);
  };

  return (
    <>
      <header className="w-full bg-white text-slate-900 shadow-2xs border-b border-slate-200/80 sticky top-0 z-40 print:hidden">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 min-w-0">
            <Link
              href="/"
              className="flex items-center space-x-1.5 sm:space-x-2 text-slate-900 hover:text-amber-700 transition-colors group shrink-0"
            >
              <Image
                src="/logo.png"
                alt="SchemeSetu Logo"
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform group-hover:scale-105 shrink-0"
                priority
              />
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 shrink-0">
                SchemeSetu
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation (shown on xl: and wider) */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-semibold text-slate-600">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Scheme Recommender
            </Link>

            <Link
              href="/calculator"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/calculator"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              EMI Calculator
            </Link>

            <Link
              href="/locator"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/locator"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Partner Locator
            </Link>

            <Link
              href="/dossier"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/dossier"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Application Dossier
            </Link>

            <Link
              href="/assistant"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/assistant"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              AI Assistant
            </Link>

            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/admin"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              MoSJE Admin
            </Link>
          </nav>

          {/* Right: Condensed Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Audio Controller - Strictly compact to prevent translation collisions */}
            <div className="h-8 inline-flex items-center whitespace-nowrap rounded-full border border-slate-200/90 bg-slate-50 px-1 sm:px-2 text-xs transition-all shadow-2xs shrink-0">
              {audioState.isSpeaking || audioState.isPaused ? (
                <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap notranslate" translate="no">
                  <span className="relative flex h-2 w-2 shrink-0 ml-0.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        audioState.isPaused ? "bg-amber-400" : "bg-emerald-400"
                      } opacity-75`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        audioState.isPaused ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                  </span>

                  <span className="hidden md:inline text-[11px] font-semibold text-slate-700 select-none notranslate" translate="no">
                    {audioState.isPaused ? "Paused" : "Reading"}
                  </span>

                  <button
                    type="button"
                    onClick={audioState.isPaused ? resumeSpeech : pauseSpeech}
                    className="h-7 w-7 sm:h-6 sm:w-6 rounded-md hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title={audioState.isPaused ? "Resume read aloud" : "Pause read aloud"}
                    aria-label={audioState.isPaused ? "Resume read aloud" : "Pause read aloud"}
                  >
                    {audioState.isPaused ? (
                      <Play className="h-3.5 w-3.5 sm:h-3 sm:w-3 fill-current" />
                    ) : (
                      <Pause className="h-3.5 w-3.5 sm:h-3 sm:w-3 fill-current" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={cancelSpeech}
                    className="h-7 w-7 sm:h-6 sm:w-6 rounded-md hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Stop read aloud completely"
                    aria-label="Stop read aloud completely"
                  >
                    <Square className="h-3.5 w-3.5 sm:h-3 sm:w-3 fill-current" />
                  </button>

                  <span className="hidden sm:inline-block h-3.5 w-[1px] bg-slate-200 shrink-0" />

                  {/* Icon-only Mute button on sm: and up */}
                  <button
                    type="button"
                    onClick={() => setAudioMuted(!audioState.isMuted)}
                    className="hidden sm:flex h-7 w-7 sm:h-6 sm:w-6 rounded-md hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 items-center justify-center transition-colors cursor-pointer shrink-0"
                    title={audioState.isMuted ? "Audio muted (Click to unmute)" : "Audio active (Click to mute)"}
                    aria-label={audioState.isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {audioState.isMuted ? (
                      <VolumeX className="h-3.5 w-3.5 text-red-600" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (audioState.isMuted) {
                        setAudioMuted(false);
                        const speechLocale = currentLanguageOption.speechLocale;
                        const msg =
                          AUDIO_ENABLED_ANNOUNCEMENTS[speechLocale] ||
                          AUDIO_ENABLED_ANNOUNCEMENTS["en-IN"];
                        speakText(msg, speechLocale);
                      } else {
                        const speechLocale = currentLanguageOption.speechLocale;
                        const summaries = PAGE_SUMMARIES[pathname] || PAGE_SUMMARIES["/"];
                        const text = summaries[speechLocale] || summaries["en-IN"];
                        speakText(text, speechLocale);
                      }
                    }}
                    className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap px-1 sm:px-1.5 shrink-0"
                    title={audioState.isMuted ? "Audio is muted. Click to unmute" : "Read aloud page summary"}
                    aria-label={audioState.isMuted ? "Unmute audio" : "Read aloud page"}
                  >
                    {audioState.isMuted ? (
                      <>
                        <VolumeX className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-red-500 shrink-0" />
                        <span className="hidden md:inline notranslate" translate="no">Audio Off</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-slate-600 hover:text-amber-700 shrink-0" />
                        <span className="hidden md:inline notranslate" translate="no">Audio On</span>
                      </>
                    )}
                  </button>

                  {!audioState.isMuted && (
                    <button
                      type="button"
                      onClick={() => {
                        const speechLocale = currentLanguageOption.speechLocale;
                        const summaries = PAGE_SUMMARIES[pathname] || PAGE_SUMMARIES["/"];
                        const text = summaries[speechLocale] || summaries["en-IN"];
                        speakText(text, speechLocale);
                      }}
                      className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-0.5 sm:py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Read aloud page summary in selected language"
                    >
                      <Volume2 className="h-3 w-3 text-amber-700 shrink-0" />
                      <span className="notranslate" translate="no">
                        {currentLanguageOption.code === "hi"
                          ? "सुनें"
                          : currentLanguageOption.code === "mr"
                          ? "ऐका"
                          : currentLanguageOption.code === "gu"
                          ? "સાંભળો"
                          : currentLanguageOption.code === "ta"
                          ? "கேட்க"
                          : currentLanguageOption.code === "te"
                          ? "వినండి"
                          : currentLanguageOption.code === "bn"
                          ? "শুনুন"
                          : currentLanguageOption.code === "kn"
                          ? "ಕೇಳಿ"
                          : currentLanguageOption.code === "pa"
                          ? "ਸੁਣੋ"
                          : "Listen"}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Offline Alert */}
            {!isOnline && (
              <div
                className="flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium bg-amber-50 text-amber-800 border-amber-300 shadow-2xs whitespace-nowrap shrink-0"
                title="Internet connection is offline"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}

            {/* Language Dropdown */}
            <LanguageDropdown />

            {/* Profile Button - Hidden on mobile (< sm) because it is elevated in the slide-over drawer */}
            <button
              type="button"
              onClick={() => {
                setProfile(getStoredApplicantProfile());
                setShowProfileModal(true);
              }}
              className="hidden sm:flex w-8 h-8 rounded-full border border-slate-300 hover:border-slate-400 items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              title="View & Edit Beneficiary Applicant Profile"
              aria-label="View & Edit Beneficiary Applicant Profile"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Mobile / Tablet Menu Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden w-8 h-8 rounded-full border border-slate-300 hover:border-slate-400 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 shadow-xl space-y-4 relative animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 sm:my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Beneficiary Applicant Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Data auto-populates your pre-screened application dossier and matching criteria
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Caste Category
                  </label>
                  <select
                    value={profile.casteCategory}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        casteCategory: e.target.value as ApplicantProfileData["casteCategory"],
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Scheduled Caste (SC)">Scheduled Caste (SC)</option>
                    <option value="SC - Women Entrepreneur">SC - Women Entrepreneur</option>
                    <option value="SC - Safai Karamchari">SC - Safai Karamchari</option>
                    <option value="SC - Student">SC - Student</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Certified Annual Income
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={1500000}
                    value={profile.annualIncome}
                    onChange={(e) =>
                      setProfile({ ...profile, annualIncome: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 tabular-nums focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Caste Certificate No.
                  </label>
                  <input
                    type="text"
                    value={profile.casteCertificateNo}
                    onChange={(e) =>
                      setProfile({ ...profile, casteCertificateNo: e.target.value })
                    }
                    placeholder="e.g. UP-SC-2024-892182"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 tabular-nums focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.contactPhone}
                    onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 tabular-nums focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Proposed Enterprise / Trade Activity
                </label>
                <input
                  type="text"
                  value={profile.enterpriseActivity}
                  onChange={(e) =>
                    setProfile({ ...profile, enterpriseActivity: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {saveSuccess && "Profile saved and synced successfully"}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-mosje-navy hover:bg-slate-800 text-amber-300 font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer text-sm"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Profile</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile & Tablet Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
          <div className="fixed inset-y-0 right-0 max-w-xs sm:max-w-sm w-full bg-white shadow-2xl flex flex-col z-50 border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="SchemeSetu Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  SchemeSetu
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close Navigation Menu"
                aria-label="Close Navigation Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Links Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Beneficiary Profile Summary Card for Mobile */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-amber-500/15 text-amber-700 rounded-xl">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block leading-tight">
                        {profile.fullName || "Beneficiary Applicant"}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {profile.casteCategory}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfile(getStoredApplicantProfile());
                      setShowProfileModal(true);
                    }}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Read Aloud Voice:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextMuted = !audioState.isMuted;
                      setAudioMuted(nextMuted);
                      if (!nextMuted) {
                        const speechLocale = currentLanguageOption.speechLocale;
                        const msg =
                          AUDIO_ENABLED_ANNOUNCEMENTS[speechLocale] ||
                          AUDIO_ENABLED_ANNOUNCEMENTS["en-IN"];
                        speakText(msg, speechLocale);
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-colors cursor-pointer ${
                      audioState.isMuted
                        ? "bg-slate-200 text-slate-600"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {audioState.isMuted ? "Disabled" : "Active"}
                  </button>
                </div>
              </div>

              {/* Section 1: Main Portals */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Portal Navigation
                </span>
                <nav className="space-y-1">
                  {[
                    { href: "/", label: "Scheme Recommender", icon: BookOpen, desc: "AI-guided affirmative matching" },
                    { href: "/calculator", label: "EMI Calculator", icon: Calculator, desc: "Moratorium & repayment schedule" },
                    { href: "/locator", label: "Partner Locator", icon: MapPin, desc: "Solvent SCAs & bank branches" },
                    { href: "/dossier", label: "Application Dossier", icon: FileText, desc: "Verifiable QR application slip" },
                    { href: "/assistant", label: "AI Assistant", icon: MessageSquareText, desc: "Vernacular voice & chat agent" },
                    { href: "/admin", label: "MoSJE Admin", icon: Landmark, desc: "Institutional queue & governance" },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-amber-50 text-amber-950 border border-amber-200/80 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-lg ${isActive ? "bg-amber-200/60 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="block text-xs">{item.label}</span>
                            <span className="block text-[10px] text-slate-400 font-normal">{item.desc}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Section 2: Beneficiary Services */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Citizen Services
                </span>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfile(getStoredApplicantProfile());
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs">Beneficiary Profile</span>
                        <span className="block text-[10px] text-slate-400 font-normal">Edit personal &amp; income details</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <Link
                    href="/helpdesk"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      pathname === "/helpdesk"
                        ? "bg-amber-50 text-amber-950 border border-amber-200/80 font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs">Helpdesk &amp; Grievances</span>
                        <span className="block text-[10px] text-slate-400 font-normal">Toll-free 1800-11-2001 support</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Section 3: Statutory Policies */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Statutory Policies
                </span>
                <div className="flex items-center space-x-3 text-xs text-slate-500 pl-1">
                  <Link
                    href="/privacy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span>&bull;</span>
                  <Link
                    href="/terms"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50 text-center space-y-1">
              <p className="text-[11px] font-semibold text-slate-700">
                Ministry of Social Justice &amp; Empowerment
              </p>
              <p className="text-[10px] text-slate-400">
                National Scheduled Castes Finance &amp; Development Corporation
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
