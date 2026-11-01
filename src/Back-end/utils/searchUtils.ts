// Intelligent Arabic and English search normalization, synonyms, and precision relevance scoring

export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    // Remove Arabic diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alef variants: أ, إ, آ, ٱ -> ا
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Yeh / Alef Maksura: ى, ئ -> ي
    .replace(/[ىئ]/g, 'ي')
    // Normalize Teh Marbuta: ة -> ه
    .replace(/ة/g, 'ه')
    // Normalize Waw with Hamza: ؤ -> و
    .replace(/ؤ/g, 'و')
    // Remove tatweel (kashida)
    .replace(/\u0640/g, '')
    // Replace punctuation with spaces
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»[\]\\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Common conversational / query-filler stop words in Arabic & English
const INTENT_STOP_WORDS = new Set([
  'كورس', 'كورسات', 'دورة', 'دوره', 'دورات', 'شرح', 'تعلم', 'تعليم', 'تدريب', 
  'دروس', 'درس', 'محاضرة', 'محاضره', 'محاضرات', 'افضل', 'احسن', 'ابغى', 'عايز', 
  'اريد', 'منهج', 'سلسلة', 'سلسله', 'فيديو', 'فيديوهات', 'اونلاين', 'مجاني',
  'في', 'من', 'على', 'إلى', 'الي', 'عن', 'مع', 'هذا', 'هذه', 'تم', 'ما', 'هو', 'هي', 
  'أن', 'ان', 'لا', 'هل', 'كيف', 'طريقة', 'طريقه', 'course', 'tutorial', 'learn', 'free'
]);

// Cross-language synonyms and technical equivalences
const SYNONYM_MAP: Record<string, string[]> = {
  // Web & Frameworks
  'رياكت': ['react', 'reactjs', 'واجهات'],
  'react': ['رياكت', 'واجهات', 'ويب'],
  'بايثون': ['python', 'py', 'بيانات', 'ذكاء'],
  'python': ['بايثون', 'برمجة'],
  'جافاسكريبت': ['javascript', 'js', 'ويب'],
  'جافاسكربت': ['javascript', 'js', 'ويب'],
  'javascript': ['جافاسكريبت', 'جافاسكربت', 'js', 'ويب'],
  'js': ['javascript', 'جافاسكريبت', 'جافاسكربت'],
  'تايبسكريبت': ['typescript', 'ts'],
  'تايبسكربت': ['typescript', 'ts'],
  'typescript': ['تايبسكريبت', 'تايبسكربت', 'ts'],
  'ts': ['typescript', 'تايبسكريبت'],
  'اتش تي ام ال': ['html', 'html5', 'صفحات'],
  'html': ['اتش تي ام ال', 'html5', 'ويب'],
  'سي اس اس': ['css', 'css3', 'تنسيق'],
  'css': ['سي اس اس', 'css3', 'تصميم'],
  'نكست': ['next', 'nextjs', 'react'],
  'next': ['نكست', 'nextjs', 'react'],
  'فلاتر': ['flutter', 'dart', 'موبايل', 'تطبيقات'],
  'flutter': ['فلاتر', 'dart', 'تطبيقات'],
  // AI & Data
  'ذكاء': ['ai', 'اصطناعي', 'ذكاء اصطناعي', 'artificial', 'intelligence', 'تعلم الالة'],
  'اصطناعي': ['ai', 'ذكاء', 'ذكاء اصطناعي'],
  'ai': ['ذكاء', 'اصطناعي', 'ذكاء اصطناعي', 'python', 'بايثون'],
  'بيانات': ['data', 'analytics', 'تحليل', 'علم البيانات', 'sql'],
  'data': ['بيانات', 'تحليل', 'علم البيانات'],
  'تحليل': ['بيانات', 'data', 'analytics'],
  // Design & UI/UX
  'تصميم': ['design', 'ui', 'ux', 'واجهات', 'تجربة', 'فيجما', 'figma'],
  'واجهات': ['ui', 'ux', 'frontend', 'design', 'تصميم'],
  'فيجما': ['figma', 'تصميم', 'ui', 'ux'],
  'figma': ['فيجما', 'تصميم', 'ui', 'ux'],
  'ui': ['واجهات', 'تصميم', 'ux', 'design', 'user interface'],
  'ux': ['تجربة مستخدم', 'تصميم', 'ui', 'design', 'user experience'],
  // Business & Project Management
  'ادارة': ['management', 'قيادة', 'اعمال', 'مشاريع', 'agile', 'scrum'],
  'اعمال': ['business', 'ادارة', 'مشاريع'],
  'قيادة': ['leadership', 'ادارة', 'فريق']
};

