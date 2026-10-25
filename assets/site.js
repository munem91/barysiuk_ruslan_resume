/* Ruslan Barysiuk — resume hub. Vanilla JS, no dependencies.
   One state for the whole site and the embedded resume: { lang: en|ru|uk|be|kk|es|fr|zh|hi|ar, theme: light|dark }.
   Priority: ?lang= → the page's own language (en.html, ru.html, … ar.html) → localStorage (explicit choices only)
   → browser language / OS theme; theme: ?theme= → localStorage → OS.
   The inline script in <head> resolves it before first paint; this file wires up the UI. */
(() => {
  'use strict';
  const d = document.documentElement;
  const STATIC = d.getAttribute('data-static-lang') || 'ru';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mm = (q) => window.matchMedia(q);
  const mqReduce = mm('(prefers-reduced-motion: reduce)');
  const mqDark = mm('(prefers-color-scheme: dark)');
  const mqCarousel = mm('(max-width: 599px)');
  const STORE = 'rb-prefs';
  const EMAIL = 'borisukrusaln12345@gmail.com';
  const GH_FIRST = Date.UTC(2025, 9, 19); // Sunday; 53 weeks x 7 days, "x" = future
  const GH = '00111101110110011101100021340132134001310001221101021100301322003101100010000011131030111100111111111111101111100111111011111111111110011111111011101121200111101011111111111111211121201102001111100101111110111110212110132211120211021110010101111000010001210010021121100100100110100100000010011010000000140021002110000011110000000000000000000000000000000000001010000000xxx';

  const TAG = { en: 'EN', ru: 'RU', uk: 'UKR', be: 'BEL', kk: 'KAZ', es: 'ES', fr: 'FR', zh: 'ZH', hi: 'HI', ar: 'AR' };
  const RTL = ['ar'];
  const variants = (light, dark) => Object.fromEntries(Object.entries(TAG).flatMap(([l, tag]) => [[`${l}-light`, `${tag}, ${light}`], [`${l}-dark`, `${tag}, ${dark}`]]));
  const UI = {
    ru: {
      title: 'Руслан Борисюк — резюме Senior Flutter-разработчика (iOS, Android)',
      desc: 'Резюме Руслана Борисюка: Senior Flutter-разработчик (Flutter developer), мобильный разработчик iOS и Android, 5 лет коммерческого опыта. Открыт к удалённой работе.',
      months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      days: ['Пн', 'Ср', 'Пт'],
      variant: variants('светлая', 'тёмная'),
      announce: (l, t) => `Версия резюме: ${{ en: 'английский', ru: 'русский', uk: 'украинский', be: 'белорусский', kk: 'казахский', es: 'испанский', fr: 'французский', zh: 'китайский', hi: 'хинди', ar: 'арабский' }[l]}, ${t === 'dark' ? 'тёмная' : 'светлая'} тема`,
      email: 'Email скопирован', link: 'Ссылка скопирована', fail: 'Не получилось скопировать'
    },
    en: {
      title: 'Ruslan Barysiuk — Senior Flutter Developer Resume (iOS, Android)',
      desc: 'Resume of Ruslan Barysiuk, Senior Flutter and mobile developer: 5 years of iOS and Android apps, from estimate to App Store and Google Play release. Open to remote work.',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days: ['Mon', 'Wed', 'Fri'],
      variant: variants('light', 'dark'),
      announce: (l, t) => `Resume version: ${{ en: 'English', ru: 'Russian', uk: 'Ukrainian', be: 'Belarusian', kk: 'Kazakh', es: 'Spanish', fr: 'French', zh: 'Chinese', hi: 'Hindi', ar: 'Arabic' }[l]}, ${t} theme`,
      email: 'Email copied', link: 'Link copied', fail: 'Could not copy'
    },
    uk: {
      title: 'Руслан Борисюк — резюме Senior Flutter Developer (iOS, Android)',
      desc: 'Резюме Руслана Борисюка: Senior Flutter Developer, розробник мобільних додатків для iOS та Android, 5 років комерційного досвіду. Відкритий до віддаленої роботи.',
      months: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'],
      days: ['Пн', 'Ср', 'Пт'],
      variant: variants('світла', 'темна'),
      announce: (l, t) => `Версія резюме: ${{ en: 'англійська', ru: 'російська', uk: 'українська', be: 'білоруська', kk: 'казахська', es: 'іспанська', fr: 'французька', zh: 'китайська', hi: 'гінді', ar: 'арабська' }[l]}, ${t === 'dark' ? 'темна' : 'світла'} тема`,
      email: 'Email скопійовано', link: 'Посилання скопійовано', fail: 'Не вдалося скопіювати'
    },
    be: {
      title: 'Руслан Барысюк — рэзюмэ Senior Flutter-распрацоўшчыка (iOS, Android)',
      desc: 'Рэзюмэ Руслана Барысюка: Senior Flutter-распрацоўшчык (Flutter developer), мабільны распрацоўшчык iOS і Android, 5 гадоў камерцыйнага досведу. Адкрыты да аддаленай працы.',
      months: ['сту', 'лют', 'сак', 'кра', 'тра', 'чэр', 'ліп', 'жні', 'вер', 'кас', 'ліс', 'сне'],
      days: ['Пн', 'Ср', 'Пт'],
      variant: variants('светлая', 'цёмная'),
      announce: (l, t) => `Версія рэзюмэ: ${{ en: 'англійская', ru: 'руская', uk: 'украінская', be: 'беларуская', kk: 'казахская', es: 'іспанская', fr: 'французская', zh: 'кітайская', hi: 'хіндзі', ar: 'арабская' }[l]}, ${t === 'dark' ? 'цёмная' : 'светлая'} тэма`,
      email: 'Email скапіяваны', link: 'Спасылка скапіявана', fail: 'Не атрымалася скапіяваць'
    },
    kk: {
      title: 'Руслан Борисюк — Senior Flutter-әзірлеуші түйіндемесі (iOS, Android)',
      desc: 'Руслан Борисюктің түйіндемесі: Senior Flutter-әзірлеуші (Flutter developer), iOS және Android мобильді әзірлеушісі, 5 жыл коммерциялық тәжірибе. Қашықтан жұмысқа ашық.',
      months: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
      days: ['Дс', 'Ср', 'Жм'],
      variant: variants('ашық', 'қараңғы'),
      announce: (l, t) => `Түйіндеме нұсқасы: ${{ en: 'ағылшынша', ru: 'орысша', uk: 'украинша', be: 'беларусша', kk: 'қазақша', es: 'испанша', fr: 'французша', zh: 'қытайша', hi: 'хинди тілі', ar: 'арабша' }[l]}, ${t === 'dark' ? 'қараңғы' : 'ашық'} тақырып`,
      email: 'Email көшірілді', link: 'Сілтеме көшірілді', fail: 'Көшіру мүмкін болмады'
    },
    es: {
      title: 'Ruslan Barysiuk — Currículum de Desarrollador Flutter Senior (iOS, Android)',
      desc: 'Currículum de Ruslan Barysiuk, desarrollador Flutter Senior y desarrollador móvil: 5 años creando apps iOS y Android, de la estimación a la publicación en App Store y Google Play. Abierto a trabajo remoto.',
      months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
      days: ['lun', 'mié', 'vie'],
      variant: variants('claro', 'oscuro'),
      announce: (l, t) => `Versión del currículum: ${{ en: 'inglés', ru: 'ruso', uk: 'ucraniano', be: 'bielorruso', kk: 'kazajo', es: 'español', fr: 'francés', zh: 'chino', hi: 'hindi', ar: 'árabe' }[l]}, tema ${t === 'dark' ? 'oscuro' : 'claro'}`,
      email: 'Email copiado', link: 'Enlace copiado', fail: 'No se pudo copiar'
    },
    fr: {
      title: 'Ruslan Barysiuk — CV de développeur Flutter senior (iOS, Android)',
      desc: 'CV de Ruslan Barysiuk, développeur Flutter et mobile senior : 5 ans d’applis iOS et Android, du chiffrage à la publication sur l’App Store et Google Play. Disponible en télétravail.',
      months: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
      days: ['lun.', 'mer.', 'ven.'],
      variant: variants('clair', 'sombre'),
      announce: (l, t) => `Version du CV : ${{ en: 'Anglais', ru: 'Russe', uk: 'Ukrainien', be: 'Biélorusse', kk: 'Kazakh', es: 'Espagnol', fr: 'Français', zh: 'Chinois', hi: 'Hindi', ar: 'Arabe' }[l]}, thème ${t === 'dark' ? 'sombre' : 'clair'}`,
      email: 'E-mail copié', link: 'Lien copié', fail: 'Impossible de copier'
    },
    zh: {
      title: 'Ruslan Barysiuk — 高级 Flutter 开发工程师简历（iOS、Android）',
      desc: 'Ruslan Barysiuk 的简历，高级 Flutter 及移动端开发工程师：5 年 iOS 与 Android 应用开发经验，从工作量评估到 App Store 和 Google Play 上架。寻求远程工作机会。',
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      days: ['周一', '周三', '周五'],
      variant: variants('浅色', '深色'),
      announce: (l, t) => `简历版本：${{ en: '英语', ru: '俄语', uk: '乌克兰语', be: '白俄罗斯语', kk: '哈萨克语', es: '西班牙语', fr: '法语', zh: '中文', hi: '印地语', ar: '阿拉伯语' }[l]}，${t === 'dark' ? '深色' : '浅色'}主题`,
      email: '邮箱已复制', link: '链接已复制', fail: '复制失败'
    },
    hi: {
      title: 'Ruslan Barysiuk — सीनियर Flutter डेवलपर का रिज़्यूमे (iOS, Android)',
      desc: 'Ruslan Barysiuk का रिज़्यूमे — सीनियर Flutter और मोबाइल डेवलपर: iOS और Android ऐप्स में 5 साल, एस्टिमेट से App Store और Google Play रिलीज़ तक। रिमोट काम के लिए उपलब्ध।',
      months: ['जन', 'फ़र', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'],
      days: ['सोम', 'बुध', 'शुक्र'],
      variant: variants('लाइट', 'डार्क'),
      announce: (l, t) => `रिज़्यूमे वर्ज़न: ${{ en: 'अंग्रेज़ी', ru: 'रूसी', uk: 'यूक्रेनी', be: 'बेलारूसी', kk: 'कज़ाख़', es: 'स्पेनिश', fr: 'फ़्रेंच', zh: 'चीनी', hi: 'हिन्दी', ar: 'अरबी' }[l]}, ${t === 'dark' ? 'डार्क' : 'लाइट'} थीम`,
      email: 'ईमेल कॉपी हो गया', link: 'लिंक कॉपी हो गया', fail: 'कॉपी नहीं हो सका'
    },
    ar: {
      title: 'Ruslan Barysiuk — سيرة ذاتية لمطوّر Flutter أول (iOS وAndroid)',
      desc: 'السيرة الذاتية لـ Ruslan Barysiuk، مطوّر Flutter أول ومطوّر تطبيقات جوال: 5 سنوات في تطوير تطبيقات iOS وAndroid، من التقدير حتى الإطلاق على App Store وGoogle Play. متاح للعمل عن بُعد.',
      months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      days: ['إثنين', 'أربعاء', 'جمعة'],
      variant: variants('فاتح', 'داكن'),
      announce: (l, t) => `نسخة السيرة الذاتية: ${{ en: 'الإنجليزية', ru: 'الروسية', uk: 'الأوكرانية', be: 'البيلاروسية', kk: 'الكازاخية', es: 'الإسبانية', fr: 'الفرنسية', zh: 'الصينية', hi: 'الهندية', ar: 'العربية' }[l]}، المظهر ${t === 'dark' ? 'الداكن' : 'الفاتح'}`,
      email: 'تم نسخ البريد الإلكتروني', link: 'تم نسخ الرابط', fail: 'تعذّر النسخ'
    }
  };

  /* Copy for EN / UK / BE / KK. Russian is the default markup and is read back from the DOM. */
  const EN = {
    skip: 'Skip to content',
    brandLabel: 'Ruslan Barysiuk, back to top',
    name: 'Ruslan Barysiuk',
    navLabel: 'Sections',
    navApps: 'Apps',
    navResume: 'Resume',
    navContacts: 'Contact',
    langLegendSite: 'Language of the site and resume',
    themeLegendSite: 'Theme of the site and resume',
    light: 'Light',
    dark: 'Dark',
    chip: 'Open to work · remote · GMT+7',
    role: 'Senior Flutter<br>Developer',
    lead: 'I take iOS and Android apps from estimates and a&nbsp;roadmap to release on the App Store and Google&nbsp;Play.',
    ctaTg: 'Message on Telegram',
    ctaEmail: 'Copy email',
    copiedEmail: 'Email copied',
    ctaPdf: 'Download resume PDF',
    artLabel: 'Portrait and app screenshots: Healthy4u, ProveUp, document scanner',
    openToWork: 'Open to work',
    altPuKits: 'ProveUp: avatar gear',
    altScCamera: 'Document scanner: camera with scan modes',
    altH4uInsights: 'Healthy4u: weekly health trends',
    altH4uPaywall: 'Healthy4u: subscription paywall',
    altPuCoach: 'ProveUp: coach screen',
    altH4uHome: 'Healthy4u: AI assistant home screen',
    altPuHome: 'ProveUp: home screen with the player avatar',
    f1n: '5 <span>years</span>',
    f1l: 'of commercial development',
    f2n: '6 <span>apps</span>',
    f2l: 'in the App&nbsp;Store and Google&nbsp;Play',
    f3n: '1.5 <span>months</span>',
    f3l: 'from audit to release of a stalled project',
    f4n: '1,014',
    f4l: 'GitHub contributions in the last&nbsp;year',
    appsTitle: 'Apps',
    appsLead: 'Flutter apps that feel native: subscriptions, health data from watches, real-time video, computer vision.',
    h4uSub: 'AI health assistant',
    h4uDates: 'June 2025 – September 2026',
    h4uRole: 'Rewrote it from Swift to Flutter · sole mobile developer for 15 months',
    h4uText: 'Health data from watches: HealthKit (40+ types), Health Connect and a&nbsp;watchOS prototype in SwiftUI. Native subscriptions with StoreKit&nbsp;2 and Google Play Billing, validated on the server together with the backend developer.',
    altH4uSync: 'Healthy4u: Apple Health data sync',
    altH4uChat: 'Healthy4u: the AI chat logs meals',
    altH4uNutrition: 'Healthy4u: daily nutrition progress',
    altH4uVoice: 'Healthy4u: assistant voice settings',
    puSub: 'Fitness battles and freestyle football',
    puDates: 'May – September 2026, contract',
    puText: 'Computer vision counts reps right from the camera; real-time video on LiveKit and WebRTC.',
    puBuild: 'TestFlight build',
    altPuBattle: 'ProveUp: battle arena',
    altPuRanking: 'ProveUp: player ranking',
    altPuCamera: 'ProveUp: the camera detects the exercise',
    scTitle: 'Document Scanner &amp; PDF&nbsp;Editor',
    scDates: 'September – October 2026, contract',
    scText: 'Joined a stalled project and took it from audit to release in 1.5&nbsp;months. Native camera SDKs, on-device ML and OCR with ONNX Runtime and OpenCV. Subscriptions on RevenueCat.',
    altScPin: 'Scanner: PIN-protected folder',
    altScProfile: 'Scanner: profile and PRO subscription',
    altScCamera2: 'Scanner: camera with scan modes',
    earlyTitle: 'Projects 2022–2025',
    earlySub: 'Marketplaces, a hiring service and a&nbsp;crypto wallet — in teams and solo',
    kAgro: 'agricultural classifieds',
    kKerla: 'classifieds marketplace',
    nRab: 'Rabotnik24',
    kRab: 'hiring platform',
    kSfera: 'social platform',
    kGyber: 'crypto wallet',
    altRab: 'Rabotnik24: welcome screen',
    altAgro: 'Agrotook: Google Play promo',
    altKerla: 'Kerla: listings feed',
    altGyber: 'Gyber Wallet: welcome screen',
    resumeTitle: 'Resume',
    resumeLead: 'Six A4 pages in ten languages, light and dark. The link and the PDF follow your choice.',
    langLegend: 'Language',
    themeLegend: 'Theme',
    dlPdf: 'Download PDF',
    allFiles: 'All files: PDF and DOCX',
    menuPdf: 'PDF, 6 pages',
    fRuLight: 'Russian, light',
    fRuDark: 'Russian, dark',
    fEnLight: 'English, light',
    fEnDark: 'English, dark',
    fUkLight: 'Ukrainian, light',
    fUkDark: 'Ukrainian, dark',
    fBeLight: 'Belarusian, light',
    fBeDark: 'Belarusian, dark',
    fKkLight: 'Kazakh, light',
    fKkDark: 'Kazakh, dark',
    fEsLight: 'Spanish, light',
    fEsDark: 'Spanish, dark',
    fFrLight: 'French, light',
    fFrDark: 'French, dark',
    fZhLight: 'Chinese, light',
    fZhDark: 'Chinese, dark',
    fHiLight: 'Hindi, light',
    fHiDark: 'Hindi, dark',
    fArLight: 'Arabic, light',
    fArDark: 'Arabic, dark',
    menuAts: 'For ATS: single column, DOCX',
    fAtsRu: 'Russian',
    fAtsEn: 'English',
    copyLink: 'Copy link to this version',
    copiedLink: 'Link copied',
    pagesLabel: 'Resume pages',
    pagesTitle: 'Pages',
    p1: 'Overview',
    p2: 'Experience',
    p4: 'ProveUp and scanner',
    p5: 'Projects 2022–2025',
    p6: 'Tech stack',
    pg1: 'Page 1 of 6', pg2: 'Page 2 of 6', pg3: 'Page 3 of 6', pg4: 'Page 4 of 6', pg5: 'Page 5 of 6', pg6: 'Page 6 of 6',
    if1: 'Resume, page 1 of 6', if2: 'Resume, page 2 of 6', if3: 'Resume, page 3 of 6',
    if4: 'Resume, page 4 of 6', if5: 'Resume, page 5 of 6', if6: 'Resume, page 6 of 6',
    openPage: 'Open page',
    ghTitle: 'GitHub activity',
    ghLead: 'Each square is one day of the last 12&nbsp;months. The darker, the more contributions.',
    ghBig: '1,014',
    ghCap: 'contributions in the last year',
    ghDays: '<strong>215</strong> active days',
    ghSince: 'On GitHub since <strong>2020</strong>',
    ghScroll: 'Activity graph, scrolls horizontally',
    ghAria: 'GitHub activity graph: 1,014 contributions and 215 active days in the last year',
    less: 'Less',
    more: 'More',
    contactsTitle: 'Contact',
    contactsLead: 'Telegram works best. Remote from Bangkok (GMT+7), full-time or part-time billed hourly.',
    copy: 'Copy',
    copied: 'Copied',
    phoneLabel: 'Phone and WhatsApp',
    openProfile: 'Open profile',
    note1: 'English B1, classes three times a week',
    note2: 'Recommendation letter from a previous employer on request',
    note3: 'AI agents in daily work for 1.5 years: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · updated Oct 2026',
    skillsTitle: 'What I bring',
    skillsLead: 'Flutter development with native iOS and Android integrations: from an MVP and a&nbsp;code audit to store release and support.',
    sk1t: 'Cross-platform apps in Flutter',
    sk1d: 'iOS and Android apps from a&nbsp;single Dart codebase: Clean Architecture, BLoC and Riverpod, and flavors that build several apps from the same code.',
    sk2t: 'Native iOS and Android',
    sk2d: 'Swift, SwiftUI and Kotlin where Flutter is not enough: platform channels, native SDKs, a&nbsp;watchOS prototype, Android&nbsp;13/14 permissions.',
    sk3t: 'Subscriptions and in-app purchases',
    sk3d: 'StoreKit&nbsp;2 and Google Play Billing with server-side validation, RevenueCat, paywalls and purchase restore. I&nbsp;get apps through App Store review.',
    sk4t: 'Health data and wearables',
    sk4d: 'HealthKit (40+ types) and Health Connect: data from watches and phones, sync, and Google Play review rules for health data.',
    sk5t: 'Video calls and AI features',
    sk5d: 'Video calls on WebRTC and LiveKit, streaming LLM responses over SSE and reading them aloud with text-to-speech.',
    sk6t: 'Camera, computer vision and OCR',
    sk6d: 'Native camera SDKs, document scanning, rep counting from the camera. On-device ML and OCR with no custom backend: ONNX Runtime, OpenCV, Tesseract.',
    sk7t: 'Code audits and project rescue',
    sk7d: 'I&nbsp;dig into inherited code, document the architecture and ship stalled projects: one went from audit to release in 1.5&nbsp;months.',
    sk8t: 'AI-native development',
    sk8d: 'Claude Code and Cursor every day for 1.5&nbsp;years: agent pipelines with an agent reviewer, Figma MCP. Used Dart MCP to remove 2,000+ unnecessary widget rebuilds.',
    hireT: '<strong>Available for hire:</strong> Senior Flutter Developer, Mobile Developer (Flutter) or Flutter Lead · full-time, part-time or contract · remote, GMT+7',
    toTop: 'Back to top'
  };


  const UK = {
    skip: 'Перейти до вмісту',
    brandLabel: 'Руслан Борисюк, на початок сторінки',
    name: 'Руслан Борисюк',
    navLabel: 'Розділи',
    navApps: 'Застосунки',
    navResume: 'Резюме',
    navContacts: 'Контакти',
    langLegendSite: 'Мова сайту й резюме',
    themeLegendSite: 'Тема сайту й резюме',
    light: 'Світла',
    dark: 'Темна',
    chip: 'Відкритий до пропозицій · віддалено · GMT+7',
    role: 'Senior Flutter-<br>розробник',
    lead: 'Доводжу мобільні застосунки для iOS та&nbsp;Android від&nbsp;оцінки й&nbsp;роадмапу до&nbsp;релізу в&nbsp;App&nbsp;Store і&nbsp;Google&nbsp;Play.',
    ctaTg: 'Написати в Telegram',
    ctaEmail: 'Скопіювати email',
    copiedEmail: 'Email скопійовано',
    ctaPdf: 'Завантажити резюме в PDF',
    artLabel: 'Портрет і скриншоти застосунків: Healthy4u, ProveUp, сканер документів',
    openToWork: 'Відкритий до пропозицій',
    altPuKits: 'ProveUp: екіпірування аватара',
    altScCamera: 'Сканер документів: камера з режимами зйомки',
    altH4uInsights: 'Healthy4u: тренди здоров’я за тиждень',
    altH4uPaywall: 'Healthy4u: екран підписки',
    altPuCoach: 'ProveUp: екран тренера',
    altH4uHome: 'Healthy4u: головний екран AI-асистента',
    altPuHome: 'ProveUp: головний екран з аватаром гравця',
    f1n: '5 <span>років</span>',
    f1l: 'у комерційній розробці',
    f2n: '6 <span>застосунків</span>',
    f2l: 'у App&nbsp;Store і Google&nbsp;Play',
    f3n: '1,5 <span>місяця</span>',
    f3l: 'від аудиту до релізу застряглого проєкту',
    f4n: '1&#8239;014',
    f4l: 'внесків на&nbsp;GitHub за&nbsp;останній рік',
    appsTitle: 'Застосунки',
    appsLead: 'Flutter-застосунки, які відчуваються нативними: підписки, дані з&nbsp;годинника, відео в&nbsp;реальному часі, комп’ютерний зір.',
    h4uSub: 'AI-асистент здоров’я',
    h4uDates: 'Червень 2025 — вересень 2026',
    h4uRole: 'Переписав зі&nbsp;Swift на&nbsp;Flutter · єдиний мобільний розробник 15&nbsp;місяців',
    h4uText: 'Дані з&nbsp;годинника: HealthKit (40+ типів), Health Connect і&nbsp;прототип для watchOS на&nbsp;SwiftUI. Нативні підписки StoreKit&nbsp;2 і&nbsp;Google Play Billing із&nbsp;серверною перевіркою&nbsp;— разом із&nbsp;бекенд-розробником.',
    altH4uSync: 'Healthy4u: синхронізація даних з Apple Health',
    altH4uChat: 'Healthy4u: AI-чат записує прийоми їжі',
    altH4uNutrition: 'Healthy4u: денний прогрес харчування',
    altH4uVoice: 'Healthy4u: вибір голосу асистента',
    puSub: 'Фітнес-батли й футбольний фристайл',
    puDates: 'Травень — вересень 2026, контракт',
    puText: 'Комп’ютерний зір рахує повторення просто з&nbsp;камери, відеозв’язок на&nbsp;LiveKit і&nbsp;WebRTC.',
    puBuild: 'Збірка в TestFlight',
    altPuBattle: 'ProveUp: батл-арена',
    altPuRanking: 'ProveUp: рейтинг гравців',
    altPuCamera: 'ProveUp: камера розпізнає вправу',
    scTitle: 'Сканер документів і&nbsp;PDF-редактор',
    scDates: 'Вересень — жовтень 2026, контракт',
    scText: 'Долучився до&nbsp;проєкту, що застряг, і&nbsp;за&nbsp;1,5 місяця довів його від&nbsp;аудиту до&nbsp;релізу. Нативні SDK камери, ML і&nbsp;OCR на&nbsp;пристрої: ONNX Runtime, OpenCV. Підписки на&nbsp;RevenueCat.',
    altScPin: 'Сканер: папка під PIN-кодом',
    altScProfile: 'Сканер: профіль і PRO-підписка',
    altScCamera2: 'Сканер: камера з режимами зйомки',
    earlyTitle: 'Проєкти 2022–2025',
    earlySub: 'Маркетплейси, сервіс найму й&nbsp;криптогаманець&nbsp;— у&nbsp;командах і&nbsp;соло',
    kAgro: 'дошка оголошень агроринку',
    kKerla: 'маркетплейс оголошень',
    nRab: 'РАБОТНИК24',
    kRab: 'пошук роботи й найм',
    kSfera: 'соціальна платформа',
    kGyber: 'криптогаманець',
    altRab: 'РАБОТНИК24: стартовий екран',
    altAgro: 'Agrotook: промо з Google Play',
    altKerla: 'Kerla: стрічка оголошень',
    altGyber: 'Gyber Wallet: стартовий екран',
    resumeTitle: 'Резюме',
    resumeLead: 'Шість сторінок A4 десятьма мовами, у&nbsp;світлій і&nbsp;темній темі. Посилання й&nbsp;PDF змінюються разом із&nbsp;вибором.',
    langLegend: 'Мова',
    themeLegend: 'Тема',
    dlPdf: 'Завантажити PDF',
    allFiles: 'Усі файли: PDF і DOCX',
    menuPdf: 'PDF, 6 сторінок',
    fRuLight: 'Російська, світла',
    fRuDark: 'Російська, темна',
    fEnLight: 'Англійська, світла',
    fEnDark: 'Англійська, темна',
    fUkLight: 'Українська, світла',
    fUkDark: 'Українська, темна',
    fBeLight: 'Білоруська, світла',
    fBeDark: 'Білоруська, темна',
    fKkLight: 'Казахська, світла',
    fKkDark: 'Казахська, темна',
    fEsLight: 'Іспанська, світла',
    fEsDark: 'Іспанська, темна',
    fFrLight: 'Французька, світла',
    fFrDark: 'Французька, темна',
    fZhLight: 'Китайська, світла',
    fZhDark: 'Китайська, темна',
    fHiLight: 'Гінді, світла',
    fHiDark: 'Гінді, темна',
    fArLight: 'Арабська, світла',
    fArDark: 'Арабська, темна',
    menuAts: 'Для ATS: одна колонка, DOCX',
    fAtsRu: 'Російська',
    fAtsEn: 'Англійська',
    copyLink: 'Скопіювати посилання на цю версію',
    copiedLink: 'Посилання скопійовано',
    pagesLabel: 'Сторінки резюме',
    pagesTitle: 'Сторінки',
    p1: 'Огляд',
    p2: 'Досвід роботи',
    p4: 'ProveUp і сканер',
    p5: 'Проєкти 2022–2025',
    p6: 'Технічний стек',
    pg1: 'Стор. 1 з 6', pg2: 'Стор. 2 з 6', pg3: 'Стор. 3 з 6', pg4: 'Стор. 4 з 6', pg5: 'Стор. 5 з 6', pg6: 'Стор. 6 з 6',
    if1: 'Резюме, стор. 1 з 6', if2: 'Резюме, стор. 2 з 6', if3: 'Резюме, стор. 3 з 6',
    if4: 'Резюме, стор. 4 з 6', if5: 'Резюме, стор. 5 з 6', if6: 'Резюме, стор. 6 з 6',
    openPage: 'Відкрити сторінку',
    ghTitle: 'Активність на GitHub',
    ghLead: 'Кожен квадрат&nbsp;— один день за&nbsp;останні 12&nbsp;місяців. Що темніший, то більше внесків.',
    ghBig: '1&#8239;014',
    ghCap: 'внесків за&nbsp;останній рік',
    ghDays: '<strong>215</strong> активних днів',
    ghSince: 'На&nbsp;GitHub з&nbsp;<strong>2020</strong> року',
    ghScroll: 'Графік активності, прокручується горизонтально',
    ghAria: 'Графік активності на GitHub: 1 014 внесків і 215 активних днів за останній рік',
    less: 'Менше',
    more: 'Більше',
    contactsTitle: 'Контакти',
    contactsLead: 'Найзручніше&nbsp;— Telegram. Працюю віддалено з&nbsp;Бангкока (GMT+7), full-time або part-time з&nbsp;погодинною оплатою.',
    copy: 'Скопіювати',
    copied: 'Скопійовано',
    phoneLabel: 'Телефон і WhatsApp',
    openProfile: 'Відкрити профіль',
    note1: 'Англійська B1, заняття тричі на&nbsp;тиждень',
    note2: 'Рекомендаційний лист від&nbsp;попереднього роботодавця&nbsp;— на&nbsp;запит',
    note3: 'AI-агенти в&nbsp;роботі щодня вже 1,5&nbsp;року: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · оновлено жовт.&nbsp;2026',
    skillsTitle: 'Чим буду корисний',
    skillsLead: 'Flutter-розробка з&nbsp;нативними інтеграціями для iOS та&nbsp;Android: від&nbsp;MVP і&nbsp;аудиту коду до&nbsp;релізу в&nbsp;сторах і&nbsp;підтримки.',
    sk1t: 'Кросплатформна розробка на&nbsp;Flutter',
    sk1d: 'Застосунки для iOS та&nbsp;Android з&nbsp;однієї кодової бази на&nbsp;Dart: Clean Architecture, BLoC і&nbsp;Riverpod, флейвори для збирання кількох застосунків з&nbsp;одного коду.',
    sk2t: 'Нативна розробка iOS та&nbsp;Android',
    sk2d: 'Swift, SwiftUI і&nbsp;Kotlin там, де&nbsp;Flutter не&nbsp;вистачає: Platform Channels, нативні SDK, прототип для watchOS, дозволи Android&nbsp;13/14.',
    sk3t: 'Підписки та&nbsp;вбудовані покупки',
    sk3d: 'StoreKit&nbsp;2 і&nbsp;Google Play Billing із&nbsp;серверною перевіркою, RevenueCat, пейволи та&nbsp;відновлення покупок. Проводжу застосунки через рев’ю App Store.',
    sk4t: 'Здоров’я та&nbsp;носимі пристрої',
    sk4d: 'HealthKit (40+ типів) і&nbsp;Health Connect: дані з&nbsp;годинника й&nbsp;телефона, синхронізація, вимоги рев’ю Google Play до&nbsp;даних про здоров’я.',
    sk5t: 'Відеозв’язок і&nbsp;AI-функції',
    sk5d: 'Відеодзвінки на&nbsp;WebRTC і&nbsp;LiveKit, стримінг відповідей LLM через SSE та&nbsp;їх&nbsp;озвучення (TTS).',
    sk6t: 'Камера, комп’ютерний зір і&nbsp;OCR',
    sk6d: 'Нативні SDK камери, сканування документів, підрахунок повторень із&nbsp;камери. ML і&nbsp;OCR на&nbsp;пристрої без власного бекенда: ONNX Runtime, OpenCV, Tesseract.',
    sk7t: 'Аудит і&nbsp;порятунок проєктів',
    sk7d: 'Розбираюся в&nbsp;чужому коді, документую архітектуру й&nbsp;доводжу застряглі проєкти до&nbsp;релізу: один такий випустив за&nbsp;1,5&nbsp;місяця.',
    sk8t: 'AI-native розробка',
    sk8d: 'Claude Code і&nbsp;Cursor щодня 1,5&nbsp;року: агентні пайплайни з&nbsp;агентом-рев’юером, Figma MCP. Через Dart MCP прибрав 2000+ зайвих перебудов віджетів.',
    hireT: '<strong>Відкритий до&nbsp;роботи:</strong> Senior Flutter Developer, мобільний розробник (Flutter) або Flutter Lead · full-time, part-time чи контракт · віддалено, GMT+7',
    toTop: 'Нагору'
  };

  const BE = {
    skip: 'Перайсці да зместу',
    brandLabel: 'Руслан Барысюк, на пачатак старонкі',
    name: 'Руслан Барысюк',
    navLabel: 'Раздзелы',
    navApps: 'Праграмы',
    navResume: 'Рэзюмэ',
    navContacts: 'Кантакты',
    langLegendSite: 'Мова сайта і рэзюмэ',
    themeLegendSite: 'Тэма сайта і рэзюмэ',
    light: 'Светлая',
    dark: 'Цёмная',
    chip: 'Адкрыты да прапаноў · аддалена · GMT+7',
    role: 'Senior Flutter-<br>распрацоўшчык',
    lead: 'Даводжу мабільныя праграмы для iOS і&nbsp;Android ад&nbsp;ацэнкі і&nbsp;роадмапа да&nbsp;рэлізу ў&nbsp;App&nbsp;Store і&nbsp;Google&nbsp;Play.',
    ctaTg: 'Напісаць у Telegram',
    ctaEmail: 'Скапіяваць email',
    copiedEmail: 'Email скапіяваны',
    ctaPdf: 'Спампаваць рэзюмэ ў PDF',
    artLabel: 'Партрэт і скрыншоты праграм: Healthy4u, ProveUp, сканер дакументаў',
    openToWork: 'Адкрыты да прапаноў',
    altPuKits: 'ProveUp: экіпіроўка аватара',
    altScCamera: 'Сканер дакументаў: камера з рэжымамі здымкі',
    altH4uInsights: 'Healthy4u: трэнды здароўя за тыдзень',
    altH4uPaywall: 'Healthy4u: экран падпіскі',
    altPuCoach: 'ProveUp: экран трэнера',
    altH4uHome: 'Healthy4u: галоўны экран AI-асістэнта',
    altPuHome: 'ProveUp: галоўны экран з аватарам гульца',
    f1n: '5 <span>гадоў</span>',
    f1l: 'у камерцыйнай распрацоўцы',
    f2n: '6 <span>праграм</span>',
    f2l: 'у App&nbsp;Store і Google&nbsp;Play',
    f3n: '1,5 <span>месяца</span>',
    f3l: 'ад аўдыту да рэлізу праекта, які застрэў',
    f4n: '1&#8239;014',
    f4l: 'унёскаў на&nbsp;GitHub за&nbsp;апошні год',
    appsTitle: 'Праграмы',
    appsLead: 'Flutter-праграмы, якія адчуваюцца натыўнымі: падпіскі, даныя з&nbsp;гадзінніка, відэа ў&nbsp;рэальным часе, камп’ютарны зрок.',
    h4uSub: 'AI-асістэнт здароўя',
    h4uDates: 'Чэрвень 2025 — верасень 2026',
    h4uRole: 'Перапісаў са&nbsp;Swift на&nbsp;Flutter · адзіны мабільны распрацоўшчык 15&nbsp;месяцаў',
    h4uText: 'Даныя з&nbsp;гадзінніка: HealthKit (40+ тыпаў), Health Connect і&nbsp;прататып для watchOS на&nbsp;SwiftUI. Натыўныя падпіскі StoreKit&nbsp;2 і&nbsp;Google Play Billing з&nbsp;сервернай праверкай&nbsp;— разам з&nbsp;бэкенд-распрацоўшчыкам.',
    altH4uSync: 'Healthy4u: сінхранізацыя даных з Apple Health',
    altH4uChat: 'Healthy4u: AI-чат запісвае прыёмы ежы',
    altH4uNutrition: 'Healthy4u: дзённы прагрэс харчавання',
    altH4uVoice: 'Healthy4u: выбар голасу асістэнта',
    puSub: 'Фітнес-батлы і футбольны фрыстайл',
    puDates: 'Травень — верасень 2026, кантракт',
    puText: 'Камп’ютарны зрок лічыць паўторы проста з&nbsp;камеры, відэасувязь на&nbsp;LiveKit і&nbsp;WebRTC.',
    puBuild: 'Зборка ў TestFlight',
    altPuBattle: 'ProveUp: батл-арэна',
    altPuRanking: 'ProveUp: рэйтынг гульцоў',
    altPuCamera: 'ProveUp: камера распазнае практыкаванне',
    scTitle: 'Сканер дакументаў і&nbsp;PDF-рэдактар',
    scDates: 'Верасень — кастрычнік 2026, кантракт',
    scText: 'Далучыўся да&nbsp;праекта, які застрэў, і&nbsp;за&nbsp;1,5 месяца давёў яго ад&nbsp;аўдыту да&nbsp;рэлізу. Натыўныя SDK камеры, ML і&nbsp;OCR на&nbsp;прыладзе: ONNX Runtime, OpenCV. Падпіскі на&nbsp;RevenueCat.',
    altScPin: 'Сканер: папка пад PIN-кодам',
    altScProfile: 'Сканер: профіль і PRO-падпіска',
    altScCamera2: 'Сканер: камера з рэжымамі здымкі',
    earlyTitle: 'Праекты 2022–2025',
    earlySub: 'Маркетплейсы, сэрвіс найму і&nbsp;крыптакашалёк&nbsp;— у&nbsp;камандах і&nbsp;сола',
    kAgro: 'дошка аб’яў аграрынку',
    kKerla: 'маркетплейс аб’яў',
    nRab: 'РАБОТНИК24',
    kRab: 'пошук працы і наём',
    kSfera: 'сацыяльная платформа',
    kGyber: 'крыптакашалёк',
    altRab: 'РАБОТНИК24: стартавы экран',
    altAgro: 'Agrotook: прома з Google Play',
    altKerla: 'Kerla: стужка аб’яў',
    altGyber: 'Gyber Wallet: стартавы экран',
    resumeTitle: 'Рэзюмэ',
    resumeLead: 'Шэсць старонак A4 на&nbsp;дзесяці мовах, у&nbsp;светлай і&nbsp;цёмнай тэме. Спасылка і&nbsp;PDF мяняюцца разам з&nbsp;выбарам.',
    langLegend: 'Мова',
    themeLegend: 'Тэма',
    dlPdf: 'Спампаваць PDF',
    allFiles: 'Усе файлы: PDF і DOCX',
    menuPdf: 'PDF, 6 старонак',
    fRuLight: 'Руская, светлая',
    fRuDark: 'Руская, цёмная',
    fEnLight: 'Англійская, светлая',
    fEnDark: 'Англійская, цёмная',
    fUkLight: 'Украінская, светлая',
    fUkDark: 'Украінская, цёмная',
    fBeLight: 'Беларуская, светлая',
    fBeDark: 'Беларуская, цёмная',
    fKkLight: 'Казахская, светлая',
    fKkDark: 'Казахская, цёмная',
    fEsLight: 'Іспанская, светлая',
    fEsDark: 'Іспанская, цёмная',
    fFrLight: 'Французская, светлая',
    fFrDark: 'Французская, цёмная',
    fZhLight: 'Кітайская, светлая',
    fZhDark: 'Кітайская, цёмная',
    fHiLight: 'Хіндзі, светлая',
    fHiDark: 'Хіндзі, цёмная',
    fArLight: 'Арабская, светлая',
    fArDark: 'Арабская, цёмная',
    menuAts: 'Для ATS: адна калонка, DOCX',
    fAtsRu: 'Руская',
    fAtsEn: 'Англійская',
    copyLink: 'Скапіяваць спасылку на гэту версію',
    copiedLink: 'Спасылка скапіявана',
    pagesLabel: 'Старонкі рэзюмэ',
    pagesTitle: 'Старонкі',
    p1: 'Агляд',
    p2: 'Досвед працы',
    p4: 'ProveUp і сканер',
    p5: 'Праекты 2022–2025',
    p6: 'Тэхнічны стэк',
    pg1: 'Стар. 1 з 6', pg2: 'Стар. 2 з 6', pg3: 'Стар. 3 з 6', pg4: 'Стар. 4 з 6', pg5: 'Стар. 5 з 6', pg6: 'Стар. 6 з 6',
    if1: 'Рэзюмэ, стар. 1 з 6', if2: 'Рэзюмэ, стар. 2 з 6', if3: 'Рэзюмэ, стар. 3 з 6',
    if4: 'Рэзюмэ, стар. 4 з 6', if5: 'Рэзюмэ, стар. 5 з 6', if6: 'Рэзюмэ, стар. 6 з 6',
    openPage: 'Адкрыць старонку',
    ghTitle: 'Актыўнасць на GitHub',
    ghLead: 'Кожны квадрат&nbsp;— адзін дзень за&nbsp;апошнія 12&nbsp;месяцаў. Чым цямнейшы, тым больш унёскаў.',
    ghBig: '1&#8239;014',
    ghCap: 'унёскаў за&nbsp;апошні год',
    ghDays: '<strong>215</strong> актыўных дзён',
    ghSince: 'На&nbsp;GitHub з&nbsp;<strong>2020</strong> года',
    ghScroll: 'Графік актыўнасці, пракручваецца па гарызанталі',
    ghAria: 'Графік актыўнасці на GitHub: 1 014 унёскаў і 215 актыўных дзён за апошні год',
    less: 'Менш',
    more: 'Больш',
    contactsTitle: 'Кантакты',
    contactsLead: 'Найзручней&nbsp;— Telegram. Працую аддалена з&nbsp;Бангкока (GMT+7), full-time або part-time з&nbsp;пагадзіннай аплатай.',
    copy: 'Скапіяваць',
    copied: 'Скапіявана',
    phoneLabel: 'Тэлефон і WhatsApp',
    openProfile: 'Адкрыць профіль',
    note1: 'Англійская B1, заняткі тры разы на&nbsp;тыдзень',
    note2: 'Рэкамендацыйны ліст ад&nbsp;папярэдняга працадаўцы&nbsp;— па&nbsp;запыце',
    note3: 'AI-агенты ў&nbsp;працы штодня ўжо 1,5&nbsp;года: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · абноўлена кастр.&nbsp;2026',
    skillsTitle: 'Чым буду карысны',
    skillsLead: 'Flutter-распрацоўка з&nbsp;натыўнымі інтэграцыямі для iOS і&nbsp;Android: ад&nbsp;MVP і&nbsp;аўдыту кода да&nbsp;рэлізу ў&nbsp;сторах і&nbsp;падтрымкі.',
    sk1t: 'Кросплатформавая распрацоўка на&nbsp;Flutter',
    sk1d: 'Праграмы для iOS і&nbsp;Android з&nbsp;адной кодавай базы на&nbsp;Dart: Clean Architecture, BLoC і&nbsp;Riverpod, флейверы для зборкі некалькіх праграм з&nbsp;аднаго кода.',
    sk2t: 'Натыўная распрацоўка iOS і&nbsp;Android',
    sk2d: 'Swift, SwiftUI і&nbsp;Kotlin там, дзе не&nbsp;хапае Flutter: Platform Channels, натыўныя SDK, прататып для watchOS, дазволы Android&nbsp;13/14.',
    sk3t: 'Падпіскі і&nbsp;ўбудаваныя пакупкі',
    sk3d: 'StoreKit&nbsp;2 і&nbsp;Google Play Billing з&nbsp;сервернай праверкай, RevenueCat, пэйвалы і&nbsp;аднаўленне пакупак. Праводжу праграмы праз рэв’ю App Store.',
    sk4t: 'Здароўе і&nbsp;разумныя гадзіннікі',
    sk4d: 'HealthKit (40+ тыпаў) і&nbsp;Health Connect: даныя з&nbsp;гадзінніка і&nbsp;тэлефона, сінхранізацыя, патрабаванні рэв’ю Google Play да&nbsp;даных пра здароўе.',
    sk5t: 'Відэасувязь і&nbsp;AI-функцыі',
    sk5d: 'Відэазванкі на&nbsp;WebRTC і&nbsp;LiveKit, стрымінг адказаў LLM праз SSE і&nbsp;іх&nbsp;агучванне (TTS).',
    sk6t: 'Камера, камп’ютарны зрок і&nbsp;OCR',
    sk6d: 'Натыўныя SDK камеры, сканаванне дакументаў, падлік паўтораў з&nbsp;камеры. ML і&nbsp;OCR на&nbsp;прыладзе без уласнага бэкенда: ONNX Runtime, OpenCV, Tesseract.',
    sk7t: 'Аўдыт і&nbsp;выратаванне праектаў',
    sk7d: 'Разбіраюся ў&nbsp;чужым кодзе, дакументую архітэктуру і&nbsp;даводжу да&nbsp;рэлізу праекты, якія забуксавалі: адзін такі выпусціў за&nbsp;1,5&nbsp;месяца.',
    sk8t: 'AI-native распрацоўка',
    sk8d: 'Claude Code і&nbsp;Cursor штодня 1,5&nbsp;года: агентныя пайплайны з&nbsp;агентам-рэв’юерам, Figma MCP. Праз Dart MCP прыбраў 2000+ лішніх перабудоў віджэтаў.',
    hireT: '<strong>Адкрыты да&nbsp;працы:</strong> Senior Flutter Developer, мабільны распрацоўшчык (Flutter) або Flutter Lead · full-time, part-time ці кантракт · аддалена, GMT+7',
    toTop: 'Уверх'
  };

  const KK = {
    skip: 'Мазмұнға өту',
    brandLabel: 'Руслан Борисюк, бет басына оралу',
    name: 'Руслан Борисюк',
    navLabel: 'Бөлімдер',
    navApps: 'Қосымшалар',
    navResume: 'Түйіндеме',
    navContacts: 'Байланыс',
    langLegendSite: 'Сайт пен түйіндеме тілі',
    themeLegendSite: 'Сайт пен түйіндеме тақырыбы',
    light: 'Ашық',
    dark: 'Қараңғы',
    chip: 'Ұсыныстарға ашықпын · қашықтан · GMT+7',
    role: 'Senior Flutter-<br>әзірлеуші',
    lead: 'iOS пен&nbsp;Android қосымшаларын бағалау мен&nbsp;роадмаптан App&nbsp;Store мен Google&nbsp;Play-дегі релизге дейін жеткіземін.',
    ctaTg: 'Telegram-ға жазу',
    ctaEmail: 'Email-ді көшіру',
    copiedEmail: 'Email көшірілді',
    ctaPdf: 'Түйіндемені PDF түрінде жүктеу',
    artLabel: 'Портрет және қосымшалардың скриншоттары: Healthy4u, ProveUp, құжат сканері',
    openToWork: 'Ұсыныстарға ашықпын',
    altPuKits: 'ProveUp: аватар экипировкасы',
    altScCamera: 'Құжат сканері: түсіру режимдері бар камера',
    altH4uInsights: 'Healthy4u: апталық денсаулық трендтері',
    altH4uPaywall: 'Healthy4u: жазылым экраны',
    altPuCoach: 'ProveUp: жаттықтырушы экраны',
    altH4uHome: 'Healthy4u: AI көмекшісінің басты экраны',
    altPuHome: 'ProveUp: ойыншы аватары бар басты экран',
    f1n: '5 <span>жыл</span>',
    f1l: 'коммерциялық әзірлеуде',
    f2n: '6 <span>қосымша</span>',
    f2l: 'App&nbsp;Store мен Google&nbsp;Play-де',
    f3n: '1,5 <span>ай</span>',
    f3l: 'тоқтап қалған жобаның аудитінен релизіне дейін',
    f4n: '1&#8239;014',
    f4l: 'соңғы жылдағы GitHub&nbsp;контрибуциясы',
    appsTitle: 'Қосымшалар',
    appsLead: 'Нативті сезілетін Flutter-қосымшалар: жазылымдар, смарт-сағат деректері, нақты уақыттағы бейне, компьютерлік көру.',
    h4uSub: 'AI денсаулық көмекшісі',
    h4uDates: 'Маусым 2025 — қыркүйек 2026',
    h4uRole: 'Swift-тен Flutter-ге қайта жаздым · 15&nbsp;ай бойы жалғыз мобильді әзірлеуші',
    h4uText: 'Смарт-сағат деректері: HealthKit (40+ тип), Health Connect және&nbsp;SwiftUI-дағы watchOS прототипі. StoreKit&nbsp;2 мен&nbsp;Google Play Billing нативті жазылымдары, серверлік валидациясы бэкенд-әзірлеушімен бірге жасалды.',
    altH4uSync: 'Healthy4u: Apple Health деректерін синхрондау',
    altH4uChat: 'Healthy4u: AI-чат тамақтануды жазып алады',
    altH4uNutrition: 'Healthy4u: күндік тамақтану прогресі',
    altH4uVoice: 'Healthy4u: көмекші дауысын таңдау',
    puSub: 'Фитнес-батлдар және футбол фристайлы',
    puDates: 'Мамыр — қыркүйек 2026, келісімшарт',
    puText: 'Компьютерлік көру қайталауларды тікелей камерадан санайды, бейнебайланыс LiveKit пен&nbsp;WebRTC-де.',
    puBuild: 'TestFlight-тағы сборка',
    altPuBattle: 'ProveUp: батл-арена',
    altPuRanking: 'ProveUp: ойыншылар рейтингі',
    altPuCamera: 'ProveUp: камера жаттығуды таниды',
    scTitle: 'Құжат сканері және&nbsp;PDF-редактор',
    scDates: 'Қыркүйек — қазан 2026, келісімшарт',
    scText: 'Тоқтап қалған жобаға қосылып, оны 1,5&nbsp;айда аудиттен релизге дейін жеткіздім. Камераның нативті SDK-лары, құрылғыдағы ML мен&nbsp;OCR: ONNX Runtime, OpenCV. RevenueCat-тегі жазылымдар.',
    altScPin: 'Сканер: PIN-кодпен қорғалған папка',
    altScProfile: 'Сканер: профиль және PRO-жазылым',
    altScCamera2: 'Сканер: түсіру режимдері бар камера',
    earlyTitle: 'Жобалар 2022–2025',
    earlySub: 'Маркетплейстер, HR-сервис және&nbsp;криптоәмиян&nbsp;— командада және&nbsp;жеке',
    kAgro: 'агронарық хабарландырулары',
    kKerla: 'хабарландырулар маркетплейсі',
    nRab: 'РАБОТНИК24',
    kRab: 'жұмыс іздеу және жалдау',
    kSfera: 'әлеуметтік платформа',
    kGyber: 'криптоәмиян',
    altRab: 'РАБОТНИК24: бастапқы экран',
    altAgro: 'Agrotook: Google Play-дегі промо',
    altKerla: 'Kerla: хабарландырулар таспасы',
    altGyber: 'Gyber Wallet: бастапқы экран',
    resumeTitle: 'Түйіндеме',
    resumeLead: 'Он тілдегі алты A4 беті, ашық және&nbsp;қараңғы тақырыпта. Сілтеме мен&nbsp;PDF таңдауыңызға қарай өзгереді.',
    langLegend: 'Тіл',
    themeLegend: 'Тақырып',
    dlPdf: 'PDF жүктеу',
    allFiles: 'Файлдар: PDF және DOCX',
    menuPdf: 'PDF, 6 бет',
    fRuLight: 'Орысша, ашық',
    fRuDark: 'Орысша, қараңғы',
    fEnLight: 'Ағылшынша, ашық',
    fEnDark: 'Ағылшынша, қараңғы',
    fUkLight: 'Украинша, ашық',
    fUkDark: 'Украинша, қараңғы',
    fBeLight: 'Беларусша, ашық',
    fBeDark: 'Беларусша, қараңғы',
    fKkLight: 'Қазақша, ашық',
    fKkDark: 'Қазақша, қараңғы',
    fEsLight: 'Испанша, ашық',
    fEsDark: 'Испанша, қараңғы',
    fFrLight: 'Французша, ашық',
    fFrDark: 'Французша, қараңғы',
    fZhLight: 'Қытайша, ашық',
    fZhDark: 'Қытайша, қараңғы',
    fHiLight: 'Хинди, ашық',
    fHiDark: 'Хинди, қараңғы',
    fArLight: 'Арабша, ашық',
    fArDark: 'Арабша, қараңғы',
    menuAts: 'ATS үшін: бір баған, DOCX',
    fAtsRu: 'Орысша',
    fAtsEn: 'Ағылшынша',
    copyLink: 'Осы нұсқаның сілтемесін көшіру',
    copiedLink: 'Сілтеме көшірілді',
    pagesLabel: 'Түйіндеме беттері',
    pagesTitle: 'Беттер',
    p1: 'Шолу',
    p2: 'Жұмыс тәжірибесі',
    p4: 'ProveUp және сканер',
    p5: 'Жобалар 2022–2025',
    p6: 'Техникалық стек',
    pg1: '1-бет / 6', pg2: '2-бет / 6', pg3: '3-бет / 6', pg4: '4-бет / 6', pg5: '5-бет / 6', pg6: '6-бет / 6',
    if1: 'Түйіндеме, 1-бет / 6', if2: 'Түйіндеме, 2-бет / 6', if3: 'Түйіндеме, 3-бет / 6',
    if4: 'Түйіндеме, 4-бет / 6', if5: 'Түйіндеме, 5-бет / 6', if6: 'Түйіндеме, 6-бет / 6',
    openPage: 'Бетті ашу',
    ghTitle: 'GitHub-тағы белсенділік',
    ghLead: 'Әр шаршы&nbsp;— соңғы 12&nbsp;айдағы бір күн. Неғұрлым қою болса, соғұрлым контрибуция көп.',
    ghBig: '1&#8239;014',
    ghCap: 'соңғы жылдағы контрибуция',
    ghDays: '<strong>215</strong> белсенді күн',
    ghSince: 'GitHub-та <strong>2020</strong> жылдан бері',
    ghScroll: 'Белсенділік графигі, көлденеңінен жылжиды',
    ghAria: 'GitHub белсенділік графигі: соңғы жылда 1 014 контрибуция және 215 белсенді күн',
    less: 'Аз',
    more: 'Көп',
    contactsTitle: 'Байланыс',
    contactsLead: 'Ең ыңғайлысы&nbsp;— Telegram. Бангкоктан (GMT+7) қашықтан жұмыс істеймін: full-time немесе сағаттық ақылы part-time.',
    copy: 'Көшіру',
    copied: 'Көшірілді',
    phoneLabel: 'Телефон және WhatsApp',
    openProfile: 'Профильді ашу',
    note1: 'Ағылшын тілі B1, аптасына үш рет сабақ',
    note2: 'Бұрынғы жұмыс берушінің ұсыным хаты&nbsp;— сұрау бойынша',
    note3: '1,5&nbsp;жылдан бері күн сайын AI-агенттермен жұмыс: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · жаңартылды: қаз.&nbsp;2026',
    skillsTitle: 'Немен пайдалы боламын',
    skillsLead: 'iOS пен&nbsp;Android нативті интеграциялары бар Flutter-әзірлеу: MVP мен&nbsp;код аудитінен сторлардағы релиз бен&nbsp;қолдауға дейін.',
    sk1t: 'Flutter-дегі кроссплатформалық әзірлеу',
    sk1d: 'Dart-тағы бір кодтық базадан iOS пен&nbsp;Android қосымшалары: Clean Architecture, BLoC пен&nbsp;Riverpod, бір кодтан бірнеше қосымша құрастыратын флейворлар.',
    sk2t: 'iOS пен&nbsp;Android нативті әзірлеу',
    sk2d: 'Flutter жетпейтін жерде Swift, SwiftUI және&nbsp;Kotlin: Platform Channels, нативті SDK-лар, watchOS прототипі, Android&nbsp;13/14 рұқсаттары.',
    sk3t: 'Жазылымдар және&nbsp;кіріктірілген сатып алулар',
    sk3d: 'Серверлік валидациясы бар StoreKit&nbsp;2 мен&nbsp;Google Play Billing, RevenueCat, пейволдар және&nbsp;сатып алуларды қалпына келтіру. Қосымшаларды App Store ревьюінен өткіземін.',
    sk4t: 'Денсаулық және&nbsp;киілетін құрылғылар',
    sk4d: 'HealthKit (40+ тип) және&nbsp;Health Connect: сағат пен&nbsp;телефон деректері, синхрондау, денсаулық деректеріне қойылатын Google Play ревью талаптары.',
    sk5t: 'Бейнебайланыс және&nbsp;AI-функциялар',
    sk5d: 'WebRTC мен&nbsp;LiveKit-тегі бейнеқоңыраулар, SSE арқылы LLM жауаптарының стримингі және&nbsp;оларды дыбыстау (TTS).',
    sk6t: 'Камера, компьютерлік көру және&nbsp;OCR',
    sk6d: 'Камераның нативті SDK-лары, құжаттарды сканерлеу, камерадан қайталауларды санау. Жеке бэкендсіз құрылғыдағы ML мен&nbsp;OCR: ONNX Runtime, OpenCV, Tesseract.',
    sk7t: 'Жобалар аудиті және&nbsp;оларды құтқару',
    sk7d: 'Бөтен кодты талдаймын, архитектураны құжаттаймын және&nbsp;тоқтап қалған жобаларды релизге жеткіземін: біреуін 1,5&nbsp;айда шығардым.',
    sk8t: 'AI-native әзірлеу',
    sk8d: '1,5&nbsp;жыл бойы күн сайын Claude Code пен&nbsp;Cursor: агент-ревьюері бар агенттік пайплайндар, Figma MCP. Dart MCP арқылы виджеттердің 2000+ артық қайта құрылуын жойдым.',
    hireT: '<strong>Жұмысқа ашықпын:</strong> Senior Flutter Developer, мобильді әзірлеуші (Flutter) немесе Flutter Lead · full-time, part-time немесе келісімшарт · қашықтан, GMT+7',
    toTop: 'Жоғарыға'
  };

  const ES = {
    skip: 'Ir al contenido',
    brandLabel: 'Ruslan Barysiuk, volver arriba',
    name: 'Ruslan Barysiuk',
    navLabel: 'Secciones',
    navApps: 'Apps',
    navResume: 'Currículum',
    navContacts: 'Contacto',
    langLegendSite: 'Idioma del sitio y del currículum',
    themeLegendSite: 'Tema del sitio y del currículum',
    light: 'Claro',
    dark: 'Oscuro',
    chip: 'Abierto a ofertas · remoto · GMT+7',
    role: 'Desarrollador<br>Flutter Senior',
    lead: 'Llevo apps iOS y Android desde la estimación y el&nbsp;roadmap hasta su publicación en App&nbsp;Store y Google&nbsp;Play.',
    ctaTg: 'Escribir por Telegram',
    ctaEmail: 'Copiar email',
    copiedEmail: 'Email copiado',
    ctaPdf: 'Descargar CV en PDF',
    artLabel: 'Retrato y capturas de apps: Healthy4u, ProveUp, escáner de documentos',
    openToWork: 'Abierto a ofertas',
    altPuKits: 'ProveUp: equipamiento del avatar',
    altScCamera: 'Escáner de documentos: cámara con modos de escaneo',
    altH4uInsights: 'Healthy4u: tendencias semanales de salud',
    altH4uPaywall: 'Healthy4u: paywall de suscripción',
    altPuCoach: 'ProveUp: pantalla del entrenador',
    altH4uHome: 'Healthy4u: inicio del asistente de IA',
    altPuHome: 'ProveUp: pantalla de inicio con el avatar del jugador',
    f1n: '5 <span>años</span>',
    f1l: 'de experiencia profesional',
    f2n: '6 <span>apps</span>',
    f2l: 'en App&nbsp;Store y Google&nbsp;Play',
    f3n: '1,5 <span>meses</span>',
    f3l: 'para auditar y lanzar un proyecto estancado',
    f4n: '1014',
    f4l: 'contribuciones en GitHub en el último&nbsp;año',
    appsTitle: 'Apps',
    appsLead: 'Apps en Flutter con experiencia nativa: suscripciones, datos de salud de relojes, video en tiempo real, visión artificial.',
    h4uSub: 'Asistente de salud con IA',
    h4uDates: 'Junio de 2025 – septiembre de 2026',
    h4uRole: 'Reescribí la app de Swift a Flutter · único desarrollador móvil durante 15&nbsp;meses',
    h4uText: 'Datos de salud de relojes: HealthKit (40+ tipos), Health Connect y un&nbsp;prototipo de watchOS en SwiftUI. Suscripciones nativas con StoreKit&nbsp;2 y Google Play Billing, validadas en el servidor junto con el desarrollador backend.',
    altH4uSync: 'Healthy4u: sincronización con Apple Health',
    altH4uChat: 'Healthy4u: el chat de IA registra comidas',
    altH4uNutrition: 'Healthy4u: progreso nutricional diario',
    altH4uVoice: 'Healthy4u: ajustes de voz del asistente',
    puSub: 'Batallas de fitness y fútbol freestyle',
    puDates: 'Mayo – septiembre de 2026, por contrato',
    puText: 'La visión artificial cuenta repeticiones desde la cámara; video en tiempo real con LiveKit y WebRTC.',
    puBuild: 'Build en TestFlight',
    altPuBattle: 'ProveUp: arena de batalla',
    altPuRanking: 'ProveUp: ranking de jugadores',
    altPuCamera: 'ProveUp: la cámara detecta el ejercicio',
    scTitle: 'Escáner de documentos y&nbsp;editor&nbsp;PDF',
    scDates: 'Septiembre – octubre de 2026, por contrato',
    scText: 'Me uní a un proyecto estancado y lo llevé de la auditoría al lanzamiento en 1,5&nbsp;meses. SDK nativos de cámara, ML y OCR en el dispositivo con ONNX Runtime y OpenCV. Suscripciones con RevenueCat.',
    altScPin: 'Escáner: carpeta protegida con PIN',
    altScProfile: 'Escáner: perfil y suscripción PRO',
    altScCamera2: 'Escáner: cámara con modos de escaneo',
    earlyTitle: 'Proyectos 2022–2025',
    earlySub: 'Marketplaces, servicio de empleo y&nbsp;billetera cripto — en equipo y en solitario',
    kAgro: 'clasificados agrícolas',
    kKerla: 'marketplace de clasificados',
    nRab: 'Rabotnik24',
    kRab: 'plataforma de empleo',
    kSfera: 'plataforma social',
    kGyber: 'billetera cripto',
    altRab: 'Rabotnik24: pantalla de bienvenida',
    altAgro: 'Agrotook: promo en Google Play',
    altKerla: 'Kerla: feed de anuncios',
    altGyber: 'Gyber Wallet: pantalla de bienvenida',
    resumeTitle: 'Currículum',
    resumeLead: 'Seis páginas A4 en diez idiomas, en tema claro y oscuro. El enlace y el PDF se adaptan a la selección.',
    langLegend: 'Idioma',
    themeLegend: 'Tema',
    dlPdf: 'Descargar PDF',
    allFiles: 'Todos los archivos: PDF y DOCX',
    menuPdf: 'PDF, 6 páginas',
    fRuLight: 'Ruso, claro',
    fRuDark: 'Ruso, oscuro',
    fEnLight: 'Inglés, claro',
    fEnDark: 'Inglés, oscuro',
    fUkLight: 'Ucraniano, claro',
    fUkDark: 'Ucraniano, oscuro',
    fBeLight: 'Bielorruso, claro',
    fBeDark: 'Bielorruso, oscuro',
    fKkLight: 'Kazajo, claro',
    fKkDark: 'Kazajo, oscuro',
    fEsLight: 'Español, claro',
    fEsDark: 'Español, oscuro',
    fFrLight: 'Francés, claro',
    fFrDark: 'Francés, oscuro',
    fZhLight: 'Chino, claro',
    fZhDark: 'Chino, oscuro',
    fHiLight: 'Hindi, claro',
    fHiDark: 'Hindi, oscuro',
    fArLight: 'Árabe, claro',
    fArDark: 'Árabe, oscuro',
    menuAts: 'Para ATS: una columna, DOCX',
    fAtsRu: 'Ruso',
    fAtsEn: 'Inglés',
    copyLink: 'Copiar enlace a esta versión',
    copiedLink: 'Enlace copiado',
    pagesLabel: 'Páginas del currículum',
    pagesTitle: 'Páginas',
    p1: 'Resumen',
    p2: 'Experiencia',
    p4: 'ProveUp y escáner',
    p5: 'Proyectos 2022–2025',
    p6: 'Stack tecnológico',
    pg1: 'Página 1 de 6',
    pg2: 'Página 2 de 6',
    pg3: 'Página 3 de 6',
    pg4: 'Página 4 de 6',
    pg5: 'Página 5 de 6',
    pg6: 'Página 6 de 6',
    if1: 'Currículum, página 1 de 6',
    if2: 'Currículum, página 2 de 6',
    if3: 'Currículum, página 3 de 6',
    if4: 'Currículum, página 4 de 6',
    if5: 'Currículum, página 5 de 6',
    if6: 'Currículum, página 6 de 6',
    openPage: 'Abrir página',
    ghTitle: 'Actividad en GitHub',
    ghLead: 'Cada cuadrado es un día de los últimos 12&nbsp;meses. Cuanto más oscuro, más contribuciones.',
    ghBig: '1014',
    ghCap: 'contribuciones en el último año',
    ghDays: '<strong>215</strong> días activos',
    ghSince: 'En GitHub desde <strong>2020</strong>',
    ghScroll: 'Gráfico de actividad, desplazable en horizontal',
    ghAria: 'Gráfico de actividad en GitHub: 1014 contribuciones y 215 días activos en el último año',
    less: 'Menos',
    more: 'Más',
    contactsTitle: 'Contacto',
    contactsLead: 'Prefiero Telegram. Trabajo remoto desde Bangkok (GMT+7), a tiempo completo o parcial con pago por horas.',
    copy: 'Copiar',
    copied: 'Copiado',
    phoneLabel: 'Teléfono y WhatsApp',
    openProfile: 'Abrir perfil',
    note1: 'Inglés B1, clases tres veces por&nbsp;semana',
    note2: 'Carta de recomendación de un empleador anterior, a&nbsp;petición',
    note3: 'Agentes de IA a diario desde hace 1,5&nbsp;años: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · actualizado en oct&nbsp;2026',
    skillsTitle: 'Qué aporto',
    skillsLead: 'Desarrollo Flutter con integraciones nativas de iOS y Android: del MVP y la&nbsp;auditoría de código a la publicación en tiendas y el soporte.',
    sk1t: 'Apps multiplataforma en Flutter',
    sk1d: 'Apps iOS y Android con una&nbsp;sola base de código en Dart: Clean Architecture, BLoC y Riverpod, y flavors que generan varias apps desde el mismo código.',
    sk2t: 'iOS y Android nativos',
    sk2d: 'Swift, SwiftUI y Kotlin donde Flutter no basta: platform channels, SDK nativos, un&nbsp;prototipo de watchOS, permisos de Android&nbsp;13/14.',
    sk3t: 'Suscripciones y compras in-app',
    sk3d: 'StoreKit&nbsp;2 y Google Play Billing con validación en el servidor, RevenueCat, paywalls y restauración de compras. Consigo que las apps superen la&nbsp;revisión del App Store.',
    sk4t: 'Datos de salud y wearables',
    sk4d: 'HealthKit (40+ tipos) y Health Connect: datos de relojes y teléfonos, sincronización y normas de revisión de Google Play para datos de salud.',
    sk5t: 'Videollamadas y funciones de IA',
    sk5d: 'Videollamadas con WebRTC y LiveKit, streaming de respuestas de LLM por SSE y lectura en voz alta con síntesis de voz.',
    sk6t: 'Cámara, visión artificial y OCR',
    sk6d: 'SDK nativos de cámara, escaneo de documentos, conteo de repeticiones con la cámara. ML y OCR en el dispositivo sin backend propio: ONNX Runtime, OpenCV, Tesseract.',
    sk7t: 'Auditoría y rescate de proyectos',
    sk7d: 'Analizo código heredado, documento la arquitectura y saco adelante proyectos estancados: uno pasó de la auditoría al lanzamiento en 1,5&nbsp;meses.',
    sk8t: 'Desarrollo AI-native',
    sk8d: 'Claude Code y Cursor a diario desde hace 1,5&nbsp;años: pipelines de agentes con un agente revisor, Figma MCP. Con Dart MCP eliminé 2000+ rebuilds innecesarios de widgets.',
    hireT: '<strong>Disponible como:</strong> desarrollador Flutter Senior, desarrollador móvil (Flutter) o Flutter Lead · tiempo completo, parcial o por contrato · remoto, GMT+7',
    toTop: 'Volver arriba'
  };

  const FR = {
    skip: 'Aller au contenu',
    brandLabel: 'Ruslan Barysiuk, retour en haut',
    name: 'Ruslan Barysiuk',
    navLabel: 'Sections',
    navApps: 'Applis',
    navResume: 'CV',
    navContacts: 'Contact',
    langLegendSite: 'Langue du site et du CV',
    themeLegendSite: 'Thème du site et du CV',
    light: 'Clair',
    dark: 'Sombre',
    chip: 'Disponible · télétravail · GMT+7',
    role: 'Développeur<br>Flutter senior',
    lead: 'Je mène des applis iOS et Android du chiffrage et de la roadmap jusqu’à leur sortie sur l’App&nbsp;Store et Google&nbsp;Play.',
    ctaTg: 'Écrire sur Telegram',
    ctaEmail: 'Copier l’e-mail',
    copiedEmail: 'E-mail copié',
    ctaPdf: 'Télécharger le CV en PDF',
    artLabel: 'Portrait et captures d’écran d’applis : Healthy4u, ProveUp, scanner de documents',
    openToWork: 'Disponible',
    altPuKits: 'ProveUp : équipement de l’avatar',
    altScCamera: 'Scanner de documents : caméra avec modes de scan',
    altH4uInsights: 'Healthy4u : tendances santé hebdomadaires',
    altH4uPaywall: 'Healthy4u : paywall d’abonnement',
    altPuCoach: 'ProveUp : écran du coach',
    altH4uHome: 'Healthy4u : accueil de l’assistant IA',
    altPuHome: 'ProveUp : accueil avec l’avatar du joueur',
    f1n: '5 <span>ans</span>',
    f1l: 'de développement en entreprise',
    f2n: '6 <span>applis</span>',
    f2l: 'sur l’App&nbsp;Store et Google&nbsp;Play',
    f3n: '1,5 <span>mois</span>',
    f3l: 'de l’audit à la sortie d’un projet bloqué',
    f4n: '1&nbsp;014',
    f4l: 'contributions GitHub sur l’année&nbsp;écoulée',
    appsTitle: 'Applis',
    appsLead: 'Des applis Flutter qu’on croirait natives&nbsp;: abonnements, données de santé des montres, vidéo en temps réel, vision par ordinateur.',
    h4uSub: 'Assistant santé IA',
    h4uDates: 'juin 2025 – septembre 2026',
    h4uRole: 'Réécriture de Swift vers Flutter · seul développeur mobile pendant 15&nbsp;mois',
    h4uText: 'Données de santé des montres&nbsp;: HealthKit (40+ types), Health Connect et un&nbsp;prototype watchOS en SwiftUI. Abonnements natifs avec StoreKit&nbsp;2 et Google Play Billing, validés côté serveur avec le développeur backend.',
    altH4uSync: 'Healthy4u : synchronisation Apple Health',
    altH4uChat: 'Healthy4u : le chat IA note les repas',
    altH4uNutrition: 'Healthy4u : suivi nutritionnel du jour',
    altH4uVoice: 'Healthy4u : réglages vocaux de l’assistant',
    puSub: 'Duels fitness et football freestyle',
    puDates: 'mai – septembre 2026, freelance',
    puText: 'La vision par ordinateur compte les répétitions via la caméra&nbsp;; vidéo en temps réel sur LiveKit et WebRTC.',
    puBuild: 'Build TestFlight',
    altPuBattle: 'ProveUp : arène de duels',
    altPuRanking: 'ProveUp : classement des joueurs',
    altPuCamera: 'ProveUp : la caméra détecte l’exercice',
    scTitle: 'Scanner de documents &amp; éditeur&nbsp;PDF',
    scDates: 'septembre – octobre 2026, freelance',
    scText: 'Reprise d’un projet bloqué, mené de l’audit à la sortie en 1,5&nbsp;mois. SDK caméra natifs, ML et OCR embarqués avec ONNX Runtime et OpenCV. Abonnements sur RevenueCat.',
    altScPin: 'Scanner : dossier protégé par PIN',
    altScProfile: 'Scanner : profil et abonnement PRO',
    altScCamera2: 'Scanner : caméra avec modes de scan',
    earlyTitle: 'Projets 2022–2025',
    earlySub: 'Marketplaces, service de recrutement et portefeuille crypto — en équipe et en solo',
    kAgro: 'petites annonces agricoles',
    kKerla: 'marketplace d’annonces',
    nRab: 'Rabotnik24',
    kRab: 'plateforme de recrutement',
    kSfera: 'plateforme sociale',
    kGyber: 'portefeuille crypto',
    altRab: 'Rabotnik24 : écran d’accueil',
    altAgro: 'Agrotook : promo Google Play',
    altKerla: 'Kerla : fil des annonces',
    altGyber: 'Gyber Wallet : écran d’accueil',
    resumeTitle: 'CV',
    resumeLead: 'Six pages A4 en dix langues, thèmes clair et sombre. Le lien et le PDF suivent votre choix.',
    langLegend: 'Langue',
    themeLegend: 'Thème',
    dlPdf: 'Télécharger le PDF',
    allFiles: 'Tous les fichiers&nbsp;: PDF et DOCX',
    menuPdf: 'PDF, 6 pages',
    fRuLight: 'Russe, clair',
    fRuDark: 'Russe, sombre',
    fEnLight: 'Anglais, clair',
    fEnDark: 'Anglais, sombre',
    fUkLight: 'Ukrainien, clair',
    fUkDark: 'Ukrainien, sombre',
    fBeLight: 'Biélorusse, clair',
    fBeDark: 'Biélorusse, sombre',
    fKkLight: 'Kazakh, clair',
    fKkDark: 'Kazakh, sombre',
    fEsLight: 'Espagnol, clair',
    fEsDark: 'Espagnol, sombre',
    fFrLight: 'Français, clair',
    fFrDark: 'Français, sombre',
    fZhLight: 'Chinois, clair',
    fZhDark: 'Chinois, sombre',
    fHiLight: 'Hindi, clair',
    fHiDark: 'Hindi, sombre',
    fArLight: 'Arabe, clair',
    fArDark: 'Arabe, sombre',
    menuAts: 'Pour les ATS&nbsp;: une colonne, DOCX',
    fAtsRu: 'Russe',
    fAtsEn: 'Anglais',
    copyLink: 'Copier le lien de cette version',
    copiedLink: 'Lien copié',
    pagesLabel: 'Pages du CV',
    pagesTitle: 'Pages',
    p1: 'Vue d’ensemble',
    p2: 'Expérience',
    p4: 'ProveUp et scanner',
    p5: 'Projets 2022–2025',
    p6: 'Stack technique',
    pg1: 'Page 1 sur 6',
    pg2: 'Page 2 sur 6',
    pg3: 'Page 3 sur 6',
    pg4: 'Page 4 sur 6',
    pg5: 'Page 5 sur 6',
    pg6: 'Page 6 sur 6',
    if1: 'CV, page 1 sur 6',
    if2: 'CV, page 2 sur 6',
    if3: 'CV, page 3 sur 6',
    if4: 'CV, page 4 sur 6',
    if5: 'CV, page 5 sur 6',
    if6: 'CV, page 6 sur 6',
    openPage: 'Ouvrir la page',
    ghTitle: 'Activité GitHub',
    ghLead: 'Chaque case est un jour des 12&nbsp;derniers mois. Plus elle est foncée, plus il y a de contributions.',
    ghBig: '1&nbsp;014',
    ghCap: 'contributions sur l’année écoulée',
    ghDays: '<strong>215</strong> jours actifs',
    ghSince: 'Sur GitHub depuis <strong>2020</strong>',
    ghScroll: 'Graphique d’activité, défilement horizontal',
    ghAria: 'Graphique d’activité GitHub : 1 014 contributions et 215 jours actifs sur l’année écoulée',
    less: 'Moins',
    more: 'Plus',
    contactsTitle: 'Contact',
    contactsLead: 'Telegram de préférence. Télétravail depuis Bangkok (GMT+7), temps plein ou temps partiel facturé à l’heure.',
    copy: 'Copier',
    copied: 'Copié',
    phoneLabel: 'Téléphone et WhatsApp',
    openProfile: 'Voir le profil',
    note1: 'Anglais B1, cours trois fois par semaine',
    note2: 'Lettre de recommandation d’un ancien employeur sur demande',
    note3: 'Agents IA au quotidien depuis 1,5&nbsp;an&nbsp;: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · mis à jour en oct.&nbsp;2026',
    skillsTitle: 'Ce que j’apporte',
    skillsLead: 'Développement Flutter avec intégrations natives iOS et Android&nbsp;: du MVP et de l’audit de code à la sortie sur les stores et au support.',
    sk1t: 'Applis multiplateformes en Flutter',
    sk1d: 'Applis iOS et Android à partir d’une seule base de code Dart&nbsp;: Clean Architecture, BLoC et Riverpod, et des flavors qui génèrent plusieurs applis depuis le même code.',
    sk2t: 'iOS et Android natifs',
    sk2d: 'Swift, SwiftUI et Kotlin là où Flutter ne suffit pas&nbsp;: platform channels, SDK natifs, un&nbsp;prototype watchOS, permissions Android&nbsp;13/14.',
    sk3t: 'Abonnements et achats intégrés',
    sk3d: 'StoreKit&nbsp;2 et Google Play Billing avec validation côté serveur, RevenueCat, paywalls et restauration des achats. J’obtiens la validation de l’App&nbsp;Store.',
    sk4t: 'Données de santé et wearables',
    sk4d: 'HealthKit (40+ types) et Health Connect&nbsp;: données des montres et des téléphones, synchronisation, règles de Google Play sur les données de santé.',
    sk5t: 'Appels vidéo et fonctions IA',
    sk5d: 'Appels vidéo sur WebRTC et LiveKit, streaming des réponses LLM via SSE et lecture à voix haute en synthèse vocale.',
    sk6t: 'Caméra, vision par ordinateur et OCR',
    sk6d: 'SDK caméra natifs, scan de documents, comptage des répétitions par la caméra. ML et OCR embarqués sans backend dédié&nbsp;: ONNX Runtime, OpenCV, Tesseract.',
    sk7t: 'Audits de code et sauvetage de projets',
    sk7d: 'Je me plonge dans le code hérité, documente l’architecture et livre les projets bloqués&nbsp;: l’un est passé de l’audit à la sortie en 1,5&nbsp;mois.',
    sk8t: 'Développement AI-native',
    sk8d: 'Claude Code et Cursor au quotidien depuis 1,5&nbsp;an&nbsp;: pipelines d’agents avec un agent relecteur, Figma MCP. Grâce à Dart MCP, 2&nbsp;000+ rebuilds de widgets inutiles supprimés.',
    hireT: '<strong>Disponible&nbsp;:</strong> Développeur Flutter senior, Développeur mobile (Flutter) ou Lead Flutter · temps plein, temps partiel ou freelance · télétravail, GMT+7',
    toTop: 'Retour en haut'
  };

  const ZH = {
    skip: '跳到主要内容',
    brandLabel: 'Ruslan Barysiuk，返回顶部',
    name: 'Ruslan Barysiuk',
    navLabel: '页面栏目',
    navApps: '应用',
    navResume: '简历',
    navContacts: '联系方式',
    langLegendSite: '网站和简历语言',
    themeLegendSite: '网站和简历主题',
    light: '浅色',
    dark: '深色',
    chip: '求职中 · 远程 · GMT+7',
    role: '高级 Flutter<br>开发工程师',
    lead: '我将 iOS 和 Android 应用从工作量评估、路线图规划一路推进到 App Store 和 Google&nbsp;Play 上架。',
    ctaTg: '通过 Telegram 联系',
    ctaEmail: '复制邮箱',
    copiedEmail: '邮箱已复制',
    ctaPdf: '下载 PDF 简历',
    artLabel: '个人照片与应用截图：Healthy4u、ProveUp、文档扫描应用',
    openToWork: '求职中',
    altPuKits: 'ProveUp：虚拟形象装备',
    altScCamera: '文档扫描应用：相机及扫描模式',
    altH4uInsights: 'Healthy4u：每周健康趋势',
    altH4uPaywall: 'Healthy4u：订阅付费墙',
    altPuCoach: 'ProveUp：教练界面',
    altH4uHome: 'Healthy4u：AI 助手首页',
    altPuHome: 'ProveUp：首页与玩家虚拟形象',
    f1n: '5 <span>年</span>',
    f1l: '商业开发经验',
    f2n: '6 <span>款应用</span>',
    f2l: '已上架 App&nbsp;Store 和 Google&nbsp;Play',
    f3n: '1.5 <span>个月</span>',
    f3l: '停滞项目从代码审计到上线',
    f4n: '1,014',
    f4l: '过去一年的 GitHub 贡献',
    appsTitle: '应用',
    appsLead: '体验媲美原生的 Flutter 应用：订阅、手表健康数据、实时视频、计算机视觉。',
    h4uSub: 'AI 健康助手',
    h4uDates: '2025 年 6 月 – 2026 年 9 月',
    h4uRole: '从 Swift 重写为 Flutter · 15 个月独立负责移动端开发',
    h4uText: '手表健康数据：HealthKit（40+ 种类型）、Health Connect，以及基于 SwiftUI 的 watchOS 原型。原生订阅采用 StoreKit&nbsp;2 和 Google Play Billing，并与后端开发协作完成服务端校验。',
    altH4uSync: 'Healthy4u：Apple Health 数据同步',
    altH4uChat: 'Healthy4u：通过 AI 聊天记录饮食',
    altH4uNutrition: 'Healthy4u：每日营养进度',
    altH4uVoice: 'Healthy4u：助手语音设置',
    puSub: '健身对战与花式足球',
    puDates: '2026 年 5–9 月，合同制',
    puText: '计算机视觉直接通过摄像头统计动作次数；基于 LiveKit 与 WebRTC 的实时视频。',
    puBuild: 'TestFlight 测试版',
    altPuBattle: 'ProveUp：对战竞技场',
    altPuRanking: 'ProveUp：玩家排行榜',
    altPuCamera: 'ProveUp：摄像头识别动作',
    scTitle: '文档扫描与 PDF 编辑器',
    scDates: '2026 年 9–10 月，合同制',
    scText: '接手停滞项目，1.5&nbsp;个月内完成从代码审计到上线。原生相机 SDK；基于 ONNX Runtime 与 OpenCV 的端侧 ML 和 OCR；通过 RevenueCat 实现订阅。',
    altScPin: '扫描应用：PIN 码保护的文件夹',
    altScProfile: '扫描应用：个人资料与 PRO 订阅',
    altScCamera2: '扫描应用：相机及扫描模式',
    earlyTitle: '2022–2025 年项目',
    earlySub: '交易平台、招聘服务和加密钱包，团队协作与独立开发兼有',
    kAgro: '农业分类信息平台',
    kKerla: '分类信息交易平台',
    nRab: 'Rabotnik24',
    kRab: '招聘平台',
    kSfera: '社交平台',
    kGyber: '加密钱包',
    altRab: 'Rabotnik24：欢迎页',
    altAgro: 'Agrotook：Google Play 宣传图',
    altKerla: 'Kerla：商品信息流',
    altGyber: 'Gyber Wallet：欢迎页',
    resumeTitle: '简历',
    resumeLead: '共 6 页 A4，提供 10 种语言及浅色、深色两种主题。链接和 PDF 随您的选择切换。',
    langLegend: '语言',
    themeLegend: '主题',
    dlPdf: '下载 PDF',
    allFiles: '全部文件：PDF 和 DOCX',
    menuPdf: 'PDF，共 6 页',
    fRuLight: '俄语，浅色',
    fRuDark: '俄语，深色',
    fEnLight: '英语，浅色',
    fEnDark: '英语，深色',
    fUkLight: '乌克兰语，浅色',
    fUkDark: '乌克兰语，深色',
    fBeLight: '白俄罗斯语，浅色',
    fBeDark: '白俄罗斯语，深色',
    fKkLight: '哈萨克语，浅色',
    fKkDark: '哈萨克语，深色',
    fEsLight: '西班牙语，浅色',
    fEsDark: '西班牙语，深色',
    fFrLight: '法语，浅色',
    fFrDark: '法语，深色',
    fZhLight: '中文，浅色',
    fZhDark: '中文，深色',
    fHiLight: '印地语，浅色',
    fHiDark: '印地语，深色',
    fArLight: '阿拉伯语，浅色',
    fArDark: '阿拉伯语，深色',
    menuAts: '适用于 ATS：单栏，DOCX',
    fAtsRu: '俄语',
    fAtsEn: '英语',
    copyLink: '复制此版本的链接',
    copiedLink: '链接已复制',
    pagesLabel: '简历页面',
    pagesTitle: '页面',
    p1: '概览',
    p2: '工作经历',
    p4: 'ProveUp 与扫描应用',
    p5: '2022–2025 年项目',
    p6: '技术栈',
    pg1: '第 1/6 页',
    pg2: '第 2/6 页',
    pg3: '第 3/6 页',
    pg4: '第 4/6 页',
    pg5: '第 5/6 页',
    pg6: '第 6/6 页',
    if1: '简历第 1 页，共 6 页',
    if2: '简历第 2 页，共 6 页',
    if3: '简历第 3 页，共 6 页',
    if4: '简历第 4 页，共 6 页',
    if5: '简历第 5 页，共 6 页',
    if6: '简历第 6 页，共 6 页',
    openPage: '打开页面',
    ghTitle: 'GitHub 活动',
    ghLead: '每个方格代表过去 12&nbsp;个月中的一天。颜色越深，贡献越多。',
    ghBig: '1,014',
    ghCap: '过去一年的贡献',
    ghDays: '活跃 <strong>215</strong> 天',
    ghSince: '<strong>2020</strong> 年加入 GitHub',
    ghScroll: '活动图，可横向滚动',
    ghAria: 'GitHub 活动图：过去一年 1,014 次贡献，活跃 215 天',
    less: '少',
    more: '多',
    contactsTitle: '联系方式',
    contactsLead: '优先通过 Telegram 联系。常驻曼谷远程工作（GMT+7），可全职，也可按小时计费兼职。',
    copy: '复制',
    copied: '已复制',
    phoneLabel: '电话和 WhatsApp',
    openProfile: '查看主页',
    note1: '英语 B1，每周上课三次',
    note2: '可应要求提供前雇主推荐信',
    note3: '日常工作中使用 AI 智能体已 1.5 年：Claude Code、Cursor',
    footer: '原生 HTML/CSS/JS · GitHub Pages · 2026 年 10 月更新',
    skillsTitle: '核心能力',
    skillsLead: 'Flutter 开发，结合原生 iOS 与 Android 集成：从 MVP、代码审计到应用商店上架及后续维护。',
    sk1t: 'Flutter 跨平台应用',
    sk1d: '用同一套 Dart 代码库开发 iOS 和 Android 应用：Clean Architecture、BLoC 与 Riverpod，以及通过 flavors 用同一份代码构建多个应用。',
    sk2t: '原生 iOS 与 Android',
    sk2d: 'Flutter 无法覆盖的场景，用 Swift、SwiftUI 和 Kotlin 实现：Platform Channels、原生 SDK、watchOS 原型、Android&nbsp;13/14 权限适配。',
    sk3t: '订阅与应用内购买',
    sk3d: 'StoreKit&nbsp;2 与 Google Play Billing（含服务端校验）、RevenueCat、付费墙和恢复购买。能让应用顺利通过 App Store 审核。',
    sk4t: '健康数据与可穿戴设备',
    sk4d: 'HealthKit（40+ 种类型）与 Health Connect：手表和手机数据、同步，以及 Google Play 关于健康数据的审核规则。',
    sk5t: '视频通话与 AI 功能',
    sk5d: '基于 WebRTC 和 LiveKit 的视频通话；通过 SSE 流式输出 LLM 回复，并用文本转语音朗读。',
    sk6t: '相机、计算机视觉与 OCR',
    sk6d: '原生相机 SDK、文档扫描、通过摄像头统计动作次数。无需自建后端的端侧 ML 与 OCR：ONNX Runtime、OpenCV、Tesseract。',
    sk7t: '代码审计与项目挽救',
    sk7d: '深入梳理接手的代码，编写架构文档，推动停滞项目上线：其中一个项目从代码审计到上线仅用 1.5&nbsp;个月。',
    sk8t: 'AI 原生开发',
    sk8d: '1.5&nbsp;年来每天使用 Claude Code 和 Cursor：智能体流水线（含审查智能体）、Figma MCP。借助 Dart MCP 消除了 2,000+ 次不必要的 widget 重建。',
    hireT: '<strong>求职意向：</strong>高级 Flutter 开发工程师、移动端开发工程师（Flutter）或 Flutter 技术负责人 · 全职、兼职或合同制 · 远程，GMT+7',
    toTop: '返回顶部'
  };

  const HI = {
    skip: 'मुख्य सामग्री पर जाएँ',
    brandLabel: 'Ruslan Barysiuk, ऊपर जाएँ',
    name: 'Ruslan Barysiuk',
    navLabel: 'सेक्शन',
    navApps: 'ऐप्स',
    navResume: 'रिज़्यूमे',
    navContacts: 'संपर्क',
    langLegendSite: 'साइट और रिज़्यूमे की भाषा',
    themeLegendSite: 'साइट और रिज़्यूमे की थीम',
    light: 'लाइट',
    dark: 'डार्क',
    chip: 'काम के लिए उपलब्ध · रिमोट · GMT+7',
    role: 'सीनियर Flutter<br>डेवलपर',
    lead: 'iOS और Android ऐप्स को एस्टिमेट और रोडमैप से App&nbsp;Store और Google&nbsp;Play पर रिलीज़ तक ले जाता हूँ।',
    ctaTg: 'Telegram पर मैसेज करें',
    ctaEmail: 'ईमेल कॉपी करें',
    copiedEmail: 'ईमेल कॉपी हो गया',
    ctaPdf: 'रिज़्यूमे PDF डाउनलोड करें',
    artLabel: 'पोर्ट्रेट और ऐप्स के स्क्रीनशॉट: Healthy4u, ProveUp, डॉक्यूमेंट स्कैनर',
    openToWork: 'काम के लिए उपलब्ध',
    altPuKits: 'ProveUp: अवतार गियर',
    altScCamera: 'डॉक्यूमेंट स्कैनर: स्कैन मोड वाला कैमरा',
    altH4uInsights: 'Healthy4u: साप्ताहिक हेल्थ ट्रेंड्स',
    altH4uPaywall: 'Healthy4u: सब्सक्रिप्शन पेवॉल',
    altPuCoach: 'ProveUp: कोच स्क्रीन',
    altH4uHome: 'Healthy4u: AI असिस्टेंट की होम स्क्रीन',
    altPuHome: 'ProveUp: प्लेयर अवतार वाली होम स्क्रीन',
    f1n: '5 <span>साल</span>',
    f1l: 'कमर्शियल डेवलपमेंट में',
    f2n: '6 <span>ऐप्स</span>',
    f2l: 'App&nbsp;Store और Google&nbsp;Play में',
    f3n: '1.5 <span>महीने</span>',
    f3l: 'अटके प्रोजेक्ट के ऑडिट से रिलीज़ तक',
    f4n: '1,014',
    f4l: 'पिछले एक&nbsp;साल में GitHub योगदान',
    appsTitle: 'ऐप्स',
    appsLead: 'Flutter ऐप्स, जो नेटिव जैसे लगते हैं: सब्सक्रिप्शन, स्मार्टवॉच से हेल्थ डेटा, रियल-टाइम वीडियो, कंप्यूटर विज़न।',
    h4uSub: 'AI हेल्थ असिस्टेंट',
    h4uDates: 'जून 2025 – सितंबर 2026',
    h4uRole: 'Swift से Flutter में दोबारा लिखा · 15 महीने तक एकमात्र मोबाइल डेवलपर',
    h4uText: 'स्मार्टवॉच से हेल्थ डेटा: HealthKit (40+ टाइप), Health Connect और SwiftUI में watchOS प्रोटोटाइप। StoreKit&nbsp;2 और Google Play Billing पर नेटिव सब्सक्रिप्शन, बैकएंड डेवलपर के साथ सर्वर पर वैलिडेशन।',
    altH4uSync: 'Healthy4u: Apple Health डेटा सिंक',
    altH4uChat: 'Healthy4u: AI चैट में मील लॉगिंग',
    altH4uNutrition: 'Healthy4u: दैनिक पोषण प्रगति',
    altH4uVoice: 'Healthy4u: असिस्टेंट की वॉइस सेटिंग्स',
    puSub: 'फ़िटनेस बैटल और फ़्रीस्टाइल फ़ुटबॉल',
    puDates: 'मई – सितंबर 2026, कॉन्ट्रैक्ट',
    puText: 'कंप्यूटर विज़न सीधे कैमरे से रेप्स गिनता है; LiveKit और WebRTC पर रियल-टाइम वीडियो।',
    puBuild: 'TestFlight बिल्ड',
    altPuBattle: 'ProveUp: बैटल एरीना',
    altPuRanking: 'ProveUp: प्लेयर रैंकिंग',
    altPuCamera: 'ProveUp: कैमरा एक्सरसाइज़ पहचानता है',
    scTitle: 'डॉक्यूमेंट स्कैनर और PDF&nbsp;एडिटर',
    scDates: 'सितंबर – अक्टूबर 2026, कॉन्ट्रैक्ट',
    scText: 'अटके प्रोजेक्ट से जुड़कर उसे 1.5&nbsp;महीने में ऑडिट से रिलीज़ तक पहुँचाया। नेटिव कैमरा SDK, ONNX Runtime और OpenCV के साथ ऑन-डिवाइस ML और OCR। RevenueCat पर सब्सक्रिप्शन।',
    altScPin: 'स्कैनर: PIN-सुरक्षित फ़ोल्डर',
    altScProfile: 'स्कैनर: प्रोफ़ाइल और PRO सब्सक्रिप्शन',
    altScCamera2: 'स्कैनर: स्कैन मोड वाला कैमरा',
    earlyTitle: 'प्रोजेक्ट्स 2022–2025',
    earlySub: 'मार्केटप्लेस, हायरिंग सर्विस और क्रिप्टो&nbsp;वॉलेट — टीम में और अकेले',
    kAgro: 'कृषि क्लासिफ़ाइड्स',
    kKerla: 'क्लासिफ़ाइड्स मार्केटप्लेस',
    nRab: 'Rabotnik24',
    kRab: 'हायरिंग प्लेटफ़ॉर्म',
    kSfera: 'सोशल प्लेटफ़ॉर्म',
    kGyber: 'क्रिप्टो वॉलेट',
    altRab: 'Rabotnik24: वेलकम स्क्रीन',
    altAgro: 'Agrotook: Google Play प्रोमो',
    altKerla: 'Kerla: लिस्टिंग फ़ीड',
    altGyber: 'Gyber Wallet: वेलकम स्क्रीन',
    resumeTitle: 'रिज़्यूमे',
    resumeLead: 'दस भाषाओं में छह A4 पेज, लाइट और डार्क। लिंक और PDF आपकी पसंद के हिसाब से बदलते हैं।',
    langLegend: 'भाषा',
    themeLegend: 'थीम',
    dlPdf: 'PDF डाउनलोड करें',
    allFiles: 'सभी फ़ाइलें: PDF और DOCX',
    menuPdf: 'PDF, 6 पेज',
    fRuLight: 'रूसी, लाइट',
    fRuDark: 'रूसी, डार्क',
    fEnLight: 'अंग्रेज़ी, लाइट',
    fEnDark: 'अंग्रेज़ी, डार्क',
    fUkLight: 'यूक्रेनी, लाइट',
    fUkDark: 'यूक्रेनी, डार्क',
    fBeLight: 'बेलारूसी, लाइट',
    fBeDark: 'बेलारूसी, डार्क',
    fKkLight: 'कज़ाख़, लाइट',
    fKkDark: 'कज़ाख़, डार्क',
    fEsLight: 'स्पेनिश, लाइट',
    fEsDark: 'स्पेनिश, डार्क',
    fFrLight: 'फ़्रेंच, लाइट',
    fFrDark: 'फ़्रेंच, डार्क',
    fZhLight: 'चीनी, लाइट',
    fZhDark: 'चीनी, डार्क',
    fHiLight: 'हिन्दी, लाइट',
    fHiDark: 'हिन्दी, डार्क',
    fArLight: 'अरबी, लाइट',
    fArDark: 'अरबी, डार्क',
    menuAts: 'ATS के लिए: एक कॉलम, DOCX',
    fAtsRu: 'रूसी',
    fAtsEn: 'अंग्रेज़ी',
    copyLink: 'इस वर्ज़न का लिंक कॉपी करें',
    copiedLink: 'लिंक कॉपी हो गया',
    pagesLabel: 'रिज़्यूमे के पेज',
    pagesTitle: 'पेज',
    p1: 'सारांश',
    p2: 'अनुभव',
    p4: 'ProveUp और स्कैनर',
    p5: 'प्रोजेक्ट्स 2022–2025',
    p6: 'टेक स्टैक',
    pg1: 'पेज 1 / 6',
    pg2: 'पेज 2 / 6',
    pg3: 'पेज 3 / 6',
    pg4: 'पेज 4 / 6',
    pg5: 'पेज 5 / 6',
    pg6: 'पेज 6 / 6',
    if1: 'रिज़्यूमे, 6 में से पेज 1',
    if2: 'रिज़्यूमे, 6 में से पेज 2',
    if3: 'रिज़्यूमे, 6 में से पेज 3',
    if4: 'रिज़्यूमे, 6 में से पेज 4',
    if5: 'रिज़्यूमे, 6 में से पेज 5',
    if6: 'रिज़्यूमे, 6 में से पेज 6',
    openPage: 'पेज खोलें',
    ghTitle: 'GitHub एक्टिविटी',
    ghLead: 'हर बॉक्स पिछले 12&nbsp;महीनों का एक दिन है। जितना गहरा रंग, उतने ज़्यादा योगदान।',
    ghBig: '1,014',
    ghCap: 'पिछले एक साल में योगदान',
    ghDays: '<strong>215</strong> सक्रिय दिन',
    ghSince: '<strong>2020</strong> से GitHub पर',
    ghScroll: 'एक्टिविटी ग्राफ़, बाएँ-दाएँ स्क्रॉल होता है',
    ghAria: 'GitHub एक्टिविटी ग्राफ़: पिछले एक साल में 1,014 योगदान और 215 सक्रिय दिन',
    less: 'कम',
    more: 'ज़्यादा',
    contactsTitle: 'संपर्क',
    contactsLead: 'Telegram पर लिखना सबसे अच्छा है। बैंकॉक (GMT+7) से रिमोट, फ़ुल-टाइम या पार्ट-टाइम (प्रति घंटा बिलिंग)।',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया',
    phoneLabel: 'फ़ोन और WhatsApp',
    openProfile: 'प्रोफ़ाइल खोलें',
    note1: 'अंग्रेज़ी B1, हफ़्ते में तीन बार क्लास',
    note2: 'पिछले नियोक्ता से सिफ़ारिशी पत्र, अनुरोध पर',
    note3: '1.5 साल से रोज़ के काम में AI एजेंट: Claude Code, Cursor',
    footer: 'Vanilla HTML/CSS/JS · GitHub Pages · अपडेट: अक्टू 2026',
    skillsTitle: 'मैं क्या दे सकता हूँ',
    skillsLead: 'नेटिव iOS और Android इंटीग्रेशन के साथ Flutter डेवलपमेंट: MVP और कोड&nbsp;ऑडिट से लेकर स्टोर रिलीज़ और सपोर्ट तक।',
    sk1t: 'Flutter पर क्रॉस-प्लेटफ़ॉर्म ऐप्स',
    sk1d: 'एक ही Dart कोडबेस से iOS और Android ऐप्स: Clean Architecture, BLoC और Riverpod, और flavors, जिनसे उसी कोड से कई ऐप्स बनते हैं।',
    sk2t: 'नेटिव iOS और Android',
    sk2d: 'जहाँ Flutter काफ़ी नहीं, वहाँ Swift, SwiftUI और Kotlin: platform channels, नेटिव SDK, watchOS प्रोटोटाइप, Android&nbsp;13/14 परमिशन।',
    sk3t: 'सब्सक्रिप्शन और इन-ऐप खरीदारी',
    sk3d: 'सर्वर-साइड वैलिडेशन के साथ StoreKit&nbsp;2 और Google Play Billing, RevenueCat, पेवॉल और खरीदारी रीस्टोर। ऐप्स को App Store रिव्यू पास कराता हूँ।',
    sk4t: 'हेल्थ डेटा और वियरेबल्स',
    sk4d: 'HealthKit (40+ टाइप) और Health Connect: स्मार्टवॉच और फ़ोन से डेटा, सिंक, और हेल्थ डेटा के लिए Google Play रिव्यू के नियम।',
    sk5t: 'वीडियो कॉल और AI फ़ीचर्स',
    sk5d: 'WebRTC और LiveKit पर वीडियो कॉल, SSE पर LLM जवाबों की स्ट्रीमिंग और टेक्स्ट-टू-स्पीच से उन्हें बोलकर सुनाना।',
    sk6t: 'कैमरा, कंप्यूटर विज़न और OCR',
    sk6d: 'नेटिव कैमरा SDK, डॉक्यूमेंट स्कैनिंग, कैमरे से रेप्स की गिनती। बिना कस्टम बैकएंड के ऑन-डिवाइस ML और OCR: ONNX Runtime, OpenCV, Tesseract।',
    sk7t: 'कोड ऑडिट और प्रोजेक्ट रेस्क्यू',
    sk7d: 'विरासत में मिले कोड को समझता हूँ, आर्किटेक्चर डॉक्यूमेंट करता हूँ और अटके प्रोजेक्ट रिलीज़ करता हूँ: एक प्रोजेक्ट 1.5&nbsp;महीने में ऑडिट से रिलीज़ तक पहुँचा।',
    sk8t: 'AI-नेटिव डेवलपमेंट',
    sk8d: '1.5&nbsp;साल से रोज़ Claude Code और Cursor: रिव्यूअर एजेंट वाली एजेंट पाइपलाइन, Figma MCP। Dart MCP से 2,000+ अनावश्यक विजेट रीबिल्ड हटाए।',
    hireT: '<strong>काम के लिए उपलब्ध:</strong> सीनियर Flutter डेवलपर, मोबाइल डेवलपर (Flutter) या Flutter लीड · फ़ुल-टाइम, पार्ट-टाइम या कॉन्ट्रैक्ट · रिमोट, GMT+7',
    toTop: 'ऊपर जाएँ'
  };

  const AR = {
    skip: 'انتقل إلى المحتوى',
    brandLabel: 'Ruslan Barysiuk، العودة إلى الأعلى',
    name: 'Ruslan Barysiuk',
    navLabel: 'الأقسام',
    navApps: 'التطبيقات',
    navResume: 'السيرة الذاتية',
    navContacts: 'التواصل',
    langLegendSite: 'لغة الموقع والسيرة الذاتية',
    themeLegendSite: 'مظهر الموقع والسيرة الذاتية',
    light: 'فاتح',
    dark: 'داكن',
    chip: 'متاح للعمل · عن بُعد · GMT+7',
    role: 'مطوّر<br>Flutter أول',
    lead: 'أقود تطبيقات iOS وAndroid من التقدير وخارطة&nbsp;الطريق حتى الإطلاق على App&nbsp;Store وGoogle&nbsp;Play.',
    ctaTg: 'راسلني على Telegram',
    ctaEmail: 'نسخ البريد الإلكتروني',
    copiedEmail: 'تم نسخ البريد الإلكتروني',
    ctaPdf: 'تنزيل السيرة الذاتية PDF',
    artLabel: 'صورة شخصية ولقطات شاشة للتطبيقات: Healthy4u وProveUp وماسح المستندات',
    openToWork: 'متاح للعمل',
    altPuKits: 'ProveUp: تجهيزات الأفاتار',
    altScCamera: 'ماسح المستندات: الكاميرا مع أوضاع المسح',
    altH4uInsights: 'Healthy4u: الاتجاهات الصحية الأسبوعية',
    altH4uPaywall: 'Healthy4u: شاشة الاشتراك المدفوع',
    altPuCoach: 'ProveUp: شاشة المدرب',
    altH4uHome: 'Healthy4u: الشاشة الرئيسية للمساعد الذكي',
    altPuHome: 'ProveUp: الشاشة الرئيسية مع أفاتار اللاعب',
    f1n: '5 <span>سنوات</span>',
    f1l: 'في المشاريع التجارية',
    f2n: '6 <span>تطبيقات</span>',
    f2l: 'على App&nbsp;Store وGoogle&nbsp;Play',
    f3n: '1.5 <span>شهر</span>',
    f3l: 'من التدقيق حتى إطلاق مشروع متعثر',
    f4n: '1,014',
    f4l: 'مساهمة على GitHub في العام&nbsp;الأخير',
    appsTitle: 'التطبيقات',
    appsLead: 'تطبيقات Flutter بتجربة أصلية: الاشتراكات، والبيانات الصحية من الساعات، والفيديو الفوري، والرؤية الحاسوبية.',
    h4uSub: 'مساعد صحي بالذكاء الاصطناعي',
    h4uDates: 'يونيو 2025 – سبتمبر 2026',
    h4uRole: 'أعدت كتابته من Swift إلى Flutter · مطوّر الجوال الوحيد لمدة 15 شهرًا',
    h4uText: 'البيانات الصحية من الساعات الذكية: HealthKit (40+ نوعًا)، وHealth Connect، ونموذج أولي على&nbsp;watchOS باستخدام SwiftUI. اشتراكات أصلية عبر StoreKit&nbsp;2 وGoogle Play Billing مع التحقق منها على الخادم بالتعاون مع مطوّر الواجهة الخلفية.',
    altH4uSync: 'Healthy4u: مزامنة بيانات Apple Health',
    altH4uChat: 'Healthy4u: الدردشة الذكية تسجّل الوجبات',
    altH4uNutrition: 'Healthy4u: التقدم اليومي في التغذية',
    altH4uVoice: 'Healthy4u: إعدادات صوت المساعد',
    puSub: 'مبارزات اللياقة وكرة القدم الاستعراضية',
    puDates: 'مايو – سبتمبر 2026، عقد',
    puText: 'رؤية حاسوبية تعدّ التكرارات مباشرة من الكاميرا؛ وفيديو فوري عبر LiveKit وWebRTC.',
    puBuild: 'نسخة TestFlight',
    altPuBattle: 'ProveUp: ساحة المبارزات',
    altPuRanking: 'ProveUp: تصنيف اللاعبين',
    altPuCamera: 'ProveUp: الكاميرا تتعرف على التمرين',
    scTitle: 'ماسح المستندات ومحرّر&nbsp;PDF',
    scDates: 'سبتمبر – أكتوبر 2026، عقد',
    scText: 'انضممت إلى مشروع متعثر وأوصلته من التدقيق إلى الإطلاق في 1.5&nbsp;شهر. حزم SDK أصلية للكاميرا، وتعلم آلي وOCR على الجهاز عبر ONNX Runtime وOpenCV. اشتراكات عبر RevenueCat.',
    altScPin: 'الماسح: مجلد محمي برمز PIN',
    altScProfile: 'الماسح: الملف الشخصي واشتراك PRO',
    altScCamera2: 'الماسح: الكاميرا مع أوضاع المسح',
    earlyTitle: 'مشاريع 2022–2025',
    earlySub: 'أسواق إلكترونية، وخدمة توظيف، ومحفظة&nbsp;عملات مشفرة — ضمن فرق وبمفردي',
    kAgro: 'إعلانات زراعية مبوبة',
    kKerla: 'سوق إعلانات مبوبة',
    nRab: 'Rabotnik24',
    kRab: 'منصة توظيف',
    kSfera: 'منصة اجتماعية',
    kGyber: 'محفظة عملات مشفرة',
    altRab: 'Rabotnik24: شاشة الترحيب',
    altAgro: 'Agrotook: الترويج في Google Play',
    altKerla: 'Kerla: موجز الإعلانات',
    altGyber: 'Gyber Wallet: شاشة الترحيب',
    resumeTitle: 'السيرة الذاتية',
    resumeLead: 'ست صفحات A4 بعشر لغات، بمظهر فاتح وداكن. الرابط وملف PDF يتبعان اختيارك.',
    langLegend: 'اللغة',
    themeLegend: 'المظهر',
    dlPdf: 'تنزيل PDF',
    allFiles: 'جميع الملفات: PDF وDOCX',
    menuPdf: 'PDF، 6 صفحات',
    fRuLight: 'الروسية، فاتح',
    fRuDark: 'الروسية، داكن',
    fEnLight: 'الإنجليزية، فاتح',
    fEnDark: 'الإنجليزية، داكن',
    fUkLight: 'الأوكرانية، فاتح',
    fUkDark: 'الأوكرانية، داكن',
    fBeLight: 'البيلاروسية، فاتح',
    fBeDark: 'البيلاروسية، داكن',
    fKkLight: 'الكازاخية، فاتح',
    fKkDark: 'الكازاخية، داكن',
    fEsLight: 'الإسبانية، فاتح',
    fEsDark: 'الإسبانية، داكن',
    fFrLight: 'الفرنسية، فاتح',
    fFrDark: 'الفرنسية، داكن',
    fZhLight: 'الصينية، فاتح',
    fZhDark: 'الصينية، داكن',
    fHiLight: 'الهندية، فاتح',
    fHiDark: 'الهندية، داكن',
    fArLight: 'العربية، فاتح',
    fArDark: 'العربية، داكن',
    menuAts: 'لأنظمة ATS: عمود واحد، DOCX',
    fAtsRu: 'الروسية',
    fAtsEn: 'الإنجليزية',
    copyLink: 'نسخ رابط هذه النسخة',
    copiedLink: 'تم نسخ الرابط',
    pagesLabel: 'صفحات السيرة الذاتية',
    pagesTitle: 'الصفحات',
    p1: 'نظرة عامة',
    p2: 'الخبرة',
    p4: 'ProveUp وماسح المستندات',
    p5: 'مشاريع 2022–2025',
    p6: 'حزمة التقنيات',
    pg1: 'الصفحة 1 من 6',
    pg2: 'الصفحة 2 من 6',
    pg3: 'الصفحة 3 من 6',
    pg4: 'الصفحة 4 من 6',
    pg5: 'الصفحة 5 من 6',
    pg6: 'الصفحة 6 من 6',
    if1: 'السيرة الذاتية، الصفحة 1 من 6',
    if2: 'السيرة الذاتية، الصفحة 2 من 6',
    if3: 'السيرة الذاتية، الصفحة 3 من 6',
    if4: 'السيرة الذاتية، الصفحة 4 من 6',
    if5: 'السيرة الذاتية، الصفحة 5 من 6',
    if6: 'السيرة الذاتية، الصفحة 6 من 6',
    openPage: 'فتح الصفحة',
    ghTitle: 'النشاط على GitHub',
    ghLead: 'كل مربع يمثل يومًا من آخر 12&nbsp;شهرًا. كلما كان أغمق، زادت المساهمات.',
    ghBig: '1,014',
    ghCap: 'مساهمة في العام الأخير',
    ghDays: '<strong>215</strong> يومًا نشطًا',
    ghSince: 'على GitHub منذ <strong>2020</strong>',
    ghScroll: 'مخطط النشاط، قابل للتمرير أفقيًا',
    ghAria: 'مخطط النشاط على GitHub: 1,014 مساهمة و215 يومًا نشطًا في العام الأخير',
    less: 'أقل',
    more: 'أكثر',
    contactsTitle: 'التواصل',
    contactsLead: 'أفضل وسيلة للتواصل هي Telegram. أعمل عن بُعد من بانكوك (GMT+7)، بدوام كامل أو جزئي مع محاسبة بالساعة.',
    copy: 'نسخ',
    copied: 'تم النسخ',
    phoneLabel: 'الهاتف وWhatsApp',
    openProfile: 'فتح الملف الشخصي',
    note1: 'الإنجليزية B1، دروس ثلاث مرات أسبوعيًا',
    note2: 'خطاب توصية من صاحب عمل سابق عند الطلب',
    note3: 'وكلاء الذكاء الاصطناعي في العمل اليومي منذ 1.5 سنة: Claude Code وCursor',
    footer: 'HTML/CSS/JS بلا أطر عمل · GitHub Pages · آخر تحديث: أكتوبر 2026',
    skillsTitle: 'ما أقدّمه',
    skillsLead: 'تطوير Flutter مع تكاملات iOS وAndroid الأصلية: من MVP وتدقيق&nbsp;الكود إلى الإطلاق في المتاجر والدعم.',
    sk1t: 'تطبيقات Flutter متعددة المنصات',
    sk1d: 'تطبيقات iOS وAndroid من قاعدة&nbsp;كود Dart واحدة: Clean Architecture وBLoC وRiverpod، وflavors لبناء عدة تطبيقات من الكود نفسه.',
    sk2t: 'تطوير أصلي على iOS وAndroid',
    sk2d: 'Swift وSwiftUI وKotlin حين لا يكفي Flutter: Platform Channels، وحزم SDK أصلية، ونموذج أولي على&nbsp;watchOS، وأذونات Android&nbsp;13/14.',
    sk3t: 'الاشتراكات والمشتريات داخل التطبيق',
    sk3d: 'StoreKit&nbsp;2 وGoogle Play Billing مع التحقق من جهة الخادم، وRevenueCat، وشاشات الاشتراك، واستعادة المشتريات. أتولى تمرير التطبيقات عبر مراجعة App&nbsp;Store.',
    sk4t: 'البيانات الصحية والساعات الذكية',
    sk4d: 'HealthKit (40+ نوعًا) وHealth Connect: بيانات من الساعات والهواتف، والمزامنة، وقواعد مراجعة Google Play للبيانات الصحية.',
    sk5t: 'مكالمات الفيديو والذكاء الاصطناعي',
    sk5d: 'مكالمات فيديو عبر WebRTC وLiveKit، وبث ردود LLM عبر SSE وقراءتها بصوت مسموع بتحويل النص إلى كلام.',
    sk6t: 'الكاميرا والرؤية الحاسوبية وOCR',
    sk6d: 'حزم SDK أصلية للكاميرا، ومسح المستندات، وعدّ التكرارات عبر الكاميرا. تعلم آلي وOCR على الجهاز دون خادم مخصص: ONNX Runtime وOpenCV وTesseract.',
    sk7t: 'تدقيق الكود وإنقاذ المشاريع',
    sk7d: 'أتعمق في الكود الموروث، وأوثّق البنية المعمارية، وأنجز المشاريع المتعثرة: أحدها وصل من التدقيق إلى الإطلاق في 1.5&nbsp;شهر.',
    sk8t: 'تطوير قائم على الذكاء الاصطناعي',
    sk8d: 'أستخدم Claude Code وCursor يوميًا منذ 1.5&nbsp;سنة: خطوط عمل بالوكلاء مع وكيل مراجعة، وFigma MCP. وعبر Dart MCP أزلت 2,000+ إعادة بناء غير ضرورية للودجات.',
    hireT: '<strong>متاح للتوظيف:</strong> مطوّر Flutter أول، أو مطوّر تطبيقات جوال (Flutter)، أو قائد فريق Flutter · دوام كامل أو جزئي أو بعقد · عن بُعد، GMT+7',
    toTop: 'العودة إلى الأعلى'
  };

  /* Russian copy for pages whose static markup is in another language (embedded by tools/prerender_hub.py). */
  const RU = (() => { try { return JSON.parse(document.getElementById('i18n-ru').textContent); } catch (e) { return null; } })();
  const L10N = { en: EN, uk: UK, be: BE, kk: KK, ru: RU, es: ES, fr: FR, zh: ZH, hi: HI, ar: AR };
  const LANGS = ['en', 'ru', 'uk', 'be', 'kk', 'es', 'fr', 'zh', 'hi', 'ar'];

  const prefs = (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })();
  const initial = new URLSearchParams(location.search);
  const state = { lang: LANGS.includes(d.lang) ? d.lang : 'ru', theme: d.getAttribute('data-theme') === 'dark' ? 'dark' : 'light' };
  let followOS = !/^(light|dark)$/.test(initial.get('theme') || prefs.theme || '');

  const metaTheme = $('meta[name="theme-color"]');
  const live = $('#live');
  const frames = $$('iframe[data-page]');
  let refreshIndex = null;
  const i18nText = $$('[data-i18n]').map((el) => ({ el, key: el.dataset.i18n, orig: el.innerHTML }));
  const i18nAttr = $$('[data-i18n-attr]').flatMap((el) => el.dataset.i18nAttr.split(';').map((pair) => {
    const [attr, key] = pair.split(':');
    return { el, attr, key, orig: el.getAttribute(attr) };
  }));

  function announce(msg) {
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 60);
  }

  function applyLang() {
    const dict = state.lang === STATIC ? null : L10N[state.lang];
    d.lang = state.lang;
    d.dir = RTL.includes(state.lang) ? 'rtl' : 'ltr';
    for (const t of i18nText) {
      const v = dict ? (dict[t.key] ?? t.orig) : t.orig;
      if (v != null && t.el.innerHTML !== v) t.el.innerHTML = v;
    }
    for (const t of i18nAttr) {
      const v = dict ? (dict[t.key] ?? t.orig) : t.orig;
      if (v != null) t.el.setAttribute(t.attr, v);
    }
    document.title = UI[state.lang].title;
    const md = $('meta[name="description"]');
    if (md) md.setAttribute('content', UI[state.lang].desc);
    if (typeof refreshIndex === 'function') refreshIndex();
    renderGraph();
    d.classList.remove('i18n-wait');
  }

  function paintTheme() {
    d.setAttribute('data-theme', state.theme);
    if (metaTheme) metaTheme.content = state.theme === 'dark' ? '#0A0D14' : '#FFFFFF';
  }

  function switchTheme(origin) {
    const calm = () => requestAnimationFrame(() => requestAnimationFrame(() => d.classList.remove('no-anim')));
    if (document.startViewTransition && !document.hidden) {
      const reveal = !!origin && !mqReduce.matches;
      if (reveal) d.classList.add('vt-reveal');
      const vt = document.startViewTransition(() => { d.classList.add('no-anim'); paintTheme(); });
      if (reveal) {
        vt.ready.then(() => {
          const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
          d.animate({ clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
            { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' });
        }).catch(() => {});
      }
      vt.finished.finally(() => { d.classList.remove('vt-reveal'); calm(); });
    } else {
      d.classList.add('no-anim');
      paintTheme();
      void d.offsetHeight;
      calm();
    }
  }

  function variant() { return `${state.lang}-${state.theme}`; }

  function updateVariant() {
    const v = variant();
    const pdf = `pdf/Barysiuk_Ruslan_Flutter_${TAG[state.lang]}_${state.theme === 'dark' ? 'Dark' : 'Light'}.pdf`;
    $$('[data-pdf]').forEach((a) => a.setAttribute('href', pdf));
    $$('[data-variant]').forEach((s) => { s.textContent = UI[state.lang].variant[v]; });
    $$('[data-file]').forEach((a) => (a.dataset.file === v ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    $$('[data-page-link]').forEach((a) => a.setAttribute('href', `pages/${v}/${a.dataset.pageLink}.html`));
    frames.forEach((f) => {
      const src = `pages/${v}/${f.dataset.page}.html`;
      if (f.getAttribute('src') === src) return;
      clearTimeout(f._swap);
      if (f.classList.contains('is-loaded')) {
        f.classList.remove('is-loaded');
        f._swap = setTimeout(() => f.setAttribute('src', src), mqReduce.matches ? 0 : 180);
      } else {
        f.setAttribute('src', src);
      }
    });
  }

  function syncInputs() {
    $$('input[data-k]').forEach((i) => { i.checked = i.value === state[i.dataset.k]; });
    $$('[data-lang-current]').forEach((el) => { el.textContent = TAG[state.lang]; });
  }

  const isTag = (k) => k === 'ref' || k.startsWith('utm_');
  function pageURL() {
    const u = new URL(location.href);
    const tags = [...u.searchParams].filter(([k]) => isTag(k)); // visit-source tags for the counter
    u.pathname = u.pathname.replace(/[^/]*$/, `${state.lang}.html`);
    u.search = '';
    u.searchParams.set('theme', state.theme);
    tags.forEach(([k, v]) => u.searchParams.set(k, v));
    return u;
  }

  function writeURL() {
    try { history.replaceState(history.state, '', pageURL()); } catch (e) { /* file:// or sandboxed */ }
  }

  function setState(key, value, opts = {}) {
    if (state[key] === value) return;
    state[key] = value;
    if (key === 'theme') switchTheme(opts.origin); else applyLang();
    syncInputs();
    updateVariant();
    if (opts.quiet) return;
    writeURL();
    prefs[key] = value;
    try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch (e) { /* private mode */ }
    announce(UI[state.lang].announce(state.lang, state.theme));
  }

  $$('input[data-k]').forEach((input) => input.addEventListener('change', () => {
    if (!input.checked) return;
    const r = input.closest('label').getBoundingClientRect();
    if (input.dataset.k === 'theme') followOS = false;
    const menu = input.closest('details.lang-menu');
    if (menu) menu.open = false;
    setState(input.dataset.k, input.value, { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  }));

  /* header language menu: close on outside click and Escape */
  $$('details.lang-menu').forEach((menu) => {
    document.addEventListener('click', (e) => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
  });

  const onOS = (e) => { if (followOS) setState('theme', e.matches ? 'dark' : 'light', { quiet: true }); };
  if (mqDark.addEventListener) mqDark.addEventListener('change', onOS);

  /* copy email / link */
  function shareURL() {
    const u = pageURL();
    [...u.searchParams.keys()].filter(isTag).forEach((k) => u.searchParams.delete(k));
    u.hash = '';
    return u.href;
  }
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.append(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (err) { return false; }
    }
  }
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const isEmail = btn.dataset.copy === 'email';
    const ok = await copyText(isEmail ? EMAIL : shareURL());
    if (!ok) {
      if (isEmail) location.href = `mailto:${EMAIL}`;
      else announce(UI[state.lang].fail);
      return;
    }
    btn.classList.add('is-copied');
    announce(UI[state.lang][isEmail ? 'email' : 'link']);
    clearTimeout(btn._t);
    btn._t = setTimeout(() => btn.classList.remove('is-copied'), 2000);
  }));

  /* A4 sheets: scale to width, fade in on load */
  const fit = (el, w) => el.style.setProperty('--s', Math.min(1, w / 794).toFixed(4));
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target, e.contentRect.width)));
    $$('.sheet').forEach((s) => ro.observe(s));
  } else {
    const all = () => $$('.sheet').forEach((s) => fit(s, s.clientWidth));
    addEventListener('resize', all);
    all();
  }
  frames.forEach((f) => {
    f.addEventListener('load', () => {
      let blank = false;
      try { blank = f.contentWindow.location.href === 'about:blank'; } catch (e) { /* cross-origin */ }
      if (!blank) f.classList.add('is-loaded');
    });
    try {
      const doc = f.contentDocument;
      if (doc && doc.readyState === 'complete' && f.contentWindow.location.href !== 'about:blank') f.classList.add('is-loaded');
    } catch (e) { /* ignore */ }
  });

  /* page index: highlight the page in view; on phones it drives the carousel */
  const idx = $$('.pindex a');
  const items = $$('.sheet-item');
  const sheetsBox = $('#sheets');
  const nowLabel = $('#pindex-now');
  const pageName = (a) => (a ? a.querySelector('.sr-only').textContent : '');
  let current = '1';
  const showName = (a) => { if (nowLabel) nowLabel.textContent = pageName(a); };
  const setCurrent = (n) => {
    current = String(n);
    idx.forEach((a) => (a.dataset.n === current ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    showName(idx[+current - 1]);
  };
  idx.forEach((a) => {
    a.addEventListener('mouseenter', () => showName(a));
    a.addEventListener('focus', () => showName(a));
    a.addEventListener('mouseleave', () => showName(idx[+current - 1]));
    a.addEventListener('blur', () => showName(idx[+current - 1]));
  });
  let io;
  function watchPages() {
    if (!('IntersectionObserver' in window)) return;
    if (io) io.disconnect();
    const carousel = mqCarousel.matches;
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id.split('-')[1]); });
    }, carousel ? { root: sheetsBox, threshold: 0.6 } : { rootMargin: '-40% 0px -55% 0px' });
    items.forEach((i) => io.observe(i));
  }
  refreshIndex = () => setCurrent(current);
  setCurrent(1);
  watchPages();
  if (mqCarousel.addEventListener) mqCarousel.addEventListener('change', watchPages);
  idx.forEach((a) => a.addEventListener('click', (e) => {
    if (!mqCarousel.matches) return;
    e.preventDefault();
    const el = $(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }));

  /* header hairline once the page scrolls */
  const header = $('.site-header');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { header.classList.toggle('is-stuck', scrollY > 4); ticking = false; });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* GitHub contribution graph (53 weeks, Sunday-first columns) */
  function renderGraph() {
    const host = $('#gh-graph');
    if (!host) return;
    const L = UI[state.lang];
    const cell = 10, gap = 3, p = cell + gap, left = 28, top = 16;
    const cols = GH.length / 7;
    const W = left + cols * p - gap, H = top + 7 * p - gap;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">`;
    let last = -9;
    for (let c = 0; c < cols; c++) {
      const day = new Date(GH_FIRST + c * 7 * 864e5);
      if ((c === 0 || day.getUTCDate() <= 7) && c - last >= 2 && c <= cols - 2) {
        s += `<text x="${left + c * p}" y="9">${L.months[day.getUTCMonth()]}</text>`;
        last = c;
      }
      for (let r = 0; r < 7; r++) {
        const v = GH[c * 7 + r];
        if (v !== 'x') s += `<rect x="${left + c * p}" y="${top + r * p}" width="${cell}" height="${cell}" rx="2.2" class="l${v}"/>`;
      }
    }
    L.days.forEach((t, i) => { s += `<text x="0" y="${top + (2 * i + 1) * p + 8.5}">${t}</text>`; });
    host.innerHTML = `${s}</svg>`;
    const sc = host.parentElement;
    if (sc.scrollWidth > sc.clientWidth) sc.scrollLeft = sc.scrollWidth;
  }

  /* init */
  syncInputs();
  updateVariant();
  applyLang();
  if (initial.get('lang')) writeURL(); // old ?lang= links land on the language page URL
})();
