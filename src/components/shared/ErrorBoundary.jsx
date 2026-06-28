import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-500 p-6">
          <AlertTriangle className="w-12 h-12 text-amber-400" />
          <h2 className="text-xl font-bold text-gray-700">حدث خطأ غير متوقع</h2>
          <p className="text-sm text-gray-400 text-center max-w-sm">
            {this.state.error?.message || 'يرجى تحديث الصفحة أو المحاولة لاحقاً'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700"
          >
            <RefreshCw className="w-4 h-4" /> إعادة التحميل
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
