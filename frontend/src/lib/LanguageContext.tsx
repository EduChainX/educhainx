"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    dashboard: "Dashboard",
    marketplace: "Marketplace",
    certificates: "Certificates",
    my_identity: "My Identity",
    instructor: "Instructor",
    chat: "Chat",
    settings: "Settings",
    explore: "Explore",
    how_it_works: "How It Works",
    verification: "Verification",
    disconnect: "Disconnect",
    // Landing Page
    landing_title: "Nigerian university credentials, impossible to fake or lose.",
    landing_subtitle: "EduChainX anchors academic identities and credentials to the Solana blockchain, making degree verification instant and fraud-proof.",
    get_started: "Get Started",
    verify_now: "Verify Now",
    why_educhain: "Why EduChainX?",
    // Settings Page
    settings_title: "Settings",
    settings_subtitle: "Manage your preferences, identity, and account.",
    language: "Language",
    choose_language: "Choose your preferred language.",
    appearance: "Appearance",
    switch_appearance: "Switch between light and dark mode.",
    notifications: "Notifications",
    notify_desc: "Get notified about new certificates and messages in this browser.",
    account: "Account",
    disconnect_desc: "Disconnect your wallet and manage your account.",
    // Onboarding
    matric_verif: "Matriculation Verification",
    enter_matric: "Enter your university-issued matriculation number to begin verification.",
    matric_num: "Matric Number",
    did_gen: "DID Generation",
    wallet_binding: "Wallet Binding",
    role_selection: "Role Selection",
  },
  Français: {
    dashboard: "Tableau de bord",
    marketplace: "Marché",
    certificates: "Certificats",
    my_identity: "Mon identité",
    instructor: "Instructeur",
    chat: "Discussion",
    settings: "Paramètres",
    explore: "Explorer",
    how_it_works: "Comment ça marche",
    verification: "Vérification",
    disconnect: "Déconnexion",
    landing_title: "Diplômes universitaires nigérians, impossibles à falsifier ou à perdre.",
    landing_subtitle: "EduChainX ancres les identités et diplômes académiques sur la blockchain Solana, rendant la vérification instantanée et infalsifiable.",
    get_started: "Commencer",
    verify_now: "Vérifier maintenant",
    why_educhain: "Pourquoi EduChainX?",
    settings_title: "Paramètres",
    settings_subtitle: "Gérez vos préférences, votre identité et votre compte.",
    language: "Langue",
    choose_language: "Choisissez votre langue préférée.",
    appearance: "Apparence",
    switch_appearance: "Basculez entre le mode clair et le mode sombre.",
    notifications: "Notifications",
    notify_desc: "Soyez informé des nouveaux certificats et messages dans ce navigateur.",
    account: "Compte",
    disconnect_desc: "Déconnectez votre portefeuille et gérez votre compte.",
    matric_verif: "Vérification d'immatriculation",
    enter_matric: "Entrez votre numéro d'immatriculation universitaire pour commencer.",
    matric_num: "Numéro d'immatriculation",
    did_gen: "Génération de DID",
    wallet_binding: "Liaison du portefeuille",
    role_selection: "Sélection du rôle",
  },
  Español: {
    dashboard: "Panel de control",
    marketplace: "Mercado",
    certificates: "Certificados",
    my_identity: "Mi Identidad",
    instructor: "Instructor",
    chat: "Chat",
    settings: "Configuración",
    explore: "Explorar",
    how_it_works: "Cómo funciona",
    verification: "Verificación",
    disconnect: "Desconectar",
    // Landing Page
    landing_title: "Credenciales de universidades nigerianas, imposibles de falsificar o perder.",
    landing_subtitle: "EduChainX ancla las identidades y credenciales académicas en la blockchain de Solana, haciendo que la verificación de títulos sea instantánea y libre de fraudes.",
    get_started: "Empezar",
    verify_now: "Verificar ahora",
    why_educhain: "¿Por qué EduChainX?",
    // Settings Page
    settings_title: "Configuración",
    settings_subtitle: "Administra tus preferencias, identidad y cuenta.",
    language: "Idioma",
    choose_language: "Elige tu idioma preferido.",
    appearance: "Apariencia",
    switch_appearance: "Cambiar entre modo claro y oscuro.",
    notifications: "Notificaciones",
    notify_desc: "Recibe notificaciones sobre nuevos certificados y mensajes en este navegador.",
    account: "Cuenta",
    disconnect_desc: "Desconecta tu billetera y administra tu cuenta.",
    // Onboarding
    matric_verif: "Verificación de Matrícula",
    enter_matric: "Ingresa tu número de matrícula emitido por la universidad para comenzar la verificación.",
    matric_num: "Número de Matrícula",
    did_gen: "Generación de DID",
    wallet_binding: "Vinculación de Billetera",
    role_selection: "Selección de Rol",
  },
  Yorùbá: {
    dashboard: "Dashboard",
    marketplace: "Ojú Ojà",
    certificates: "Àwọn Ẹ̀rí",
    my_identity: "Idanimọ Mi",
    instructor: "Olùkọ́",
    chat: "Spọ̀rọ̀",
    settings: "Ètò",
    explore: "Ye Wò",
    how_it_works: "Bí Ó Ti Ń Rìn",
    verification: "Ìmúdájú",
    disconnect: "Ge Asopọ",
    landing_title: "Awọn iwe-ẹri ile-ẹkọ giga ti Nigeria, ko ṣee ṣe lati eke tabi sọnu.",
    landing_subtitle: "EduChainX n fi awọn idanimọ ile-ẹkọ ati awọn iwe-ẹri pamọ si Solana blockchain, ṣiṣe idaniloju alefa lẹsẹkẹsẹ ati laisi jegudujera.",
    get_started: "Bẹ̀rẹ̀ Nísinsìnyí",
    verify_now: "Dán An Wò",
    why_educhain: "Kí Nìdí EduChainX?",
    settings_title: "Ètò",
    settings_subtitle: "Ṣakoso awọn ifẹ rẹ, idanimọ, ati akọọlẹ.",
    language: "Èdè",
    choose_language: "Yan èdè tí o fẹ́.",
    appearance: "Ìrísí",
    switch_appearance: "Yipada laarin imọlẹ ati dudu mode.",
    notifications: "Ìfitónilétí",
    notify_desc: "Gba itaniji nipa awọn iwe-ẹri tuntun ati awọn ifiranṣẹ ninu ẹrọ aṣawakiri yii.",
    account: "Àkọọlẹ",
    disconnect_desc: "Ge apamọwọ rẹ kuro ki o ṣakoso akọọlẹ rẹ.",
    matric_verif: "Ìmúdájú Nọ́ńbà Matric",
    enter_matric: "Tẹ nọmba matric ile-ẹkọ giga rẹ lati bẹrẹ.",
    matric_num: "Nọ́ńbà Matric",
    did_gen: "Ìdásílẹ̀ DID",
    wallet_binding: "Dídá Apamọwọ Pọ̀",
    role_selection: "Yíyàn Ipa",
  },
  Hausa: {
    dashboard: "Dashboard",
    marketplace: "Kasuwa",
    certificates: "Takaddun Shaida",
    my_identity: "Halin Hujja Ta",
    instructor: "Malami",
    chat: "Hira",
    settings: "Saituna",
    explore: "Bincika",
    how_it_works: "Yadda Yake Aiki",
    verification: "Tabbatarwa",
    disconnect: "Cire Haɗin",
    landing_title: "Takaddun shaida na jami'ar Najeriya, ba zai yiwu a yi jabun su ba ko asara.",
    landing_subtitle: "EduChainX yana adana bayanan ilimi da takaddun shaida akan Solana blockchain, yana sa tabbatar da digiri nan take kuma marar zamba.",
    get_started: "Fara Yanzu",
    verify_now: "Tabbatar Yanzu",
    why_educhain: "Me yasa EduChainX?",
    settings_title: "Saituna",
    settings_subtitle: "Sarrafa abubuwan da kuke so, ainihi, da asusunku.",
    language: "Harshe",
    choose_language: "Zaɓi harshen da kuka fi so.",
    appearance: "Bayyanar",
    switch_appearance: "Sauya tsakanin haske da duhu.",
    notifications: "Sanarwa",
    notify_desc: "Sami sanarwa game da sabbin takaddun shaida da saƙonni a cikin wannan mai binciken.",
    account: "Asusu",
    disconnect_desc: "Cire haɗin walat ɗin ku kuma sarrafa asusun ku.",
    matric_verif: "Tabbatar da Lambar Matric",
    enter_matric: "Shigar da lambar matric ta jami'a don fara tabbatarwa.",
    matric_num: "Lambar Matric",
    did_gen: "Kirkirar DID",
    wallet_binding: "Haɗa Walat",
    role_selection: "Zabin Matsayi",
  },
  Igbo: {
    dashboard: "Dashboard",
    marketplace: "Ahịa",
    certificates: "Asambodo",
    my_identity: "Njirimara M",
    instructor: "Onye Nkụzi",
    chat: "Nkata",
    settings: "Ntọala",
    explore: "Chọgharịa",
    how_it_works: "Otu O Si Arụ Ọrụ",
    verification: "Nkwenye",
    disconnect: "Kwụpụ Njikọ",
    landing_title: "Asambodo mahadum Nigeria, agaghị ekwe omume imepụta adịgboroja ma ọ bụ tufuo.",
    landing_subtitle: "EduChainX na-echekwa njirimara agụmakwụkwọ na asambodo na Solana blockchain, na-eme nkwenye asambodo ozugbo na enweghị aghụghọ.",
    get_started: "Biri Maka Amalite",
    verify_now: "Nyochaa Ugbu a",
    why_educhain: "Gịnị kpatara EduChainX?",
    settings_title: "Ntọala",
    settings_subtitle: "Jikwaa mmasị gị, njirimara gị, na akaụntụ gị.",
    language: "Asụsụ",
    choose_language: "Họrọ asụsụ kacha mma gị.",
    appearance: "Ọdịdị",
    switch_appearance: "Gbanwee n'etiti ọkụ na ọchịchịrị.",
    notifications: "Ịma Ọkwa",
    notify_desc: "Nweta ọkwa gbasara asambodo ọhụrụ na ozi na ihe nchọgharị a.",
    account: "Akaụntụ",
    disconnect_desc: "Kwụpụ obere akpa gị ma jikwaa akaụntụ gị.",
    matric_verif: "Nkwenye Nọmba Matric",
    enter_matric: "Tinye nọmba matric mahadum gị ka ịmalite nkwenye.",
    matric_num: "Nọmba Matric",
    did_gen: "Nbudata DID",
    wallet_binding: "Njikọ Akpa Ego",
    role_selection: "Nhọrọ Ọrụ",
  },
  Kiswahili: {
    dashboard: "Kompyuta",
    marketplace: "Soko",
    certificates: "Vyeti",
    my_identity: "Utambulisho Wangu",
    instructor: "Mkufunzi",
    chat: "Gumzo",
    settings: "Mipangilio",
    explore: "Vinjari",
    how_it_works: "Inavyofanya Kazi",
    verification: "Uthibitishaji",
    disconnect: "Ondoa Muunganisho",
    landing_title: "Vyeti vya chuo kikuu cha Nigeria, ambavyo haviwezi kughushiwa au kupotea.",
    landing_subtitle: "EduChainX inahifadhi vitambulisho vya kitaaluma na vyeti kwenye blockchain ya Solana, na kufanya uthibitishaji wa digrii kuwa wa papo hapo na usio na udanganyifu.",
    get_started: "Anza Sasa",
    verify_now: "Thibitisha Sasa",
    why_educhain: "Kwa nini EduChainX?",
    settings_title: "Mipangilio",
    settings_subtitle: "Dhibiti mapendeleo yako, utambulisho na akaunti yako.",
    language: "Lugha",
    choose_language: "Chagua lugha unayopendelea.",
    appearance: "Muonekano",
    switch_appearance: "Badilisha kati ya hali ya mwanga na giza.",
    notifications: "Arifa",
    notify_desc: "Pata arifa kuhusu vyeti vipya na ujumbe kwenye kivinjari hiki.",
    account: "Akaunti",
    disconnect_desc: "Tenganisha mkoba wako na udhibiti akaunti yako.",
    matric_verif: "Uthibitishaji wa Matric",
    enter_matric: "Weka nambari yako ya matric ya chuo kikuu ili kuanza uthibitishaji.",
    matric_num: "Nambari ya Matric",
    did_gen: "Uzalishaji wa DID",
    wallet_binding: "Kufunga Mkoba",
    role_selection: "Uteuzi wa Jukumu",
  },
  العربية: {
    dashboard: "لوحة التحكم",
    marketplace: "المتجر",
    certificates: "الشهادات",
    my_identity: "هويتي",
    instructor: "المعلم",
    chat: "المحادثة",
    settings: "الإعدادات",
    explore: "استكشف",
    how_it_works: "كيف يعمل",
    verification: "التحقق",
    disconnect: "قطع الاتصال",
    landing_title: "الشهادات الجامعية النيجيرية، مستحيل تزويرها أو فقدانها.",
    landing_subtitle: "يقوم EduChainX بإنشاء الهويات الأكاديمية والشهادات وتأمينها على شبكة سولانا البلوكشين، مما يجعل التحقق من الدرجة فوريًا ومقاومًا للاحتيال.",
    get_started: "ابدأ الآن",
    verify_now: "تحقق الآن",
    why_educhain: "لماذا EduChainX؟",
    settings_title: "الإعدادات",
    settings_subtitle: "إدارة تفضيلاتك وهويتك وحسابك.",
    language: "اللغة",
    choose_language: "اختر لغتك المفضلة.",
    appearance: "المظهر",
    switch_appearance: "التبديل بين المظهر الفاتح والداكن.",
    notifications: "الإشعارات",
    notify_desc: "احصل على إشعارات بشأن الشهادات والرسائل الجديدة في هذا المتصفح.",
    account: "الحساب",
    disconnect_desc: "اقطع اتصال محفظتك وقم بإدارة حسابك.",
    matric_verif: "التحقق من رقم التسجيل",
    enter_matric: "أدخل رقم التسجيل الجامعي الخاص بك لبدء التحقق.",
    matric_num: "رقم التسجيل",
    did_gen: "توليد الهوية اللامركزية (DID)",
    wallet_binding: "ربط المحفظة",
    role_selection: "تحديد الدور",
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<string>("English");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_language");
    if (saved && TRANSLATIONS[saved]) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: string) => {
    if (TRANSLATIONS[lang]) {
      setLangState(lang);
      localStorage.setItem("preferred_language", lang);
    }
  };

  const t = (key: string, fallback: string): string => {
    if (!mounted) return fallback;
    const dictionary = TRANSLATIONS[language];
    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
