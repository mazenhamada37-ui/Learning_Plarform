import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { Course, CategoryType, CourseLevel } from '../types';

interface AICourseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseGenerated: (course: Course) => void;
}

export const AICourseGeneratorModal: React.FC<AICourseGeneratorModalProps> = ({
  isOpen,
  onClose,
  onCourseGenerated
}) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<CategoryType>('برمجة وتطوير');
  const [level, setLevel] = useState<CourseLevel>('متوسط');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/gemini/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category,
          level
        })
      });

      const data = await res.json();

      if (data.success && data.course) {
        const generated = data.course;
        const defaultArabicVideos: Record<string, string> = {
          'برمجة وتطوير': 'https://www.youtube.com/watch?v=6QAELgirvjs',
          'الذكاء الاصطناعي': 'https://www.youtube.com/watch?v=k24r2_Tj048',
          'تصميم واجهات UI/UX': 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
          'علوم البيانات': 'https://www.youtube.com/watch?v=h3vcT-L6sN8',
          'إدارة الأعمال والقيادة': 'https://www.youtube.com/watch?v=2L0kYw3x2Fw',
          'اللغات والتواصل': 'https://www.youtube.com/watch?v=2L0kYw3x2Fw'
        };

        const mappedModules = (generated.modules || []).map((mod: any) => ({
          ...mod,
          lessons: (mod.lessons || []).map((les: any) => ({
            ...les,
            videoUrl: les.videoUrl || defaultArabicVideos[category] || 'https://www.youtube.com/watch?v=6QAELgirvjs'
          }))
        }));

        const newCourse: Course = {
          id: `ai-course-${Date.now()}`,
          title: generated.title || topic,
          subtitle: generated.subtitle || 'دورة تدريبية سريعة تم إنشاؤها بالذكاء الاصطناعي.',
          description: generated.subtitle || 'دورة شاملة تم تصميم خطتها وشروحها بواسطة نموذج Gemini AI التوليدي.',
          category: (generated.category as CategoryType) || category,
          level: (generated.level as CourseLevel) || level,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
          instructor: {
            id: 'inst-ai',
            name: 'معلم الذكاء الاصطناعي (Gemini AI)',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
            title: 'مُنشئ المناهج التعليمية التوليدي',
            bio: 'نموذج ذكاء اصطناعي متطور مدرب على صياغة المحتوى التعليمي والدروس التفاعلية.',
            rating: 5.0,
            studentsCount: 1500
          },
          rating: 4.95,
          reviewsCount: 12,
          studentsEnrolledCount: 1,
          estimatedHours: generated.estimatedHours || 6,
          isAiGenerated: true,
          price: 'مجاني',
          tags: [topic, 'ذكاء اصطناعي', 'دورة مخصصة'],
          learningObjectives: generated.learningObjectives || ['فهم المفاهيم الأساسية للموضوع', 'التطبيق العملي المباشر'],
          modules: mappedModules,
          quiz: generated.quiz
        };

        onCourseGenerated(newCourse);
        onClose();
      } else {
        setErrorMessage(data.error || 'تعذر إنشاء الدورة التدريبية. يرجى محاولة صياغة العنوان بأسلوب مختلف.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('حدث خطأ في الشبكة أو الاتصال بالسيرفر.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl"
    >
      <div className="min-h-full flex items-center justify-center py-4">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
        >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg font-arabic">إنشاء دورة تعليمية بالذكاء الاصطناعي</h3>
              <p className="text-xs text-emerald-200">اكتب موضوعك ليقوم Gemini AI بتأليف خطة المنهج والدروس فوراً</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 touch-pan-y overscroll-contain">
          
          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              عن أي موضوع ترغب في تعلمه أو تدريسه؟ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: أساسيات الأمن السيبراني والوقاية من الاختراق"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Category Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                التصنيف والمجال:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
              >
                <option value="برمجة وتطوير">برمجة وتطوير</option>
                <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                <option value="تصميم واجهات UI/UX">تصميم واجهات UI/UX</option>
                <option value="علوم البيانات">علوم البيانات</option>
                <option value="إدارة الأعمال والقيادة">إدارة الأعمال والقيادة</option>
                <option value="اللغات والتواصل">اللغات والتواصل</option>
              </select>
            </div>

            {/* Level Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                المستوى المطلوب:
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
              >
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="عالمي">عالمي (احترافي فائق)</option>
              </select>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">اقتراحات سريعة للموضوعات:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'تطوير ألعاب بنفسك بـ Unity',
                'تحليل البيانات بـ Python & Pandas',
                'إدارة المشاريع الناشئة والابتكار',
                'التسويق الرقمي بـ SEO'
              ].map((sug, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setTopic(sug)}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-emerald-300" />
                  <span>جاري كتابة خطة الدورة والدروس بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>توليد الدورة والدروس فوراً</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
);
};
