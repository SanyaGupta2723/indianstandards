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


const navItems = [
  { label: 'New Search', icon: Search },
  { label: 'Dashboard', icon: LayoutDashboard },
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
  notificationCount,
}: {
  active: string
  setActive: (x: string) => void
  open: boolean
  setOpen: (x: boolean) => void
  notificationCount: number
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

              {label === 'Saved Standards' && notificationCount > 0 && (
                <span className="ml-auto rounded-full bg-[#e6a82f] px-1.5 py-0.5 text-[9px] font-bold text-[#092445]">
                  {notificationCount}
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
  notificationCount,
}: {
  setOpen: (x: boolean) => void
  notificationCount: number
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:left-[246px] lg:px-8">
      <button
        onClick={() => setOpen(true)}
        className="mr-3 rounded p-2 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={19} />
      </button>

      <div className="hidden items-center gap-3 md:flex">
        <div className="grid h-9 w-9 place-items-center rounded border border-slate-200 bg-slate-50 text-[10px] font-black text-[#092445]">
          भारत
          <br />
          INDIA
        </div>

        <div className="h-7 w-px bg-slate-200" />

        <div>
          <div className="text-[14px] font-bold tracking-tight text-[#092445]">
            IS-SPEC AI
          </div>

          <div className="text-[10px] text-slate-500">
            AI Recommendation Engine for Indian Standards
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-5">
        <button
          className="relative rounded p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={18} />

        </button>

        <button className="hidden items-center gap-1 text-xs font-medium text-slate-600 sm:flex">
          <Globe2 size={15} />
          EN
          <ChevronDown size={13} />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#dcecff] text-xs font-bold text-[#174d8c]">
            SG
          </div>

          <div className="hidden text-left sm:block">
            <div className="text-xs font-semibold text-slate-800">
              Sanya Gupta
            </div>

            <div className="text-[10px] text-slate-500">
              Procurement Officer
            </div>
          </div>

          <ChevronDown size={14} className="text-slate-400" />
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

  const handleVoiceInput = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported. Please use Chrome or Edge.");
    return;
  }

  

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;

    setText(transcript);
    setTab("Text Input");
  };

  recognition.onerror = (event: any) => {
    console.error("Voice input error:", event.error);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.start();
};

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

        <select className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
          <option>English</option>
          <option>Hindi</option>
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
              placeholder="Describe your procurement requirement in simple words…"
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
              'More',
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
        <SlidersHorizontal size={14} />
        Advanced Options
        <ChevronDown size={13} />
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
  recommendations,
  queryText,
  searched,
}: {
  onDetails: (standard: any) => void
  saved: boolean
  setSaved: (x: boolean) => void
  onSave: (standard: any) => void
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
      count: relationships.filter((r: any) => {
        const text = `${r.relationship_type || ''} ${
          r.description || ''
        }`.toLowerCase()

        return (
          text.includes('test') ||
          text.includes('testing') ||
          text.includes('inspection')
        )
      }).length,
      sub: 'Testing and inspection related references',
      content: relationships
        .filter((r: any) => {
          const text = `${r.relationship_type || ''} ${
            r.description || ''
          }`.toLowerCase()

          return (
            text.includes('test') ||
            text.includes('testing') ||
            text.includes('inspection')
          )
        })
        .map((r: any) => [
          r.related_standard_number ||
            r.standard_number ||
            r.related_standard_id ||
            'Testing Standard',
          r.description || r.relationship_type || 'Testing reference',
        ]),
    },

    {
      title: 'Installation & Commissioning',
      count: relationships.filter((r: any) => {
        const text = `${r.relationship_type || ''} ${
          r.description || ''
        }`.toLowerCase()

        return (
          text.includes('installation') ||
          text.includes('commission') ||
          text.includes('maintenance')
        )
      }).length,
      sub: 'Installation, commissioning and maintenance references',
      content: relationships
        .filter((r: any) => {
          const text = `${r.relationship_type || ''} ${
            r.description || ''
          }`.toLowerCase()

          return (
            text.includes('installation') ||
            text.includes('commission') ||
            text.includes('maintenance')
          )
        })
        .map((r: any) => [
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
      count: relationships.length,
      sub: 'Related products and equipment',
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
          : [],
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

  // DIRECT PDF DOWNLOAD
  doc.save(
    `${standard.is_number || 'IS-SPEC-AI'}-Recommendation-Report.pdf`
  )
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
          `Safety (${certifications.length + qcos.length})`,
          `Testing (${
            sections.find(s => s.title === 'Testing Standards')?.count || 0
          })`,
          `Related (${relationships.length})`,
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
                {s.title} ({s.count})
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
                  No linked records available for this standard.
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
  const [notificationCount, setNotificationCount] = useState(0)
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('savedStandards')
      const notifications = localStorage.getItem('notificationCount')
      const message = localStorage.getItem('notificationMessage')

      if (savedData) setSavedStandards(JSON.parse(savedData))
      if (notifications) setNotificationCount(Number(notifications))
      if (message) setNotificationMessage(message)
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
    const nextNotificationCount = notificationCount + 1
    const message = `Saved ${standard.is_number} — ${standard.title || 'standard'} to My List.`

    setSavedStandards(updated)
    setSaved(true)
    setNotificationCount(nextNotificationCount)
    setNotificationMessage(message)

    localStorage.setItem('savedStandards', JSON.stringify(updated))
    localStorage.setItem('notificationCount', String(nextNotificationCount))
    localStorage.setItem('notificationMessage', message)
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
        notificationCount={notificationCount}
      />

      <Sidebar
        active={active}
        setActive={setActive}
        open={navOpen}
        setOpen={setNavOpen}
        notificationCount={notificationCount}
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
            <EmptyPage
              title="My Documents"
              icon={FolderOpen}
            />
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
              {notificationCount > 0 ? (
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