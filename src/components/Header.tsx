import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  UserCheck, 
  Plus, 
  BookOpen, 
  Search, 
  ShieldCheck,
  GraduationCap,
  Menu,
  X,
  ArrowDown,
  Sparkles,
  LogIn
} from 'lucide-react';
import { StudentProfile, InstructorProfile, Course } from '../types';
import { getCourseSearchScore } from '../utils/searchUtils';

export interface HeaderProps {
  currentRole?: 'student' | 'teacher' | 'instructor' | 'admin';
  onRoleChange?: (role: any) => void;
  activeTab?: string;
  setActiveTab?: (tab: 'catalog' | 'dashboard' | 'instructor') => void;
  onOpenAiGenerator?: () => void;
  onOpenAiTutor?: () => void;
  onOpenAddCourseModal?: () => void;
  onOpenStudentProfile?: () => void;
  onOpenAddAccount?: () => void;
  onOpenCatalog?: () => void;
  onOpenDashboard?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  courses?: Course[];
  onSelectCourse?: (course: Course) => void;
  studentProfile?: StudentProfile | null;
  instructorProfile?: InstructorProfile | null;
  userName?: string;
  onOpenRegistrationModal?: () => void;
  onOpenInstructorRegistrationModal?: () => void;
  onOpenAddUserModal?: () => void;
  onOpenAdminModal?: () => void;
  onUserProfileClick?: () => void;
  onAddAccount?: () => void;
  onOpenCourseCatalog?: () => void;
  onOpenDashboardAndCertificates?: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  completedCoursesCount?: number;
  streakDays?: number;
  extraRegisteredStudents?: StudentProfile[];
  extraRegisteredInstructors?: InstructorProfile[];
  onSelectActiveStudent?: (student: StudentProfile) => void;
  onSelectActiveInstructor?: (instructor: InstructorProfile) => void;
  onLogoutStudent?: () => void;
  onLogoutInstructor?: () => void;
  isOwnerSession?: boolean;
  onSelectOwner?: () => void;
  isCloudSynced?: boolean;
  onOpenLoginModal?: () => void; // دالة فتح نافذة تسجيل الدخول المفعلة
}

