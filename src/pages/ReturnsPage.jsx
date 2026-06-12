import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, RotateCcw, Clock, CheckCircle, XCircle, ChevronRight, AlertCircle, Plus } from 'lucide-react';

const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Returns' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredReturns = returns.filter((r) =>
    activeTab === 'all' ? true : r.status === activeTab
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Returns</h1>
          </div>
          <p className="text-cyan-50 text-sm sm:text-base">
            Track and manage your return requests
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* New Return Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-dashed border-cyan-300 hover:border-cyan-500 text-cyan-600 hover:text-cyan-700 font-semibold py-3 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <Plus className="w-5 h-5" />
            Request a New Return
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Returns List */}
        {filteredReturns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-50 rounded-full mb-4">
              <Package className="w-10 h-10 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No returns found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              You haven't requested any returns yet. Returns for eligible orders can be requested within 14 days of delivery.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredReturns.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              const StatusIcon = statusConfig.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Order #{item.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Return Policy Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm mb-1">Return Policy</h4>
            <p className="text-blue-700 text-sm">
              Items can be returned within 14 days of delivery if unopened and unused. Medications and personal care items are non-returnable for safety reasons unless defective or incorrectly shipped.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnsPage;
