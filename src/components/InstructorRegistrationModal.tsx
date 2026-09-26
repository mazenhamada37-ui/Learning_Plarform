import React, { useRef, useState } from 'react';
import { Award, X, Mail, Lock, Phone, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { InstructorProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  instructorProfile?: InstructorProfile | null;
  onSaveProfile: (profile: InstructorProfile, password: string) => Promise<{ isPending: boolean }> | { isPending: boolean };
  onLogout?: () => void;
  isInitialRequired?: boolean;
}

// قائمة شاملة بالتخصصات ليختار المحاضر منها بدل الكتابة الحرة
const SPECIALIZATION_OPTIONS: { group: string; options: string[] }[] = [
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
      'المحاسبة والتمويل',
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
    group: 'الهندسة والعلوم',
    options: [
      'الهندسة الميكانيكية',
      'الهندسة الكهربائية',
      'الهندسة المدنية',
      'الرياضيات',
      'الفيزياء',
      'الكيمياء',
    ],
  },
  {
    group: 'اللغات والتعليم',
    options: [
      'تعليم اللغة الإنجليزية',
      'تعليم لغات أجنبية أخرى',
      'اللغة العربية وعلومها',
      'التنمية الذاتية والمهارات الشخصية',
      'إعداد المعلمين والتدريب',
    ],
  },
  {
    group: 'الطب والعلوم الصحية',
    options: [
      'الطب البشري',
      'طب الأسنان',
      'الصيدلة',
      'التمريض',
      'العلاج الطبيعي',
      'التغذية العلاجية',
    ],
  },
  {
    group: 'أخرى',
    options: ['تخصص آخر غير مذكور'],
  },
];

const OTHER_SPECIALIZATION_VALUE = 'تخصص آخر غير مذكور';

export const InstructorRegistrationModal: React.FC<Props> = ({ isOpen, onClose, onSaveProfile }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const specializationRef = useRef<HTMLSelectElement>(null);
  const customSpecializationRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 3) return setError('اكتب الاسم الكامل.');
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return setError('اكتب بريدًا إلكترونيًا صحيحًا.');
    if (phone.trim().length < 8) return setError('اكتب رقم هاتف صحيح.');

    if (!specialization) {
      customSpecializationRef.current ? null : specializationRef.current?.focus();
      return setError('اختر التخصص.');
    }
    const cleanCustomSpecialization = customSpecialization.trim();
    if (specialization === OTHER_SPECIALIZATION_VALUE && cleanCustomSpecialization.length < 3) {
      customSpecializationRef.current?.focus();
      return setError('اكتب التخصص المطلوب بوضوح.');
    }
    const finalSpecialization = specialization === OTHER_SPECIALIZATION_VALUE ? cleanCustomSpecialization : specialization;

    if (password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
    if (password !== confirmPassword) return setError('كلمتا المرور غير متطابقتين.');

    setSaving(true);
    try {
      await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const profile: InstructorProfile = {
        fullName: cleanName,
        email: cleanEmail,
        phone: phone.trim(),
        specialization: finalSpecialization,
        bio: bio.trim() || 'محاضر في المنصة.',
        registeredAt: new Date().toISOString(),
        status: 'pending',
        isApproved: false,
      };
      await onSaveProfile(profile, password);
      await signOut(auth);
      setSuccess(true);
    } catch (err: any) {
      console.error('Instructor registration error:', err);
      if (err?.code === 'auth/email-already-in-use') setError('هذا البريد مسجل بالفعل في Firebase. استخدم بريدًا آخر.');
      else if (err?.code === 'auth/weak-password') setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      else if (err?.code === 'auth/network-request-failed') setError('تعذر الاتصال بـ Firebase. افحص الإنترنت.');
      else setError('لم يتم حفظ الطلب. لم يتم إغلاق النموذج؛ راجع الاتصال وحاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" dir="rtl"><div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl dark:bg-slate-900"><CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-emerald-500" /><h2 className="text-xl font-black text-slate-900 dark:text-white">تم إرسال طلبك</h2><p className="mt-2 text-sm text-slate-500">حساب المحاضر في انتظار موافقة المسؤول.</p><button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">إغلاق</button></div></div>;
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4" dir="rtl"><form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><Award className="h-10 w-10 rounded-2xl bg-amber-500/15 p-2 text-amber-500" /><div><h2 className="text-lg font-black text-slate-900 dark:text-white">تسجيل محاضر جديد</h2><p className="text-xs text-slate-500">سيتم إرسال الطلب للمسؤول للموافقة</p></div></div><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 p-2 text-slate-500 dark:bg-slate-800"><X className="h-5 w-5" /></button></div>{error && <div className="mb-4 flex gap-2 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600"><AlertCircle className="h-4 w-4" />{error}</div>}<div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600 dark:text-slate-300">الاسم الكامل<input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800" /></label><label className="text-xs font-bold text-slate-600 dark:text-slate-300">البريد الإلكتروني<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800" /></label><label className="text-xs font-bold text-slate-600 dark:text-slate-300">الهاتف<input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800" /></label>

<label className="text-xs font-bold text-slate-600 dark:text-slate-300">
  التخصص
  <div className="relative">
    <BookOpen className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
    <select
      ref={specializationRef}
      required
      value={specialization}
      onChange={(e) => setSpecialization(e.target.value)}
      className="mt-1 w-full appearance-none cursor-pointer rounded-xl border p-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <option value="" disabled>اختر تخصصك...</option>
      {SPECIALIZATION_OPTIONS.map((group) => (
        <optgroup key={group.group} label={group.group}>
          {group.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </optgroup>
      ))}
    </select>
  </div>
  {specialization === OTHER_SPECIALIZATION_VALUE && (
    <input
      ref={customSpecializationRef}
      autoFocus
      required
      value={customSpecialization}
      onChange={(e) => setCustomSpecialization(e.target.value)}
      placeholder="اكتب تخصصك..."
      className="mt-2 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
    />
  )}
</label>

<label className="text-xs font-bold text-slate-600 dark:text-slate-300 sm:col-span-2">نبذة مختصرة<textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 min-h-20 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800" /></label><label className="text-xs font-bold text-slate-600 dark:text-slate-300">كلمة المرور<div className="relative"><Lock className="absolute right-3 top-3 h-4 w-4 text-slate-400" /><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800" /></div></label><label className="text-xs font-bold text-slate-600 dark:text-slate-300">تأكيد كلمة المرور<input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800" /></label></div><button disabled={saving} className="mt-5 w-full rounded-xl bg-amber-500 py-3 font-black text-slate-950 disabled:opacity-60">{saving ? 'جارٍ حفظ الطلب...' : 'إرسال طلب التسجيل'}</button></form></div>;
};

export default InstructorRegistrationModal;