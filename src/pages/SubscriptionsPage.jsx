import { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Calendar, Package, Pause, Play, Trash2, Plus, ChevronRight, Clock } from 'lucide-react';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredSubscriptions = subscriptions.filter((s) => s.status === activeTab);

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
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Subscriptions</h1>
          </div>
          <p className="text-cyan-50 text-sm sm:text-base">
            Manage your recurring medication and product deliveries
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* New Subscription Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-dashed border-cyan-300 hover:border-cyan-500 text-cyan-600 hover:text-cyan-700 font-semibold py-3 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <Plus className="w-5 h-5" />
            Set Up a New Subscription
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

        {/* Subscriptions List */}
        {filteredSubscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-50 rounded-full mb-4">
              <Repeat className="w-10 h-10 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No subscriptions yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Set up automatic recurring deliveries for your regular medications and never run out again.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredSubscriptions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Delivered every {item.frequency}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    Next delivery: {item.nextDelivery}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-700 px-3 py-1.5 rounded-lg hover:bg-cyan-50 transition-colors">
                      {item.status === 'active' ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Resume
                        </>
                      )}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Subscription Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-xl mb-3">
              <Repeat className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm mb-1">Never Run Out</h4>
            <p className="text-gray-500 text-xs">Automatic refills on your schedule</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-xl mb-3">
              <Calendar className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm mb-1">Flexible Timing</h4>
            <p className="text-gray-500 text-xs">Pause, skip, or adjust anytime</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-xl mb-3">
              <Package className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm mb-1">Priority Packing</h4>
            <p className="text-gray-500 text-xs">Subscriptions are prepared first</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