/**
 * Calculates a search relevance score for a course.
 * Returns 0 if there is NO genuine match to the substantive search keywords.
 * Returns > 0 if matched, with higher scores for matches in title, tags, or subtitle.
 */
export function getCourseSearchScore(
  course: {
    title: string;
    subtitle?: string;
    description?: string;
    category?: string;
    instructor?: { name: string };
    tags?: string[];
  },
  rawQuery: string
): number {
  if (!rawQuery || !rawQuery.trim()) return 1;

  const normQuery = normalizeSearchText(rawQuery);
  if (!normQuery) return 1;

  const allQueryTokens = normQuery.split(' ').filter(Boolean);
  
  // Extract substantive tokens by filtering out stop/filler words (like "كورس", "دورة", "شرح")
  let substantiveTokens = allQueryTokens.filter(tok => !INTENT_STOP_WORDS.has(tok));
  
  // If the query was solely comprised of stop words (e.g. user just searched "كورس" or "دورة"),
  // treat all tokens as query tokens so we don't return an empty page
  if (substantiveTokens.length === 0) {
    substantiveTokens = allQueryTokens;
  }

  // Course normalized fields
  const normTitle = normalizeSearchText(course.title || '');
  const normSubtitle = normalizeSearchText(course.subtitle || '');
  const normDesc = normalizeSearchText(course.description || '');
  const normCategory = normalizeSearchText(course.category || '');
  const normInstructor = normalizeSearchText(course.instructor?.name || '');
  const normTags = (course.tags || []).map(t => normalizeSearchText(t));

  // Build expanded token set with technical synonyms
  const expandedTokens: string[] = [];
  substantiveTokens.forEach(tok => {
    expandedTokens.push(tok);
    if (SYNONYM_MAP[tok]) {
      expandedTokens.push(...SYNONYM_MAP[tok].map(s => normalizeSearchText(s)));
    }
  });

  let score = 0;
  let matchesCount = 0;

  // 1. Check exact phrase match in Title (Super High Relevance)
  if (normTitle.includes(normQuery)) {
    score += 500;
  }

  // 2. Check exact phrase in Subtitle / Tags
  if (normSubtitle.includes(normQuery)) {
    score += 200;
  }
  if (normTags.some(t => t.includes(normQuery) || normQuery.includes(t))) {
    score += 300;
  }

  // 3. Check substantive and expanded token matches
  for (const token of substantiveTokens) {
    let tokenMatched = false;
    const synonyms = [token, ...(SYNONYM_MAP[token] || []).map(s => normalizeSearchText(s))];

    for (const syn of synonyms) {
      if (!syn) continue;

      if (normTitle.includes(syn)) {
        score += 150;
        tokenMatched = true;
      }
      if (normTags.some(t => t.includes(syn) || syn.includes(t))) {
        score += 120;
        tokenMatched = true;
      }
      if (normSubtitle.includes(syn)) {
        score += 70;
        tokenMatched = true;
      }
      if (normDesc.includes(syn)) {
        score += 40;
        tokenMatched = true;
      }
      if (normInstructor.includes(syn)) {
        score += 50;
        tokenMatched = true;
      }

      // Category match: ONLY gives points if user specifically searched for a category name
      if (normCategory.includes(syn) && (syn === 'برمجه' || syn === 'ذكاء' || syn === 'تصميم' || syn === 'بيانات' || syn === 'اداره')) {
        score += 30;
        tokenMatched = true;
      }
    }

    if (tokenMatched) {
      matchesCount++;
    }
  }

  // Strict relevance threshold:
  // If substantive tokens were searched (e.g. "بايثون" or "رياكت"), at least one substantive token must match!
  if (substantiveTokens.length > 0 && matchesCount === 0 && !normTitle.includes(normQuery)) {
    return 0;
  }

  return score;
}

/**
 * Simple boolean check: does the course genuinely match the query?
 */
export function isCourseMatched(
  course: {
    title: string;
    subtitle?: string;
    description?: string;
    category?: string;
    instructor?: { name: string };
    tags?: string[];
  },
  query: string
): boolean {
  return getCourseSearchScore(course, query) > 0;
}
