import { Course } from '../types';
import { COURSE_QUIZZES } from './quizzesData';

const RAW_COURSES: Course[] = [
  // ==========================================
  // TRACK 1: البرمجة وتطوير الويب (3 مستويات)
  // ==========================================
  {
    id: 'course-web-beg',
    title: 'أساسيات البرمجة وتطوير الويب (HTML5, CSS3 & JavaScript)',
    subtitle: 'انطلق في عالم البرمجة من الصفر وابنِ أول موقع ويب تفاعلي متجاوب بخطوات عملية.',
    description: 'دورة المستوى المبتدئ الشاملة لتعلم قواعد بناء صفحات الويب وتنسيقها وإضافة اللمسات التفاعلية الحية باستخدام لغة JavaScript، مصممة خصيصاً للمبتدئين بدون أي خبرة سابقة.',
    category: 'برمجة وتطوير',
    level: 'مبتدئ',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-1',
      name: 'مهندس أحمد علي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      title: 'خبير تطوير تطبيقات الويب والـ Full-Stack',
      bio: 'أكثر من 10 سنوات من الخبرة في تطوير الأنظمة الرقمية الكبيرة وتدريب الآلاف من المطورين.',
      rating: 4.9,
      studentsCount: 14200
    },
    rating: 4.9,
    reviewsCount: 420,
    studentsEnrolledCount: 3800,
    estimatedHours: 6,
    price: 'مجاني',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'المبتدئين'],
    learningObjectives: [
      'فهم هيكلية صفحات الويب وكتابة وسوم HTML5 بصورة صحيحة',
      'تنسيق المواقع وتطبيق التصميم المتجاوب بـ CSS Flexbox & Grid',
      'إضافة التفاعلية والأزرار وتغيير العناصر بـ JavaScript',
      'رفع أول موقع لك على الإنترنت مجاناً'
    ],
    prerequisites: ['لا تتطلب أي معرفة برمجية سابقة'],
    modules: [
      {
        id: 'mod-wb-1',
        title: 'الوحدة 1: مدخل إلى هيكلة شبكة الويب والـ HTML5',
        description: 'بناء الهيكل الأساسي للصفحات والأشكال والروابط.',
        lessons: [
          {
            id: 'les-wb-1-1',
            title: 'كيف تعمل شبكة الإنترنت؟ وبناء أول صفحة HTML',
            durationMinutes: 14,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=6QAELgirvjs',
            contentMarkdown: `### مرحباً بك في عالم البرمجة!

تعلم أساسيات بناء صفحات الويب هو الخطوة الأولى لأي مبرمج ناجح.

#### المفاهيم الأساسية:
1. **HTML (HyperText Markup Language):** هي الهيكل العظمي لصفحة الويب.
2. **CSS (Cascading Style Sheets):** تتولى الألوان والجماليات والتنسيقات.
3. **JavaScript:** المحرك الذي يمنح الصفحة الحيوية والتفاعل.

\`\`\`html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>موقعي الأول</title>
</head>
<body>
  <h1>أهلاً بك في عالم البرمجة!</h1>
  <p>هذا أول تطبيق ويب أقوم بإنشائه بنفسي.</p>
</body>
</html>
\`\`\``,
            keyTakeaways: [
              'HTML يحدد المحتوى والهيكل',
              'جميع متصفحات الويب تفهم وتنفذ HTML مجاناً'
            ],
            resources: [
              { name: 'ملخص كتابة وسوم HTML5 الأساسية PDF', url: '#', type: 'document' }
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار تقييم أساسيات HTML & CSS للمبتدئين',
      questions: [
        {
          id: 'q-wb-1',
          question: 'ما هو الوسوم المسئول عن إنشاء عنوان رئيسي كَبِير في HTML؟',
          options: ['<h1>', '<p>', '<div>', '<span>'],
          correctAnswerIndex: 0,
          explanation: 'يعتبر <h1> الوسم الهيكلي القياسي لأهم عنوان رئيسي في الصفحة.'
        }
      ]
    }
  },
  {
    id: 'course-react-ts',
    title: 'تطوير واجهات المستخدم باستخدام React 19 و TypeScript',
    subtitle: 'تعلم بناء تطبيقات ويب حديثة وسريعة باستخدام أحدث تقنيات وبنيات React الحديثة.',
    description: 'دورة المستوى المتوسط الشاملة تأخذك لبناء تطبيقات واجهات المستخدم التفاعلية المتطورة، مع إدارة الحالة والربط مع الخدمات والأنواع.',
    category: 'برمجة وتطوير',
    level: 'متوسط',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-1',
      name: 'مهندس أحمد علي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      title: 'خبير تطوير تطبيقات الويب والـ Full-Stack',
      bio: 'أكثر من 10 سنوات من الخبرة في تطوير الأنظمة الرقمية الكبيرة وتدريب الآلاف من المطورين.',
      rating: 4.9,
      studentsCount: 14200
    },
    rating: 4.9,
    reviewsCount: 380,
    studentsEnrolledCount: 2450,
    estimatedHours: 12,
    price: 'مجاني',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Frontend'],
    learningObjectives: [
      'فهم طريقة عمل React 19 والـ Concurrent Rendering',
      'كتابة كود TypeScript نظيف وقوي للـ Components والـ Hooks',
      'إدارة حالات التطبيق المتقدمة وبناء واجهات سريعة التجاوب',
      'التعامل مع الـ APIs والأخطاء بكفاءة عالية'
    ],
    prerequisites: ['أساسيات JavaScript (ES6+)', 'معرفة بسيطة بـ HTML & CSS'],
    modules: [
      {
        id: 'mod-1',
        title: 'الوحدة 1: مقدمة إلى React 19 وهيكلة المشاريع',
        description: 'أساسيات المكونات وكيفية إعداد بيئة العمل الحديثة.',
        lessons: [
          {
            id: 'les-1-1',
            title: 'مفهوم المكونات (Components) والـ JSX في React',
            durationMinutes: 15,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            contentMarkdown: `### مقدمة في المكونات (Components)

تعتبر المكونات **اللَبِنة الأساسية** لبناء أي تطبيق React.

\`\`\`tsx
function WelcomeMessage({ name }: { name: string }) {
  return (
    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
      <h1 className="text-xl font-bold text-emerald-900">أهلاً بك يا {name}!</h1>
      <p className="text-sm text-emerald-700">مرحباً بك في منصة التعلم الإلكتروني.</p>
    </div>
  );
}
\`\`\``,
            keyTakeaways: [
              'المكونات تجعل الكود قابلاً للإعادة والاستخدام والترتيب',
              'JSX يمزج بين قوة JavaScript وسهولة وسلاسة HTML'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'الاختبار النهائي الشامل لدبلوم React 19 & TypeScript',
      questions: [
        {
          id: 'q1',
          question: 'ما هي الميزة الجوهرية لاستخدام TypeScript في تطوير تطبيقات React مقارنة بـ JavaScript العادية؟',
          options: [
            'تسريع وقت تحميل الصفحة في متصفح العميل فقط',
            'الفحص الثابت للأنواع (Static Type Checking) واكتشاف الأخطاء البرمجية أثناء كتابة الكود وقبل تشغيله',
            'الاستغناء عن استخدام CSS وتنسيق العناصر تلقائياً',
            'تحويل كود React إلى كود بايثون في السيرفر'
          ],
          correctAnswerIndex: 1,
          explanation: 'يوفر TypeScript نظام أنواع ثابت (Static Typing) يكتشف أخطاء عدم تطابق الـ Props والحالات قبل وصول الكود لمرحلة الإنتاج، بالإضافة إلى ميزة الإكمال التلقائي (IntelliSense) المتطورة.'
        },
        {
          id: 'q2',
          question: 'في React مع TypeScript، ما هي الطريقة الموصى بها لتعريف خصائص (Props) اختيارية للمكون؟',
          options: [
            'استخدام علامة الاستفهام (?) بجانب اسم الخاصية داخل الـ interface أو type (مثال: title?: string)',
            'كتابة كلمة optional قبل اسم الخاصية',
            'تعيين نوع الخاصية كـ never',
            'لا يمكن وجود خصائص اختيارية في TypeScript'
          ],
          correctAnswerIndex: 0,
          explanation: 'تتيح علامة ? (مثل title?: string) جعل الخاصية اختيارية، ويمكن إعطاؤها قيمة افتراضية عند تفكيك الخصائص داخل المكون.'
        },
        {
          id: 'q3',
          question: 'كيف نقوم بتعريف حالة (State) تبدأ بقيمة null ثم يتم تحديثها لاحقاً بكائن من نوع UserData؟',
          options: [
            'const [user, setUser] = useState<UserData | null>(null);',
            'const [user, setUser] = useState(null as any as never);',
            'const [user, setUser] = useState<null>(UserData);',
            'const [user, setUser] = useState<string>(null);'
          ],
          correctAnswerIndex: 0,
          explanation: 'استخدام الـ Generics مع Union Type مثل useState<UserData | null>(null) يسمح ببدء الحالة كـ null بأمان وتحديثها لاحقاً ببيانات UserData مع حماية كاملة للأنواع.'
        },
        {
          id: 'q4',
          question: 'متى يتم تنفيذ دالة التنظيف (Cleanup Function) التي نرجعها من داخل خطاف useEffect؟',
          options: [
            'فقط عند أول تحميل للمكون في الصفحة ولا تتكرر أبداً',
            'قبل إعادة تنفيذ الـ Effect التالي، وعند إزالة المكون من الـ DOM (Unmount)',
            'في كل مرة يضغط فيها المستخدم على زر داخل الصفحة',
            'لا يتم تنفيذها إلا إذا حدث خطأ برمجي غير متوقع في التطبيق'
          ],
          correctAnswerIndex: 1,
          explanation: 'تعمل دالة التنظيف على إلغاء الاشتراكات (Subscribers)، والمؤقتات (Timers)، وإلغاء طلبات الشبكة قبل تشغيل التأثير الجديد أو عند مغادرة الصفحة لتجنب تسريب الذاكرة (Memory Leaks).'
        },
        {
          id: 'q5',
          question: 'ما هو الفارق الرئيسي بين تعديل قيمة useRef.current وبين تعديل قيمة useState؟',
          options: [
            'تعديل useRef.current لا يؤدي إلى إعادة تصيير (Re-render) المكون، بينما دالة تحديث useState تؤدي لإعادة تصيير المكون',
            'خطاف useRef يعمل فقط في المتصفح بينما useState يعمل فقط في السيرفر',
            'خطاف useRef يقوم بحذف البيانات المخزنة فور تحريك الفأرة',
            'لا يوجد أي فارق، كلاهما يعيد التصيير فوراً بنفس الطريقة'
          ],
          correctAnswerIndex: 0,
          explanation: 'تُستخدم useRef للاحتفاظ بقيم متغيرة عبر التصييرات دون تشغيل عملية إعادة تصيير للمكون، وتُستخدم بكثرة للربط المباشر مع عناصر الـ DOM أو الاحتفاظ بمؤقتات زمنية.'
        },
        {
          id: 'q6',
          question: 'ما الفرق الأساسي بين خطافي تحسين الأداء useMemo و useCallback؟',
          options: [
            'useMemo يحفظ القيمة الناتجة عن عملية حسابية، بينما useCallback يحفظ المرجع لتعريف الدالة ذاتها بين التصييرات',
            'useMemo مخصص لتنسيقات CSS فقط بينما useCallback لعناصر HTML',
            'useCallback يتم تنفيذه في السيرفر فقط ولا يعمل في المتصفح',
            'كلاهما متطابقان تماماً بدون أي اختلاف في طريقة العمل أو القيمة المرجعة'
          ],
          correctAnswerIndex: 0,
          explanation: 'يستخدم useMemo لحفظ نتيجة عملية حسابية مكلفة (Memoized Value)، في حين يستخدم useCallback لحفظ استقرار مرجع الدالة (Memoized Callback) عند تمريرها كمكوّن تابع لمنع إعادة تصييره.'
        },
        {
          id: 'q7',
          question: 'ما الفائدة من استخدام TypeScript Generics عند بناء مكون مثل قائمة عناصر مخصصة <Dropdown<T> />؟',
          options: [
            'إتاحة استخدام المكون مع أي نوع بيانات مع الحفاظ على الفحص الصارم للأنواع (Type Safety) دون اللجوء لـ any',
            'تصغير حجم حزمة ملف الـ JavaScript النهائي إلى النصف',
            'استبدال كود الـ Tailwind CSS بأكواد نقية بدون كلاسات',
            'إجبار المكون على قبول الأرقام فقط ورفض النصوص'
          ],
          correctAnswerIndex: 0,
          explanation: 'تتيح المكونات العامة (Generic Components) إعادة استخدام نفس المكون مع أنواع كائنات مختلفة (مثل قائمة مستخدمين أو منتجات) مع التحقق الأوتوماتيكي الصارم من خصائص كل كائن.'
        },
        {
          id: 'q8',
          question: 'ما فائدة نمط Discriminated Union التالي: type FetchState<T> = { status: \'loading\' } | { status: \'success\'; data: T } | { status: \'error\'; error: string }؟',
          options: [
            'يمنع الحالات المتضاربة (Impossible States) ويسمح للـ TypeScript بتضييق النوع تلقائياً بالاعتماد على خاصية status',
            'يمنع استخدام الـ Async/Await في كود الـ Fetch',
            'يقوم بجلب البيانات تلقائياً من قاعدة البيانات بدون كتابة كود برمجيات',
            'يلغي الحاجة للتعامل مع أخطاء الشبكة والـ HTTP Status Codes'
          ],
          correctAnswerIndex: 0,
          explanation: 'الـ Discriminated Unions تقضي على الحالات المتضاربة (مثل وجود loading: true و error: \'...\' معاً)، فعند فحص if (state.status === \'success\') يعرف TypeScript مباشرة وبأمان أن data موجودة.'
        },
        {
          id: 'q9',
          question: 'عند كتابة Custom Hook يرجع مصفوفة تحتوي على قيمة ودالة تعديل (مثل [value, setValue])، لماذا يفضل إضافة as const للمصفوفة المرجعة؟',
          options: [
            'لجعل TypeScript يستنتج نوع المصفوفة كـ Tuple ثابت بدلاً من استنتاجه كـ Union Array عام (typeof value | typeof setValue)[]',
            'لقفل المتصفح ومنع المستخدم من تعديل الحقول',
            'لأن كلمة const تسرع سرعة تشغيل المتصفح بضعفين',
            'لحذف المتغير من الذاكرة العشوائية فور الانتهاء'
          ],
          correctAnswerIndex: 0,
          explanation: 'استخدام return [value, setValue] as const يحافظ على الترتيب والأنواع الدقيقة للعناصر (Tuple Type)، تماماً كما يفعل خطاف useState الأصلي.'
        },
        {
          id: 'q10',
          question: 'ما هي الإضافة الرئيسية التي قدمتها React 19 لتسهيل التعامل مع النماذج وتحديث البيانات غير المتزامنة (Form Actions)؟',
          options: [
            'توفير خطافات ودوال Actions مثل useActionState و useOptimistic للتعامل التلقائي مع حالات التحميل والتحديث المتفائل دون إدارة يدوية معقدة',
            'إلغاء دعم دوال الـ JavaScript واستبدالها بلغة C++',
            'إيقاف دعم المتصفحات القديمة نهائياً',
            'إجبار المطور على كتابة جميع العمليات داخل كود الـ Backend حصراً'
          ],
          correctAnswerIndex: 0,
          explanation: 'في React 19، تم تقديم الـ Actions وخطافات مثل useActionState و useOptimistic لإدارة الحالات التفاعلية للنماذج، وأخطاء الشبكة، والتحديث الفوري المتفائل (Optimistic Updates) بسلاسة فائقة.'
        }
      ]
    }
  },
  {
    id: 'course-web-world',
    title: 'الهندسة المعمارية العالمية للواجهات الضخمة (Micro-Frontends & Performance)',
    subtitle: 'تعلم كيف تبني المنصات العالمية الضخمة بأساليب التكبير والأداء الفائق ومعمارية الأنظمة الموزعة.',
    description: 'دورة المستوى العالمي المتقدم للمهندسين والمطورين المحترفين للتعمق في معمارية Micro-Frontends، تخزين الـ Cache المتقدم، أداء الـ SSR والـ Hydration، وإدارة الأنظمة الضخمة بحجم ملايين المستخدمين.',
    category: 'برمجة وتطوير',
    level: 'عالمي',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-1',
      name: 'مهندس أحمد علي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      title: 'خبير تطوير تطبيقات الويب والـ Full-Stack',
      bio: 'أكثر من 10 سنوات من الخبرة في تطوير الأنظمة الرقمية الكبيرة وتدريب الآلاف من المطورين.',
      rating: 4.95,
      studentsCount: 14200
    },
    rating: 4.98,
    reviewsCount: 185,
    studentsEnrolledCount: 920,
    estimatedHours: 16,
    price: 'مجاني',
    tags: ['Architecture', 'Micro-Frontends', 'Performance', 'World-Class'],
    learningObjectives: [
      'تطبيق معمارية Micro-Frontends واستخدام Module Federation',
      'تحسين مؤشرات الأداء العالمية Core Web Vitals لأقصى سرعة',
      'التعامل مع الـ Memory Leaks وتحسين الـ Rendering Engine',
      'بناء واجهات مضادة لانهيار الخوادم وتتحمل الملايين'
    ],
    prerequisites: ['خبرة متقدمة بـ JavaScript, React ومعمارية الأنظمة'],
    modules: [
      {
        id: 'mod-ww-1',
        title: 'الوحدة 1: معمارية Module Federation والـ Micro-Frontends',
        lessons: [
          {
            id: 'les-ww-1-1',
            title: 'تقسيم التطبيقات المونوليثية إلى أنظمة فرعية مستقلة',
            durationMinutes: 28,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=b4b8J0tXm7w',
            contentMarkdown: `### معمارية المايكرو فرونت إند العالمية

تسمح معمارية **Micro-Frontends** للفرق الكبيرة بالعمل بشكل مستقل على أجزاء مختلفة من نفس المنصة مع إمكانية نشرها دون الحاجة لإعادة بناء باقي التطبيق.

#### تقنية Module Federation:
تسمح بشركة مثل Google أو Amazon بتحميل موديول البروفايل أو الدفع من سيرفر مستقل كلياً ودمجه في الـ DOM بسلاسة فائقة.`,
            keyTakeaways: [
              'المستويات العالمية تشترط فصل النشر والدفع عن بقية واجهات المستخدم',
              'Module Federation تحافظ على سرعة التطوير وضخامة النظام'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار دبلوم الهندسة المعمارية المتقدمة للواجهات',
      questions: [
        {
          id: 'q-ww-1',
          question: 'ما هي الفائدة الجوهرية لاستخدام Module Federation في المعمارية العالمية؟',
          options: [
            'مشاركة المكونات والتطبيقات الفرعية في الوقت الفعلي وقت التشغيل Runtime دون الحاجة لإعادة التجميع',
            'إلغاء لغة JavaScript',
            'جعل الإنترنت أسرع للجميع تلقائياً',
            'استبدال قواعد البيانات'
          ],
          correctAnswerIndex: 0,
          explanation: 'تسمح Module Federation بتشغيل أكثر من تطبيق كواجهة واحدة مدمجة مع التحميل الديناميكي الموزع.'
        }
      ]
    }
  },

  // ==========================================
  // TRACK 2: الذكاء الاصطناعي (3 مستويات)
  // ==========================================
  {
    id: 'course-ai-beg',
    title: 'مدخل إلى الذكاء الاصطناعي وتطبيقاته اليومية',
    subtitle: 'اكتشف مفاهيم الذكاء الاصطناعي التوليدي وكيف تستفيد منه في حياتك وعملك بسهولة.',
    description: 'دورة المستوى المبتدئ لتشغيل أدوات الذكاء الاصطناعي الحديثة، فهم طريقة تفكير المحركات اللغوية، واختصار ساعات العمل في المهام اليومية.',
    category: 'الذكاء الاصطناعي',
    level: 'مبتدئ',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-2',
      name: 'د. سارة محمود',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      title: 'باحثة وبناءة حلول الذكاء الاصطناعي التوليدي',
      bio: 'استشارية تحول رقمي متخصصة في توظيف نماذج اللغة والتعلم الآلي.',
      rating: 4.95,
      studentsCount: 22000
    },
    rating: 4.91,
    reviewsCount: 310,
    studentsEnrolledCount: 4100,
    estimatedHours: 5,
    price: 'مجاني',
    tags: ['الذكاء الاصطناعي', 'Gemini', 'المبتدئين', 'إنتاجية'],
    learningObjectives: [
      'فهم الفرق بين الذكاء الاصطناعي التقليدي والذكاء التوليدي',
      'استخدام النماذج الحديثة في صياغة النصوص والأفكار والتلخيص',
      'توفير الأوقات وتطبيق الأدوات الذكية في العمل والحياة'
    ],
    prerequisites: ['لا تتطلب أي خبرة سابقة'],
    modules: [
      {
        id: 'mod-aib-1',
        title: 'الوحدة 1: الأساسيات البسيطة لـ AI',
        lessons: [
          {
            id: 'les-aib-1-1',
            title: 'ما هو الذكاء الاصطناعي التوليدي وكيف يفهمنا؟',
            durationMinutes: 12,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=k24r2_Tj048',
            contentMarkdown: `### ما هو الذكاء الاصطناعي التوليدي؟

تستطيع النماذج اللغوية الحديثة مثل **Gemini** فهم اللغة البشرية وإنشاء إجابات مفيدة وتلخيص المجلدات الكبيرة في ثوانٍ.

#### استخدامات عملية:
1. صياغة البريد الإلكتروني الاحترافي.
2. تلخيص المقالات والتقارير الطويلة.
3. التخطيط وإيجاد أفكار مبتكرة للمشاريع.`,
            keyTakeaways: ['الذكاء الاصطناعي أداة مساعدة تضاعف الإنتاجية والتركيز']
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار مدخل الذكاء الاصطناعي للمبتدئين',
      questions: [
        {
          id: 'q-aib-1',
          question: 'ما هو الهدف الأساسي من نماذج الذكاء الاصطناعي التوليدي؟',
          options: ['إنشاء محتوى ونصوص وإجابات جديدة تشبه البشر', 'تخزين الملفات فقط', 'شراء المنتجات تلقائياً', 'إيقاف تشغيل الحاسوب'],
          correctAnswerIndex: 0,
          explanation: 'تقوم النماذج التوليدية بتحليل الأننماط لإنتاج نصوص وصور برمجية وإجابات مبتكرة.'
        }
      ]
    }
  },
  {
    id: 'course-ai-prompt',
    title: 'أساسيات الذكاء الاصطناعي والهندسة الفورية (Prompt Engineering)',
    subtitle: 'اكتشف كيف توظف نماذج Gemini والذكاء الاصطناعي التوليدي لزيادة إنتاجيتك وبناء أفكار مبتكرة.',
    description: 'مسار المستوى المتوسط العملي المكثف يغطّي أفضل الممارسات لصياغة الأوامر (Prompts)، فهم عمل النماذج اللغوية الضخمة (LLMs)، واستخدام تقنيات التفكير والربط مع البرمجة.',
    category: 'الذكاء الاصطناعي',
    level: 'متوسط',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-2',
      name: 'د. سارة محمود',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      title: 'باحثة وبناءة حلول الذكاء الاصطناعي التوليدي',
      bio: 'استشارية تحول رقمي متخصصة في توظيف نماذج اللغة والتعلم الآلي في الشركات الناشئة والمؤسسات التعليمية.',
      rating: 4.95,
      studentsCount: 22000
    },
    rating: 4.95,
    reviewsCount: 520,
    studentsEnrolledCount: 3890,
    estimatedHours: 8,
    price: 'مجاني',
    tags: ['Gemini AI', 'Prompt Engineering', 'AI Productivity', 'ChatGPT'],
    learningObjectives: [
      'فهم كيفية عمل النماذج التوليدية ونظام التلقين',
      'كتابة أوامر احترافية بأسلوب Zero-shot و Few-shot Prompting',
      'استخدام التقنيات الهيكلية (Chain of Thought) للحلول المعقدة',
      'تطبيق مهارات الذكاء الاصطناعي في كتابة المحتوى والتحليل والبرمجة'
    ],
    prerequisites: ['معرفة بسيطة بأدوات التعامل مع الحاسوب'],
    modules: [
      {
        id: 'mod-ai-1',
        title: 'الوحدة 1: القواعد الذهبية لمهندس الأوامر',
        description: 'هيكلة الأمر وتحديد الدور للنموذج.',
        lessons: [
          {
            id: 'les-ai-1-1',
            title: 'هيكل الأمر المثالي (Context, Task, Format, Persona)',
            durationMinutes: 16,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=50n2v9Rk5Rk',
            contentMarkdown: `### صياغة الأوامر الاحترافية

للحصول على أفضل نتيجة من نموذج الذكاء الاصطناعي، يوصى باتباع الهيكل رباعي الأركان:

1. **الـ Persona (الشخصية):** حدّد الدور المطلوب.
2. **الـ Context (السياق):** خلفية عن المشكلة.
3. **الـ Task (المهمة):** المطلوب بدقة.
4. **الـ Format (صيغة المخرجات):** جدول أو نقاط.`,
            keyTakeaways: [
              'التحديد يقلل التخمين ويزيد الدقة',
              'تعيين شخصية للنموذج يرفع من جودة اللغة والأسلوب'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار تقييم مهارات هندسة الأوامر',
      questions: [
        {
          id: 'q-ai-1',
          question: 'ماذا يقصد بتقنية Few-shot Prompting؟',
          options: [
            'عدم إعطاء أي أمثلة للنموذج',
            'تزويد النموذج ببعض الأمثلة التوضيحية داخل الأمر لتوجيه نمط المخرجات',
            'إجبار النموذج على العمل بسرعة',
            'إطفاء الذكاء الاصطناعي'
          ],
          correctAnswerIndex: 1,
          explanation: 'تساعد تقنية Few-shot النموذج على إدراك النمط المطلوب بدقة عالية من خلال مشاهدة نماذج للإدخال والمخرجات المتوقعة.'
        }
      ]
    }
  },
  {
    id: 'course-ai-world',
    title: 'تطوير أنظمة الذكاء الاصطناعي العالمية و Multi-Agent Systems بـ Gemini API',
    subtitle: 'ابنِ عملاء ذكاء اصطناعي مستقلي التفكير والعمل (Autonomous Agents) وتقنيات RAG المعقدة.',
    description: 'دورة المستوى العالمي الاحترافي المتقدم لبناء تطبيقات وبك إند قائمة على نماذج Gemini 3.6 Flash، ربط قواعد البيانات المتجهة Vector Databases، ومعمارية الوكلاء الذكية Multi-Agent Workflows.',
    category: 'الذكاء الاصطناعي',
    level: 'عالمي',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-2',
      name: 'د. سارة محمود',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      title: 'باحثة وبناءة حلول الذكاء الاصطناعي التوليدي',
      bio: 'استشارية تحول رقمي متخصصة في توظيف نماذج اللغة والتعلم الآلي.',
      rating: 4.98,
      studentsCount: 22000
    },
    rating: 4.99,
    reviewsCount: 240,
    studentsEnrolledCount: 1120,
    estimatedHours: 18,
    price: 'مجاني',
    tags: ['Gemini API', 'Multi-Agent', 'RAG', 'Vector Search', 'World-Class'],
    learningObjectives: [
      'تطوير وتوليد الاستجابات التكيفية بـ @google/genai SDK',
      'بناء نظام RAG (Retrieval-Augmented Generation) عالي الدقة',
      'تصميم وظائف الـ Function Calling والربط مع APIs خارجية',
      'معمارية العملاء المتعددين (Multi-Agent Swarms) لاتخاذ القرارات'
    ],
    prerequisites: ['خبرة جيدة في البرمجة بـ TypeScript أو Python والاتصال بـ APIs'],
    modules: [
      {
        id: 'mod-aiw-1',
        title: 'الوحدة 1: معمارية Multi-Agent والـ Function Calling في Gemini',
        lessons: [
          {
            id: 'les-aiw-1-1',
            title: 'تصميم الوكلاء الافتراضيين والتفكير المتسلسل المستقل',
            durationMinutes: 32,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
            contentMarkdown: `### معمارية Multi-Agent في المستويات العالمية

تعتمد الأنظمة الذكية الحديثة على توزيع المهام الكبيرة بين عدة **AI Agents**:
1. **الوكيل الباحث (Researcher Agent):** يتصفح ويسترجع المستندات.
2. **الوكيل المحلل (Analyst Agent):** يعالج البيانات ويصيغ الاستنتاجات.
3. **الوكيل المراجع (Reviewer Agent):** يدقق السلامة والجودة والمنطق.

\`\`\`typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: 'قم بتحليل واستدعاء أداة تنفيذ البيانات المباشرة...',
});
\`\`\``,
            keyTakeaways: [
              'أنظمة Multi-Agent تتفوق بنسبة 400% في دقة المهام المعقدة مقارنة بالأمر الواحد',
              'Function Calling يربط النماذج التوليدية بالواقع والأدوات الحية'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار دبلوم أنظمة الذكاء الاصطناعي العالمية',
      questions: [
        {
          id: 'q-aiw-1',
          question: 'ما هي التقنية التي تمكّن النماذج اللغوية الضخمة من تنفيذ أوامر في قواعد بيانات أو أدوات خارجية بشكل ديناميكي؟',
          options: ['Function Calling / Tool Use', 'CSS', 'HTML Table', 'Hard Reboot'],
          correctAnswerIndex: 0,
          explanation: 'تسمح تقنية Function Calling للنموذج بطلب استدعاء دالة برمجية محددة بناءً على المدخلات واستخدام المخرجات.'
        }
      ]
    }
  },

  // ==========================================
  // TRACK 3: تصميم UI/UX (3 مستويات)
  // ==========================================
  {
    id: 'course-ux-beg',
    title: 'أساسيات تصميم واجهات وتجربة المستخدم للمبتدئين بـ Figma',
    subtitle: 'ابدأ رحلتك في عالم التصميم الرقمي واكتشف أسرار رسم التخطيطات الجذابة والألوان بأسلوب سلس.',
    description: 'دورة المستوى المبتدئ الشاملة لأولئك الذين يرغبون في دخول عالم تصميم واجهات البرامج والتطبيقات عبر التعامل المباشر مع أدوات Figma وقواعد الترتيب البصري.',
    category: 'تصميم واجهات UI/UX',
    level: 'مبتدئ',
    thumbnail: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-3',
      name: 'أستاذة مريم الخالد',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
      title: 'قائدة فريق تصميم المنتجات الرقمية',
      bio: 'صممت أكثر من 40 تطبيقاً ناجحاً وحاصلة على جوائز إقليمية.',
      rating: 4.88,
      studentsCount: 9500
    },
    rating: 4.86,
    reviewsCount: 210,
    studentsEnrolledCount: 2900,
    estimatedHours: 6,
    price: 'مجاني',
    tags: ['Figma', 'UI Design', 'المبتدئين', 'تصميم'],
    learningObjectives: [
      'فهم عناصر واجهة المستخدم والخطوط والتباين',
      'استخدام واجهة أدوات Figma الأساسية والأحجام القياسية',
      'تصميم أول تطبيق هاتف وتنسيقه احترافياً'
    ],
    prerequisites: ['لا تتطلب أي خبرة سابقة'],
    modules: [
      {
        id: 'mod-uxb-1',
        title: 'الوحدة 1: التعامل مع Figma وتنسيق الألوان',
        lessons: [
          {
            id: 'les-uxb-1-1',
            title: 'طريقة استخدام Figma ورسم العناصر الهندسية',
            durationMinutes: 15,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
            contentMarkdown: `### مرحباً بك في Figma!

تعد أداة **Figma** الأداة الأولى عالمياً لتصميم واجهات وتطبيقات الويب والموبايل.

#### خطوات البداية:
1. اختيار مقاس الإطار (Frame) المناسب للشاّشة.
2. استخدام الألوان ذات التباين الجيد للعين.
3. الترتيب الهرمي للنصوص (العنوان الرئيسي، الفرعي، والمحتوى).`,
            keyTakeaways: ['Figma تعمل مباشرة في المتصفح وتوفر تعاوناً حياً بين الفريق']
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار أساسيات تصميم الواجهات للمبتدئين',
      questions: [
        {
          id: 'q-uxb-1',
          question: 'ما هي أهم قاعدة لتناسق الخطوط في الواجهة المبتدئة؟',
          options: ['استخدام التدرج الهرمي الواضح لحجم وسماكة الخط', 'استخدام 10 خطوط مختلفة', 'كتابة النص بالكامل بصغر جداً', 'إخفاء العناوين'],
          correctAnswerIndex: 0,
          explanation: 'التسلسل الهرمي يسهل على العين قراءة الأهم فالمهم بسرعة.'
        }
      ]
    }
  },
  {
    id: 'course-ux-design',
    title: 'تصميم تجربة وواجهة المستخدم UX/UI الاحترافي والـ Design Systems',
    subtitle: 'من الفكرة والشائعات إلى بناء البروتوتايب التفاعلي وتجارب المستخدمين المذهلة بـ Figma.',
    description: 'دورة المستوى المتوسط الشاملة لتعلم منهجية التفكير التصميمي (Design Thinking)، إجراء الأبحاث مع المستخدمين، رسم المخططات السلكية (Wireframes)، وتصميم واجهات عصرية جذابة وسهلة الاستخدام.',
    category: 'تصميم واجهات UI/UX',
    level: 'متوسط',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-3',
      name: 'أستاذة مريم الخالد',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
      title: 'قائدة فريق تصميم المنتجات الرقمية',
      bio: 'صممت أكثر من 40 تطبيقاً ناجحاً وحاصلة على جوائز إقليمية في تصميم تجارب المستخدم المستدامة.',
      rating: 4.88,
      studentsCount: 9500
    },
    rating: 4.88,
    reviewsCount: 290,
    studentsEnrolledCount: 1820,
    estimatedHours: 10,
    price: 'مجاني',
    tags: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    learningObjectives: [
      'فهم الفرق الجوهري بين تجربة المستخدم UX وواجهة المستخدم UI',
      'إجراء مقابلات المستخدمين وتحليل Personas',
      'تطبيق قواعد التباين الهرمي والتسلسل البصري والنسب الذهبية',
      'بناء الأنظمة البصرية (Design Systems) في Figma'
    ],
    prerequisites: ['لا تتطلب معرفة سابقة - حاسوب وتطبيق Figma مجاني'],
    modules: [
      {
        id: 'mod-ux-1',
        title: 'الوحدة 1: أركان تصميم تجربة المستخدم',
        lessons: [
          {
            id: 'les-ux-1-1',
            title: 'قوانين UX الأساسية والتدرج البصري',
            durationMinutes: 20,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=1oW2X1n5GfQ',
            contentMarkdown: `### القوانين النفسية في تصميم التفاعل

1. **قانون فيتس (Fitts's Law):** كلما كَبُر حجم الزر وكان أقرب ليد المستخدم، كلما سهل الضغط عليه.
2. **قانون هِك (Hick's Law):** تقليل الخيارات المتاحة يقلل زمن التردد واتخاذ القرار.
3. **قانون ياكوب (Jakob's Law):** يقضي المستخدمون معظم وقتهم على تطبيقات أخرى، لذا يفضلون أن يعمل تطبيقك بنفس الطريقة المعتادة.`,
            keyTakeaways: [
              'التصميم الجيد هو التصميم غير المرئي الذي يسهل مهام المستخدم',
              'احرص على التناسق في الألوان والمسافات'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار تقييم مفاهيم UI/UX والتفكير التصميمي',
      questions: [
        {
          id: 'q-ux-1',
          question: 'ما هو قانون Hick\'s Law في تصميم الواجهات؟',
          options: [
            'التركيز على اللون الأحمر فقط',
            'كلما زادت الخيارات المتاحة للمستخدم، زاد زمن اتخاذ القرار',
            'إخفاء زر الشراء في أسفل الصفحة',
            'استخدام خطوط صغيرة جداً'
          ],
          correctAnswerIndex: 1,
          explanation: 'ينص قانون هِك على أن زيادة الخيارات تعقد اتخاذ القرار، لذلك فإن التبسيط يرفع معدلات التحويل والرضا.'
        }
      ]
    }
  },
  {
    id: 'course-ux-world',
    title: 'تصميم المنتجات الرقمية العالمية والتجربة المعقدة (World-Class Product Design)',
    subtitle: 'احترف بناء الـ Enterprise Design Systems والتحسين القائم على أرقام السلوك والـ Micro-Interactions.',
    description: 'دورة المستوى العالمي المصممة لمصممي المنتجات المحترفين (Product Designers)، لتصميم الأنظمة البصرية الكبيرة التي تخدم ملايين المستخدمين، مع إتاحة سريعة (Accessibility - WCAG 2.2) وحركات تفاعلية مذهلة.',
    category: 'تصميم واجهات UI/UX',
    level: 'عالمي',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-3',
      name: 'أستاذة مريم الخالد',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
      title: 'قائدة فريق تصميم المنتجات الرقمية',
      bio: 'صممت أكثر من 40 تطبيقاً ناجحاً وحاصلة على جوائز إقليمية.',
      rating: 4.95,
      studentsCount: 9500
    },
    rating: 4.97,
    reviewsCount: 150,
    studentsEnrolledCount: 780,
    estimatedHours: 15,
    price: 'مجاني',
    tags: ['Product Design', 'Enterprise Design System', 'Accessibility', 'World-Class'],
    learningObjectives: [
      'بناء الأنظمة البصرية العالمية Enterprise Tokens & Variants',
      'تطبيق معايير الإتاحة الرقمية العالمية WCAG 2.2 AAA',
      'تحليل خرائط الحرارة وتجارب المستخدم القائمة على البيانات (Data-Driven UX)',
      'تصميم التفاعلات الدقيقة (Micro-Interactions) والحركية'
    ],
    prerequisites: ['إتقان العمل بـ Figma وخلفية في تصميم المنتجات'],
    modules: [
      {
        id: 'mod-uxw-1',
        title: 'الوحدة 1: بناء الـ Design Tokens والأنظمة العالمية',
        lessons: [
          {
            id: 'les-uxw-1-1',
            title: 'إدارة ألوان ومتغيرات الـ Light/Dark Mode و Multi-Theme Systems',
            durationMinutes: 26,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=33LzO7tB_Yk',
            contentMarkdown: `### معمارية الـ Design Tokens في المنتجات العالمية

تعتمد الشركات العالمية على **Design Tokens** لربط شفرة المطورين بتصاميم المصممين بصورة آلية وموحدة عبر الموبايل والويب.

#### الفوائد الرئيسية:
- تحديث لون أو هُوية واحدة ينتقل لجميع المكونات والـ SDKs فوراً.
- التوافق مع معايير الوصول الشامل لأصحاب الهمم بصورة قياسية.`,
            keyTakeaways: [
              'التصميم العالمي يتطلب فصل الألوان كـ Semantic Tokens',
              'الإتاحة الرقمية Accessibility ليست خياراً بل معياراً رسمياً'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار تصميم المنتجات الرقمية العالمية',
      questions: [
        {
          id: 'q-uxw-1',
          question: 'ما هو الدور الأساسي للـ Design Tokens في الشركات العالمية؟',
          options: ['ربط القيم التصميمية من ألوان ومسافات مباشرة بالكود لضمان الاتساق الكامل', 'إلغاء لغة HTML', 'زيادة مساحة الصور', 'تسريع المعالج'],
          correctAnswerIndex: 0,
          explanation: 'توفر الـ Design Tokens لغة موحدة بين المصمم والمطور عبر جميع المنصات.'
        }
      ]
    }
  },

  // ==========================================
  // TRACK 4: علوم البيانات بـ Python (3 مستويات)
  // ==========================================
  {
    id: 'course-py-beg',
    title: 'أساسيات البرمجة بلغة Python للمبتدئين من الصفر',
    subtitle: 'خطوتك الأولى وسهلة الدخول لتعلم لغة البرمجة الأكثر طلباً وشعبية في العالم.',
    description: 'دورة المستوى المبتدئ الشاملة لتأسيس التفكير البرمجي الصحيح، تعلم المتغيرات والشروط والحلقات التكرارية والدوال في Python بأسلوب مبسط وعملي.',
    category: 'علوم البيانات',
    level: 'مبتدئ',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-4',
      name: 'مهندس طارق العلي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      title: 'عالم بيانات أول ومحلل إحصائي',
      bio: 'متخصص في بناء نماذج التنبؤ بالبيانات وتحليل النظم الكبيرة.',
      rating: 4.92,
      studentsCount: 18000
    },
    rating: 4.93,
    reviewsCount: 380,
    studentsEnrolledCount: 5200,
    estimatedHours: 7,
    price: 'مجاني',
    tags: ['Python', 'المبتدئين', 'برمجة', 'الأساسيات'],
    learningObjectives: [
      'فهم طريقة كتابة شفرة Python النظيفة والأنيقة',
      'التعامل مع المتغيرات والأعداد والشروط والحلقات التكرارية',
      'كتابة دوال ومستندات برمجية لحل المشكلات البسيطة'
    ],
    prerequisites: ['لا تتطلب معرفة برمجية سابقة'],
    modules: [
      {
        id: 'mod-pyb-1',
        title: 'الوحدة 1: المدخل إلى Python والمتغيرات',
        lessons: [
          {
            id: 'les-pyb-1-1',
            title: 'كتابة برنامجك الأول وبناء الجمل البرمجية في Python',
            durationMinutes: 16,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=h3vcT-L6sN8',
            contentMarkdown: `### أهلاً بك في لغة Python!

تتميز Python بأنها لغة سهلة القراءة كاللغة الإنجليزية اليومية.

\`\`\`python
# برنامج ترحيبي بسيط
name = "مازن"
age = 22
print(f"مرحباً بك يا {name}، عمرك هو {age} عاماً!")
\`\`\``,
            keyTakeaways: ['سهولة الكتابة تجعل Python الخيار الأول للمبتدئين ولعالم البيانات']
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار أساسيات Python للمبتدئين',
      questions: [
        {
          id: 'q-pyb-1',
          question: 'كيف نقوم بطباعة نص على الشاشة في لغة Python؟',
          options: ['print("النص")', 'console.log("النص")', 'echo "النص"', 'System.out.println("النص")'],
          correctAnswerIndex: 0,
          explanation: 'تعتبر الدالة القياسية print() هي المخصصة للطباعة والعرض في Python.'
        }
      ]
    }
  },
  {
    id: 'course-python-data',
    title: 'تحليل البيانات واستخراج الرؤى بـ Python & Pandas',
    subtitle: 'ابني خطوتك الاحترافية في تحليل البيانات ومعالجة الجداول وصناعة المخططات التفاعلية.',
    description: 'دورة المستوى المتوسط الشاملة لمعالجة وتنظيف الجداول الضخمة باستخدام Pandas و NumPy، واستخراج الرؤى والإحصائيات الهامة للشركات.',
    category: 'علوم البيانات',
    level: 'متوسط',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-4',
      name: 'مهندس طارق العلي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      title: 'عالم بيانات أول ومحلل إحصائي',
      bio: 'متخصص في بناء نماذج التنبؤ بالبيانات وتحليل النظم الكبيرة للشركات الكبرى.',
      rating: 4.92,
      studentsCount: 18000
    },
    rating: 4.92,
    reviewsCount: 410,
    studentsEnrolledCount: 3100,
    estimatedHours: 14,
    price: 'مجاني',
    tags: ['Python', 'Pandas', 'NumPy', 'Data Science'],
    learningObjectives: [
      'فهم جمل التحكّم والدوال المتغيرة في Python',
      'معالجة وتنظيف البيانات الضخمة بـ Pandas DataFrames',
      'رسم المخططات البيانية وتوليد التقارير'
    ],
    prerequisites: ['أساسيات لغة Python'],
    modules: [
      {
        id: 'mod-py-1',
        title: 'الوحدة 1: الأساسيات والمعالجة بـ Python',
        lessons: [
          {
            id: 'les-py-1-1',
            title: 'المتغيرات وأنواع البيانات والمعالجة الهيكلية',
            durationMinutes: 18,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
            contentMarkdown: `### المتغيرات وأنواع البيانات في Python

تتميز لغة Python بسهولة كتابتها ووضوح مفرداتها.

\`\`\`python
import pandas as pd

# قراءة جدول البيانات
df = pd.read_csv("sales_data.csv")
print(df.describe())
\`\`\``,
            keyTakeaways: [
              'Python لغة عالية المستوى وسهلة التعلم',
              'تساعد Pandas في معالجة ملايين السجلات في أجزاء من الثانية'
            ]
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار دبلوم Python وعلوم البيانات',
      questions: [
        {
          id: 'q-py-1',
          question: 'أي مكتبة تُستخدم بشكل رئيسي في Python لمعالجة جداول البيانات (DataFrames)؟',
          options: [
            'Pandas',
            'HTML',
            'React',
            'Photoshop'
          ],
          correctAnswerIndex: 0,
          explanation: 'تعتبر Pandas المكتبة القياسية لمعالجة وتحليل جداول البيانات في Python.'
        }
      ]
    }
  },
  {
    id: 'course-py-world',
    title: 'عالمية علم البيانات والتنبؤ بالبيانات الضخمة والتعلم العميق بـ PyTorch',
    subtitle: 'بناء شبكات الأعصاب الاصطناعية (Neural Networks) ونماذج التنبؤ العالمية ذات الملايين معالجة.',
    description: 'دورة المستوى العالمي المتقدم والموجهة لعظماء علم البيانات ومهندسي التعلم الآلي، لتطوير الشبكات العصبية العميقة بـ PyTorch، وتحليل البيانات غير المهيكلة والتنبوئية عالية الجودة.',
    category: 'علوم البيانات',
    level: 'عالمي',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-4',
      name: 'مهندس طارق العلي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      title: 'عالم بيانات أول ومحلل إحصائي',
      bio: 'متخصص في بناء نماذج التنبؤ بالبيانات وتحليل النظم الكبيرة.',
      rating: 4.96,
      studentsCount: 18000
    },
    rating: 4.97,
    reviewsCount: 190,
    studentsEnrolledCount: 890,
    estimatedHours: 18,
    price: 'مجاني',
    tags: ['Deep Learning', 'PyTorch', 'Neural Networks', 'Big Data', 'World-Class'],
    learningObjectives: [
      'تطوير شبكات الأعصاب الاصطناعية العميقة (Deep Neural Networks)',
      'معالجة الصور والتسلسلات الزمنية بـ CNNs & Transformers',
      'معايرة النماذج والحد من الـ Overfitting وتحسين أداء الـ GPUs'
    ],
    prerequisites: ['إتقان Python، الجبر الخطي، والإحصاء الاحتمالي المتقدم'],
    modules: [
      {
        id: 'mod-pyw-1',
        title: 'الوحدة 1: الشبكات العصبية العميقة بـ PyTorch',
        lessons: [
          {
            id: 'les-pyw-1-1',
            title: 'بناء نموذج التغذية الأمامية وإدارة الأوزان Backpropagation',
            durationMinutes: 30,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
            contentMarkdown: `### معمارية PyTorch العميقة

يقوم إطار **PyTorch** بحساب الانحدار التلقائي (Automatic Differentiation) للشبكات العصبية المعقدة.

\`\`\`python
import torch
import torch.nn as nn

class WorldClassNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 10)
    
    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))
\`\`\``,
            keyTakeaways: ['PyTorch يوفر مرونة كاملة لبناء أحدث أبحاث وبنيات الذكاء الاصطناعي']
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار علم البيانات والتعلم العميق العالمي',
      questions: [
        {
          id: 'q-pyw-1',
          question: 'ما هي الخوارزمية الأساسية المستخدمة لتحديث أوزان الشبكة العصبية بناءً على نسبة الخطأ؟',
          options: ['Backpropagation (الانتشار الخلفي)', 'HTML Formatting', 'CSS Flexbox', 'Manual Edit'],
          correctAnswerIndex: 0,
          explanation: 'تعتبر خوارزمية الانتشار الخلفي المحرك الأساسي لتحديث الأوزان وتدريب شبكات الأعصاب العميقة.'
        }
      ]
    }
  },

  // ==========================================
  // TRACK 5: الأمن السيبراني (3 مستويات)
  // ==========================================
  {
    id: 'course-sec-beg',
    title: 'مدخل إلى الأمن السيبراني والسلامة الرقمية للمبتدئين',
    subtitle: 'حماية حساباتك ومعلوماتك الشخصية وتفادي أساليب الهندسة الاجتماعية والهجمات البسيطة.',
    description: 'دورة المستوى المبتدئ للتعرف على أساليب الاحتيال الرقمي، التشفير المبدئي، الحفاظ على كلمة المرور، واستخدام وسائل الأمان الثنائية 2FA.',
    category: 'برمجة وتطوير',
    level: 'مبتدئ',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-5',
      name: 'مهندس خالد الرشيد',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      title: 'مستشار أمن المعلومات والأنظمة',
      bio: 'حاصل على شهادات CEH و CISSP وعمل كاستشاري أمني.',
      rating: 4.85,
      studentsCount: 11000
    },
    rating: 4.87,
    reviewsCount: 180,
    studentsEnrolledCount: 3200,
    estimatedHours: 5,
    price: 'مجاني',
    tags: ['Cyber Security', 'المبتدئين', 'الأمان', 'الحماية'],
    learningObjectives: [
      'اكتشاف محاولات الصيد الإلكتروني (Phishing) والوقاية منها',
      'تفعيل التوثيق بخطوتين (2FA) وإدارة كلمات السر بأمان',
      'حماية الأجهزة الشخصية من البرمجيات الخبيثة'
    ],
    prerequisites: ['لا تتطلب أي خبرة سابقة'],
    modules: [
      {
        id: 'mod-secb-1',
        title: 'الوحدة 1: الوعي الرقمي وتجنب الاحتيال',
        lessons: [
          {
            id: 'les-secb-1-1',
            title: 'أساليب الصيد الإلكتروني وكيف تحمي بياناتك',
            durationMinutes: 14,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=2L0kYw3x2Fw',
            contentMarkdown: `### السلامة الرقمية للمبتدئين

تعتبر **الهندسة الاجتماعية** والرسائل الزائفة من أكثر الطرق الشائعة لاختراق الحسابات.

#### نصائح وقائية:
1. عدم الضغط على روابط مجهولة المصدر.
2. التأكد من رابط الموقع الأصلي ورابط الشهادة SSL (HTTPS).
3. عدم مشاركة رمُوز التحقيق المؤقتة مع أي شخص.`,
            keyTakeaways: ['الوعي هو الخط الأول والأهم للحماية الرقمية']
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار السلامة الرقمية للمبتدئين',
      questions: [
        {
          id: 'q-secb-1',
          question: 'ما هو البروتوكول الآمن الذي يجب التأكد من وجوده في رابط أي موقع حساس؟',
          options: ['HTTPS', 'HTTP', 'FTP', 'TXT'],
          correctAnswerIndex: 0,
          explanation: 'يضمن بروتوكول HTTPS تشفير البيانات المرسلة بين المتصفح والموقع.'
        }
      ]
    }
  },
  {
    id: 'course-cyber-sec',
    title: 'أساسيات الأمن السيبراني وأمن الشبكات (OWASP & Defense)',
    subtitle: 'تعلم كيف تحمي الأنظمة والشبكات من التهديدات والاختراقات الشائعة.',
    description: 'دورة المستوى المتوسط الشاملة للتعرف على أساسيات التشفير، أمن الشبكات، واكتشاف الثغرات العالية الخصوصية وفق المعايير العالمية مثل OWASP Top 10.',
    category: 'برمجة وتطوير',
    level: 'متوسط',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-5',
      name: 'مهندس خالد الرشيد',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      title: 'مستشار أمن المعلومات والأنظمة',
      bio: 'حاصل على شهادات CEH و CISSP وعمل كاستشاري أمني للعديد من المؤسسات المالية.',
      rating: 4.85,
      studentsCount: 11000
    },
    rating: 4.85,
    reviewsCount: 210,
    studentsEnrolledCount: 1650,
    estimatedHours: 9,
    price: 'مجاني',
    tags: ['Cyber Security', 'Network Security', 'OWASP', 'Encryption'],
    learningObjectives: [
      'فهم مبادئ التشفير المتماثل وغير المتماثل (AES & RSA)',
      'الوقاية من هجمات SQL Injection و Cross-Site Scripting (XSS)',
      'تطبيق ممارسات حماية الشبكات والجدران النارية'
    ],
    prerequisites: ['معرفة أساسية بمفاهيم الشبكات والإنترنت'],
    modules: [
      {
        id: 'mod-sec-1',
        title: 'الوحدة 1: قواعد الأمن السيبراني والوقاية من الثغرات',
        lessons: [
          {
            id: 'les-sec-1-1',
            title: 'حماية التطبيقات من ثغرات OWASP الشائعة',
            durationMinutes: 25,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=4FqC47J15pI',
            contentMarkdown: `### أهمية الحماية من ثغرات Injection

تحدث ثغرات حقن الاستعلامات (SQL Injection) عندما يتم دمج مدخلات المستخدم غير المفحوصة مباشرة في استعلامات قاعدة البيانات.

#### كيفية الوقاية:
استخدم دائماً **الاستعلامات المعلمية (Parameterized Queries)** لتطهير المدخلات.`,
            keyTakeaways: [
              'لا تثق أبدًا بمدخلات القادمة من المتصفح',
              'التحديثات الأمنية الدورية تقلل المخاطر بنسبة 90%'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-sec-world',
    title: 'الأمن السيبراني العالمي والهندسة العكسية واختبار الاختراق الاحترافي (Red Teaming)',
    subtitle: 'اختبار اختراق البنى التحتية العابرة للقارات، الهندسة العكسية للبرمجيات، والدفاع الرقمي الاستباقي.',
    description: 'دورة المستوى العالمي المتقدم والموجهة لمختبري الاختراق وخبراء الأمن السيبراني للتعمق في هندسة الثغرات المعقدة، فحص الـ Binaries، تقنيات Red Teaming، وتجاوز آليات الحماية السيبرانية المعقدة.',
    category: 'برمجة وتطوير',
    level: 'عالمي',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    instructor: {
      id: 'inst-5',
      name: 'مهندس خالد الرشيد',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      title: 'مستشار أمن المعلومات والأنظمة',
      bio: 'حاصل على شهادات CEH و CISSP وعمل كاستشاري أمني.',
      rating: 4.96,
      studentsCount: 11000
    },
    rating: 4.98,
    reviewsCount: 140,
    studentsEnrolledCount: 650,
    estimatedHours: 20,
    price: 'مجاني',
    tags: ['Red Teaming', 'Reverse Engineering', 'Exploit Development', 'World-Class'],
    learningObjectives: [
      'إجراء الهندسة العكسية للبرمجيات التنفيذية وتحليل الـ Assembly',
      'تطوير الثغرات واستغلال Memory Corruption & Buffer Overflow',
      'محاكاة الهجمات السيبرانية المتقدمة Advanced Persistent Threats (APT)'
    ],
    prerequisites: ['إتقان معمارية الحاسوب، لغة C/C++، ولغة Assembly وأمن الأنظمة'],
    modules: [
      {
        id: 'mod-secw-1',
        title: 'الوحدة 1: الهندسة العكسية وتحليل الـ Binaries',
        lessons: [
          {
            id: 'les-secw-1-1',
            title: 'تفكيك الكود البرمجي بـ Ghidra وفهم الـ Stack Frame',
            durationMinutes: 35,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=5rG40zR3V6k',
            contentMarkdown: `### الهندسة العكسية للثغرات في المستوى العالمي

تُستخدم أدوات مثل **Ghidra** و **IDA Pro** لتفكيك الملفات التنفيذية بدون توفر الكود المصدري الأصلي.

#### تحليل الـ Buffer Overflow:
تحدث عندما تتجاوز البيانات المدخلة سعة الميموري المخصصة للـ Buffer مما يؤدي لتعديل مسار برنامج التنفيذ (EIP Register).`,
            keyTakeaways: ['مستوى Red Teaming يتطلب فهماً دقيقاً لكيفية تعامل المعالج مع الذاكرة']
          }
        ]
      }
    ],
    quiz: {
      title: 'اختبار دبلوم الأمن السيبراني والاختراق العالمي',
      questions: [
        {
          id: 'q-secw-1',
          question: 'ما هي الأداة الشائعة مفتوحة المصدر من وكالة NSA لتفكيك الملفات التنفيذية وإجراء الهندسة العكسية؟',
          options: ['Ghidra', 'Word', 'Photoshop', 'Excel'],
          correctAnswerIndex: 0,
          explanation: 'تعتبر أداة Ghidra واحدة من أشهر وأقوى الأدوات العالمية في الهندسة العكسية وتحليل الثغرات.'
        }
      ]
    }
  }
];

export const INITIAL_COURSES: Course[] = RAW_COURSES.map((course) => {
  const customQuiz = COURSE_QUIZZES[course.id] || course.quiz;
  return {
    ...course,
    quiz: customQuiz,
    modules: course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson, idx) => ({
        ...lesson,
        directVideoUrl:
          lesson.directVideoUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        downloadUrl:
          lesson.downloadUrl ||
          lesson.directVideoUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        videoFileSize: lesson.videoFileSize || `${42 + idx * 10} MB`,
      })),
    })),
  };
});
