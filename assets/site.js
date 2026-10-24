/* Ruslan Barysiuk — resume hub. Vanilla JS, no dependencies.
   One state for the whole site and the embedded resume: { lang: en|ru|uk|be|kk, theme: light|dark }.
   Priority: ?lang= → the page's own language (en.html, ru.html, uk.html, be.html, kk.html) → localStorage (explicit choices only)
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

  const TAG = { en: 'EN', ru: 'RU', uk: 'UKR', be: 'BEL', kk: 'KAZ' };
  const variants = (light, dark) => Object.fromEntries(Object.entries(TAG).flatMap(([l, tag]) => [[`${l}-light`, `${tag}, ${light}`], [`${l}-dark`, `${tag}, ${dark}`]]));
  const UI = {
    ru: {
      title: 'Руслан Борисюк — резюме Senior Flutter-разработчика (iOS, Android)',
      desc: 'Резюме Руслана Борисюка: Senior Flutter-разработчик (Flutter developer), мобильный разработчик iOS и Android, 5 лет коммерческого опыта. Открыт к удалённой работе.',
      months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      days: ['Пн', 'Ср', 'Пт'],
      variant: variants('светлая', 'тёмная'),
      announce: (l, t) => `Версия резюме: ${{ en: 'английский', ru: 'русский', uk: 'украинский', be: 'белорусский', kk: 'казахский' }[l]}, ${t === 'dark' ? 'тёмная' : 'светлая'} тема`,
      email: 'Email скопирован', link: 'Ссылка скопирована', fail: 'Не получилось скопировать'
    },
    en: {
      title: 'Ruslan Barysiuk — Senior Flutter Developer Resume (iOS, Android)',
      desc: 'Resume of Ruslan Barysiuk, Senior Flutter and mobile developer: 5 years of iOS and Android apps, from estimate to App Store and Google Play release. Open to remote work.',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days: ['Mon', 'Wed', 'Fri'],
      variant: variants('light', 'dark'),
      announce: (l, t) => `Resume version: ${{ en: 'English', ru: 'Russian', uk: 'Ukrainian', be: 'Belarusian', kk: 'Kazakh' }[l]}, ${t} theme`,
      email: 'Email copied', link: 'Link copied', fail: 'Could not copy'
    },
    uk: {
      title: 'Руслан Борисюк — резюме Senior Flutter Developer (iOS, Android)',
      desc: 'Резюме Руслана Борисюка: Senior Flutter Developer, розробник мобільних додатків для iOS та Android, 5 років комерційного досвіду. Відкритий до віддаленої роботи.',
      months: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'],
      days: ['Пн', 'Ср', 'Пт'],
      variant: variants('світла', 'темна'),
      announce: (l, t) => `Версія резюме: ${{ en: 'англійська', ru: 'російська', uk: 'українська', be: 'білоруська', kk: 'казахська' }[l]}, ${t === 'dark' ? 'темна' : 'світла'} тема`,
      email: 'Email скопійовано', link: 'Посилання скопійовано', fail: 'Не вдалося скопіювати'
    },
    be: {
      title: 'Руслан Барысюк — рэзюмэ Senior Flutter-распрацоўшчыка (iOS, Android)',
      desc: 'Рэзюмэ Руслана Барысюка: Senior Flutter-распрацоўшчык (Flutter developer), мабільны распрацоўшчык iOS і Android, 5 гадоў камерцыйнага досведу. Адкрыты да аддаленай працы.',
      months: ['сту', 'лют', 'сак', 'кра', 'тра', 'чэр', 'ліп', 'жні', 'вер', 'кас', 'ліс', 'сне'],
      days: ['Пн', 'Ср', 'Пт'],
      variant: variants('светлая', 'цёмная'),
      announce: (l, t) => `Версія рэзюмэ: ${{ en: 'англійская', ru: 'руская', uk: 'украінская', be: 'беларуская', kk: 'казахская' }[l]}, ${t === 'dark' ? 'цёмная' : 'светлая'} тэма`,
      email: 'Email скапіяваны', link: 'Спасылка скапіявана', fail: 'Не атрымалася скапіяваць'
    },
    kk: {
      title: 'Руслан Борисюк — Senior Flutter-әзірлеуші түйіндемесі (iOS, Android)',
      desc: 'Руслан Борисюктің түйіндемесі: Senior Flutter-әзірлеуші (Flutter developer), iOS және Android мобильді әзірлеушісі, 5 жыл коммерциялық тәжірибе. Қашықтан жұмысқа ашық.',
      months: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
      days: ['Дс', 'Ср', 'Жм'],
      variant: variants('ашық', 'қараңғы'),
      announce: (l, t) => `Түйіндеме нұсқасы: ${{ en: 'ағылшынша', ru: 'орысша', uk: 'украинша', be: 'беларусша', kk: 'қазақша' }[l]}, ${t === 'dark' ? 'қараңғы' : 'ашық'} тақырып`,
      email: 'Email көшірілді', link: 'Сілтеме көшірілді', fail: 'Көшіру мүмкін болмады'
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
    resumeLead: 'Six A4 pages in English, Russian, Ukrainian, Belarusian and Kazakh, light and dark. The link and the PDF follow your choice.',
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
    resumeLead: 'Шість сторінок A4 англійською, російською, українською, білоруською та&nbsp;казахською, у&nbsp;світлій і&nbsp;темній темі. Посилання й&nbsp;PDF змінюються разом із&nbsp;вибором.',
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
    resumeLead: 'Шэсць старонак A4 на&nbsp;англійскай, рускай, украінскай, беларускай і&nbsp;казахскай мовах, у&nbsp;светлай і&nbsp;цёмнай тэме. Спасылка і&nbsp;PDF мяняюцца разам з&nbsp;выбарам.',
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
    resumeLead: 'Ағылшын, орыс, украин, беларус және&nbsp;қазақ тілдеріндегі алты A4 беті, ашық және&nbsp;қараңғы тақырыпта. Сілтеме мен&nbsp;PDF таңдауыңызға қарай өзгереді.',
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

  /* Russian copy for pages whose static markup is in another language (embedded by tools/prerender_hub.py). */
  const RU = (() => { try { return JSON.parse(document.getElementById('i18n-ru').textContent); } catch (e) { return null; } })();
  const L10N = { en: EN, uk: UK, be: BE, kk: KK, ru: RU };
  const LANGS = ['en', 'ru', 'uk', 'be', 'kk'];

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
    setState(input.dataset.k, input.value, { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  }));

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