export const Header: React.FC<HeaderProps> = ({
  currentRole = 'student',
  onRoleChange,
  activeTab = 'catalog',
  setActiveTab,
  onOpenAiTutor,
  onOpenStudentProfile,
  onOpenAddAccount,
  onOpenCatalog,
  onOpenDashboard,
  onSearch,
  searchQuery = '',
  setSearchQuery,
  courses = [],
  onSelectCourse,
  studentProfile,
  instructorProfile,
  userName = 'Mazen Hamada',
  onOpenRegistrationModal,
  onOpenInstructorRegistrationModal,
  onOpenAddUserModal,
  onOpenAdminModal,
  onUserProfileClick,
  onAddAccount,
  onOpenCourseCatalog,
  onOpenDashboardAndCertificates,
  onOpenLoginModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchedCourses = React.useMemo(() => {
    if (!searchQuery.trim() || !courses.length) return [];
    return courses
      .map(course => ({
        course,
        score: getCourseSearchScore(course, searchQuery)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.course)
      .slice(0, 6);
  }, [searchQuery, courses]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSearchFocused(false);
      if (activeTab !== 'catalog' && setActiveTab) {
        setActiveTab('catalog');
      }
      setTimeout(() => {
        const el = document.getElementById('catalog-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }
      }, 50);
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const handleSelectDropdownCourse = (course: Course) => {
    setIsSearchFocused(false);
    if (onSelectCourse) {
      onSelectCourse(course);
    } else {
      if (setActiveTab) setActiveTab('catalog');
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const instructorDisplayName = instructorProfile?.fullName || 'أستاذ محاضر';
  const isStudentActive = currentRole === 'student';
  const isInstructorActive = currentRole === 'instructor' || currentRole === 'teacher';

  const handleSwitchToStudent = () => {
    if (onRoleChange) onRoleChange('student');
    if (setActiveTab) setActiveTab('catalog');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToInstructor = () => {
    if (onRoleChange) onRoleChange('instructor');
    if (setActiveTab) setActiveTab('instructor');
    setMobileMenuOpen(false);
    if (!instructorProfile && onOpenInstructorRegistrationModal) {
      onOpenInstructorRegistrationModal();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAccount = () => {
    setMobileMenuOpen(false);
    if (onOpenAddUserModal) {
      onOpenAddUserModal();
    } else if (onAddAccount) {
      onAddAccount();
    } else if (onOpenAddAccount) {
      onOpenAddAccount();
    }
  };

  const handleUserProfile = () => {
    setMobileMenuOpen(false);
    if (isInstructorActive) {
      if (onOpenInstructorRegistrationModal) {
        onOpenInstructorRegistrationModal();
      }
    } else {
      if (onOpenStudentProfile) {
        onOpenStudentProfile();
      } else if (onUserProfileClick) {
        onUserProfileClick();
      } else if (onOpenRegistrationModal) {
        onOpenRegistrationModal();
      }
    }
  };

  const handleAiTutor = () => {
    setMobileMenuOpen(false);
    if (onOpenAiTutor) {
      onOpenAiTutor();
    }
  };

  const handleAdmin = () => {
    setMobileMenuOpen(false);
    if (onOpenAdminModal) {
      onOpenAdminModal();
    } else if (onRoleChange) {
      onRoleChange('admin');
    }
  };

  const handleCatalog = () => {
    setMobileMenuOpen(false);
    if (setActiveTab) setActiveTab('catalog');
    if (onOpenCatalog) onOpenCatalog();
    if (onOpenCourseCatalog) onOpenCourseCatalog();
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (setSearchQuery) setSearchQuery(val);
    if (onSearch) onSearch(val);
    if (val.trim() && activeTab !== 'catalog' && setActiveTab) {
      setActiveTab('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d16] border-b border-slate-800/80 font-arabic text-white select-none w-full" dir="rtl">
      <div className="w-full px-3 md:px-5 h-16 flex items-center justify-between gap-3">
        
        {/* DESKTOP VIEW - يظهر بس من 1024px فما فوق (لاب توب حقيقي فيه مساحة كافية) */}
        <div className="hidden lg:flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            {/* Student / Instructor Toggle */}
            <div className="flex bg-[#121929] p-1 rounded-xl border border-slate-800/80 shrink-0">
              <button
                type="button"
                onClick={handleSwitchToStudent}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isStudentActive
                    ? 'bg-slate-700/90 text-white border border-slate-600/50 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                طالب
              </button>
              <button
                type="button"
                onClick={handleSwitchToInstructor}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isInstructorActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                محاضر
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenLoginModal) {
                  onOpenLoginModal();
                } else if (onOpenRegistrationModal) {
                  onOpenRegistrationModal();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-600/50 text-slate-200 hover:bg-slate-700 hover:text-white active:scale-95 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-sm"
              title="تسجيل الدخول لحساب موجود"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>تسجيل الدخول</span>
            </button>

            {/* Add Account Button */}
            <button
              type="button"
              onClick={handleAddAccount}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="إضافة حساب جديد"
            >
              <span>إضافة حساب</span>
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>

            {/* User Profile Button */}
            {isInstructorActive ? (
              <button
                type="button"
                onClick={handleUserProfile}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2b1704] border border-amber-500/60 text-amber-300 hover:bg-[#3d2006] active:scale-95 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
                title="بيانات المحاضر"
              >
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="max-w-[130px] truncate">{instructorDisplayName}</span>
              </button>
            ) : (
              studentProfile && (
                <button
                  type="button"
                  onClick={handleUserProfile}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#092220] border border-emerald-500/50 text-emerald-400 hover:bg-[#0d2d2a] active:scale-95 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-sm"
                  title="بيانات الطالب المسجل"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="max-w-[140px] truncate">{studentProfile.fullName}</span>
                </button>
              )
            )}

            {/* Smart AI Tutor */}
            <button
              type="button"
              onClick={handleAiTutor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#092225] border border-emerald-500/40 text-emerald-400 hover:bg-[#0d2d31] active:scale-95 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>المعلم الذكي</span>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={handleAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#280c3a] border border-purple-500/50 text-purple-300 hover:bg-[#34114d] active:scale-95 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>المسؤول</span>
            </button>

            {/* Catalog */}
            {!isInstructorActive && (
              <button
                type="button"
                onClick={handleCatalog}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  activeTab === 'catalog'
                    ? 'bg-[#0d1f35] border-emerald-500/70 text-emerald-300 shadow-sm'
                    : 'bg-[#0d1627] border-slate-700/80 text-emerald-400 hover:bg-[#131f37]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>كتالوج الدورات</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE HAMBURGER - يظهر لأي شاشة أصغر من 1024px (موبايل، تابلت، أو لاب توب مقسوم) */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-[#121929] border border-slate-700/80 hover:border-emerald-500/60 text-slate-200 hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Logo */}
        <div 
          onClick={handleCatalog}
          className="flex items-center gap-2 shrink-0 pl-1 cursor-pointer select-none"
        >
          <span className="font-extrabold text-white text-sm sm:text-base tracking-tight flex items-center gap-1 whitespace-nowrap">
            منصة <span className="text-emerald-400">تعلَّم</span>
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* SEARCH BAR ROW */}
      <div className="w-full bg-[#080d19]/95 backdrop-blur-md border-t border-slate-800/80 px-3 sm:px-5 py-2.5 shadow-sm">
        <div ref={searchContainerRef} className="relative w-full max-w-5xl mx-auto">
          <div className={`relative flex items-center w-full rounded-2xl transition-all duration-200 border ${
            isSearchFocused
              ? 'bg-[#0f172a] border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
              : 'bg-[#0c1322] border-slate-750 hover:border-slate-600 shadow-inner'
          }`}>
            <div className="pr-3.5 pl-1 flex items-center justify-center shrink-0 pointer-events-none">
              <Search className={`w-4 h-4 transition-colors duration-200 ${isSearchFocused ? 'text-emerald-400' : 'text-slate-400'}`} />
            </div>
            <input
              type="text"
              placeholder="ابحث عن اسم الدورة، التخصص (برمجة، ذكاء اصطناعي، لغات...)، أو المحاضر..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              className="w-full h-10 sm:h-11 bg-transparent text-sm text-slate-100 placeholder-slate-400/80 focus:outline-none pr-1 pl-2 font-normal"
            />
            <div className="pl-2 pr-1.5 flex items-center gap-1.5 shrink-0">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    if (setSearchQuery) setSearchQuery('');
                    if (onSearch) onSearch('');
                  }}
                  className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER - يظهر لأي شاشة أصغر من 1024px، فيها كل الأزرار زي الديسكتوب */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/90 bg-[#090d16]/98 backdrop-blur-md px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="flex bg-[#121929] p-1 rounded-xl border border-slate-800 w-full">
            <button
              type="button"
              onClick={handleSwitchToStudent}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                isStudentActive ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              طالب
            </button>
            <button
              type="button"
              onClick={handleSwitchToInstructor}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                isInstructorActive ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              محاضر
            </button>
          </div>

          {/* Mobile Student Profile Card */}
          {studentProfile && (
            <div 
              onClick={handleUserProfile}
              className="flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all bg-[#092220] border-emerald-500/40 hover:border-emerald-400"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-emerald-500/20 text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-300">{studentProfile.fullName}</div>
                  <div className="text-[10px] text-slate-400">الملف الشخصي للطالب المسجل</div>
                </div>
              </div>
              <span className="text-xs font-bold underline text-emerald-400">عرض</span>
            </div>
          )}

          {/* Mobile Instructor Profile Card */}
          {isInstructorActive && (
            <div 
              onClick={handleUserProfile}
              className="flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all bg-[#2b1704] border-amber-500/40 hover:border-amber-400"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-amber-500/20 text-amber-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300">{instructorDisplayName}</div>
                  <div className="text-[10px] text-slate-400">بيانات المحاضر</div>
                </div>
              </div>
              <span className="text-xs font-bold underline text-amber-400">عرض</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenLoginModal) onOpenLoginModal();
              }}
              className="col-span-2 p-2.5 rounded-xl bg-slate-800 border border-slate-600/50 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-slate-700"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>تسجيل الدخول لحساب موجود</span>
            </button>

            <button
              type="button"
              onClick={handleAddAccount}
              className="col-span-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة حساب جديد</span>
            </button>

            {!isInstructorActive && (
              <button
                type="button"
                onClick={handleCatalog}
                className={`col-span-2 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-[#0d1f35] border-emerald-500/70 text-emerald-300'
                    : 'bg-[#0d1627] border-slate-700/80 text-emerald-400 hover:bg-[#131f37]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>كتالوج الدورات</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAiTutor}
              className="p-2.5 rounded-xl bg-[#092225] border border-emerald-500/40 text-emerald-400 hover:bg-[#0d2d31] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>المعلم الذكي</span>
            </button>

            <button
              type="button"
              onClick={handleAdmin}
              className="p-2.5 rounded-xl bg-[#280c3a] border border-purple-500/50 text-purple-300 hover:bg-[#34114d] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>المسؤول</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;