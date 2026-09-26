import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Circle, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Download, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  Clock, 
  BookOpen, 
  Send, 
  MessageSquare, 
  Star, 
  ExternalLink, 
  HardDrive, 
  Check, 
  X, 
  RefreshCw,
  Video,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { Course, Lesson, UserProgress, CourseReview, StudentProfile } from '../types';
import { CourseReviewsSection } from './CourseReviewsSection';
import { LessonSessionQuiz } from './LessonSessionQuiz';

interface CoursePlayerProps {
  course: Course;
  userProgress?: UserProgress;
  reviews?: CourseReview[];
  currentStudent?: StudentProfile | null;
  onBack: () => void;
  onToggleLessonComplete: (courseId: string, lessonId: string) => void;
  onOpenQuiz: (course: Course) => void;
  onOpenCertificate: (course: Course) => void;
  onAddReview?: (review: Omit<CourseReview, 'id' | 'createdAt'>) => void;
  onDeleteReview?: (reviewId: string) => void;
  isAdmin?: boolean;
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) {
    return url.includes('?') ? `${url}&hl=ar&cc_lang_pref=ar` : `${url}?hl=ar&cc_lang_pref=ar`;
  }
  
  const matchWatch = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([^&?#/]+)/);
  if (matchWatch && matchWatch[1]) {
    return `https://www.youtube.com/embed/${matchWatch[1]}?autoplay=1&rel=0&hl=ar&cc_lang_pref=ar`;
  }
  return null;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  userProgress,
  reviews = [],
  currentStudent,
  onBack,
  onToggleLessonComplete,
  onOpenQuiz,
  onOpenCertificate,
  onAddReview,
  onDeleteReview,
  isAdmin = false,
}) => {
  // Find first uncompleted lesson or default to first lesson
  const allLessons = course.modules.flatMap(m => m.lessons);
  const completedLessonIds = userProgress?.completedLessonIds || [];

  const initialLesson = allLessons.find(l => !completedLessonIds.includes(l.id)) || allLessons[0];
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(initialLesson || allLessons[0]);
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'aiAsk' | 'resources' | 'reviews'>('notes');
  const [showLockedExamNotice, setShowLockedExamNotice] = useState<boolean>(false);
  const [justCompletedLessonPrompt, setJustCompletedLessonPrompt] = useState<boolean>(false);
  const [openModuleIds, setOpenModuleIds] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || 'mod-1']: true
  });

  // Video Streaming & Download States
  const [videoSourceMode, setVideoSourceMode] = useState<'embed' | 'direct'>('embed');
  const [showDownloadPackModal, setShowDownloadPackModal] = useState<boolean>(false);
  const [downloadingLessonId, setDownloadingLessonId] = useState<string | null>(null);
  const [isBulkDownloading, setIsBulkDownloading] = useState<boolean>(false);
  const [bulkDownloadProgress, setBulkDownloadProgress] = useState<number>(0);

  const handleDownloadLesson = (lesson: Lesson) => {
    setDownloadingLessonId(lesson.id);
    const target = lesson.downloadUrl || lesson.directVideoUrl || lesson.videoUrl;
    if (target) {
      const a = document.createElement('a');
      a.href = target;
      a.download = `${course.title}-${lesson.title}.mp4`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setTimeout(() => {
      setDownloadingLessonId(null);
    }, 1400);
  };

  const handleDownloadAllVideos = async () => {
    setIsBulkDownloading(true);
    setBulkDownloadProgress(0);
    const videoLessons = allLessons.filter(l => l.downloadUrl || l.directVideoUrl || l.videoUrl);

    for (let i = 0; i < videoLessons.length; i++) {
      const lesson = videoLessons[i];
      const target = lesson.downloadUrl || lesson.directVideoUrl || lesson.videoUrl;
      if (target) {
        const a = document.createElement('a');
        a.href = target;
        a.download = `درس_${i + 1}_${lesson.title}.mp4`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setBulkDownloadProgress(Math.round(((i + 1) / videoLessons.length) * 100));
      await new Promise(r => setTimeout(r, 600));
    }
    setTimeout(() => {
      setIsBulkDownloading(false);
    }, 1000);
  };

  // Calculate course specific reviews count & live average
  const courseReviews = reviews.filter(r => r.courseId === course.id);
  const liveAverage = courseReviews.length > 0
    ? Math.round((courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length) * 10) / 10
    : course.rating;

  // AI Assistant In-Lesson State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const toggleModuleOpen = (modId: string) => {
    setOpenModuleIds(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const isLessonDone = (lessonId: string) => completedLessonIds.includes(lessonId);

  const handleAskAiAboutLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    try {
      const res = await fetch('/api/gemini/explain-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: selectedLesson.title,
          lessonContent: selectedLesson.contentMarkdown,
          userQuestion: aiQuestion
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiExplanation(data.explanation);
      }
    } catch (err) {
      console.error(err);
      setAiExplanation("عذراً، تعذر الحصول على إجابة المعلم الذكي حالياً.");
    } finally {
      setAiLoading(false);
    }
  };

  // Find next/prev lesson index
  const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCourseComplete = completedLessonIds.length === allLessons.length && allLessons.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-4">
      
      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="العودة للكتالوج"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {course.category}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-arabic mt-1 line-clamp-1">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Course Completion Badge / Quiz Action & Ratings Button */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Download All Course Videos Button */}
          <button
            onClick={() => setShowDownloadPackModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm border border-slate-700 shadow-sm transition-all"
            title="تحميل كافة فيديوهات دروس الدورة بجودة عالية لمشاهدتها بدون إنترنت"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تحميل كل فيديوهات الدورة</span>
          </button>

          {/* Live Rating & Reviews Button */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-2xs ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
            }`}
            title="عرض جميع مراجعات وتقييمات الطلاب لهذه الدورة"
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{liveAverage.toFixed(1)}</span>
            <span className="opacity-75 font-normal">({courseReviews.length > 0 ? courseReviews.length : course.reviewsCount} تقييم)</span>
          </button>

          {isCourseComplete && (
            <button
              onClick={() => onOpenCertificate(course)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>عرض شهادة الإنجاز</span>
            </button>
          )}

          {course.quiz && (
            isCourseComplete ? (
              <button
                type="button"
                onClick={() => onOpenQuiz(course)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
                title="الامتحان الشامل النهائي متاح الآن! اضغط للبدء وإصدار شهادتك"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>الامتحان الشامل النهائي (متاح الآن 🔓)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLockedExamNotice(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                title="الامتحان الشامل مقفل - يجب إكمال جميع الدروس أولاً لفتحه"
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>الامتحان الشامل (مغلق 🔒)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-normal">
                  {completedLessonIds.length}/{allLessons.length}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Grid: Player Content (Left/Top) & Lessons Tree Sidebar (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Video/Content Player & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Media Player Box */}
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
            {/* Top Video Toolbar: Switcher, Resolution, and Download */}
            <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-bold">
                  <Video className="w-3.5 h-3.5" />
                  1080p Full HD
                </span>
                {selectedLesson.videoFileSize && (
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    الحجم: {selectedLesson.videoFileSize}
                  </span>
                )}
              </div>

              {/* Player Mode Switcher + Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setVideoSourceMode('embed')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      videoSourceMode === 'embed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    يوتيوب
                  </button>
                  <button
                    onClick={() => setVideoSourceMode('direct')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      videoSourceMode === 'direct'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    بث مباشر MP4
                  </button>
                </div>

                {/* Lesson Video Download Button */}
                <button
                  onClick={() => handleDownloadLesson(selectedLesson)}
                  disabled={downloadingLessonId === selectedLesson.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all"
                  title="تحميل ملف فيديو هذا الدرس مباشرة بجودة عالية"
                >
                  {downloadingLessonId === selectedLesson.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>جارِ التنزيل...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل الفيديو</span>
                    </>
                  )}
                </button>

                {/* External YouTube Link if available */}
                {selectedLesson.videoUrl && (
                  <a
                    href={selectedLesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    title="فتح الفيديو في نافذة مستقلة على يوتيوب"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {selectedLesson.videoUrl ? (
              <div className="relative aspect-video w-full bg-black">
                {videoSourceMode === 'embed' && getYouTubeEmbedUrl(selectedLesson.videoUrl) ? (
                  <iframe
                    key={`${selectedLesson.id}-embed`}
                    src={getYouTubeEmbedUrl(selectedLesson.videoUrl)!}
                    title={selectedLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={`${selectedLesson.id}-direct`}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    poster={course.thumbnail}
                  >
                    <source
                      src={
                        selectedLesson.directVideoUrl ||
                        selectedLesson.downloadUrl ||
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                      }
                      type="video/mp4"
                    />
                    متصفحك لا يدعم مشغل الفيديوهات.
                  </video>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-300 space-y-3 bg-gradient-to-br from-slate-900 to-slate-950">
                <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">درس قراءة وتطبيق عملي</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  تصفح الملاحظات والشرح التوضيحي أدناه للتطبيق وقراءة مفاهيم هذا الدرس.
                </p>
              </div>
            )}

            {/* Video Footer Banner */}
            <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-3">
              <div className="flex items-center gap-3 font-semibold text-white">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>المدة: {selectedLesson.durationMinutes} دقيقة</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  <span>🎥 فيديو تعليمي عالي الدقة</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Download Button */}
                <button
                  onClick={() => handleDownloadLesson(selectedLesson)}
                  disabled={downloadingLessonId === selectedLesson.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  title="تحميل فيديو الدرس"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>تحميل الدرس MP4</span>
                </button>

                {/* Complete Toggle Button */}
                <button
                  onClick={() => {
                    const willBeComplete = !isLessonDone(selectedLesson.id);
                    onToggleLessonComplete(course.id, selectedLesson.id);
                    if (willBeComplete) {
                      setJustCompletedLessonPrompt(true);
                    } else {
                      setJustCompletedLessonPrompt(false);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isLessonDone(selectedLesson.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {isLessonDone(selectedLesson.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>أكملت هذا الدرس</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>تحديد كـ "مكتمل"</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Rating & Review Prompt on Lesson Completion */}
            {justCompletedLessonPrompt && (
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-t border-amber-300/40 dark:border-amber-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      أحسنت بإكمال درس "{selectedLesson.title}"! 🎉
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      ما رأيك في الشرح والمحتوى؟ اترك تقييمك بالنجوم ورأيك لمساعدة زملائك!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab('reviews');
                      setJustCompletedLessonPrompt(false);
                      setTimeout(() => {
                        const el = document.getElementById('course-reviews-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>قيّم الدورة الآن</span>
                  </button>
                  <button
                    onClick={() => setJustCompletedLessonPrompt(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    لاحقاً
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content Header & Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-arabic">
                {selectedLesson.title}
              </h2>
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'notes'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>الشرح والملخص</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'quiz'
                    ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>اختبار السيشن / الدرس</span>
                {isLessonDone(selectedLesson.id) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('aiAsk')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'aiAsk'
                    ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Bot className="w-4 h-4 text-teal-500" />
                <span>اسأل المعلم الذكي عن الدرس</span>
              </button>

              {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'resources'
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>الملفات والمرفقات</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'reviews'
                    ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>التقييمات والمراجعات ({courseReviews.length > 0 ? courseReviews.length : course.reviewsCount})</span>
              </button>
            </div>

            {/* Tab 1: Lesson Notes (Markdown View) */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="prose prose-emerald dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedLesson.contentMarkdown}
                </div>

                {/* Key Takeaways */}
                {selectedLesson.keyTakeaways && selectedLesson.keyTakeaways.length > 0 && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-3">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>النقاط الرئيسية المستفادة من هذا الدرس:</span>
                    </h4>
                    <ul className="space-y-2 pr-4 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 list-disc">
                      {selectedLesson.keyTakeaways.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Link to Session Quiz */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-950" />
                    <span>الانتقال لاختبار هذا الدرس (السيشن) 📝</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Lesson Session Quiz */}
            {activeTab === 'quiz' && (
              <LessonSessionQuiz
                key={selectedLesson.id}
                lesson={selectedLesson}
                isCompleted={isLessonDone(selectedLesson.id)}
                onMarkLessonComplete={() => onToggleLessonComplete(selectedLesson.id)}
              />
            )}

            {/* Tab 2: Ask AI Tutor about this lesson */}
            {activeTab === 'aiAsk' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs sm:text-sm flex items-start gap-3">
                  <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">هل لديك سؤال لم تفهمه في درس "{selectedLesson.title}"؟</p>
                    <p className="text-teal-700 dark:text-teal-300 text-xs mt-0.5">
                      اكتب سؤالك وسيقوم المعلم الذكي بشرح النقطة، إعطاء مثال واقعي، أو تبسيط المفهوم فوراً.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAskAiAboutLesson} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="مثال: اشرح لي الفرق بين useState و useReducer كأني في العاشرة من عمري..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>جاري التحليل والشرح...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ارسل السؤال للـ AI</span>
                      </>
                    )}
                  </button>
                </form>

                {/* AI Explanation Result */}
                {aiExplanation && (
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-teal-200 dark:border-teal-700 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                      <Sparkles className="w-4 h-4 text-teal-500" />
                      <span>إجابة المعلم الذكي:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {aiExplanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {selectedLesson.resources?.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{res.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const content = `مرفق تعليمي خاص بدرس: ${selectedLesson.title}\nمن دورة: ${course.title}\n\n=== ملخص الدرس ===\n${selectedLesson.contentMarkdown}\n\n=== النقاط الرئيسية ===\n${(selectedLesson.keyTakeaways || []).map(k => '• ' + k).join('\n')}`;
                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${res.name.replace(/\s+/g, '_')}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-emerald-600 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-emerald-50 transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تحميل المرفق</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Ratings & Reviews */}
            {activeTab === 'reviews' && (
              <div className="pt-2">
                <CourseReviewsSection
                  course={course}
                  reviews={reviews}
                  currentStudent={currentStudent}
                  activeLessonTitle={selectedLesson?.title}
                  onAddReview={onAddReview || (() => {})}
                  onDeleteReview={onDeleteReview}
                  isAdmin={isAdmin}
                />
              </div>
            )}

            {/* Bottom Lesson Switcher (Prev/Next) */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => prevLesson && setSelectedLesson(prevLesson)}
                disabled={!prevLesson}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 transition-colors"
              >
                الدرس السابق
              </button>

              <button
                onClick={() => nextLesson && setSelectedLesson(nextLesson)}
                disabled={!nextLesson}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                الدرس التالي
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (1 Col): Modules & Lessons Hierarchy Tree */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-arabic">
                محتوى الدورة التعليمية
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {completedLessonIds.length} / {allLessons.length} دروس
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${allLessons.length > 0 ? (completedLessonIds.length / allLessons.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Modules Accordion */}
            <div className="space-y-3 pt-2">
              {course.modules.map((module, mIdx) => {
                const isOpen = openModuleIds[module.id] ?? true;
                const moduleCompletedCount = module.lessons.filter(l => isLessonDone(l.id)).length;

                return (
                  <div key={module.id} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/30">
                    
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModuleOpen(module.id)}
                      className="w-full p-3.5 flex items-center justify-between text-right bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                            {module.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {moduleCompletedCount}/{module.lessons.length} دروس مكتملة
                          </span>
                        </div>
                      </div>

                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {/* Lessons List inside Module */}
                    {isOpen && (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/80 dark:bg-slate-950/40">
                        {module.lessons.map((lesson) => {
                          const isSelected = selectedLesson.id === lesson.id;
                          const completed = isLessonDone(lesson.id);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs ${
                                isSelected
                                  ? 'bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold border-r-4 border-emerald-500'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLessonComplete(course.id, lesson.id);
                                  }}
                                  className="shrink-0"
                                >
                                  {completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                                <span className="truncate">{lesson.title}</span>
                              </div>

                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {lesson.durationMinutes} د
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Quiz Trigger Card inside Sidebar */}
            {course.quiz && (
              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>الاختبار التقييمي للدورة</span>
                </div>
                <p className="text-[11px] text-slate-200">
                  اجتز الاختبار بنجاح لاختبار حصيلتك والحصول على شهادة الإنجاز الرسمية!
                </p>
                <button
                  onClick={() => onOpenQuiz(course)}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  بدء الاختبار الآن
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Download All Course Videos Modal */}
      {showDownloadPackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    تحميل جميع فيديوهات الدورة
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {course.title} • {allLessons.length} دروس تعليمية
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadPackModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  محتوى مرئي عالي الدقة (1080p MP4)
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  يمكنك تشغيل الفيديوهات أوفلاين على هاتفك أو حاسوبك بدون اتصال بالإنترنت.
                </span>
              </div>
              <button
                onClick={handleDownloadAllVideos}
                disabled={isBulkDownloading}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                {isBulkDownloading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارِ التنزيل ({bulkDownloadProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تحميل الكل الآن</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress bar if bulk downloading */}
            {isBulkDownloading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>جاري معالجة وتحميل فيديوهات الدورة...</span>
                  <span className="font-mono">{bulkDownloadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${bulkDownloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Lessons List for Download */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {allLessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        <span>{lesson.durationMinutes} دقيقة</span>
                        <span>•</span>
                        <span>{lesson.videoFileSize || '42 MB'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-sans">جاهز للتحميل</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadLesson(lesson)}
                    disabled={downloadingLessonId === lesson.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold transition-all shrink-0 shadow-2xs"
                  >
                    {downloadingLessonId === lesson.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span>تحميل MP4</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDownloadPackModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locked Final Exam Notice Modal */}
      {showLockedExamNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-arabic" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-300/80 dark:border-amber-800/80 shadow-2xl space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>الامتحان الشامل النهائي مقفل حالياً</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                يجب إكمال جميع دروس الدورة أولاً! 🎓
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                وفقاً لضوابط الدورة المعتمدة، لا يمكن فتح الامتحان الشامل النهائي أو إصدار الشهادة إلا بعد حضور وإتمام كافة الدروس التعليمية في المنهج.
              </p>
            </div>

            {/* Progress status */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">نسبة التقدم الحالية في الدورة:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {completedLessonIds.length} من {allLessons.length} دروس مكتملة
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${allLessons.length > 0 ? (completedLessonIds.length / allLessons.length) * 100 : 0}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                متبقي لديك ({allLessons.length - completedLessonIds.length}) دروس لإتمامها وفتح الامتحان النهائي تلقائياً!
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLockedExamNotice(false)}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                فهمت، العودة لمتابعة الدروس 📚
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
