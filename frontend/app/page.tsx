'use client'

import { useMemo ,useEffect, useRef, useState } from 'react'
import jsPDF from 'jspdf'
import {
  Bell,
  BookOpen,
  Download,
  Bookmark,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileCheck2,
  FolderOpen,
  Globe2,
  GitCompareArrows,
  Home,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  X,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react'


const UI_HI: Record<string, string> = {
  'New Search':'नई खोज','Dashboard':'डैशबोर्ड','My Documents':'मेरे दस्तावेज़','Saved Standards':'सहेजे गए मानक','Notifications':'सूचनाएँ','Workspace':'कार्यस्थल','QUALITY STANDARDS,':'गुणवत्ता मानक,','STRONGER INDIA':'मजबूत भारत','Build better specifications with trusted standards.':'विश्वसनीय मानकों के साथ बेहतर विनिर्देश तैयार करें।','Procurement intelligence platform':'प्रोक्योरमेंट इंटेलिजेंस प्लेटफ़ॉर्म','Turn Procurement Requirements':'प्रोक्योरमेंट आवश्यकताओं को बदलें','into the Right Indian Standards':'सही भारतीय मानकों में','AI-powered recommendations to help you create accurate, compliant and high-quality tender specifications.':'AI आधारित सुझावों से सटीक, अनुपालक और उच्च-गुणवत्ता वाले टेंडर विनिर्देश तैयार करें।','Provide Your Requirement':'अपनी आवश्यकता दर्ज करें','Input language':'इनपुट भाषा','Text Input':'टेक्स्ट इनपुट','Upload Document':'दस्तावेज़ अपलोड करें','Voice Input':'वॉइस इनपुट','Try an example':'एक उदाहरण आज़माएँ','Advanced Options':'उन्नत विकल्प','Find Relevant Standards':'प्रासंगिक मानक खोजें','Drag & drop your tender document here':'अपना टेंडर दस्तावेज़ यहाँ ड्रैग और ड्रॉप करें','Browse Files':'फ़ाइल चुनें','Speak your procurement requirement':'अपनी प्रोक्योरमेंट आवश्यकता बोलें','Listening...':'सुन रहा है...','Recommended Standards':'अनुशंसित मानक','AI recommendations will appear here after you provide your requirement':'आपकी आवश्यकता दर्ज करने के बाद AI सुझाव यहाँ दिखाई देंगे','Ready to find applicable Indian Standards':'लागू भारतीय मानक खोजने के लिए तैयार','Requirement Analysis':'आवश्यकता विश्लेषण','Semantic Search':'सेमांटिक खोज','BIS Standards':'BIS मानक','No exact standard found in the current AI knowledge base':'वर्तमान AI नॉलेज बेस में कोई सटीक मानक नहीं मिला','Your requirement:':'आपकी आवश्यकता:','Search Official BIS Standards':'आधिकारिक BIS मानक खोजें','Download Report':'रिपोर्ट डाउनलोड करें','Save to My List':'मेरी सूची में सहेजें','Saved':'सहेजा गया','View Details':'विवरण देखें','Why AI recommended this standard':'AI ने इस मानक की अनुशंसा क्यों की','Normative References':'नॉर्मेटिव संदर्भ','Safety Standards':'सुरक्षा मानक','Testing Standards':'परीक्षण मानक','Installation & Commissioning':'स्थापना और कमीशनिंग','Related Product Standards':'संबंधित उत्पाद मानक','Standard details':'मानक विवरण','Certification Requirements':'प्रमाणन आवश्यकताएँ','Quality Control Orders':'गुणवत्ता नियंत्रण आदेश','Amendments':'संशोधन','Related Standards':'संबंधित मानक','Save Standard':'मानक सहेजें','Add to Comparison':'तुलना में जोड़ें','No linked records available for this standard.':'इस मानक के लिए कोई लिंक्ड रिकॉर्ड उपलब्ध नहीं है।','Standards you saved from your procurement searches':'आपकी प्रोक्योरमेंट खोजों से सहेजे गए मानक','No saved standards yet':'अभी कोई मानक सहेजा नहीं गया है','No new notifications':'कोई नई सूचना नहीं','Updates will appear here when available.':'उपलब्ध होने पर अपडेट यहाँ दिखाई देंगे।','Standard saved successfully':'मानक सफलतापूर्वक सहेजा गया','No notifications yet':'अभी कोई सूचना नहीं है','Save a recommended standard to receive a notification.':'सूचना पाने के लिए किसी अनुशंसित मानक को सहेजें।','AI Understanding':'AI समझ','Understands context, not just keywords':'केवल कीवर्ड नहीं, संदर्भ को भी समझता है','Allied Standards':'संबंधित मानक','Finds related, normative and cross-referenced standards':'संबंधित, नॉर्मेटिव और क्रॉस-रेफरेंस मानक खोजता है','Latest & Compliant':'नवीनतम और अनुपालक','Checks latest versions and certification requirements':'नवीनतम संस्करण और प्रमाणन आवश्यकताओं की जाँच करता है','Analysing your requirement':'आपकी आवश्यकता का विश्लेषण किया जा रहा है','Understanding requirement':'आवश्यकता को समझना','Extracting technical parameters':'तकनीकी पैरामीटर निकालना','Searching Indian Standards':'भारतीय मानक खोजना','Checking latest versions':'नवीनतम संस्करण जाँचना','Government of India':'भारत सरकार','Bureau of Indian Standards':'भारतीय मानक ब्यूरो','Ministry of Consumer Affairs':'उपभोक्ता मामले मंत्रालय','Food & Public Distribution':'खाद्य एवं सार्वजनिक वितरण','Department of Consumer Affairs (DoCA)':'उपभोक्ता मामले विभाग (DoCA)','AI Recommendation Engine for Indian Standards':'भारतीय मानकों के लिए AI अनुशंसा इंजन','All clear':'सब ठीक है','1 new':'1 नया','English':'अंग्रेज़ी','Hindi':'हिन्दी','Last saved today, 10:42 AM':'अंतिम बार आज 10:42 AM पर सहेजा गया','Prototype data notice: recommendations, editions, amendments and certification details should be verified against official BIS sources before final procurement use.':'प्रोटोटाइप डेटा सूचना: अंतिम प्रोक्योरमेंट उपयोग से पहले अनुशंसाओं, संस्करणों, संशोधनों और प्रमाणन विवरणों को आधिकारिक BIS स्रोतों से सत्यापित करें।','Open New Search':'नई खोज खोलें','Edition':'संस्करण','Status':'स्थिति','Category':'श्रेणी','Match':'मैच','Describe your procurement requirement in simple words…':'अपनी प्रोक्योरमेंट आवश्यकता सरल शब्दों में लिखें…','We do not want to recommend an unrelated standard. You can search the official BIS catalogue for your requirement instead.':'हम किसी असंबंधित मानक की अनुशंसा नहीं करना चाहते। इसके बजाय आप अपनी आवश्यकता के लिए आधिकारिक BIS कैटलॉग खोज सकते हैं।','Enter your procurement requirement on the left. Our AI engine will analyze it and recommend relevant Indian Standards.':'बाईं ओर अपनी प्रोक्योरमेंट आवश्यकता दर्ज करें। हमारा AI इंजन उसका विश्लेषण करके संबंधित भारतीय मानकों की अनुशंसा करेगा।'};

function translateVisibleUI(language: 'EN'|'HI') {
  const root=document.body;
  const walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[]=[];
  let n: Node|null;
  while((n=walker.nextNode())) nodes.push(n as Text);
  nodes.forEach(node=>{
    const raw=node.nodeValue||'';
    const trimmed=raw.trim();
    if(!trimmed) return;
    const key=trimmed.replace(/\s+/g,' ');
    if(language==='HI' && UI_HI[key]) {
      node.nodeValue=raw.replace(trimmed,UI_HI[key]);
    } else if(language==='EN') {
      const english=Object.entries(UI_HI).find(([,hi])=>hi===key)?.[0];
      if(english) node.nodeValue=raw.replace(trimmed,english);
    } else if(language==='HI') {
      const m=key.match(/^(\d+) standards? matched to your procurement requirement$/i);
      if(m) node.nodeValue=raw.replace(trimmed,`${m[1]} ${m[1]==='1'?'मानक':'मानक'} आपकी प्रोक्योरमेंट आवश्यकता से मेल खाते हैं`);
    }
  });
  if(language==='HI') {
    document.querySelectorAll('textarea').forEach(el=>{ if(el.placeholder.includes('Describe your procurement requirement')) el.placeholder=UI_HI['Describe your procurement requirement in simple words…']; });
  } else {
    document.querySelectorAll('textarea').forEach(el=>{ if(el.placeholder.includes('अपनी प्रोक्योरमेंट')) el.placeholder='Describe your procurement requirement in simple words…'; });
  }
}

const navItems = [
  { label: 'New Search', icon: Search },
  { label: 'My Documents', icon: FolderOpen },
  { label: 'Saved Standards', icon: Bookmark },
  { label: 'Notifications', icon: Bell },
]

const refs = [
  [
    'IS 2026: 2011',
    'Specification for mineral insulating oil for electrical equipment',
  ],
  [
    'IS 335: 2021',
    'Insulating materials for electrical machinery',
  ],
  [
    'IS 6600 (Part 1): 2007',
    'Methods of test for power transformers — Part 1',
  ],
  [
    'IS 11171: 1985',
    'Guide for loading of oil-immersed transformers',
  ],
  [
    'IS 14697: 1999',
    'Guide for maintenance of power transformers',
  ],
]

const sections = [
  {
    title: 'Normative References',
    count: 5,
    sub: 'Standards referenced within IS 1180 (Part 1)',
    content: refs,
  },
  {
    title: 'Safety Standards',
    count: 2,
    sub: 'Protection, safety and compliance requirements',
    content: [
      [
        'IS 1646: 2015',
        'Electrical installations — Protection against fire',
      ],
      [
        'IS 5216: 1982',
        'Guide for safety procedures in electrical work',
      ],
    ],
  },
  {
    title: 'Testing Standards',
    count: 2,
    sub: 'Routine and type testing methods',
    content: [
      [
        'IS 2026 (Part 3): 2018',
        'Power transformers — Insulation levels and dielectric tests',
      ],
      [
        'IS 2026 (Part 5): 2011',
        'Power transformers — Ability to withstand short circuit',
      ],
    ],
  },
  {
    title: 'Installation & Commissioning',
    count: 1,
    sub: 'Field installation and commissioning guidance',
    content: [
      [
        'IS 10028 (Part 2): 1981',
        'Code of practice for selection, installation and maintenance',
      ],
    ],
  },
  {
    title: 'Related Product Standards',
    count: 1,
    sub: 'Related products and equipment',
    content: [
      [
        'IS 1180 (Part 2): 1989',
        'Power transformers — Distribution transformers',
      ],
    ],
  },
]

function Badge({
  children,
  green = false,
}: {
  children: React.ReactNode
  green?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
        green
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-blue-50 text-[#24539a]'
      }`}
    >
      {green && <CheckCircle2 size={11} />}
      {children}
    </span>
  )
}

function Sidebar({
  active,
  setActive,
  open,
  setOpen,
  savedCount,
}: {
  active: string
  setActive: (x: string) => void
  open: boolean
  setOpen: (x: boolean) => void
  savedCount: number
}) {
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[#061b36]/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[246px] flex-col bg-[#092445] text-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-9 w-9 place-items-center rounded bg-[#f4b942] font-black text-[#092445]">
            IS
          </div>

          <div>
            <div className="text-[15px] font-bold tracking-wide">
              IS-SPEC <span className="text-[#f4b942]">AI</span>
            </div>

            <div className="text-[9px] text-blue-200">
              INDIAN STANDARDS INTELLIGENCE
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 pt-6 text-[10px] font-semibold uppercase tracking-[.16em] text-blue-300">
          Workspace
        </div>

        <nav className="mt-2 space-y-1 px-3">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActive(label)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-[13px] transition ${
                active === label
                  ? 'bg-[#1b5eaa] font-semibold text-white shadow-sm'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Icon size={16} strokeWidth={1.8} />

              {label}

              {label === 'Saved Standards' && savedCount > 0 && (
                <span className="ml-auto rounded-full bg-[#e6a82f] px-1.5 py-0.5 text-[9px] font-bold text-[#092445]">
                  {savedCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <div className="relative overflow-hidden rounded border border-blue-300/20 bg-[#10335d] p-4">
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full border border-[#f4b942]/30" />

            <div className="text-[11px] font-bold text-[#f4b942]">
              QUALITY STANDARDS,
            </div>

            <div className="text-[14px] font-semibold">
              STRONGER INDIA
            </div>

            <p className="mt-2 text-[10px] leading-relaxed text-blue-200">
              Build better specifications with trusted standards.
            </p>

            <div className="mt-4 h-1 w-12 bg-[#f4b942]" />
          </div>

          <div className="mt-5 flex items-center gap-2 text-[10px] text-blue-300">
            <Settings2 size={13} />
            System v1.4.2
            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({
  setOpen,
  notificationMessage,
}: {
  setOpen: (x: boolean) => void
  notificationMessage: string
}) {
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN')
  const [showLanguages, setShowLanguages] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('isSpecLanguage')
    if (savedLanguage === 'HI' || savedLanguage === 'EN') {
      setLanguage(savedLanguage)
    }
  }, [])
  const [showNotifications, setShowNotifications] = useState(false)

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'HI', label: 'हिन्दी' },
  ]

  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:left-[246px] lg:px-8">
      <button
        onClick={() => setOpen(true)}
        className="mr-3 rounded p-2 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={19} />
      </button>

      {/* Government-style identity block */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex h-11 items-center gap-2 rounded border border-slate-200 bg-white px-2.5">
  <div className="flex h-9 w-9 items-center justify-center">
    <img
  src="https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_India_logo.svg/1280px-Government_of_India_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
  alt="State Emblem of India"
  className="h-9 w-9 object-contain"
  onError={(e) => {
    e.currentTarget.style.display = "none"
  }}
/>
  </div>

  <div className="leading-tight">
    <div className="text-[8px] font-bold text-[#092445]">
      भारत सरकार
    </div>

    <div className="text-[8px] font-semibold text-slate-500">
      Government of India
    </div>
  </div>
</div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <img
            src="https://www.bis.gov.in/wp-content/uploads/2024/12/BIS-LOGO.png"
            alt="Bureau of Indian Standards"
            className="h-9 w-9 object-contain"
          />

          <div>
            <div className="flex items-center gap-2">
              <div className="text-[14px] font-bold tracking-tight text-[#092445]">
                IS-SPEC AI
              </div>
              <span className="rounded bg-[#f4b942]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#8a6100]">
                PROTOTYPE
              </span>
            </div>

            <div className="text-[10px] text-slate-500">
              AI Recommendation Engine for Indian Standards
            </div>

            <div className="text-[8px] text-slate-400">
              Bureau of Indian Standards • Ministry of Consumer Affairs
            </div>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative rounded-lg p-2 transition ${
              showNotifications
                ? 'bg-blue-50 text-[#1769aa]'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={19} />

            {notificationMessage && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="text-sm font-semibold text-[#092445]">
                  Notifications
                </div>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-600">
                  {notificationMessage ? '1 new' : 'All clear'}
                </span>
              </div>

              {notificationMessage ? (
                <div className="mt-3 rounded-md border border-blue-100 bg-[#f7fbff] p-3">
                  <div className="flex gap-2">
                    <Bookmark size={15} className="mt-0.5 shrink-0 text-[#1769aa]" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Standard saved successfully
                      </div>
                      <div className="mt-1 text-[10px] leading-relaxed text-slate-500">
                        {notificationMessage}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Bell size={24} className="mx-auto text-slate-300" />
                  <div className="mt-2 text-xs font-semibold text-slate-600">
                    No new notifications
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Updates will appear here when available.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic language selector */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            aria-label="Select language"
          >
            <Globe2 size={15} />
            <span>{language}</span>
            <ChevronDown
              size={13}
              className={`transition-transform ${showLanguages ? 'rotate-180' : ''}`}
            />
          </button>

          {showLanguages && (
            <div className="absolute right-0 top-10 z-50 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    localStorage.setItem('isSpecLanguage', lang.code)
                    window.dispatchEvent(new CustomEvent('is-spec-language', { detail: lang.code }))
                    setShowLanguages(false)
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs hover:bg-slate-50 ${
                    language === lang.code
                      ? 'bg-blue-50 font-semibold text-[#1769aa]'
                      : 'text-slate-600'
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ministry / Department identity */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc8CwbyF4aVz_gZhE2KLX_jXXaRXl7l1WOypP4KRzdeggvDOhdIL9W3Bk&s=10"
              alt="Government of India"
              className="h-9 w-9 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>

          <div className="hidden max-w-[270px] text-left sm:block">
            <div className="text-[12px] font-semibold leading-tight text-[#092445]">
              Ministry of Consumer Affairs,
              <br />
              Food &amp; Public Distribution
            </div>
            <div className="mt-0.5 text-[9px] leading-tight text-slate-500">
              Department of Consumer Affairs (DoCA)
            </div>
          </div>

          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-lg bg-[#0a2a50] px-6 py-7 text-white shadow-sm sm:px-9 sm:py-8">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(115deg, transparent 50%, #75a5d4 50%, transparent 51%), linear-gradient(75deg, transparent 70%, #75a5d4 70%, transparent 71%)',
          backgroundSize: '120px 120px, 180px 180px',
        }}
      />

      <div className="relative max-w-2xl">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#f4c75b]">
          <Sparkles size={14} />
          Procurement intelligence platform
        </div>

        <h1 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-[30px]">
          Turn Procurement Requirements
          <br className="hidden sm:block" />
          into the Right Indian Standards
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100">
          AI-powered recommendations to help you create accurate, compliant
          and high-quality tender specifications.
        </p>
      </div>

      <div className="absolute bottom-0 right-8 hidden h-28 w-44 opacity-25 lg:block">
        <div className="absolute bottom-0 h-20 w-44 border-x-8 border-t-8 border-white" />

        <div className="absolute bottom-0 left-7 h-28 w-5 border-x-4 border-t-4 border-white" />

        <div className="absolute bottom-0 right-8 h-24 w-5 border-x-4 border-t-4 border-white" />
      </div>
    </section>
  )
}

function InputCard({
  onSearch,
  onUpload,
}: {
  onSearch: (text: string) => void
  onUpload: (file: File) => void
}) {
  const [tab, setTab] = useState('Text Input')
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('English')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file.')
      return
    }

    setSelectedFile(file)
  }

  const handleBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = () => {
    if (tab === 'Upload Document') {
      if (!selectedFile) {
        alert('Please select a PDF document first.')
        return
      }

      onUpload(selectedFile)
      return
    }

    onSearch(text)
  }

  const [isListening, setIsListening] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopMicrophone = () => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current)
      voiceTimeoutRef.current = null
    }

    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop()
        }
      } catch (error) {
        console.error('🎤 Could not stop recorder:', error)
      }
      mediaRecorderRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    setIsListening(false)
  }

  const handleVoiceInput = async () => {
    if (typeof window === 'undefined' || isListening) return

    if (!navigator.mediaDevices?.getUserMedia) {
      alert(
        'Microphone access is not available. Please use the latest Google Chrome or Microsoft Edge.'
      )
      return
    }

    if (typeof MediaRecorder === 'undefined') {
      alert(
        'Audio recording is not supported in this browser. Please use the latest Google Chrome or Microsoft Edge.'
      )
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      mediaStreamRef.current = stream
      audioChunksRef.current = []

      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ]

      const supportedMimeType = mimeTypes.find(type =>
        MediaRecorder.isTypeSupported(type)
      )

      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = recorder
      setIsListening(true)

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onerror = event => {
        console.error('🎤 Audio recorder error:', event)
        alert('Voice recording failed. Please try again.')
        stopMicrophone()
      }

      recorder.onstop = async () => {
        const chunks = audioChunksRef.current
        audioChunksRef.current = []

        if (!chunks.length) {
          alert('No audio was recorded. Please speak clearly and try again.')
          stopMicrophone()
          return
        }

        const blobType =
          supportedMimeType ||
          recorder.mimeType ||
          'audio/webm'

        const audioBlob = new Blob(chunks, { type: blobType })

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop())
          mediaStreamRef.current = null
        }

        mediaRecorderRef.current = null
        setIsListening(false)

        try {
          const formData = new FormData()

          const extension = blobType.includes('ogg')
            ? 'ogg'
            : 'webm'

          formData.append(
            'file',
            new File(
              [audioBlob],
              `voice-requirement.${extension}`,
              { type: blobType }
            )
          )

          formData.append(
            'language',
            language === 'Hinglish' ? 'hi' : 'en'
          )

          console.log('🎤 Sending audio to Whisper backend...')

          const response = await fetch(
            'http://127.0.0.1:8000/api/voice/transcribe',
            {
              method: 'POST',
              body: formData,
            }
          )

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            throw new Error(
              data?.detail || 'Voice transcription failed.'
            )
          }

          const transcript = String(data?.text || '').trim()

          console.log('🎤 Whisper transcript:', transcript)

          if (!transcript) {
            alert(
              'I could not understand the audio. Please speak clearly and try again.'
            )
            return
          }

          setText(transcript)
          setTab('Text Input')
        } catch (error) {
          console.error('🎤 Whisper transcription error:', error)

          alert(
            error instanceof Error
              ? error.message
              : 'Voice transcription failed. Please make sure the backend is running and try again.'
          )
        }
      }

      recorder.start(250)

      console.log('🎤 Recording started')

      // Automatically stop after 12 seconds.
      voiceTimeoutRef.current = setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== 'inactive'
        ) {
          console.log('🎤 Automatic recording stop')
          mediaRecorderRef.current.stop()
        }
      }, 12000)
    } catch (error: any) {
      console.error('🎤 Microphone access error:', error)

      if (error?.name === 'NotAllowedError') {
        alert(
          'Microphone permission denied. Click the 🔒 icon near the address bar, allow Microphone access for localhost, and try again.'
        )
      } else if (error?.name === 'NotFoundError') {
        alert(
          'No microphone was found. Please connect or enable a microphone and try again.'
        )
      } else if (error?.name === 'NotReadableError') {
        alert(
          'The microphone is already being used by another application. Close apps using the microphone and try again.'
        )
      } else {
        alert(
          'Could not access the microphone. Please check your Windows microphone settings and try again.'
        )
      }

      stopMicrophone()
    }
  }

  const handleStopVoiceInput = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
    } else {
      stopMicrophone()
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">
            
          </div>

          <h2 className="mt-1 text-lg font-semibold text-[#102b4d]">
            Provide Your Requirement
          </h2>
        </div>

        <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
          DRAFT
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          Input language
        </label>

        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
        >
          <option value="English">English</option>
          <option value="Hinglish">Hinglish</option>
        </select>
      </div>

      <div className="mt-4 flex border-b border-slate-200">
        {['Text Input', 'Upload Document', 'Voice Input'].map(x => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`mr-5 border-b-2 pb-2 text-xs font-semibold transition ${
              tab === x
                ? 'border-[#1d67ad] text-[#1d67ad]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      {tab === 'Text Input' ? (
        <>
          <div className="mt-4 rounded border border-slate-200 focus-within:border-[#3c82c4] focus-within:ring-2 focus-within:ring-blue-100">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="h-32 w-full resize-none bg-transparent p-3 text-[13px] leading-relaxed text-slate-700 outline-none"
              placeholder={
                language === 'Hinglish'
                  ? 'Example: Mujhe 132/33 kV ka oil immersed transformer chahiye, cooling aur testing ke saath...'
                  : 'Describe your procurement requirement in simple words…'
              }
            />

            <div className="flex justify-end px-3 pb-2 text-[10px] text-slate-400">
              {text.length}/2000
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-semibold text-slate-500">
              Try an example
            </span>

            {[
              
              'Water pump',
              'Solar panel',
              'Transformer',
              'Cement',
              
            ].map(x => (
              <button
                key={x}
                onClick={() => setText(x)}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {x}
              </button>
            ))}
          </div>
        </>
      ) : tab === 'Upload Document' ? (
        <>
          <div
            onClick={handleBrowse}
            className="mt-4 grid h-44 cursor-pointer place-items-center rounded border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div>
              <UploadCloud
                className="mx-auto text-[#3978b7]"
                size={28}
              />

              <div className="mt-2 text-sm font-semibold text-slate-700">
                Drag & drop your tender document here
              </div>

              <div className="mt-1 text-[11px] text-slate-500">
                PDF · Max 10 MB
              </div>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  handleBrowse()
                }}
                className="mt-3 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Browse Files
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]

              if (file) {
                handleFileSelect(file)
              }
            }}
          />

          {selectedFile && (
            <div className="mt-4 flex items-center gap-3 rounded border border-emerald-100 bg-emerald-50/60 p-3">
              <div className="grid h-8 w-8 place-items-center rounded bg-white text-emerald-600">
                <FileCheck2 size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-slate-700">
                  {selectedFile.name}
                </div>

                <div className="text-[10px] text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for analysis
                </div>
              </div>

              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />
            </div>
          )}
        </>
      ) : tab === 'Voice Input' ? (
  <div className="mt-4 grid h-44 place-items-center rounded border border-dashed border-slate-300 bg-slate-50 text-center">
    <div>
      <div className="text-sm font-semibold text-slate-700">
        {isListening
          ? 'Listening...'
          : 'Speak your procurement requirement'}
      </div>

      <div className="mt-1 text-[11px] text-slate-500">
        {isListening
          ? 'Please describe your requirement clearly'
          : 'Click the button and speak your requirement'}
      </div>

      <button
        type="button"
        onClick={handleVoiceInput}
        disabled={isListening}
        className={`mt-4 inline-flex items-center gap-2 rounded px-5 py-2.5 text-xs font-semibold text-white transition ${
          isListening
            ? 'cursor-not-allowed bg-red-400'
            : 'bg-[#1767aa] hover:bg-[#125a96]'
        }`}
      >
        🎤 {isListening ? 'Listening...' : 'Start Voice Input'}
      </button>
    </div>
     
  </div>
) : null}
      

      <button
        className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#2464a5] hover:underline"
      >
        
      </button>

      <button
        onClick={handleSubmit}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#1767aa] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125a96] focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {tab === 'Upload Document'
          ? 'Analyze Tender Document'
          : 'Find Relevant Standards'}

        <ArrowUpRight size={16} />
      </button>
    </div>
  )
}




function FeatureCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        [
          Lightbulb,
          'AI Understanding',
          'Understands context, not just keywords',
        ],
        [
          GitCompareArrows,
          'Allied Standards',
          'Finds related, normative and cross-referenced standards',
        ],
        [
          ShieldCheck,
          'Latest & Compliant',
          'Checks latest versions and certification requirements',
        ],
      ].map(([I, t, d]) => {
        const Icon = I as typeof Lightbulb

        return (
          <div
            key={t as string}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <Icon size={17} className="text-[#2a73b5]" />

            <div className="mt-3 text-xs font-bold text-[#173452]">
              {t as string}
            </div>

            <div className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {d as string}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Results({
  onDetails,
  saved,
  setSaved,
  onSave,
  onReportGenerated,
  recommendations,
  queryText,
  searched,
}: {
  onDetails: (standard: any) => void
  saved: boolean
  setSaved: (x: boolean) => void
  onSave: (standard: any) => void
  onReportGenerated: (document: any) => void
  recommendations: any[]
  queryText: string
  searched: boolean
}) {
  const [open, setOpen] = useState<number | null>(0)

  const standard = recommendations[0]

  

if (!searched) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">
        
      </div>

      <h2 className="mt-1 text-lg font-semibold text-[#102b4d]">
        Recommended Standards
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        AI recommendations will appear here after you provide your requirement
      </p>

      <div className="mt-5 rounded border border-blue-100 bg-[#f7fbff] p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#1767aa]">
          <Sparkles size={22} />
        </div>

        <div className="mt-4 text-sm font-semibold text-[#163b63]">
          Ready to find applicable Indian Standards
        </div>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
          Enter your procurement requirement on the left. Our AI engine will
          analyze it and recommend relevant Indian Standards.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-[#24539a]">
            Requirement Analysis
          </span>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-[#24539a]">
            Semantic Search
          </span>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-[#24539a]">
            BIS Standards
          </span>
        </div>
      </div>
    </div>
  )
}

  // -----------------------------
  // NO RESULTS
  // -----------------------------
  if (!standard) {
    const searchBIS = () => {
      const url = `https://standards.bis.gov.in/`
      window.open(url, '_blank')
    }

    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">
          
        </div>

        <h2 className="mt-1 text-lg font-semibold text-[#102b4d]">
          Recommended Standards
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          0 standards matched to your procurement requirement
        </p>

        <div className="mt-5 rounded border border-blue-100 bg-[#f7fbff] p-5">
          <div className="text-sm font-semibold text-[#163b63]">
            No exact standard found in the current AI knowledge base
          </div>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            We do not want to recommend an unrelated standard. You can search
            the official BIS catalogue for your requirement instead.
          </p>

          {queryText && (
            <div className="mt-3 rounded bg-white p-3 text-[11px] text-slate-600">
              <span className="font-semibold">Your requirement:</span>{' '}
              {queryText}
            </div>
          )}

          <button
            onClick={searchBIS}
            className="mt-4 inline-flex items-center gap-2 rounded bg-[#1767aa] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#125a96]"
          >
            Search Official BIS Standards
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    )
  }

  // -----------------------------
  // DYNAMIC DATA
  // -----------------------------

  const relationships = Array.isArray(standard.relationships)
    ? standard.relationships
    : []

  const certifications = Array.isArray(standard.certifications)
    ? standard.certifications
    : []

  const qcos = Array.isArray(standard.qcos) ? standard.qcos : []

  const amendments = Array.isArray(standard.amendments)
    ? standard.amendments
    : []

  const matchReasons = Array.isArray(standard.match_reasons)
    ? standard.match_reasons
    : []

  const matchPercent = Math.round(
    Number(standard.match_score || 0) * 100
  )

  // Other AI-retrieved standards are useful as related candidates when the
  // database has no explicit relationship records. They are clearly labelled
  // as AI-related candidates and are NOT presented as verified normative
  // references.
  const relatedRecommendations = recommendations
    .filter((item: any) => item.id !== standard.id)
    .slice(0, 4)

  const testingRelationshipRows = relationships.filter((r: any) => {
    const text = `${r.relationship_type || ''} ${r.description || ''}`.toLowerCase()
    return text.includes('test') || text.includes('testing') || text.includes('inspection')
  })

  const installationRelationshipRows = relationships.filter((r: any) => {
    const text = `${r.relationship_type || ''} ${r.description || ''}`.toLowerCase()
    return text.includes('installation') || text.includes('commission') || text.includes('maintenance')
  })

  // -----------------------------
  // DYNAMIC SECTIONS
  // -----------------------------

  const sections = [
    {
      title: 'Normative References',
      count: relationships.length,
      sub: `Standards referenced or linked with ${standard.is_number}`,
      content:
        relationships.length > 0
          ? relationships.map((r: any) => [
              r.related_standard_number ||
                r.standard_number ||
                r.related_standard_id ||
                'Related Standard',
              r.description ||
                r.relationship_type ||
                'Related standard reference',
            ])
          : [],
    },

    {
      title: 'Safety Standards',
      count: certifications.length + qcos.length,
      sub: 'Certification, QCO and compliance information',
      content: [
        ...certifications.map((cert: any) => [
          cert.scheme || 'Certification',
          cert.certification_required
            ? 'Certification required'
            : 'Certification information available',
        ]),
        ...qcos.map((qco: any) => [
          'QCO',
          qco.qco_title || 'Quality Control Order',
        ]),
      ],
    },

    {
      title: 'Testing Standards',
      count: testingRelationshipRows.length,
      sub: 'Verified testing and inspection references',
      content: testingRelationshipRows.map((r: any) => [
        r.related_standard_number ||
          r.standard_number ||
          r.related_standard_id ||
          'Testing Standard',
        r.description || r.relationship_type || 'Testing reference',
      ]),
    },

    {
      title: 'Installation & Commissioning',
      count: installationRelationshipRows.length,
      sub: 'Verified installation, commissioning and maintenance references',
      content: installationRelationshipRows.map((r: any) => [
        r.related_standard_number ||
          r.standard_number ||
          r.related_standard_id ||
          'Installation Standard',
        r.description ||
          r.relationship_type ||
          'Installation reference',
      ]),
    },

    {
      title: 'Related Product Standards',
      count: relationships.length > 0 ? relationships.length : relatedRecommendations.length,
      sub: relationships.length > 0
        ? 'Verified related products and equipment'
        : 'AI-retrieved related candidates from the current knowledge base',
      content:
        relationships.length > 0
          ? relationships.map((r: any) => [
              r.related_standard_number ||
                r.standard_number ||
                r.related_standard_id ||
                'Related Standard',
              r.description ||
                r.relationship_type ||
                'Related product standard',
            ])
          : relatedRecommendations.map((r: any) => [
              r.is_number || 'Related Standard',
              `${r.title || 'Related standard'} — AI-related candidate; verify applicability against BIS.`,
            ]),
    },
  ]

  // -----------------------------
  // DOWNLOAD REPORT
  // -----------------------------

const downloadReport = () => {
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 18
  const contentWidth = pageWidth - margin * 2

  let y = 20

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(9, 36, 69)
  doc.text('IS-SPEC AI', margin, y)

  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 105, 120)
  doc.text(
    'AI Recommendation Engine for Indian Standards',
    margin,
    y
  )

  y += 15

  // Helper
  const addSection = (title: string) => {
    if (y > 265) {
      doc.addPage()
      y = 20
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(23, 103, 170)
    doc.text(title, margin, y)

    y += 8
  }

  const addText = (
    text: string,
    size = 10,
    color = [55, 65, 81]
  ) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(size)
    doc.setTextColor(color[0], color[1], color[2])

    const lines = doc.splitTextToSize(
      text || 'Not available',
      contentWidth
    )

    if (y + lines.length * 5 > 280) {
      doc.addPage()
      y = 20
    }

    doc.text(lines, margin, y)
    y += lines.length * 5 + 5
  }

  // Requirement
  addSection('Procurement Requirement')
  addText(queryText || 'Not provided')

  // Recommended standard
  addSection('Recommended Standard')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(19, 58, 103)
  doc.text(
    standard.is_number || 'N/A',
    margin,
    y
  )

  y += 8

  addText(
    standard.title || 'N/A',
    11,
    [50, 60, 70]
  )

  // Match
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(4, 120, 87)
  doc.text(
    `Match Score: ${matchPercent}%`,
    margin,
    y
  )

  y += 10

  // Metadata
  addSection('Standard Information')

  addText(
    `Category: ${standard.category || 'N/A'}`
  )

  addText(
    `Edition: ${standard.edition || 'N/A'}`
  )

  addText(
    `Status: ${standard.status || 'N/A'}`
  )

  addText(
    `Amendments: ${amendments.length}`
  )

  // Scope
  addSection('Scope')

  addText(
    standard.scope || 'Not available'
  )

  // AI reason
  addSection('Why AI Recommended This Standard')

  if (matchReasons.length > 0) {
    matchReasons.forEach((reason: string) => {
      addText(`• ${reason}`)
    })
  } else {
    addText(
      '• Relevant to the procurement product and technical requirements.'
    )
  }

  // Compliance
  addSection('Compliance Information')

  addText(
    `Certifications: ${certifications.length}`
  )

  addText(
    `Quality Control Orders: ${qcos.length}`
  )

  addText(
    `Related Standards: ${relationships.length}`
  )

  // Notice
  addSection('Important Notice')

  addText(
    'This is a prototype AI recommendation. Verify the current standard, amendments, certification requirements and QCO applicability against official BIS sources before using the recommendation in a procurement document.',
    9,
    [120, 80, 20]
  )

  // Footer
  const totalPages = doc.getNumberOfPages()

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    doc.setFontSize(8)
    doc.setTextColor(130, 130, 130)

    doc.text(
      `IS-SPEC AI • Page ${i} of ${totalPages}`,
      margin,
      290
    )
  }

  // Save the generated PDF to My Documents and download it.
  const fileName = `${standard.is_number || 'IS-SPEC-AI'}-Recommendation-Report.pdf`
  const dataUri = doc.output('datauristring')

  onReportGenerated({
    id: `${Date.now()}-${standard.is_number || 'standard'}`,
    fileName,
    standardNumber: standard.is_number || 'N/A',
    title: standard.title || 'Indian Standard Recommendation',
    requirement: queryText || 'Not provided',
    createdAt: new Date().toISOString(),
    dataUri,
  })

  doc.save(fileName)
}
  // -----------------------------
  // MAIN RESULTS UI
  // -----------------------------

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-3">

        <div>
          <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">
            
          </div>

          <h2 className="mt-1 text-lg font-semibold text-[#102b4d]">
            Recommended Standards
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {recommendations.length} standard
            {recommendations.length !== 1 ? 's' : ''} matched to your
            procurement requirement
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={downloadReport}
            className="hidden items-center gap-1 rounded border border-slate-200 px-2.5 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 sm:flex"
          >
            <Download size={14} />
            Download Report
          </button>

          <button
            onClick={() => onSave(standard)}
            className={`flex items-center gap-1 rounded border px-2.5 py-2 text-[11px] font-semibold ${
              saved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark size={14} />

            {saved ? 'Saved' : 'Save to My List'}
          </button>

        </div>
      </div>

      {/* TABS */}
      <div className="mt-5 flex gap-5 overflow-x-auto whitespace-nowrap border-b border-slate-200">

        {[
          `All Results (${recommendations.length})`,
          `Product Standards (${recommendations.length})`,
          certifications.length + qcos.length > 0
            ? `Safety (${certifications.length + qcos.length})`
            : 'Safety',
          (sections.find(s => s.title === 'Testing Standards')?.count || 0) > 0
            ? `Testing (${
                sections.find(s => s.title === 'Testing Standards')?.count || 0
              })`
            : 'Testing',
          relationships.length > 0
            ? `Related (${relationships.length})`
            : 'Related',
        ].map((x, i) => (

          <button
            key={x}
            className={`border-b-2 pb-2 text-[11px] font-semibold ${
              i === 0
                ? 'border-[#1767aa] text-[#1767aa]'
                : 'border-transparent text-slate-400'
            }`}
          >
            {x}
          </button>

        ))}

      </div>

      {/* MAIN STANDARD CARD */}
      <div className="mt-5 rounded border border-blue-100 bg-[#f7fbff] p-4">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>

            <div className="text-base font-bold text-[#133a67]">
              {standard.is_number}
            </div>

            <div className="mt-1 text-xs text-slate-600">
              {standard.title}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                <CheckCircle2 size={11} />
                Match {matchPercent}%
              </span>

              <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#24539a]">
                Indian Standard
              </span>

              {certifications.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  <ShieldCheck size={11} />
                  Certification
                </span>
              )}

              {qcos.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-700">
                  QCO
                </span>
              )}

            </div>

          </div>

          <button
            onClick={() => onDetails(standard)}
            className="flex items-center gap-1 rounded bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1767aa] hover:bg-blue-100"
          >
            View Details
            <ChevronRight size={14} />
          </button>

        </div>

        {/* META */}
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded border border-slate-200 bg-slate-200 sm:grid-cols-4">

          {[
            ['Category', standard.category || '—'],
            ['Edition', standard.edition || '—'],
            ['Status', standard.status || 'Reference'],
            ['Amendments', String(amendments.length)],
          ].map(([a, b]) => (

            <div key={a} className="bg-white p-3">

              <div className="text-[10px] text-slate-400">
                {a}
              </div>

              <div className="mt-1 text-[11px] font-semibold text-slate-700">
                {b}
              </div>

            </div>

          ))}

        </div>

        {/* AI REASON */}
        <div className="mt-3 rounded border border-blue-100 bg-blue-50/70 p-4">

          <div className="flex items-center gap-2 text-xs font-bold text-[#1c5e9d]">
            <Sparkles size={15} />
            Why AI recommended this standard
          </div>

          <div className="mt-2 space-y-1">

            {matchReasons.length > 0 ? (

              matchReasons.map((reason: string, index: number) => (
                <div
                  key={`${reason}-${index}`}
                  className="text-[11px] leading-relaxed text-slate-600"
                >
                  • {reason}
                </div>
              ))

            ) : (

              <div className="text-[11px] leading-relaxed text-slate-600">
                • Relevant to the procurement product and technical
                requirements.
              </div>

            )}

          </div>

        </div>

      </div>

      {/* EXPANDABLE SECTIONS */}
      {sections.map((s, i) => (

        <div
          key={s.title}
          className="mt-3 overflow-hidden rounded border border-slate-200 bg-white"
        >

          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-3 p-3 text-left"
          >

            <div className="grid h-6 w-6 place-items-center rounded bg-blue-50 text-[#2866a3]">

              <ChevronRight
                size={14}
                className={`transition-transform ${
                  open === i ? 'rotate-90' : ''
                }`}
              />

            </div>

            <div className="flex-1">

              <div className="text-xs font-semibold text-slate-700">
                {s.title}
                {s.count > 0 ? ` (${s.count})` : ''}
              </div>

              <div className="mt-0.5 text-[10px] text-slate-400">
                {s.sub}
              </div>

            </div>

          </button>

          {open === i && (

            <div className="border-t border-slate-100">

              {s.content.length > 0 ? (

                s.content.map(([num, title]: string[], index: number) => (

                  <div
                    key={`${num}-${index}`}
                    className="flex items-center gap-4 border-b border-slate-50 px-4 py-3 last:border-b-0"
                  >

                    <div className="text-[11px] font-semibold text-[#1767aa]">
                      {num}
                    </div>

                    <div className="flex-1 text-[10px] text-slate-500">
                      {title}
                    </div>

                    <ChevronRight
                      size={12}
                      className="text-slate-300"
                    />

                  </div>

                ))

              ) : (

                <div className="px-4 py-4 text-[11px] text-slate-400">
                  No verified linked records are available for this section in the current knowledge base.
                </div>

              )}

            </div>

          )}

        </div>

      ))}

    </div>
  )
}

function DetailsDrawer({
  standard,
  close,
}: {
  standard: any | null
  close: () => void
}) {
  if (!standard) return null

  return (
    <>
      <button
        aria-label="Close details"
        onClick={close}
        className="fixed inset-0 z-40 bg-[#092445]/30"
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#3470b5]">
              Standard details
            </div>

            <div className="mt-1 text-lg font-bold text-[#102b4d]">
              {standard.is_number}
            </div>
          </div>

          <button
            onClick={close}
            className="rounded p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              {standard.title}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {standard.status && (
                <Badge green>{standard.status}</Badge>
              )}

              {standard.edition && (
                <Badge>{standard.edition}</Badge>
              )}
            </div>
          </div>

          <div className="rounded border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1c5e9d]">
              <Sparkles size={15} />
              Why AI recommended this standard
            </div>

            <div className="mt-2 space-y-1">
              {(standard.match_reasons || []).map(
                (reason: string) => (
                  <div
                    key={reason}
                    className="text-xs leading-relaxed text-slate-600"
                  >
                    • {reason}
                  </div>
                )
              )}
            </div>
          </div>

          {[
            ['Scope', standard.scope || 'Not available'],
            ['Category', standard.category || 'Not available'],
            ['Edition', standard.edition || 'Not available'],
            ['Status', standard.status || 'Not available'],
          ].map(([a, b]) => (
            <div
              key={a}
              className="border-b border-slate-100 pb-4"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {a}
              </div>

              <div className="mt-1 text-xs leading-relaxed text-slate-700">
                {b}
              </div>
            </div>
          ))}

          {standard.certifications?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Certification Requirements
              </div>

              <div className="mt-2 space-y-2">
                {standard.certifications.map((cert: any) => (
                  <div
                    key={cert.id}
                    className="rounded border border-slate-200 p-3"
                  >
                    <div className="text-xs font-semibold text-slate-700">
                      {cert.scheme || 'Certification'}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500">
                      {cert.certification_required
                        ? 'Certification required'
                        : 'Certification requirement not marked'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {standard.qcos?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quality Control Orders
              </div>

              <div className="mt-2 space-y-2">
                {standard.qcos.map((qco: any) => (
                  <div
                    key={qco.id}
                    className="rounded border border-slate-200 p-3"
                  >
                    <div className="text-xs font-semibold text-slate-700">
                      {qco.qco_title}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500">
                      {qco.issuing_ministry || 'Ministry not available'}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500">
                      Status: {qco.status || 'Unverified'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {standard.amendments?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amendments
              </div>

              <div className="mt-2 space-y-2">
                {standard.amendments.map((amendment: any) => (
                  <div
                    key={amendment.id}
                    className="rounded border border-slate-200 p-3"
                  >
                    <div className="text-xs font-semibold text-slate-700">
                      {amendment.amendment_number}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500">
                      {amendment.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {standard.relationships?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Related Standards
              </div>

              <div className="mt-2 space-y-2">
                {standard.relationships.map((relation: any) => (
                  <div
                    key={relation.id}
                    className="rounded border border-slate-200 p-3"
                  >
                    <div className="text-xs font-semibold text-slate-700">
                      {relation.relationship_type}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500">
                      Related Standard ID:{' '}
                      {relation.related_standard_id}
                    </div>

                    {relation.description && (
                      <div className="mt-1 text-[11px] text-slate-500">
                        {relation.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex-1 rounded bg-[#1767aa] py-2.5 text-xs font-semibold text-white hover:bg-[#125a96]">
              Save Standard
            </button>

            <button className="flex-1 rounded border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Add to Comparison
            </button>
          </div>

          <div className="rounded bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-800">
            Verify current standard metadata, certification requirements
            and QCO applicability against official BIS and government
            sources before using them in a procurement document.
          </div>
        </div>
      </aside>
    </>
  )
}

function EmptyPage({
  title,
  icon: Icon,
}: {
  title: string
  icon: any
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
      <Icon size={32} className="mx-auto text-[#2b70b3]" />

      <h2 className="mt-4 text-lg font-semibold text-[#102b4d]">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        This prototype workspace is ready for your{' '}
        {title.toLowerCase()} workflow. Use New Search to explore the
        live demo.
      </p>

      <button className="mt-5 rounded bg-[#1767aa] px-4 py-2 text-xs font-semibold text-white">
        Open New Search
      </button>
    </div>
  )
}

export default function Page() {
  const [appLanguage, setAppLanguage] = useState<'EN' | 'HI'>('EN')
  useEffect(() => {
    const savedLanguage = localStorage.getItem('isSpecLanguage')
    if (savedLanguage === 'HI' || savedLanguage === 'EN') {
      setAppLanguage(savedLanguage)
    }
  }, [])
  useEffect(() => {
    const handler = (e: Event) => { const v=(e as CustomEvent).detail; if(v==='HI'||v==='EN') setAppLanguage(v) }
    window.addEventListener('is-spec-language', handler)
    return () => window.removeEventListener('is-spec-language', handler)
  }, [])
  useEffect(() => {
    translateVisibleUI(appLanguage)
    const observer = new MutationObserver(() => translateVisibleUI(appLanguage))
    observer.observe(document.body, { childList:true, subtree:true, characterData:true })
    return () => observer.disconnect()
  }, [appLanguage])

  const [active, setActive] = useState('New Search')
  const [navOpen, setNavOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [selectedStandard, setSelectedStandard] = useState<any | null>(
    null
  )
  const [saved, setSaved] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [searched, setSearched] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [queryText, setQueryText] = useState('')
  const [savedStandards, setSavedStandards] = useState<any[]>([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [generatedDocuments, setGeneratedDocuments] = useState<any[]>([])

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('savedStandards')
      const message = localStorage.getItem('notificationMessage')

      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (Array.isArray(parsed)) setSavedStandards(parsed)
      }

      if (message) setNotificationMessage(message)

      const documentData = localStorage.getItem('generatedDocuments')
      if (documentData) {
        const parsedDocuments = JSON.parse(documentData)
        if (Array.isArray(parsedDocuments)) {
          setGeneratedDocuments(parsedDocuments)
        }
      }
    } catch (error) {
      console.error('Failed to load saved data:', error)
    }
  }, [])

  const handleSaveStandard = (standard: any) => {
    if (!standard?.is_number) return

    const alreadySaved = savedStandards.some(
      item => item.is_number === standard.is_number
    )

    if (alreadySaved) {
      setSaved(true)
      setNotificationMessage(
        `${standard.is_number} is already saved in My List.`
      )
      return
    }

    const updated = [...savedStandards, standard]
    const message = `Saved ${standard.is_number} — ${standard.title || 'standard'} to My List.`

    setSavedStandards(updated)
    setSaved(true)
    setNotificationMessage(message)

    localStorage.setItem('savedStandards', JSON.stringify(updated))
    localStorage.setItem('notificationMessage', message)
  }

  const handleReportGenerated = (document: any) => {
    setGeneratedDocuments(prev => {
      const withoutDuplicate = prev.filter(
        item => item.id !== document.id
      )
      const updated = [document, ...withoutDuplicate].slice(0, 10)
      localStorage.setItem('generatedDocuments', JSON.stringify(updated))
      return updated
    })
  }

  const openGeneratedPdf = async (dataUri: string) => {
    try {
      const response = await fetch(dataUri)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const newWindow = window.open(blobUrl, '_blank')

      if (!newWindow) {
        URL.revokeObjectURL(blobUrl)
        alert('Please allow pop-ups for localhost:3000 to open the PDF.')
        return
      }

      // Keep the blob URL alive while the PDF viewer loads.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch (error) {
      console.error('Failed to open PDF:', error)
      alert('Unable to open this PDF. Please use Download instead.')
    }
  }

  const deleteDocument = (id: string) => {
    setGeneratedDocuments(prev => {
      const updated = prev.filter(document => document.id !== id)
      localStorage.setItem('generatedDocuments', JSON.stringify(updated))
      return updated
    })
  }

  const title = useMemo(
    () => (active === 'New Search' ? 'New Search' : active),
    [active]
  )


  const doSearch = async (text: string) => {
    setQueryText(text)
    setSaved(false)
    setProcessing(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/recommend/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()

      console.log('AI Recommendation Response:', data)

      const nextRecommendations = data.recommendations || []
      setRecommendations(nextRecommendations)

      if (
        nextRecommendations[0] &&
        savedStandards.some(
          item => item.is_number === nextRecommendations[0].is_number
        )
      ) {
        setSaved(true)
      }

      setSearched(true)
    } catch (error) {
      console.error('Recommendation error:', error)
      setRecommendations([])
      setSearched(true)
    } finally {
      setProcessing(false)
    }
  }

  const doUpload = async (file: File) => {
  setSaved(false)
  setProcessing(true)
  setSearched(false)

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      'http://127.0.0.1:8000/api/upload/pdf/recommend',
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    setQueryText(data.query || data.extracted_requirements?.product || file.name)

    console.log('PDF AI Recommendation Response:', data)

    if (!response.ok || !data.success) {
      throw new Error(
        data.detail || 'PDF recommendation failed'
      )
    }

    setRecommendations(data.recommendations || [])
    setSearched(true)

  } catch (error) {
    console.error('PDF upload error:', error)
    setRecommendations([])
    setSearched(true)

    alert(
      error instanceof Error
        ? error.message
        : 'Failed to analyze PDF'
    )
  } finally {
    setProcessing(false)
  }
}

  const handleDetails = (standard: any) => {
    setSelectedStandard(standard)
    setDrawer(true)
  }

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-slate-800">
      <Header
        setOpen={setNavOpen}
        notificationMessage={notificationMessage}
      />

      <Sidebar
        active={active}
        setActive={setActive}
        open={navOpen}
        setOpen={setNavOpen}
        savedCount={savedStandards.length}
      />

      <main className="pt-[72px] lg:pl-[246px]">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
                <Home size={12} />
                Workspace
                <ChevronRight size={12} />
                {title}
              </div>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-[#102b4d]">
                {title}
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex">
              <Clock3 size={14} />
              Last saved today, 10:42 AM
            </div>
          </div>

          {active === 'New Search' ? (
            <>
              <Hero />

              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(350px,0.9fr)_minmax(560px,1.35fr)]">
                <div className="space-y-4">
                 <InputCard
  onSearch={doSearch}
  onUpload={doUpload}
/>
                  <FeatureCards />
                </div>

                <div className="relative">
                  {processing && (
                    <div className="absolute inset-0 z-10 rounded-lg border border-blue-100 bg-white/95 p-8 shadow-sm">
                      <div className="mx-auto max-w-sm pt-8 text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#1767aa]">
                          <Sparkles
                            size={22}
                            className="animate-pulse"
                          />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-[#12375f]">
                          Analysing your requirement
                        </h3>

                        <div className="mt-5 space-y-3 text-left">
                          {[
                            'Understanding requirement',
                            'Extracting technical parameters',
                            'Searching Indian Standards',
                            'Checking latest versions',
                          ].map((x, i) => (
                            <div
                              key={x}
                              className="flex items-center gap-3 text-xs text-slate-600"
                            >
                              <div
                                className={`grid h-5 w-5 place-items-center rounded-full ${
                                  i < 3
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-blue-100 text-blue-600'
                                }`}
                              >
                                {i < 3 ? (
                                  <CheckCircle2 size={13} />
                                ) : (
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                )}
                              </div>

                              {x}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                                   
                                    <Results
                    onDetails={handleDetails}
                    saved={saved}
                    setSaved={setSaved}
                    onSave={handleSaveStandard}
                    onReportGenerated={handleReportGenerated}
                    recommendations={recommendations}
                    queryText={queryText}
                    searched={searched}
                  />
                  
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded border border-amber-100 bg-amber-50 px-4 py-3 text-[10px] leading-relaxed text-amber-800">
                <ShieldCheck size={15} className="shrink-0" />
                Prototype data notice: recommendations, editions,
                amendments and certification details should be verified
                against official BIS sources before final procurement use.
              </div>
            </>
          ) : active === 'My Documents' ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">
                Workspace
              </div>

              <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#102b4d]">
                    My Documents
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Generated recommendation reports are saved here for future access.
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#24539a]">
                  {generatedDocuments.length} {generatedDocuments.length === 1 ? 'document' : 'documents'}
                </span>
              </div>

              {generatedDocuments.length === 0 ? (
                <div className="mt-6 rounded border border-dashed border-slate-300 bg-[#f8fbfe] p-10 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#1767aa]">
                    <FolderOpen size={23} />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-[#163b63]">
                    No documents yet
                  </div>
                  <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                    Generate a Recommendation Report from a search. The PDF will automatically appear here.
                  </p>
                  <button
                    onClick={() => setActive('New Search')}
                    className="mt-4 rounded bg-[#1767aa] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#125a96]"
                  >
                    Open New Search
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {generatedDocuments.map((document: any) => (
                    <div
                      key={document.id}
                      className="rounded border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/20"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-red-50 text-red-600">
                            <FileCheck2 size={19} />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-[#133a67]">
                              {document.fileName}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-600">
                              {document.standardNumber} — {document.title}
                            </div>
                            <div className="mt-1 text-[10px] text-slate-400">
                              Generated {new Date(document.createdAt).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => openGeneratedPdf(document.dataUri)}
                            className="rounded border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Open PDF
                          </button>

                          <a
                            href={document.dataUri}
                            download={document.fileName}
                            className="rounded bg-[#1767aa] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#125a96]"
                          >
                            Download
                          </a>

                          <button
                            onClick={() => deleteDocument(document.id)}
                            className="rounded border border-red-100 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : active === 'Saved Standards' ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">
                Workspace
              </div>
              <h2 className="mt-1 text-lg font-semibold text-[#102b4d]">Saved Standards</h2>
              <p className="mt-1 text-xs text-slate-500">Standards you saved from your procurement searches</p>

              {savedStandards.length === 0 ? (
                <div className="mt-6 rounded border border-blue-100 bg-[#f7fbff] p-8 text-center">
                  <Bookmark size={28} className="mx-auto text-[#3470b5]" />
                  <div className="mt-3 text-sm font-semibold text-[#163b63]">No saved standards yet</div>
                  <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                    Search for a procurement requirement and click Save to My List to keep a recommended standard here.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {savedStandards.map((standard: any) => (
                    <div key={standard.is_number} className="rounded border border-slate-200 bg-white p-4 hover:border-blue-200 hover:bg-blue-50/20">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-[#133a67]">{standard.is_number}</div>
                          <div className="mt-1 text-xs text-slate-600">{standard.title}</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {standard.category && <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold text-[#24539a]">{standard.category}</span>}
                            {standard.edition && <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">Edition {standard.edition}</span>}
                            {standard.match_score !== undefined && <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">Match {Math.round(Number(standard.match_score) * 100)}%</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedStandard(standard); setDrawer(true) }}
                          className="shrink-0 rounded bg-blue-50 px-3 py-2 text-[11px] font-semibold text-[#1767aa] hover:bg-blue-100"
                        >View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : active === 'Notifications' ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#3470b5]">Notifications</div>
              <h2 className="mt-1 text-lg font-semibold text-[#102b4d]">Notifications</h2>
              {notificationMessage ? (
                <div className="mt-5 rounded border border-blue-100 bg-[#f7fbff] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-[#1767aa]"><Bookmark size={17} /></div>
                    <div>
                      <div className="text-xs font-semibold text-[#163b63]">Standard saved successfully</div>
                      <div className="mt-1 text-[11px] leading-relaxed text-slate-500">{notificationMessage || 'A standard was saved to My List.'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded border border-slate-200 p-8 text-center">
                  <Bell size={28} className="mx-auto text-slate-300" />
                  <div className="mt-3 text-sm font-semibold text-slate-600">No notifications yet</div>
                  <p className="mt-1 text-xs text-slate-400">Save a recommended standard to receive a notification.</p>
                </div>
              )}
            </div>
          ) : active === 'Dashboard' ? (
            <EmptyPage
              title="Dashboard"
              icon={LayoutDashboard}
            />
          ) : active === 'Standards Database' ? (
            <EmptyPage
              title="Standards Database"
              icon={BookOpen}
            />
          ) : (
            <EmptyPage
              title={active}
              icon={ClipboardList}
            />
          )}
        </div>
      </main>

      {drawer && (
        <DetailsDrawer
          standard={selectedStandard}
          close={() => {
            setDrawer(false)
            setSelectedStandard(null)
          }}
        />
      )}
    </div>

    
  )
}