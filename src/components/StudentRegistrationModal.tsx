import React, { useRef, useState } from 'react';
import { X, UserPlus, Mail, Lock, Phone, AlertCircle, CheckCircle2, Target, Eye, EyeOff, Globe } from 'lucide-react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';
import { StudentProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentProfile?: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void | Promise<void>;
  onLogout?: () => void;
}

// قائمة الدول - الدول العربية أولًا، ثم باقي الدول أبجديًا
const COUNTRY_OPTIONS: { group: string; options: string[] }[] = [
  {
    group: 'الدول العربية',
    options: [
      'مصر', 'السعودية', 'الإمارات', 'الكويت', 'قطر', 'البحرين', 'عمان',
      'الأردن', 'العراق', 'سوريا', 'لبنان', 'فلسطين', 'اليمن',
      'ليبيا', 'تونس', 'الجزائر', 'المغرب', 'السودان', 'موريتانيا',
      'الصومال', 'جيبوتي', 'جزر القمر',
    ],
  },
  {
    group: 'دول أخرى',
    options: [
      'الولايات المتحدة', 'كندا', 'المملكة المتحدة', 'ألمانيا', 'فرنسا',
      'إيطاليا', 'إسبانيا', 'هولندا', 'السويد', 'النرويج', 'سويسرا',
      'تركيا', 'ماليزيا', 'إندونيسيا', 'الهند', 'باكستان', 'الصين',
      'اليابان', 'كوريا الجنوبية', 'أستراليا', 'جنوب أفريقيا', 'نيجيريا',
      'دولة أخرى غير مذكورة',
    ],
  },
];

// قائمة شاملة بأبرز المجالات والتخصصات ليختار الطالب من بينها بدل الكتابة الحرة
const GOAL_OPTIONS: { group: string; options: string[] }[] = [
  {
    group: 'البرمجة وتطوير الويب',
    options: [
      'تطوير الويب الشامل (Full Stack Web Development)',
      'تطوير الواجهات الأمامية (Frontend Development)',
      'تطوير الواجهات الخلفية (Backend Development)',
      'تطوير تطبيقات الموبايل (Mobile Development)',
      'هندسة البرمجيات (Software Engineering)',
    ],
  },
  {
    group: 'الذكاء الاصطناعي والبيانات',
    options: [
      'الذكاء الاصطناعي (Artificial Intelligence)',
      'تعلم الآلة (Machine Learning)',
      'علم البيانات (Data Science)',
      'تحليل البيانات (Data Analysis)',
      'رؤية الحاسوب (Computer Vision)',
    ],
  },
  {
    group: 'التصميم والإبداع',
    options: [
      'تصميم واجهات المستخدم (UI/UX Design)',
      'الجرافيك ديزاين (Graphic Design)',
      'الموشن جرافيك (Motion Graphics)',
      'تصميم المنتجات (Product Design)',
      'التصوير والمونتاج',
    ],
  },
  {
    group: 'الأعمال والتسويق',
    options: [
      'التسويق الرقمي (Digital Marketing)',
      'ريادة الأعمال (Entrepreneurship)',
      'إدارة المشاريع (Project Management)',
      'المبيعات وخدمة العملاء',
      'إدارة الموارد البشرية',
    ],
  },
  {
    group: 'الأمن السيبراني والشبكات',
    options: [
      'الأمن السيبراني (Cybersecurity)',
      'إدارة الشبكات (Networking)',
      'إدارة أنظمة السحابة (Cloud Computing)',
      'اختبار الاختراق (Penetration Testing)',
    ],
  },
  {
    group: 'اللغات والتعليم',
    options: [
      'تعلم اللغة الإنجليزية',
      'تعلم لغات أجنبية أخرى',
      'التنمية الذاتية والمهارات الشخصية',
      'إعداد المعلمين والتدريب',
    ],
  },
  {
    group: 'أخرى',
    options: ['ما زلت أستكشف المجال المناسب لي', 'مجال آخر غير مذكور'],
  },
];

const OTHER_GOAL_VALUE = 'مجال آخر غير مذكور';

