// import { useCallback, useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { createPlan } from '../../services/super-admin/adminService';
// import axios from 'axios';

// function SuperAdminPlanCreate() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [actionError, setActionError] = useState(null);

//   // Form States
//   const [planName, setPlanName] = useState('');
//   const [planDescription, setPlanDescription] = useState('');
//   const [planStatus, setPlanStatus] = useState('Active');
//   const [planPrice, setPlanPrice] = useState('');
//   const [numOfTokens, setNumOfTokens] = useState('');
//   const [trialDays, setTrialDays] = useState('');
//   const [developmentprice, setDevelopmentPrice] = useState('');
  
//   const [features, setFeatures] = useState([]);
//   const [selectedFeatures, setSelectedFeatures] = useState([]);

//   // الحالات الخاصة بنماذج الذكاء الاصطناعي من الـ Endpoint الجديدة
//   const [aiModelsList, setAiModelsList] = useState([]);
//   const [selectedAiModels, setSelectedAiModels] = useState([]);

//   // جلب الفيتشرز ونماذج الذكاء الاصطناعي
//   const loadData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
//       const headers = { Authorization: `Bearer ${token}` };

//       // 1. جلب الفيتشرز من الـ Backend الأساسي
//       const featuresRes = await axios.get('https://aisales123.runasp.net/api/admin/features', { headers });
//       const featuresResult = featuresRes.data;
//       const featuresArr = Array.isArray(featuresResult) 
//         ? featuresResult 
//         : featuresResult?.items || featuresResult?.data || featuresResult?.features || [];
//       setFeatures(featuresArr);

//       // 2. جلب مزودي ونماذج الذكاء الاصطناعي من المسار الجديد مع معالجة الهيكل الحالي (supported_models)
//       try {
//         const modelsRes = await axios.get('/api-ai/api/v1/ai/providers', { headers });
//         const modelsResult = modelsRes.data;
        
//         let modelsArr = [];
//         if (Array.isArray(modelsResult)) {
//           modelsArr = modelsResult;
//         } else {
//           modelsArr = modelsResult?.items || modelsResult?.data || modelsResult?.models || modelsResult?.providers || [];
//         }

//         const formattedModels = [];
//         modelsArr.forEach((item) => {
//           if (typeof item === 'string') {
//             formattedModels.push(item);
//           } else if (typeof item === 'object' && item !== null) {
//             const modelsList = item.supported_models || item.models;
//             if (Array.isArray(modelsList)) {
//               modelsList.forEach((m) => {
//                 if (typeof m === 'string') {
//                   formattedModels.push(m);
//                 } else if (m && typeof m === 'object') {
//                   formattedModels.push(m.name || m.modelName || m.id);
//                 }
//               });
//             } else {
//               formattedModels.push(item.name || item.provider || item.modelName || item.id);
//             }
//           }
//         });

//         const uniqueModels = [...new Set(formattedModels)].filter(Boolean);
//         setAiModelsList(uniqueModels.length > 0 ? uniqueModels : ['GPT-4o', 'GPT-4o-mini', 'Claude-3.5-Sonnet', 'Gemini-1.5-Pro']);
//       } catch (modelErr) {
//         setAiModelsList(['GPT-4o', 'GPT-4o-mini', 'Claude-3.5-Sonnet', 'Gemini-1.5-Pro']);
//       }

//     } catch (err) {
//       setError('Failed to load data from server.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const handleFeatureToggle = (featureId) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
//     );
//   };

//   const handleModelToggle = (modelName) => {
//     setSelectedAiModels((prev) =>
//       prev.includes(modelName) ? prev.filter((m) => m !== modelName) : [...prev, modelName]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setActionError(null);

//     const payload = {
//       planName,
//       planDescription,
//       planStatus,
//       planPrice: Number(planPrice) || 0,
//       numOfTokens: Number(numOfTokens) || 0,
//       trialDays: Number(trialDays) || 0,
//       developmentprice: Number(developmentprice) || 0,
//       aiModels: selectedAiModels,
//       featureIds: selectedFeatures,
//     };

