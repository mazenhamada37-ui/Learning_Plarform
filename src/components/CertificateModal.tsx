import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Course } from '../types';

interface CertificateModalProps {
  course: Course;
  studentName: string;
  gradeScore?: number;
  issueDate?: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  studentName,
  gradeScore = 95,
  issueDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
  onClose
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const certCode = `CERT-${course.id.toUpperCase().slice(-5)}-${Math.floor(10000 + Math.random() * 90000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in dir-rtl"
    >
      <div className="min-h-full flex items-center justify-center py-4">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
        >
        
        {/* Modal Top Actions Header */}
        <div className="flex items-center justify-between p-4 px-6 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>معاينة شهادة الإنجاز الرسمية</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-12 bg-slate-50 dark:bg-slate-950 overflow-auto flex-1 touch-pan-x touch-pan-y overscroll-contain print:p-0 print:bg-white">
          <div 
            ref={certificateRef}
            className="w-full min-w-[650px] bg-white text-slate-900 p-10 sm:p-14 rounded-2xl border-8 border-double border-amber-600/40 shadow-xl relative overflow-hidden font-arabic print:border-8 print:shadow-none print:w-full"
          >
            
            {/* Elegant Corner Decorative Ornaments */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-tr-full pointer-events-none" />

            {/* Certificate Header Branding */}
            <div className="text-center space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>شهادة موثقة ورسمية</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-700 tracking-wide font-serif">
                شهــــادة إنجــــاز
              </h1>
              <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">
                OFFICIAL CERTIFICATE OF COMPLETION
              </p>
            </div>

            {/* Certificate Body Wording */}
            <div className="text-center my-8 space-y-6 relative z-10">
              <p className="text-sm text-slate-600 font-medium">
                تأكد منصة <strong className="text-emerald-700">تعلّم الإلكترونية</strong> بأن الطالب / الطالبة:
              </p>

              {/* Student Name */}
              <div className="inline-block border-b-2 border-amber-500/60 px-8 py-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide font-serif">
                  {studentName}
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                قد أتم بنجاح كافة متطلبات التطبيق واجتاز الاختبار النهائي بتقدير ممتاز بنسبة (<strong>{gradeScore}%</strong>) في الدورة التدريبية:
              </p>

              {/* Course Title */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-emerald-950">
                  {course.title}
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  المجال: {course.category} | الساعات المعتمدة: {course.estimatedHours} ساعة
                </p>
              </div>
            </div>

            {/* Certificate Footer Signatures & Seal */}
            <div className="flex items-end justify-between pt-8 border-t border-slate-200 text-xs relative z-10">
              
              {/* Instructor Signature */}
              <div className="text-center space-y-1">
                <p className="text-slate-500 font-medium">مدرب الدورة</p>
                <p className="font-extrabold text-slate-900 text-sm">{course.instructor.name}</p>
                <p className="text-[10px] text-slate-400">{course.instructor.title}</p>
              </div>

              {/* Center Seal Badge */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-white">
                  <Award className="w-9 h-9" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 mt-1">ختم الاعتماد</span>
              </div>

              {/* Verification Code & QR Simulation */}
              <div className="text-left space-y-1 font-mono">
                <p className="text-slate-500 font-sans font-medium text-right">رمز التوثيق:</p>
                <p className="font-bold text-slate-800 text-[11px] bg-slate-100 px-2 py-0.5 rounded border">{certCode}</p>
                <p className="text-[10px] text-slate-400 font-sans text-right">تاريخ الإصدار: {issueDate}</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
);
};