export const StudentRegistrationModal: React.FC<Props> = ({ isOpen, onClose, onSaveProfile }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('مصر');
  const [goal, setGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<string>(''); // اسم الحقل اللي فيه الخطأ حاليًا
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const goalRef = useRef<HTMLSelectElement>(null);
  const customGoalRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // يعرض رسالة الخطأ، يحدد اسم الحقل المسؤول عنه (للتلوين)، ويعمل focus عليه مباشرة
  const fail = (message: string, field: string, ref: React.RefObject<HTMLInputElement | HTMLSelectElement>) => {
    setError(message);
    setFieldError(field);
    ref.current?.focus();
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const fieldClass = (field: string) =>
    `mt-1.5 w-full rounded-xl border p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all bg-[#131b2e] ${
      fieldError === field
        ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/50'
        : 'border-slate-700/80 focus:border-emerald-500'
    }`;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setFieldError('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanCountry = country.trim();

    // الاسم: كلمتين على الأقل، حروف عربية أو إنجليزية بس (بدون أرقام أو رموز)
    const nameWords = cleanName.split(/\s+/).filter(Boolean);
    if (cleanName.length < 3 || nameWords.length < 2) {
      return fail('اكتب الاسم الكامل (اسم أول واسم تاني على الأقل).', 'fullName', fullNameRef);
    }
    if (!/^[A-Za-zأ-يءآأإئؤ\s]+$/.test(cleanName)) {
      return fail('الاسم يجب أن يحتوي على حروف فقط، بدون أرقام أو رموز.', 'fullName', fullNameRef);
    }

    // البريد الإلكتروني: فورمات صحيح فعليًا
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
      return fail('اكتب بريدًا إلكترونيًا صحيحًا (مثال: name@example.com).', 'email', emailRef);
    }

    // الهاتف: أرقام بس، وطول منطقي (لو مصر: لازم يبدأ بـ 01 و11 رقم بالظبط)
    const phoneDigitsOnly = cleanPhone.replace(/\s|-/g, '');
    if (!/^[0-9+]+$/.test(phoneDigitsOnly) || phoneDigitsOnly.length < 8) {
      return fail('اكتب رقم هاتف صحيح (أرقام فقط).', 'phone', phoneRef);
    }
    if (cleanCountry === 'مصر' && !/^01[0125][0-9]{8}$/.test(phoneDigitsOnly)) {
      return fail('رقم الهاتف المصري يجب أن يكون 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015.', 'phone', phoneRef);
    }

    // الدولة: مطلوبة
    if (!cleanCountry) {
      return fail('اختر الدولة.', 'country', countryRef);
    }

    // الهدف/المجال
    if (!goal) {
      return fail('اختر هدفك أو مجالك.', 'goal', goalRef);
    }
    const cleanCustomGoal = customGoal.trim();
    if (goal === OTHER_GOAL_VALUE && cleanCustomGoal.length < 3) {
      return fail('اكتب اسم الكورس أو المجال اللي تقصده بوضوح.', 'customGoal', customGoalRef);
    }

    // كلمة المرور
    if (password.length < 6) {
      return fail('كلمة المرور يجب أن تكون 6 أحرف على الأقل.', 'password', passwordRef);
    }
    if (/\s/.test(password)) {
      return fail('كلمة المرور يجب ألا تحتوي على مسافات.', 'password', passwordRef);
    }
    if (password !== confirmPassword) {
      return fail('كلمتا المرور غير متطابقتين.', 'confirmPassword', confirmPasswordRef);
    }

    const finalGoal = goal === OTHER_GOAL_VALUE ? cleanCustomGoal : goal;
    setSaving(true);

    // نحتفظ بالمستخدم اللي هيتعمل في Firebase Auth عشان نقدر نحذفه لو فشل حفظ البروفايل
    let createdUser: import('firebase/auth').User | null = null;

    try {
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      createdUser = credential.user;

      await onSaveProfile({
        fullName: cleanName,
        email: cleanEmail,
        phone: phoneDigitsOnly,
        country: cleanCountry || 'مصر',
        jobTitleOrGoal: finalGoal,
        status: 'approved',
        isApproved: true,
      });
      setSuccess(true);
    } catch (err: any) {
      console.error('Student registration error:', err);

      // لو الحساب اتعمل في Auth بنجاح لكن حفظ البروفايل فشل، نحذف الحساب
      // عشان منسيبش حساب "يتيم" من غير بيانات، ويقدر الطالب يحاول يسجل تاني بنفس الإيميل
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (cleanupErr) {
          console.error('Failed to clean up orphaned auth account:', cleanupErr);
        }
      }

      if (err?.code === 'auth/email-already-in-use') return fail('هذا البريد مسجل بالفعل. استخدم بريدًا آخر أو سجّل الدخول.', 'email', emailRef);
      if (err?.code === 'auth/weak-password') return fail('كلمة المرور يجب أن تكون 6 أحرف على الأقل.', 'password', passwordRef);
      if (err?.code === 'auth/network-request-failed') setError('تعذر الاتصال بـ Firebase. افحص الإنترنت.');
      else setError('لم يتم حفظ الحساب. النموذج ما زال مفتوحًا، حاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 font-arabic" dir="rtl">
        <div className="w-full max-w-md rounded-3xl bg-[#0d1322] border border-slate-800 p-7 text-center shadow-2xl text-white">
          <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-emerald-500" />
          <h2 className="text-xl font-black text-white">تم إنشاء الحساب</h2>
          <p className="mt-2 text-sm text-slate-400">يمكنك الآن استخدام البريد وكلمة المرور لتسجيل الدخول.</p>
          <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-black text-slate-950 cursor-pointer">
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 font-arabic" dir="rtl">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-[#0d1322] border border-slate-800 p-6 shadow-2xl text-white my-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">تسجيل طالب جديد</h2>
              <p className="text-xs text-slate-400">أنشئ حسابك للتعلم ومتابعة تقدمك</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs font-bold text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <fieldset disabled={saving} className="grid gap-3 sm:grid-cols-2 disabled:opacity-70">
          <label className="text-xs font-bold text-slate-300">
            الاسم الكامل
            <input
              ref={fullNameRef}
              required
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); if (fieldError === 'fullName') setFieldError(''); }}
              className={fieldClass('fullName')}
            />
          </label>

          <label className="text-xs font-bold text-slate-300">
            البريد الإلكتروني
            <div className="relative">
              <Mail className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                ref={emailRef}
                required
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldError === 'email') setFieldError(''); }}
                className={`${fieldClass('email')} pr-10`}
              />
            </div>
          </label>

          <label className="text-xs font-bold text-slate-300">
            الهاتف
            <div className="relative">
              <Phone className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                ref={phoneRef}
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (fieldError === 'phone') setFieldError(''); }}
                placeholder="01xxxxxxxxx"
                className={`${fieldClass('phone')} pr-10`}
              />
            </div>
          </label>

          {/* حقل الدولة - قائمة اختيار بدل الكتابة الحرة */}
          <label className="text-xs font-bold text-slate-300">
            الدولة
            <div className="relative">
              <Globe className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                ref={countryRef}
                required
                value={country}
                onChange={(e) => { setCountry(e.target.value); if (fieldError === 'country') setFieldError(''); }}
                className={`${fieldClass('country')} appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled>
                  اختر دولتك...
                </option>
                {COUNTRY_OPTIONS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </label>

          {/* حقل الهدف/المجال - قائمة اختيار بدل الكتابة الحرة */}
          <label className="text-xs font-bold text-slate-300 sm:col-span-2">
            هدفك أو مجالك
            <div className="relative">
              <Target className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                ref={goalRef}
                required
                value={goal}
                onChange={(e) => { setGoal(e.target.value); if (fieldError === 'goal') setFieldError(''); }}
                className={`${fieldClass('goal')} appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled>
                  اختر مجالك أو هدفك التعليمي...
                </option>
                {GOAL_OPTIONS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {goal === OTHER_GOAL_VALUE && (
              <input
                ref={customGoalRef}
                autoFocus
                required
                value={customGoal}
                onChange={(e) => { setCustomGoal(e.target.value); if (fieldError === 'customGoal') setFieldError(''); }}
                placeholder="اكتب الكورس أو المجال اللي تقصده..."
                className={`${fieldClass('customGoal')} mt-2`}
              />
            )}
          </label>

          <label className="text-xs font-bold text-slate-300">
            كلمة المرور
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                ref={passwordRef}
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (fieldError === 'password') setFieldError(''); }}
                className={`${fieldClass('password')} pr-10 pl-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <label className="text-xs font-bold text-slate-300">
            تأكيد كلمة المرور
            <div className="relative">
              <input
                ref={confirmPasswordRef}
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (fieldError === 'confirmPassword') setFieldError(''); }}
                className={`${fieldClass('confirmPassword')} pl-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        </fieldset>

        <button
          disabled={saving}
          className="mt-5 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 font-black text-slate-950 disabled:opacity-60 transition-all cursor-pointer active:scale-95"
        >
          {saving ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
        </button>
      </form>
    </div>
  );
};

export default StudentRegistrationModal;