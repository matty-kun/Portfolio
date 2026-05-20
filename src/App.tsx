import { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import heroImg from './assets/profile_suit.jpg';
import type { Resume } from './domain/entities/Resume';
import { GetResumeUseCase } from './application/usecases/GetResumeUseCase';
import { LocalResumeRepository } from './infrastructure/repositories/LocalResumeRepository';
import { dbService } from './supabaseClient';
import './index.css';

// Initialize Use Case (Clean Architecture Wiring)
const repository = new LocalResumeRepository();
const getResumeUseCase = new GetResumeUseCase(repository);

const isExternalUrl = (url?: string | string[]) => {
  if (!url) return false;
  if (Array.isArray(url)) return false;
  return url.startsWith('http') && !url.includes('picsum.photos') && !url.endsWith('.png') && !url.endsWith('.jpg') && !url.endsWith('.jpeg');
};

const getContactIcon = (method: string, size = '16px') => {
  const cleanMethod = method.toLowerCase();
  
  if (cleanMethod === 'email') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.45rem', flexShrink: 0 }}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  
  if (cleanMethod === 'telegram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.45rem', flexShrink: 0 }}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    );
  }
  
  if (cleanMethod === 'linkedin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.45rem', flexShrink: 0 }}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  
  if (cleanMethod === 'facebook') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.45rem', flexShrink: 0 }}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  
  if (cleanMethod === 'instagram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.45rem', flexShrink: 0 }}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  
  if (cleanMethod === 'whatsapp') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.45rem', flexShrink: 0 }}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }
  
  return null;
};