//     try {
//       await createPlan(payload);
//       navigate('/admin/subscriptions');
//     } catch (err) {
//       setActionError(err.message || 'Failed to create plan');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      
//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2">
//         <Link
//           to="/admin/subscriptions"
//           className="text-slate-500 text-xs md:text-sm font-semibold hover:text-indigo-600 transition-colors flex items-center gap-1"
//         >
//           <span className="material-symbols-outlined text-sm">arrow_back</span>
//           Subscriptions & Plans
//         </Link>
//         <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
//         <span className="text-indigo-600 font-bold text-xs md:text-sm">Create New Plan</span>
//       </nav>

//       {/* Page Header */}
//       <div className="flex justify-between items-end flex-wrap gap-4 pb-2 border-b border-slate-200/80">
//         <div>
//           <h1 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
//             Create Subscription Plan
//           </h1>
//           <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
//             Configure pricing tier, parameter limits, and feature access for merchants.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link
//             to="/admin/subscriptions"
//             className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
//           >
//             Cancel
//           </Link>
//           <button
//             type="submit"
//             disabled={submitting}
//             form="plan-create-form"
//             className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
//           >
//             {submitting ? (
//               <>
//                 <span className="material-symbols-outlined animate-spin text-lg">sync</span>
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
//                   add_circle
//                 </span>
//                 Create Plan
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Action Error Alert */}
//       {actionError && (
//         <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center gap-2 shadow-sm">
//           <span className="material-symbols-outlined text-lg text-rose-500">error</span>
//           {actionError}
//         </div>
//       )}

//       {/* Global Error Alert */}
//       {error && (
//         <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-2">
//             <span className="material-symbols-outlined text-lg text-rose-500">error</span>
//             {error}
//           </div>
//           <button onClick={loadData} className="text-xs underline font-bold">Retry</button>
//         </div>
//       )}

//       {/* Create Plan Form */}
//       <form
//         id="plan-create-form"
//         onSubmit={handleSubmit}
//         className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/85 shadow-sm space-y-6"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//               Plan Name <span className="text-rose-500">*</span>
//             </label>
//             <input
//               type="text"
//               required
//               value={planName}
//               onChange={(e) => setPlanName(e.target.value)}
//               placeholder="e.g. Scale Plan"
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//               Plan Price ($) <span className="text-rose-500">*</span>
//             </label>
//             <input
//               type="number"
//               required
//               min="0"
//               step="any"
//               value={planPrice}
//               onChange={(e) => setPlanPrice(e.target.value)}
//               placeholder="100"
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//               Number of Tokens
//             </label>
//             <input
//               type="number"
//               min="0"
//               value={numOfTokens}
//               onChange={(e) => setNumOfTokens(e.target.value)}
//               placeholder="50000"
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//               Trial Days
//             </label>
//             <input
//               type="number"
//               min="0"
//               value={trialDays}
//               onChange={(e) => setTrialDays(e.target.value)}
//               placeholder="14"
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//               Development Price ($)
//             </label>
//             <input
//               type="number"
//               min="0"
//               step="any"
//               value={developmentprice}
//               onChange={(e) => setDevelopmentPrice(e.target.value)}
//               placeholder="0"
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
//             />
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//             Plan Status
//           </label>
//           <select
//             value={planStatus}
//             onChange={(e) => setPlanStatus(e.target.value)}
//             className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium cursor-pointer"
//           >
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>

//         {/* AI Models Selection List */}
//         <div className="space-y-3 pt-2">
//           <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
//             Included AI Models ({aiModelsList.length})
//           </label>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
//             {loading ? (
//               <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center">
//                 Loading AI models...
//               </p>
//             ) : aiModelsList.length === 0 ? (
//               <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center border border-dashed border-slate-200 rounded-xl">
//                 No AI models found.
//               </p>
//             ) : (
//               aiModelsList.map((modelName) => {
//                 const isChecked = selectedAiModels.includes(modelName);
//                 return (
//                   <div
//                     key={modelName}
//                     onClick={() => handleModelToggle(modelName)}
//                     className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
//                       isChecked
//                         ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
//                         : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div
//                         className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
//                           isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
//                         }`}
//                       >
//                         {isChecked && <span className="material-symbols-outlined text-sm">check</span>}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-xs font-bold text-slate-900 truncate">{modelName}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//             Plan Description <span className="text-rose-500">*</span>
//           </label>
//           <textarea
//             rows={3}
//             required
//             value={planDescription}
//             onChange={(e) => setPlanDescription(e.target.value)}
//             placeholder="Target audience and highlight features..."
//             className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none resize-none leading-relaxed font-medium"
//           />
//         </div>

