import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Camera, X, CheckCircle, Clock, AlertCircle, FileImage, Trash2, Loader2 } from 'lucide-react';
import { prescriptionsApi } from '../api/prescriptions';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const PrescriptionUploadPage = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch the user's existing prescriptions on mount
  useEffect(() => {
    if (!user) return;
    prescriptionsApi.getMy()
      .then(d => {
        const list = Array.isArray(d) ? d : (d.prescriptions || d.data || []);
        setPrescriptions(list);
      })
      .catch(() => toast.error('Failed to load prescriptions'));
  }, [user]);

  const processFiles = async (files) => {
    if (!user) { toast.error('Please log in to upload prescriptions'); return; }
    const validFiles = Array.from(files).filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} exceeds the 10 MB limit`);
        return false;
      }
      return true;
    });
    if (!validFiles.length) return;

    setUploading(true);
    for (const file of validFiles) {
      try {
        const formData = new FormData();
        formData.append('images', file);
        const result = await prescriptionsApi.create(formData);
        const saved = result.prescription || result.data || result;
        // Normalise fields the card renderer expects
        if (!saved.fileName) saved.fileName = file.name;
        if (!saved.uploadDate) saved.uploadDate = new Date().toLocaleDateString('en-GB');
        setPrescriptions(prev => [saved, ...prev]);
        toast.success(`${file.name} uploaded`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Under Review' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Approved' };
      case 'rejected':
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Needs Attention' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: status };
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Prescription Upload</h1>
          </div>
          <p className="text-cyan-50 text-sm sm:text-base">
            Upload your prescription and we'll prepare your order for review
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`bg-white rounded-3xl shadow-sm border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/30'
            }`}
          >
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={handleFileChange} />
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-50 rounded-full mb-4">
              <Upload className="w-10 h-10 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Drag and drop your prescription here
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              or click to browse files (JPG, PNG,  max 10MB)PDF 
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button disabled={uploading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Browse Files'}
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-50 transition-all">
                <Camera className="w-4 h-4" />
                Take a Photo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Uploaded Prescriptions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Prescriptions</h2>

          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
                <FileImage className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No prescriptions uploaded</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Once you upload a prescription, it will appear here with its review status.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((item, index) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.fileName}</h4>
                          <p className="text-sm text-gray-500">Uploaded {item.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm mb-1">How it works</h4>
            <p className="text-blue-700 text-sm">
              Upload a clear photo or scan of your prescription. Our licensed pharmacists will review it within a few hours and contact you to confirm your order before dispensing.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrescriptionUploadPage;
