import React from 'react';
import { Sparkles, BookOpen, Users, Award, PlayCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onOpenAiGenerator: () => void;
  onExploreCourses: () => void;
  coursesCount: number;
  studentsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAiGenerator,
  onExploreCourses,
  coursesCount,
  studentsCount
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white py-8 sm:py-10 rounded-3xl my-3 mx-4 sm:mx-6 lg:mx-8 border border-emerald-800/40 shadow-xl">
      {/* Subtle Abstract Light Gradients */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center space-y-4">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>منصة التعليم المستقبلي المدعومة بنماذج الذكاء الاصطناعي التوليدية</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-arabic">
          تعلّم المهارات الحقيقية <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
            أو أنشئ دوراتك الكاملة في ثوانٍ
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          انضم إلى آلاف الطلاب والمعلمين واستمتع بتجربة تعلم فريدة تحتوي على مسارات تفاعلية، شروحات ذكية، اختبارات تقييمية، وشهادات معتمدة.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            onClick={onOpenAiGenerator}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>أنشئ دورة تدريبية بالذكاء الاصطناعي</span>
          </button>

          <button
            onClick={onExploreCourses}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm backdrop-blur-md transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>استعرض جميع الدورات المتاحة</span>
          </button>
        </div>

        {/* Real-time Platform Highlights */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 max-w-3xl mx-auto">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">+{coursesCount + 15}</div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-medium">دورة تعليمية وتخصص</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-teal-300 font-mono">+{studentsCount + 4800}</div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-medium">طالب ومتعلم</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono">24/7</div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-medium">معلم AI شخصي</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">100%</div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-medium">شهادات إنجاز معتمدة</div>
          </div>
        </div>

      </div>
    </div>
  );
};