//         {/* Features Selection List */}
//         <div className="space-y-3 pt-2">
//           <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
//             Included Feature Modules ({features.length})
//           </label>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
//             {loading ? (
//               <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center">
//                 Loading all features...
//               </p>
//             ) : features.length === 0 ? (
//               <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center border border-dashed border-slate-200 rounded-xl">
//                 No features found from API.
//               </p>
//             ) : (
//               features.map((feature) => {
//                 const isChecked = selectedFeatures.includes(feature.id);
//                 return (
//                   <div
//                     key={feature.id}
//                     onClick={() => handleFeatureToggle(feature.id)}
//                     className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
//                       isChecked
//                         ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
//                         : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div
//                         className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
//                           isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
//                         }`}
//                       >
//                         {isChecked && <span className="material-symbols-outlined text-sm">check</span>}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-xs font-bold text-slate-900 truncate">{feature.name || feature.featureName}</p>
//                         <p className="text-[11px] text-slate-500 truncate font-medium">{feature.description || feature.code}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </form>

//     </div>
//   );
// }

// export default SuperAdminPlanCreate;

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPlan } from '../../services/super-admin/adminService';
import axios from 'axios';

function SuperAdminPlanCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Form States
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planStatus, setPlanStatus] = useState('Active');
  const [planPrice, setPlanPrice] = useState('');
  const [numOfTokens, setNumOfTokens] = useState('');
  const [trialDays, setTrialDays] = useState('');
  const [developmentprice, setDevelopmentPrice] = useState('');
  
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // الحالات الخاصة بمزودي الذكاء الاصطناعي الأساسيين
  const [aiModelsList, setAiModelsList] = useState([]);
  const [selectedAiModels, setSelectedAiModels] = useState([]);

  // جلب الفيتشرز ومزودي الذكاء الاصطناعي الأساسيين
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. جلب الفيتشرز وتصفية النشطة فقط بناءً على enabled أو status
      const featuresRes = await axios.get('https://aisales123.runasp.net/api/admin/features', { headers });
      const featuresResult = featuresRes.data;
      const featuresArr = Array.isArray(featuresResult) 
        ? featuresResult 
        : featuresResult?.items || featuresResult?.data || featuresResult?.features || [];
      
      // تصفية الفيتشرز بحيث يتم جلب الفيتشرز النشطة فقط (تستبعد التي يكون فيها enabled يساوي false)
      const activeFeatures = featuresArr.filter((feature) => {
        if (typeof feature.enabled === 'boolean') {
          return feature.enabled === true;
        }
        if (typeof feature.status === 'string') {
          return feature.status.toLowerCase() === 'active';
        }
        if (typeof feature.isActive === 'boolean') {
          return feature.isActive === true;
        }
        return true; 
      });

      setFeatures(activeFeatures);

      // 2. جلب المزودين الأساسيين (Providers) من المسار الجديد
      try {
        const modelsRes = await axios.get('/api-ai/api/v1/ai/providers', { headers });
        const modelsResult = modelsRes.data;
        
        let modelsArr = [];
        if (Array.isArray(modelsResult)) {
          modelsArr = modelsResult;
        } else {
          modelsArr = modelsResult?.items || modelsResult?.data || modelsResult?.models || modelsResult?.providers || [];
        }

        const formattedProviders = [];
        modelsArr.forEach((item) => {
          if (typeof item === 'string') {
            formattedProviders.push(item);
          } else if (typeof item === 'object' && item !== null) {
            const providerName = item.provider || item.name || item.id;
            if (providerName) {
              formattedProviders.push(providerName);
            }
          }
        });

        const uniqueProviders = [...new Set(formattedProviders)].filter(Boolean);
        setAiModelsList(uniqueProviders.length > 0 ? uniqueProviders : ['openai', 'azure', 'gemini', 'claude']);
      } catch (modelErr) {
        setAiModelsList(['openai', 'azure', 'gemini', 'claude']);
      }

    } catch (err) {
      setError('Failed to load data from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  const handleModelToggle = (modelName) => {
    setSelectedAiModels((prev) =>
      prev.includes(modelName) ? prev.filter((m) => m !== modelName) : [...prev, modelName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError(null);

    const payload = {
      planName,
      planDescription,
      planStatus,
      planPrice: Number(planPrice) || 0,
      numOfTokens: Number(numOfTokens) || 0,
      trialDays: Number(trialDays) || 0,
      developmentprice: Number(developmentprice) || 0,
      aiModels: selectedAiModels,
      featureIds: selectedFeatures,
    };

    try {
      await createPlan(payload);
      navigate('/admin/subscriptions');
    } catch (err) {
      setActionError(err.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2">
        <Link
          to="/admin/subscriptions"
          className="text-slate-500 text-xs md:text-sm font-semibold hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Subscriptions & Plans
        </Link>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <span className="text-indigo-600 font-bold text-xs md:text-sm">Create New Plan</span>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-end flex-wrap gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Create Subscription Plan
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
            Configure pricing tier, parameter limits, and feature access for merchants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/subscriptions"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            form="plan-create-form"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                Creating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  add_circle
                </span>
                Create Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-lg text-rose-500">error</span>
          {actionError}
        </div>
      )}

      {/* Global Error Alert */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 font-medium flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-rose-500">error</span>
            {error}
          </div>
          <button onClick={loadData} className="text-xs underline font-bold">Retry</button>
        </div>
      )}

      {/* Create Plan Form */}
      <form
        id="plan-create-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/85 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Plan Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Scale Plan"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Plan Price ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
              placeholder="100"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Number of Tokens
            </label>
            <input
              type="number"
              min="0"
              value={numOfTokens}
              onChange={(e) => setNumOfTokens(e.target.value)}
              placeholder="50000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Trial Days
            </label>
            <input
              type="number"
              min="0"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              placeholder="14"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Development Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={developmentprice}
              onChange={(e) => setDevelopmentPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Plan Status
          </label>
          <select
            value={planStatus}
            onChange={(e) => setPlanStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* AI Providers Selection List */}
        <div className="space-y-3 pt-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Included AI Providers ({aiModelsList.length})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
            {loading ? (
              <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center">
                Loading AI providers...
              </p>
            ) : aiModelsList.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center border border-dashed border-slate-200 rounded-xl">
                No AI providers found.
              </p>
            ) : (
              aiModelsList.map((providerName) => {
                const isChecked = selectedAiModels.includes(providerName);
                return (
                  <div
                    key={providerName}
                    onClick={() => handleModelToggle(providerName)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <span className="material-symbols-outlined text-sm">check</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wide truncate">{providerName}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Plan Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            placeholder="Target audience and highlight features..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none resize-none leading-relaxed font-medium"
          />
        </div>

        {/* Features Selection List (Active Only) */}
        <div className="space-y-3 pt-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Included Feature Modules ({features.length})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
            {loading ? (
              <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center">
                Loading active features...
              </p>
            ) : features.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium col-span-2 py-4 text-center border border-dashed border-slate-200 rounded-xl">
                No active features found.
              </p>
            ) : (
              features.map((feature) => {
                const isChecked = selectedFeatures.includes(feature.id);
                return (
                  <div
                    key={feature.id}
                    onClick={() => handleFeatureToggle(feature.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <span className="material-symbols-outlined text-sm">check</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{feature.name || feature.featureName}</p>
                        <p className="text-[11px] text-slate-500 truncate font-medium">{feature.description || feature.code}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </form>

    </div>
  );
}

export default SuperAdminPlanCreate;