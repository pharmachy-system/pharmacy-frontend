import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, ChevronLeft, Loader2, Tag } from 'lucide-react';
import { articlesApi } from '../api/articles';

const CATEGORIES = ['الكل', 'الأدوية', 'الصحة العامة', 'التغذية', 'اللياقة', 'الأمراض المزمنة'];

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('الكل');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search)              params.search   = search;
      if (category !== 'الكل') params.category = category;
      const data = await articlesApi.getAll(params);
      setArticles(data.articles || data.data || []);
      setTotal(data.total || data.count || 0);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [page, search, category]);

  useEffect(() => { load(); }, [load]);

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 mb-1 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-cyan-600" /> المقالات الصحية
          </h1>
          <p className="text-gray-500">محتوى طبي موثوق من صيادلتنا المعتمدين</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="ابحث في المقالات..."
              className="w-full pr-9 pl-3 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:border-cyan-500 shadow-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  category===c ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-cyan-400'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">لا توجد مقالات</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map(a => (
                <Link key={a._id} to={`/articles/${a.slug || a._id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  {a.image ? (
                    <img src={a.image} alt={a.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-cyan-400" />
                    </div>
                  )}
                  <div className="p-4">
                    {a.category && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full mb-2">
                        <Tag className="w-2.5 h-2.5" /> {a.category}
                      </span>
                    )}
                    <h2 className="font-bold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-cyan-700 transition-colors">
                      {a.title}
                    </h2>
                    {a.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{a.excerpt}</p>}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{fmt(a.createdAt)}</span>
                      {a.author?.name && <><span>·</span><span>{a.author.name}</span></>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40">
                  السابق
                </button>
                <span className="text-sm text-gray-500">صفحة {page} من {Math.ceil(total/12)}</span>
                <button onClick={() => setPage(p => p+1)} disabled={page*12>=total}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40">
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
