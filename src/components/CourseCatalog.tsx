import React, { useState } from 'react';
import { Sparkles, Filter, Search, BookOpen, Layers, BookPlus } from 'lucide-react';
import { Course, CategoryType, CourseLevel, UserProgress } from '../types';
import { CourseCard } from './CourseCard';
import { getCourseSearchScore } from '../utils/searchUtils';

interface CourseCatalogProps {
  courses: Course[];
  userProgressMap: Record<string, UserProgress>;
  onSelectCourse: (course: Course) => void;
  onOpenAiGenerator: () => void;
  onOpenAddCourseModal?: () => void;
  onEditCourse?: (course: Course) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORIES: CategoryType[] = [
  'الكل',
  'برمجة وتطوير',
  'الذكاء الاصطناعي',
  'تصميم واجهات UI/UX',
  'علوم البيانات',
  'إدارة الأعمال والقيادة'
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  userProgressMap,
  onSelectCourse,
  onOpenAiGenerator,
  onOpenAddCourseModal,
  onEditCourse,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('الكل');
  const [selectedLevel, setSelectedLevel] = useState<string>('الكل');

  // Filter Courses Logic with accurate relevance scoring & ranking
  const filteredCourses = React.useMemo(() => {
    const trimmedQuery = searchQuery.trim();

    return courses
      .map((course) => {
        const score = trimmedQuery ? getCourseSearchScore(course, trimmedQuery) : 1;
        const matchesCategory = selectedCategory === 'الكل' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'الكل' || course.level === selectedLevel;
        
        return {
          course,
          score,
          isValid: score > 0 && matchesCategory && matchesLevel
        };
      })
      .filter((item) => item.isValid)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.course);
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      
      {/* Category Pills & Filters Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Filter Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>المستوى:</span>
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="الكل">جميع المستويات</option>
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="عالمي">عالمي</option>
          </select>
        </div>

      </div>

      {/* Catalog Title & Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-arabic">
            الدورات التدريبية المتاحة
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            تم إيجاد {filteredCourses.length} دورة تعليمية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAiGenerator}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>ابتكر دورة بالـ AI</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userProgress={userProgressMap[course.id]}
              onSelectCourse={onSelectCourse}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Result State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            لم نجد دورات تطابق بحثك
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            جرب البحث عن مصطلح آخر أو قم بالاستعانة بمُنشئ الدورات بالذكاء الاصطناعي لإنشاء منهج مخصص لك فوراً!
          </p>
          <button
            onClick={onOpenAiGenerator}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all mt-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>إنشاء دورة في هذا الموضوع بالـ AI</span>
          </button>
        </div>
      )}

    </div>
  );
};