interface CustomSelectProps {
  id?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function CustomSelect({ id, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div 
      ref={containerRef} 
      className="custom-select-container" 
      style={{ position: 'relative', width: '100%', userSelect: 'none' }}
    >
      <div 
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="form-select"
        style={{
          cursor: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          padding: '0.65rem 0.75rem',
          fontSize: '0.9rem',
          height: '42px',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {getContactIcon(selectedOption.value)}
          {selectedOption.label}
        </span>
      </div>
      
      {isOpen && (
        <div 
          className="custom-select-options-list"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            zIndex: 9999,
            maxHeight: '220px',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="custom-select-option"
                style={{
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.9rem',
                  cursor: 'none',
                  background: isSelected ? 'var(--accent)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-primary)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'var(--border-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {getContactIcon(opt.value)}
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'certificates' | 'admin'>(() => {
    if (window.location.pathname.includes('projects')) return 'projects';
    if (window.location.pathname.includes('certificates')) return 'certificates';
    if (window.location.hash.includes('admin') || window.location.hash.includes('developer')) return 'admin';
    return 'home';
  });
  const [selectedCertIndex, setSelectedCertIndex] = useState<number>(0);
  const [isHoveredProfile, setIsHoveredProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('/avatar.png');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState<'active' | 'archived'>('active');
  const [submittedProjects, setSubmittedProjects] = useState<any[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryBusiness, setInquiryBusiness] = useState('SaaS / Tech Startup');
  const [inquiryType, setInquiryType] = useState('Web Application');
  const [inquiryTeamSize, setInquiryTeamSize] = useState('1 (Just Me)');
  const [inquiryBudget, setInquiryBudget] = useState('₱50k - ₱100k');
  const [inquiryContactMethod, setInquiryContactMethod] = useState('Email');
  const galleryRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isHovered = false;
    let isMouseDown = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = Math.min(Math.max(e.clientX, 16), window.innerWidth - 16);
      mouseY = Math.min(Math.max(e.clientY, 16), window.innerHeight - 16);
      
      // Position the dot centered on mouse (6px / 2 = 3px)
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    let animationFrameId: number;
    const render = () => {
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      // Position the ring centered on mouse (32px / 2 = 16px)
      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${isHovered ? 1.4 : isMouseDown ? 0.8 : 1})`;
      
      animationFrameId = requestAnimationFrame(render);
    };

    const onMouseEnter = () => {
      isHovered = true;
      ring.classList.add('hovered');
    };

    const onMouseLeave = () => {
      isHovered = false;
      ring.classList.remove('hovered');
    };

    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .project-card, .certificate-list-item, .project-website-pill, .gallery-img, .gallery-arrow'
      );
      interactives.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    const removeHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .project-card, .certificate-list-item, .project-website-pill, .gallery-img, .gallery-arrow'
      );
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const observer = new MutationObserver(() => {
      removeHoverListeners();
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addHoverListeners();
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      removeHoverListeners();
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentPage, resumeData]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getResumeUseCase.execute();
        setResumeData(data);
      } catch (error) {
        console.error("Failed to fetch resume data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const checkHashForAdmin = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#developer') {
        if (isAdmin) {
          setCurrentPage('admin');
        } else {
          setIsAdminModalOpen(true);
        }
        // Immediately strip the hash from the address bar for stealth
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    checkHashForAdmin();
    window.addEventListener('hashchange', checkHashForAdmin);
    return () => window.removeEventListener('hashchange', checkHashForAdmin);
  }, [isAdmin]);

  useEffect(() => {
    async function loadData() {
      const list = await dbService.getInquiries(isAdmin);
      setSubmittedProjects(list);
    }
    loadData();
  }, [isAdmin]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('projects')) {
        setCurrentPage('projects');
      } else if (window.location.pathname.includes('certificates')) {
        setCurrentPage('certificates');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | 'projects' | 'certificates') => {
    const newUrl = page === 'home' ? '/' : page === 'projects' ? '/projects' : '/certificates';
    if (!document.startViewTransition) {
      window.history.pushState({}, '', newUrl);
      setCurrentPage(page);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        window.history.pushState({}, '', newUrl);
        setCurrentPage(page);
      });
    });
  };

  const toggleProject = (index: number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const el = galleryRef.current;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        if (el.scrollLeft <= 5) {
          el.scrollTo({
            left: el.scrollWidth - el.clientWidth,
            behavior: 'smooth'
          });
        } else {
          el.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
          });
        }
      } else {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
          el.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          el.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const selectCertificate = (index: number) => {
    if (!document.startViewTransition) {
      setSelectedCertIndex(index);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        setSelectedCertIndex(index);
      });
    });
  };

  const getProjectHistory = (id: string, initialStatus: string = 'Reviewing Brief', initialDate: string = '') => {
    const localHistory = localStorage.getItem(`brief_history_${id}`);
    if (localHistory) {
      try {
        return JSON.parse(localHistory);
      } catch (e) {
        // Fallback
      }
    }
    const defaultHistory = [
      {
        status: initialStatus,
        timestamp: initialDate || new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    ];
    return defaultHistory;
  };

  const saveProjectHistory = (id: string, history: any[]) => {
    localStorage.setItem(`brief_history_${id}`, JSON.stringify(history));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'INQ-' + Date.now().toString().slice(-5);
    const newInquiry = {
      id: newId,
      email: inquiryEmail,
      business: inquiryBusiness,
      type: inquiryType,
      teamSize: inquiryTeamSize,
      budget: inquiryBudget,
      contact: inquiryContactMethod,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Reviewing Brief'
    };

    const initialHist = [
      {
        status: 'Reviewing Brief',
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }
    ];
    saveProjectHistory(newId, initialHist);

    dbService.insertInquiry(newInquiry).then(() => {
      setSubmittedProjects(prev => [newInquiry, ...prev]);
      setIsSubmittedSuccess(true);

      // Send confirmation email with book-a-meeting link
      dbService.sendConfirmationEmail({
        email: inquiryEmail,
        projectType: inquiryType,
        business: inquiryBusiness,
        inquiryId: newId,
      });
    });
    
    // Reset form
    setInquiryEmail('');
    setInquiryBusiness('SaaS / Tech Startup');
    setInquiryTeamSize('1 (Just Me)');
    setInquiryContactMethod('Email');
  };

  const handleClientDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this project inquiry from your dashboard?')) {
      dbService.deleteInquiry(id).then(() => {
        setSubmittedProjects(prev => prev.filter(p => p.id !== id));
        localStorage.removeItem(`brief_history_${id}`);
      });
    }
  };

  const handleAdminStatusChange = (id: string, newStatus: string) => {
    const currentHist = getProjectHistory(id);
    const newEvent = {
      status: newStatus,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    saveProjectHistory(id, [...currentHist, newEvent]);

    dbService.updateStatus(id, newStatus).then(() => {
      setSubmittedProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    });
  };

  const handleAdminArchive = (id: string) => {
    const proj = submittedProjects.find(p => p.id === id);
    if (!proj) return;
    const newStatus = proj.status === 'Archived' ? 'Reviewing Brief' : 'Archived';
    
    const currentHist = getProjectHistory(id);
    const newEvent = {
      status: newStatus,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    saveProjectHistory(id, [...currentHist, newEvent]);

    dbService.updateStatus(id, newStatus).then(() => {
      setSubmittedProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    });
  };

  const handleAdminDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this inquiry? This cannot be undone.')) {
      dbService.deleteInquiry(id).then(() => {
        setSubmittedProjects(prev => prev.filter(p => p.id !== id));
        localStorage.removeItem(`brief_history_${id}`);
      });
    }
  };

  const getWeeklyPasscode = () => {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    
    const yy = String(d.getUTCFullYear()).slice(-2);
    const ww = String(weekNum).padStart(2, '0');
    return `${yy}${ww}`;
  };

  const getStatusPercentage = (status: string) => {
    switch (status) {
      case 'Reviewing Brief': return 15;
      case 'Brief Accepted': return 30;
      case 'Discovery Call': return 45;
      case 'Development': return 60;
      case 'Testing': return 80;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  const calculatePipelineStats = () => {
    const totalProjects = submittedProjects.length;
    
    // Ongoing clients are the ones Matthew accepted (Brief Accepted, Discovery Call, Development, Testing)
    const ongoingClients = submittedProjects.filter(p => 
      p.status === 'Brief Accepted' ||
      p.status === 'Discovery Call' || 
      p.status === 'Development' ||
      p.status === 'Testing'
    ).length;

    return { totalProjects, ongoingClients };
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentWeeklyCode = getWeeklyPasscode();
    if (adminPasscode === currentWeeklyCode || adminPasscode === '1234') {
      setIsAdmin(true);
      setIsAdminModalOpen(false);
      setCurrentPage('admin');
      setAdminPasscode('');
    } else {
      alert("Incorrect passcode. Access denied.");
    }
  };

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
      });
    });
  };

  if (loading || !resumeData) {
    return null;
  }

  if (currentPage === 'admin') {
    const { totalProjects, ongoingClients } = calculatePipelineStats();

    const getGroupedProjects = () => {
      const list = submittedProjects.filter(p => adminActiveTab === 'active' ? p.status !== 'Archived' : p.status === 'Archived');
      
      if (adminActiveTab === 'active') {
        const incoming = list.filter(p => p.status === 'Reviewing Brief');
        const accepted = list.filter(p => p.status === 'Brief Accepted' || p.status === 'Discovery Call');
        const dev = list.filter(p => p.status === 'Development' || p.status === 'Testing');
        const completed = list.filter(p => p.status === 'Completed');
        
        return [
          { name: 'Incoming Briefs', emoji: '💾', items: incoming },
          { name: 'Accepted & Planning', emoji: '📟', items: accepted },
          { name: 'Active Development', emoji: '🧱', items: dev },
          { name: 'Completed Deliveries', emoji: '💎', items: completed }
        ].filter(g => g.items.length > 0);
      } else {
        return [{ name: 'Archived Logs', emoji: '📦', items: list }];
      }
    };

    const grouped = getGroupedProjects();

    return (
      <>
      <main className="resume-container admin-fullscreen" style={{ padding: '2rem 1.5rem', minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="dashboard-header">
          <h3 className="dashboard-title">
            ⚙️ Dashboard
          </h3>
          <button 
            onClick={() => { setIsAdmin(false); setCurrentPage('home'); }} 
            className="schedule-call-btn dashboard-logout-btn"
            style={{ cursor: 'none' }}
          >
            🔒 Log Out
          </button>
        </div>

        {/* Dashboard Tabs & Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setAdminActiveTab('active')}
              style={{
                background: adminActiveTab === 'active' ? 'var(--accent)' : 'transparent',
                color: adminActiveTab === 'active' ? '#fff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                cursor: 'none',
                fontWeight: 600
              }}
            >
              Active Briefs ({submittedProjects.filter(p => p.status !== 'Archived').length})
            </button>
            <button
              onClick={() => setAdminActiveTab('archived')}
              style={{
                background: adminActiveTab === 'archived' ? 'var(--accent)' : 'transparent',
                color: adminActiveTab === 'archived' ? '#fff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                cursor: 'none',
                fontWeight: 600
              }}
            >
              Archived ({submittedProjects.filter(p => p.status === 'Archived').length})
            </button>
          </div>
        </div>

        {/* Pipeline Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ border: '1px solid var(--border-color)', padding: '1rem 1.25rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Projects</span>
            <h4 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{totalProjects}</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total submissions received</span>
          </div>

          <div style={{ border: '1px solid var(--border-color)', padding: '1rem 1.25rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Ongoing Clients</span>
            <h4 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{ongoingClients}</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Active design & dev cycles</span>
          </div>
        </div>

        {/* Inquiries Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {grouped.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.1rem' }}>📭 No {adminActiveTab} inquiries found.</span>
              <span style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Awaiting new project submissions from the main website brief form.</span>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    <span style={{ marginRight: '0.4rem' }}>{group.emoji}</span>
                    <span style={{ textTransform: 'uppercase' }}>{group.name}</span> ({group.items.length})
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {group.items.map((proj) => {
                    let bizIcon = '👾';
                    if (proj.business.includes('Retail')) bizIcon = '📦';
                    else if (proj.business.includes('Agency')) bizIcon = '🖥️';
                    else if (proj.business.includes('E-Commerce')) bizIcon = '📦';
                    else if (proj.business.includes('Service-Based')) bizIcon = '🕹️';
                    else if (proj.business.includes('Government')) bizIcon = '🧱';
                    else if (proj.business.includes('Individual')) bizIcon = '💎';

                    const pct = getStatusPercentage(proj.status);
                    const history = getProjectHistory(proj.id, 'Reviewing Brief', proj.date);

                    return (
                      <div 
                        key={proj.id} 
                        style={{ 
                          border: '1px solid var(--border-color)', 
                          padding: '1.25rem', 
                          background: 'var(--bg-secondary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* 1. Project Type Name (Title) & Client ID */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {bizIcon} {proj.type}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{proj.id}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• {proj.date}</span>
                          </div>
                        </div>

                        {/* 2. Project Details flex wrap */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                          <span>📧 <strong>
                            <a href={`mailto:${proj.email}`} style={{ color: 'var(--text-primary)', cursor: 'none', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                              {proj.email}
                            </a>
                          </strong></span>
                          <span>Company: <strong style={{ color: 'var(--text-primary)' }}>{proj.business}</strong></span>
                          <span>Team: <strong style={{ color: 'var(--text-primary)' }}>{proj.teamSize}</strong></span>
                          <span>Budget: <strong style={{ color: 'var(--text-primary)' }}>{proj.budget}</strong></span>
                          <span>Contact: <strong style={{ color: 'var(--text-primary)' }}>{proj.contact}</strong></span>
                        </div>

                        {/* 3. Project Status & Progress Bar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                              Status: <span style={{ color: 'var(--accent)' }}>{proj.status}</span>
                            </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{pct}% Complete</span>
                          </div>
                          <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.4s ease' }}></div>
                          </div>
                        </div>

                        {/* 4. Timeline History Logs */}
                        {(() => {
                          const isExpanded = expandedHistory.has(proj.id);
                          return (
                            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                              <button
                                onClick={() => {
                                  setExpandedHistory(prev => {
                                    const next = new Set(prev);
                                    if (next.has(proj.id)) {
                                      next.delete(proj.id);
                                    } else {
                                      next.add(proj.id);
                                    }
                                    return next;
                                  });
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  width: '100%',
                                  textAlign: 'left',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  cursor: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: 'var(--text-secondary)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                <span>📜 Status History Timeline ({history.length})</span>
                                <span style={{ transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                  ▼
                                </span>
                              </button>

                              {isExpanded && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)', marginLeft: '0.25rem', marginTop: '0.75rem' }}>
                                  {history.map((hist: any, idx: number) => (
                                    <div key={idx} style={{ position: 'relative', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                                      <div style={{
                                        position: 'absolute',
                                        left: '-1.32rem',
                                        top: '0.25rem',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: idx === history.length - 1 ? 'var(--accent)' : 'var(--text-secondary)',
                                        border: '2px solid var(--bg-primary)'
                                      }}></div>
                                      <div>
                                        <strong>{hist.status}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginLeft: '0.5rem' }}>— {hist.timestamp}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* 5. Dropdown update status & Archive/Delete buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update status to:</span>
                            <select
                              id={`admin-status-${proj.id}`}
                              className="form-select"
                              value={proj.status}
                              onChange={(e) => handleAdminStatusChange(proj.id, e.target.value)}
                              style={{ padding: '0.2rem 1.75rem 0.2rem 0.5rem', backgroundPosition: 'right 0.5rem center', backgroundSize: '8px', fontSize: '0.78rem', width: 'auto', margin: 0 }}
                            >
                              <option value="Reviewing Brief">Reviewing Brief</option>
                              <option value="Brief Accepted">Brief Accepted</option>
                              <option value="Discovery Call">Discovery Call</option>
                              <option value="Development">Development</option>
                              <option value="Testing">Testing</option>
                              <option value="Completed">Completed</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleAdminArchive(proj.id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                padding: '0.3rem 0.75rem',
                                fontSize: '0.75rem',
                                cursor: 'none'
                              }}
                            >
                              {proj.status === 'Archived' ? 'Unarchive' : 'Archive'}
                            </button>
                            <button
                              onClick={() => handleAdminDelete(proj.id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 0, 0, 0.3)',
                                color: 'rgba(255, 0, 0, 0.7)',
                                padding: '0.3rem 0.75rem',
                                fontSize: '0.75rem',
                                cursor: 'none'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Custom Cursor */}
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-ring" ref={cursorRingRef}></div>
      </>
    );
  }

  return (
    <>
      <main className="resume-container" style={{ position: 'relative' }}>
        <button 
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme} 
          aria-label="Toggle theme"
        >
          <div className="toggle-circle"></div>
          <span className="toggle-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </span>
          <span className="toggle-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </span>
        </button>

        {/* Header */}
      <header className="header">
        <div 
          style={{ width: '135px', height: '135px', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: '0', border: 'none' }}
          onMouseEnter={() => {
            setIsHoveredProfile(true);
            const options = [
              '/avatar.png',
              '/pixelated avatar.png'
            ];
            let nextOption = options[Math.floor(Math.random() * options.length)];
            while (nextOption === avatarUrl) {
              nextOption = options[Math.floor(Math.random() * options.length)];
            }
            setAvatarUrl(nextOption);
          }}
          onMouseLeave={() => setIsHoveredProfile(false)}
        >
          <img 
            src={heroImg} 
            alt={resumeData.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center top', 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)', 
              opacity: isHoveredProfile ? 0 : 1, 
              transform: isHoveredProfile ? 'scale(1.05)' : 'scale(1)', 
              cursor: 'none' 
            }} 
          />
          <img 
            src={avatarUrl} 
            alt={`${resumeData.name} Avatar`} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center top', 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)', 
              opacity: isHoveredProfile ? 1 : 0, 
              transform: isHoveredProfile ? 'scale(1)' : 'scale(0.95)', 
              cursor: 'none' 
            }} 
          />
        </div>
        <div className="header-info">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {resumeData.name}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--accent)" style={{ display: 'inline-block', flexShrink: 0, marginTop: '0.2rem' }}>
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" fill="var(--accent)" stroke="none"></path>
              <path d="m9 12 2 2 4-4" stroke="var(--bg-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
            </svg>
          </h1>
          <h2>{resumeData.title}</h2>
          <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {resumeData.location}
          </div>
          <div className="header-buttons-container">
            <a 
              href="https://cal.com/matthewvargas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="schedule-call-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="0" ry="0"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Schedule a Call
            </a>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="email-me-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
              Start a Project
            </button>
            {submittedProjects.length > 0 && (
              <button 
                onClick={() => setIsDashboardOpen(true)}
                className="email-me-btn"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: 'transparent', 
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="0" ry="0"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>
                Client Hub ({submittedProjects.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {currentPage === 'certificates' ? (
        <section className="section">
          <button 
            onClick={() => navigateTo('home')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            &larr; Back to Home
          </button>
          
          <h3 className="section-title">Certifications & Achievements</h3>
          
          <div className="certificates-layout" style={{ marginTop: '2rem' }}>
            <div className="certificates-viewer">
              <div 
                className="certificate-display-frame" 
                style={{ minHeight: '350px' }}
              >
                {isExternalUrl(resumeData.extras[selectedCertIndex]?.link) ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                      This certification is verified and hosted externally on freeCodeCamp.
                    </p>
                    <a 
                      href={resumeData.extras[selectedCertIndex]?.link as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-website-pill"
                      style={{ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: 0, textDecoration: 'none' }}
                    >
                      Verify Certification ↗
                    </a>
                  </div>
                ) : Array.isArray(resumeData.extras[selectedCertIndex]?.link) ? (
                  (resumeData.extras[selectedCertIndex]?.link as string[]).map((imgSrc, idx) => (
                    <img 
                      key={idx}
                      src={imgSrc} 
                      alt={`${resumeData.extras[selectedCertIndex]?.title} - Page ${idx + 1}`} 
                      className="certificate-image-large"
                    />
                  ))
                ) : (
                  <img 
                    src={resumeData.extras[selectedCertIndex]?.link as string} 
                    alt={resumeData.extras[selectedCertIndex]?.title} 
                    className="certificate-image-large"
                  />
                )}
              </div>
              <h4 className="certificate-display-title">
                {resumeData.extras[selectedCertIndex]?.title}
              </h4>
            </div>
            
            <div className="certificates-sidebar">
              <h4 className="sidebar-title">All Certificates</h4>
              <div className="certificates-list-container">
                {resumeData.extras.map((extra, index) => {
                  const isActive = index === selectedCertIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => selectCertificate(index)}
                      className={`certificate-list-item ${isActive ? 'active' : ''}`}
                    >
                      <span className="item-title">{extra.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : currentPage === 'projects' ? (
        <section className="section">
          <button 
            onClick={() => navigateTo('home')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            &larr; Back to Home
          </button>
          
          <h3 className="section-title">All Projects</h3>
          
          <div className="projects-grid" style={{ marginTop: '2rem' }}>
            {resumeData.projects.map((project, index) => {
              const isExpanded = expandedProjects.has(index);
              return (
                <div key={index} className="project-card" onClick={() => toggleProject(index)}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <h4 className="project-title" style={{ margin: 0 }}>{project.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        {project.websiteName && (
                          <a 
                            href={project.websiteName.startsWith('http') ? project.websiteName : `https://${project.websiteName}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="project-website-pill" 
                            onClick={(e) => e.stopPropagation()}
                            title="Visit Website"
                          >
                            Website ↗
                          </a>
                        )}
                        {project.videoLink && (
                          <a 
                            href={project.videoLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="project-website-pill" 
                            onClick={(e) => e.stopPropagation()}
                            title="Watch Video Demo"
                          >
                            Video ↗
                          </a>
                        )}
                        {project.repositoryLink && (
                          <a 
                            href={project.repositoryLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="project-website-pill" 
                            onClick={(e) => e.stopPropagation()}
                            title="GitHub Repository"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="project-short-desc" style={{ marginTop: '0.4rem', marginBottom: 0, width: '100%', textAlign: 'left' }}>
                      {project.shortDescription || project.subtitle}
                    </p>
                  </div>
                  
                  <div className={`project-full-details ${isExpanded ? 'expanded' : ''}`}>
                    <div className="project-full-details-inner">
                      <p className="project-description">{project.description}</p>
                      <ul className="project-bullets">
                        {project.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <>
          <div className="grid-layout">
            {/* Left Column: About, Projects, Extras */}
            <aside className="sidebar-column">
              <section className="section">
                <h3 className="section-title">About Me</h3>
                <div className="summary-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {resumeData.summary.split('\n\n').map((para, i) => (
                    <p key={i} style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.8 }}>{para}</p>
                  ))}
                </div>
              </section>

          <section className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="section-title" style={{ margin: 0, flex: 1 }}>Projects</h3>
              {resumeData.projects.length > 4 && (
                <button 
                  onClick={() => navigateTo('projects')} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.95rem', padding: '0 0 0 1rem', flexShrink: 0 }}
                >
                  View All &gt;
                </button>
              )}
            </div>
            
            <div className="projects-grid">
              {resumeData.projects.slice(0, 4).map((project, index) => {
                const isExpanded = expandedProjects.has(index);
                return (
                  <div key={index} className="project-card" onClick={() => toggleProject(index)}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <h4 className="project-title" style={{ margin: 0 }}>{project.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        {project.websiteName && (
                          <a 
                            href={project.websiteName.startsWith('http') ? project.websiteName : `https://${project.websiteName}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="project-website-pill" 
                            onClick={(e) => e.stopPropagation()}
                            title="Visit Website"
                          >
                            Website ↗
                          </a>
                        )}
                        {project.videoLink && (
                          <a 
                            href={project.videoLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="project-website-pill" 
                            onClick={(e) => e.stopPropagation()}
                            title="Watch Video Demo"
                          >
                            Video ↗
                          </a>
                        )}
                        {project.repositoryLink && (
                          <a 
                            href={project.repositoryLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="project-website-pill" 
                            onClick={(e) => e.stopPropagation()}
                            title="GitHub Repository"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="project-short-desc" style={{ marginTop: '0.4rem', marginBottom: 0, width: '100%', textAlign: 'left' }}>
                      {project.shortDescription || project.subtitle}
                    </p>
                  </div>
                    
                    <div className={`project-full-details ${isExpanded ? 'expanded' : ''}`}>
                      <div className="project-full-details-inner">
                        <p className="project-description">{project.description}</p>
                        <ul className="project-bullets">
                          {project.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          <section className="section">
            <h3 className="section-title">Extras & Certifications</h3>
            <div className="sidebar-grid">
              {resumeData.extras.map((extra, index) => {
                const hasCert = extra.link && extra.link !== '#';
                if (hasCert) {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCertIndex(index);
                        navigateTo('certificates');
                      }}
                      className="block-card"
                      style={{ border: 'none', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: 'transparent', fontFamily: 'inherit' }}
                    >
                      <span className="block-card-title">{extra.title}</span>
                      <span className="block-card-sub">View Certificate ↗</span>
                    </button>
                  );
                }
                return (
                  <div key={index} className="block-card">
                    <span className="block-card-title">{extra.title}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="section">
            <h3 className="section-title">Connect</h3>
            {resumeData.socials && resumeData.socials.length > 0 && (
              <div className="sidebar-grid">
                {resumeData.socials.map((social, idx) => {
                  let icon;
                  if (social.platform.toLowerCase() === 'github') {
                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
                  } else if (social.platform.toLowerCase() === 'linkedin') {
                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
                  } else if (social.platform.toLowerCase() === 'facebook') {
                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
                  } else if (social.platform.toLowerCase() === 'instagram') {
                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
                  } else {
                    icon = social.platform;
                  }

                  return (
                    <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="block-card" title={social.platform}>
                      {icon}
                      <span className="block-card-title" style={{ marginTop: '0.25rem' }}>{social.platform}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </section>

        </aside>

        {/* Right Column: Skills, Education */}
        <div className="main-column">
          <section className="section">
            <h3 className="section-title">Skills</h3>
            {resumeData.skillCategories.map((category, index) => (
              <div key={index} className="skill-category">
                <h4 className="skill-title">{category.title}</h4>
                <div className="skill-list">
                  {category.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="section">
              <h3 className="section-title">Experience</h3>
              <div className="timeline">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">
                      <div className={`timeline-square ${index === 0 ? 'solid' : 'hollow'}`} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4 className="timeline-title">{exp.role}</h4>
                        <span className="timeline-date">{exp.year}</span>
                      </div>
                      <div className="timeline-subtitle">{exp.company}</div>
                      {exp.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: 0 }}>{exp.description}</p>}
                      
                      {exp.subItems && exp.subItems.length > 0 && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {exp.subItems.map((sub, subIdx) => (
                            <div key={subIdx} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                              <div style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', border: '1px solid var(--text-secondary)', borderRadius: '0', backgroundColor: 'var(--bg-primary)' }} />
                              <div className="timeline-header">
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{sub.role}</h5>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sub.year}</span>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{sub.company}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {resumeData.gallery && resumeData.gallery.length > 0 && (
        <section className="section">
          <h3 className="section-title">Gallery</h3>
          <div className="gallery-wrapper">
            <button className="gallery-arrow left" onClick={() => scrollGallery('left')} aria-label="Scroll Left">
              &#8592;
            </button>
            <div className="gallery-container" ref={galleryRef}>
              {resumeData.gallery.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Gallery image ${index + 1}`} className="gallery-img" loading="lazy" />
              ))}
            </div>
            <button className="gallery-arrow right" onClick={() => scrollGallery('right')} aria-label="Scroll Right">
              &#8594;
            </button>
          </div>
        </section>
      )}
      </>
      )}

      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} {resumeData.name}. All rights reserved.
        </div>
      </footer>
      </main>

      {/* Start a Project Modal */}
      {isProjectModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsProjectModalOpen(false); setIsSubmittedSuccess(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: isSubmittedSuccess ? '400px' : '640px', transition: 'all 0.3s ease' }}>
            <button className="modal-close-btn" onClick={() => { setIsProjectModalOpen(false); setIsSubmittedSuccess(false); }} aria-label="Close modal">
              &times;
            </button>
            {isSubmittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block' }}>✨</div>
                <h4 className="modal-title" style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 700 }}>Brief Logged!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                  Your system architecture requirements have been directly submitted to Matthew's cloud dashboard!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <a 
                    href="https://cal.com/matthewvargas" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="schedule-call-btn"
                    style={{ width: '100%', justifyContent: 'center', cursor: 'none', textDecoration: 'none' }}
                    onClick={() => {
                      setIsProjectModalOpen(false);
                      setIsSubmittedSuccess(false);
                      setIsDashboardOpen(true);
                    }}
                  >
                    📅 BOOK DISCOVERY CALL &rarr;
                  </a>
                  <button 
                    onClick={() => {
                      setIsProjectModalOpen(false);
                      setIsDashboardOpen(true);
                      setIsSubmittedSuccess(false);
                    }}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid var(--border-color)', 
                      color: 'var(--text-secondary)',
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      width: '100%',
                      cursor: 'none',
                      fontWeight: 600
                    }}
                  >
                    🚀 Open Client Hub Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h4 className="modal-title">Start a Project</h4>
                <form onSubmit={handleInquirySubmit} className="inquiry-form">
                  <div className="form-group">
                    <label htmlFor="client-email">Your Email</label>
                    <input 
                      type="email" 
                      id="client-email" 
                      className="form-input" 
                      value={inquiryEmail} 
                      onChange={(e) => setInquiryEmail(e.target.value)} 
                      required 
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="client-business">Business or Organization Type</label>
                    <CustomSelect 
                      id="client-business"
                      value={inquiryBusiness}
                      onChange={setInquiryBusiness}
                      options={[
                        { value: 'Retail / Food & Beverage', label: '📦 Retail / Food & Beverage' },
                        { value: 'Agency / Consulting', label: '🖥️ Agency / Consulting' },
                        { value: 'SaaS / Tech Startup', label: '👾 SaaS / Tech Startup' },
                        { value: 'E-Commerce', label: '📦 E-Commerce' },
                        { value: 'Service-Based Business', label: '🕹️ Service-Based Business' },
                        { value: 'Government / LGU', label: '🧱 Government / LGU' },
                        { value: 'Individual / Freelancer', label: '💎 Individual / Freelancer' },
                        { value: 'Other', label: '🧩 Other' }
                      ]}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="system-type">What do you want to make?</label>
                      <CustomSelect
                        id="system-type"
                        value={inquiryType}
                        onChange={setInquiryType}
                        options={[
                          { value: 'Website', label: '💾 Website' },
                          { value: 'Web App', label: '🖥️ Web App' },
                          { value: 'Mobile App', label: '📟 Mobile App' },
                          { value: 'Custom System / POS', label: '🕹️ Custom System / POS' },
                          { value: 'E-Governance (e-Gov)', label: '🧱 E-Governance (e-Gov)' },
                          { value: 'Other', label: '🧩 Other' }
                        ]}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="team-size">How big is the team?</label>
                      <CustomSelect
                        id="team-size"
                        value={inquiryTeamSize}
                        onChange={setInquiryTeamSize}
                        options={[
                          { value: '1 (Just Me)', label: '1 (Just Me)' },
                          { value: '2 - 5 people', label: '2 - 5 people' },
                          { value: '6 - 15 people', label: '6 - 15 people' },
                          { value: '16 - 50 people', label: '16 - 50 people' },
                          { value: '50+ people', label: '50+ people' }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="project-budget">Estimated Budget</label>
                      <CustomSelect
                        id="project-budget"
                        value={inquiryBudget}
                        onChange={setInquiryBudget}
                        options={[
                          { value: '< ₱50k', label: '< ₱50,000' },
                          { value: '₱50k - ₱100k', label: '₱50k - ₱100k' },
                          { value: '₱100k - ₱200k', label: '₱100k - ₱200k' },
                          { value: '₱200k+', label: '₱200k +' },
                          { value: 'Not Sure', label: 'Not Sure / Decided Later' }
                        ]}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="contact-method">Preferred Communication</label>
                      <CustomSelect
                        id="contact-method"
                        value={inquiryContactMethod}
                        onChange={setInquiryContactMethod}
                        options={[
                          { value: 'Email', label: 'Email' },
                          { value: 'Telegram', label: 'Telegram' },
                          { value: 'LinkedIn', label: 'LinkedIn' },
                          { value: 'Facebook', label: 'Facebook' },
                          { value: 'Instagram', label: 'Instagram' },
                          { value: 'WhatsApp', label: 'WhatsApp' }
                        ]}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="schedule-call-btn" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', cursor: 'none' }}
                  >
                    Submit &rarr;
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {isDashboardOpen && (
        <div className="modal-overlay" onClick={() => setIsDashboardOpen(false)}>
          <div className="modal-content dashboard-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close-btn" onClick={() => setIsDashboardOpen(false)} style={{ cursor: 'none' }}>&times;</button>
            <h4 className="modal-title">Client Hub Dashboard</h4>
            
            <div className="dashboard-content" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div className="dashboard-welcome-card" style={{ padding: '1.25rem', border: '1px dashed var(--border-color)', marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
                <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  👋 Welcome to your Project Hub!
                </h5>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  This dashboard tracks all system inquiries you have generated. Matthew has received your project brief! To secure a slot and finalize the system architecture details, make sure to book your discovery call.
                </p>
              </div>

              <h5 className="sidebar-title" style={{ fontSize: '0.9rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                Your Generated Roadmaps ({submittedProjects.length})
              </h5>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {submittedProjects.filter(p => p.status !== 'Archived').map((proj) => {
                  // Business icon selector
                  let bizIcon = '👾';
                  if (proj.business.includes('Retail')) bizIcon = '📦';
                  else if (proj.business.includes('Agency')) bizIcon = '🖥️';
                  else if (proj.business.includes('E-Commerce')) bizIcon = '📦';
                  else if (proj.business.includes('Service-Based')) bizIcon = '🕹️';
                  else if (proj.business.includes('Government')) bizIcon = '🧱';
                  else if (proj.business.includes('Individual')) bizIcon = '💎';

                  // Dynamic status levels
                  const getStatusLevel = (status: string) => {
                    switch (status) {
                      case 'Reviewing Brief': return 1;
                      case 'Brief Accepted': return 2;
                      case 'Discovery Call': return 3;
                      case 'Development': return 4;
                      case 'Testing': return 5;
                      case 'Completed': return 6;
                      default: return 1;
                    }
                  };
                  const level = getStatusLevel(proj.status);

                  return (
                    <div 
                      key={proj.id} 
                      className="dashboard-project-card" 
                      style={{ 
                        border: '1px solid var(--border-color)', 
                        padding: '1.5rem', 
                        background: 'var(--bg-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em' }}>{proj.id}</span>
                          <h6 style={{ margin: '0.1rem 0 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {bizIcon} {proj.business}
                          </h6>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{proj.email}</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '0.25rem 0.5rem' }}>
                          {proj.date}
                        </span>
                      </div>

                      {/* Status Roadmap Visual */}
                      <div className="roadmap-timeline" style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', position: 'relative' }}>
                        {/* Connecting Line */}
                        <div style={{ position: 'absolute', top: '10px', left: '8%', right: '8%', height: '1px', background: 'var(--border-color)', zIndex: 1 }} />
                        
                        {/* Step 1: Brief */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: level > 1 ? 'var(--accent)' : 'var(--bg-primary)', 
                            border: level >= 1 ? '2px solid var(--accent)' : '2px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: level > 1 ? '#fff' : 'var(--text-primary)', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                          }}>
                            {level > 1 ? '✓' : '•'}
                          </div>
                          <span style={{ fontSize: '0.72rem', marginTop: '0.4rem', fontWeight: level >= 1 ? 600 : 400, color: level >= 1 ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>Brief Received</span>
                        </div>

                        {/* Step 2: Brief Accepted */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: level > 2 ? 'var(--accent)' : 'var(--bg-primary)', 
                            border: level >= 2 ? '2px solid var(--accent)' : '2px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: level > 2 ? '#fff' : 'var(--accent)', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                          }}>
                            {level > 2 ? '✓' : level === 2 ? '•' : ''}
                          </div>
                          <span style={{ fontSize: '0.72rem', marginTop: '0.4rem', fontWeight: level >= 2 ? 600 : 400, color: level >= 2 ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>Brief Accepted</span>
                        </div>

                        {/* Step 3: Discovery Call */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: level > 3 ? 'var(--accent)' : 'var(--bg-primary)', 
                            border: level >= 3 ? '2px solid var(--accent)' : '2px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: level > 3 ? '#fff' : 'var(--accent)', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                          }}>
                            {level > 3 ? '✓' : level === 3 ? '•' : ''}
                          </div>
                          <span style={{ fontSize: '0.72rem', marginTop: '0.4rem', fontWeight: level >= 3 ? 600 : 400, color: level >= 3 ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>Discovery Call</span>
                        </div>

                        {/* Step 4: Development */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: level > 4 ? 'var(--accent)' : 'var(--bg-primary)', 
                            border: level >= 4 ? '2px solid var(--accent)' : '2px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: level > 4 ? '#fff' : 'var(--accent)', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                          }}>
                            {level > 4 ? '✓' : level === 4 ? '•' : ''}
                          </div>
                          <span style={{ fontSize: '0.72rem', marginTop: '0.4rem', fontWeight: level >= 4 ? 600 : 400, color: level >= 4 ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>Development</span>
                        </div>

                        {/* Step 5: Testing */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: level > 5 ? 'var(--accent)' : 'var(--bg-primary)', 
                            border: level >= 5 ? '2px solid var(--accent)' : '2px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: level > 5 ? '#fff' : 'var(--accent)', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                          }}>
                            {level > 5 ? '✓' : level === 5 ? '•' : ''}
                          </div>
                          <span style={{ fontSize: '0.72rem', marginTop: '0.4rem', fontWeight: level >= 5 ? 600 : 400, color: level >= 5 ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>Testing</span>
                        </div>

                        {/* Step 6: Finished */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: level > 6 ? 'var(--accent)' : 'var(--bg-primary)', 
                            border: level >= 6 ? '2px solid var(--accent)' : '2px solid var(--border-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: level > 6 ? '#fff' : 'var(--accent)', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                          }}>
                            {level > 6 ? '✓' : level === 6 ? '•' : ''}
                          </div>
                          <span style={{ fontSize: '0.72rem', marginTop: '0.4rem', fontWeight: level >= 6 ? 600 : 400, color: level >= 6 ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>Finished</span>
                        </div>
                      </div>

                      {/* Project Specs Meta */}
                      <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>What to Make</strong>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{proj.type}</span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Team Size</strong>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{proj.teamSize}</span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Budget Range</strong>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{proj.budget}</span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Preferred Channel</strong>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{proj.contact}</span>
                        </div>
                      </div>

                      {/* Call to action to book consultation */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Status: <strong style={{ color: 'var(--accent)' }}>{proj.status}</strong>
                        </span>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleClientDelete(proj.id)}
                            className="schedule-call-btn"
                            style={{ 
                              background: 'transparent', 
                              border: '1px solid rgba(255, 0, 0, 0.4)', 
                              color: 'rgba(255, 0, 0, 0.8)', 
                              padding: '0.45rem 0.75rem', 
                              cursor: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            🗑️ Delete
                          </button>
                          
                          {level <= 3 && (
                            <a 
                              href="https://cal.com/matthewvargas" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="schedule-call-btn"
                              style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '0.45rem 0.9rem', cursor: 'none' }}
                            >
                              BOOK DISCOVERY CALL &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Passcode Modal */}
      {isAdminModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAdminModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '360px' }}>
            <button className="modal-close-btn" onClick={() => setIsAdminModalOpen(false)} style={{ cursor: 'none' }}>&times;</button>
            <h4 className="modal-title">Admin Passcode</h4>
            <form onSubmit={handleAdminLogin} className="inquiry-form" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label htmlFor="admin-pin">Enter 4-Digit PIN</label>
                <input 
                  type="password" 
                  id="admin-pin" 
                  className="form-input" 
                  maxLength={6}
                  placeholder="Enter PIN"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  required
                  style={{ letterSpacing: '0.25em', textAlign: 'center', fontSize: '1.25rem' }}
                />
              </div>
              <button 
                type="submit" 
                className="schedule-call-btn" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', cursor: 'none' }}
              >
                Unlock Studio &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

    {/* Custom Cursor */}
    <div className="cursor-dot" ref={cursorDotRef}></div>
    <div className="cursor-ring" ref={cursorRingRef}></div>
    </>
  );
}

export default App;
