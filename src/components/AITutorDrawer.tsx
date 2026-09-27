import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, Loader2, BookOpen } from 'lucide-react';
import { StudentProfile, Course } from '../types';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile?: StudentProfile | null;
  courses?: Course[];
  currentCourseTitle?: string;
  onSelectCourse?: (courseId: string) => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  matchedCourses?: Course[];
}

// نوع رسالة السياق المرسلة للسيرفر (تطابق شكل messages المتوقع في server.ts)
interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const nowTime = () => new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  courses = [],
  onSelectCourse,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `أهلاً بك${studentProfile?.fullName ? ' يا ' + studentProfile.fullName : ''}! أنا معلمك الذكي 🤖\nاسألني عن أي حاجة - أي مادة، أي سؤال، أو حتى لو عايز اقتراح كورس - وهساعدك فورًا.`,
      time: nowTime(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // سجل المحادثة اللي بيتبعت للسيرفر عشان يحافظ على سياق الحوار
  const conversationHistoryRef = useRef<ApiMessage[]>([]);

  // ملخص الكورسات المتاحة، بيتبعت كسياق إضافي للسيرفر
  const coursesSummary = courses
    .slice(0, 40)
    .map((c) => `- ${c.title}${c.category ? ` (${c.category})` : ''}`)
    .join('\n');

  // إعادة ضبط سجل المحادثة كل ما المودال يتفتح من جديد
  useEffect(() => {
    if (!isOpen) return;
    conversationHistoryRef.current = [];
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const findMatchingCourses = (query: string): Course[] => {
    const cleanQuery = query.toLowerCase().replace(/[أإآ]/g, 'ا');
    return courses.filter((c) => {
      const title = (c.title || '').toLowerCase().replace(/[أإآ]/g, 'ا');
      const desc = (c.description || '').toLowerCase().replace(/[أإآ]/g, 'ا');
      const cat = (c.category || '').toLowerCase().replace(/[أإآ]/g, 'ا');
      return title.includes(cleanQuery) || desc.includes(cleanQuery) || cat.includes(cleanQuery);
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: nowTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);
    setError('');

    // إضافة رسالة المستخدم لسجل المحادثة المرسل للسيرفر
    conversationHistoryRef.current.push({ role: 'user', content: query });

    try {
      const response = await fetch('/api/gemini/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistoryRef.current,
          courseContext: coursesSummary || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل الاتصال بالمساعد الذكي');
      }

      const replyText: string = data.reply || 'عذرًا، لم أتمكن من إيجاد رد مناسب. حاول تصيغ سؤالك بشكل مختلف.';

      // إضافة رد البوت لسجل المحادثة عشان يفضل محتفظ بالسياق
      conversationHistoryRef.current.push({ role: 'assistant', content: replyText });

      const foundCourses = findMatchingCourses(query);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        time: nowTime(),
        matchedCourses: foundCourses.length > 0 ? foundCourses : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('AI Tutor error:', err);
      setError('حدث خطأ أثناء التواصل مع المساعد الذكي. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'عذرًا، حدث خطأ أثناء محاولة الرد على سؤالك. حاول مرة أخرى بعد قليل.',
        time: nowTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-arabic" dir="rtl">
      <div className="bg-[#0b132b] border border-slate-700 rounded-2xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">المعلم الذكي (EduBot)</h3>
              <p className="text-[11px] text-slate-400">مساعدك التعليمي المدعوم بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {msg.matchedCourses && msg.matchedCourses.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.matchedCourses.map((course) => (
                      <div 
                        key={course.id}
                        onClick={() => {
                          if (onSelectCourse) onSelectCourse(course.id);
                          onClose();
                        }}
                        className="p-2.5 bg-slate-900 hover:bg-slate-950 border border-emerald-500/30 rounded-xl cursor-pointer transition-all flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-emerald-400 text-xs">{course.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{course.description}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-md font-bold shrink-0 mr-2">
                          عرض
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <span className="block text-[10px] opacity-50 mt-1 text-left">{msg.time}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>جاري التفكير في إجابة سؤالك...</span>
            </div>
          )}

          {error && (
            <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="اكتب سؤالك أو استفسارك هنا..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 rounded-xl font-bold cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export const AITutorDrawer = AiTutorModal;
export default AiTutorModal;