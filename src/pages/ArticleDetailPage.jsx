import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, ChevronLeft, Loader2, Tag, Share2 } from 'lucide-react';
import { articlesApi } from '../api/articles';
import { toast } from 'sonner';

export default function ArticleDetailPage() {
  const { slug }   = useParams();
  const [article,  setArticle]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const isObjectId = /^[a-f\d]{24}$/i.test(slug);
        const data = isObjectId
          ? await articlesApi.getById(slug)
          : await articlesApi.getBySlug(slug);
        setArticle(data.article || data.data || data);
        // Load related (same category)
        const cat = (data.article || data.data || data)?.category;
        if (cat) {
          const rel = await articlesApi.getAll({ category: cat, limit: 3 }).catch(() => null);
          setRelated((rel?.articles || rel?.data || []).filter(a => a._id !== (data.article||data.data||data)?._id));
        }
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally { setLoading(false); }
    };
    load();
  }, [slug]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط');
    } catch { toast.error('فشل النسخ'); }
  };

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  if (notFound || !article) return (
    <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-bold text-gray-600 mb-2">المقال غير موجود</h1>
        <Link to="/articles" className="text-cyan-600 hover:underline text-sm">العودة للمقالات</Link>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-cyan-600">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link to="/articles" className="hover:text-cyan-600">المقالات</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-600 truncate">{article.title}</span>
        </div>

        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {article.image && (
            <img src={article.image} alt={article.title} className="w-full h-64 sm:h-80 object-cover" />
          )}
          <div className="p-6 sm:p-8">
            {article.category && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-cyan-50 text-cyan-600 px-2.5 py-1 rounded-full mb-4">
                <Tag className="w-3 h-3" /> {article.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{fmt(article.createdAt)}</span>
              </div>
              {article.author?.name && (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-[10px] font-bold text-cyan-700">
                    {article.author.name[0]}
                  </div>
                  <span>{article.author.name}</span>
                </div>
              )}
              <button onClick={share} className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-600 mr-auto">
                <Share2 className="w-4 h-4" /> مشاركة
              </button>
            </div>

            {/* Article body */}
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ __html: article.content || article.body || '<p>محتوى المقال غير متوفر.</p>' }}
            />
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-gray-800 mb-4">مقالات ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(a => (
                <Link key={a._id} to={`/articles/${a.slug || a._id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  {a.image
                    ? <img src={a.image} alt={a.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                    : <div className="w-full h-32 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center"><BookOpen className="w-8 h-8 text-cyan-300" /></div>
                  }
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-cyan-700">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(a.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-cyan-600 hover:underline">
            <ArrowRight className="w-4 h-4" /> عرض كل المقالات
          </Link>
        </div>
      </div>
    </div>
  );
}
