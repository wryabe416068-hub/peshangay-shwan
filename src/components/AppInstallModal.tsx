import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Apple, 
  Play, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Layers,
  Sparkles,
  ChevronLeft,
  Copy,
  Check
} from 'lucide-react';
import { ShopSettings } from '../types';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'store'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Detect if already installed / standalone
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Auto-detect OS to switch tab by default
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveTab('ios');
    } else if (/android/.test(ua)) {
      setActiveTab('android');
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    }
  };

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                دابەزاندنی ئەپ بۆ هەردوو سیستەم
              </h2>
              <p className="text-xs text-zinc-400">
                iPhone (iOS) و Android بە بێ باگ و بە خێرایی باڵا
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-2 bg-zinc-900/90 border-b border-zinc-800 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>ئایفۆن (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'android'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>ئەندرۆید (Android)</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'store'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Play Store / APK</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-right">
          {/* iOS Instructions */}
          {activeTab === 'ios' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-2xl shadow-lg shrink-0">
                  ش
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">ئەپی فەرمی پێشەنگای شوان بۆ iPhone</h4>
                  <p className="text-xs text-zinc-400">
                    ڕاستەوخۆ وەک بەرنامەی ڕاستەقینە دادەبەزێتە سەر شاشەی سەرەکی و بێ وێبگەڕ دەکرێتەوە.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  هەنگاوەکانی دابەزاندن لەسەر ئایفۆن و ئایپاد:
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ١
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-200 block">
                      ماڵپەڕەکە لە وێبگەڕی Safari ی ئایفۆنەکەت بکەرەوە
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      (تێبینی: پێویستە لە Safari بێت بۆ ئەوەی دوگمەی خستنەسەر شاشە کار بکات).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ٢
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      دوگمەی هاوبەشکردن <Share2 className="w-3.5 h-3.5 text-amber-400 inline" /> (Share) دابگرە
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      ئەم دوگمەیە دەکەوێتە خوارەوەی شاشەی سەفاری (نیشانەی چوارگۆشە و تیرێک بۆ سەرەوە).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ٣
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      کلیک لەسەر <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> "Add to Home Screen" بکە
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      لە لیستەکە کەمێک بڕۆ خوارەوە، دەبینیت نووسراوە "Add to Home Screen" یان (زیادکردن بۆ پەڕەی سەرەکی).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-300 block">
                      لە سەرەوەی ڕاست کلیک لەسەر "Add" بکە
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      ئایکۆنی زێڕینی پێشەنگای شوان دەچێتە ناو ئەپەکانی ئایفۆنەکەت و بە خێرایی دەکرێتەوە!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Instructions */}
          {activeTab === 'android' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Direct Install Button if supported */}
              {deferredPrompt && (
                <div className="p-4 bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/40 rounded-xl flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 block">ئامادەیە بۆ داگرتن!</span>
                    <span className="text-[11px] text-zinc-300">بە یەک کلیک دابەزێنە سەر ئەندرۆید</span>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>داگرتنی ڕاستەوخۆ</span>
                  </button>
                </div>
              )}

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-2xl shadow-lg shrink-0">
                  ش
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">ئەپی فەرمی پێشەنگای شوان بۆ Android</h4>
                  <p className="text-xs text-zinc-400">
                    بۆ هەموو مۆبایلەکانی سامسۆنگ، شیاومی، هواوی و هەموو جۆرە ئەندرۆیدێک.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  هەنگاوەکانی دابەزاندن لەسەر ئەندرۆید:
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ١
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-200 block">
                      لە وێبگەڕی Google Chrome ئەپەکە بکەرەوە
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      کلیک لە سێ خاڵەکەی بەشی سەرەوەی ڕاست یان چەپ بکە (⋮).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ٢
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-200 block">
                      کلیک لەسەر "Install App" یان "Add to Home screen" بکە
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      (یان بە کوردی: "دامەزراندنی ئەپ" یان "زیادکردن بۆ پەڕەی سەرەکی").
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-300 block">
                      تەئکیدی بکەوە بە داگرتنی "Install"
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      ئەپەکە وەک بەرنامەیەکی فەرمی دادەبەزێتە سەر شاشەت و بە تەواوی شاشە کار دەکات.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store / APK Instructions */}
          {activeTab === 'store' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>دروستکردنی فایلی فەرمی APK / AAB بۆ Google Play و App Store</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ئەم ئەپە بە ستانداردی جیهانی PWA (Progressive Web App) دروستکراوە. دەتوانیت بە یەک لەم دوو ڕێگەیە فایلی ئەپ ستۆر و گوگڵ پلەی لێ دروست بکەیت:
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: PWABuilder */}
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <span>ڕێگەی ١ (خێراترین و بێ کۆد): بەکارهێنانی PWABuilder</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-bold border border-emerald-500/20">
                      پێشنیارکراو
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    ماڵپەڕی <strong>pwabuilder.com</strong> لەلایەن مایکرۆسۆفتەوە دروستکراوە. تەنها لینکی ئەم ئەپەی تێدا دابنێ:
                  </p>
                  <ol className="text-[11px] text-zinc-400 space-y-1 list-decimal list-inside pr-1">
                    <li>سەردانی ماڵپەڕی <span className="text-amber-300 font-mono">pwabuilder.com</span> بکە</li>
                    <li>لینکی ئەپەکەت کۆپی بکە و لێی بدە</li>
                    <li>کلیک لە <strong>Package for Stores</strong> بکە</li>
                    <li>فایلی <strong className="text-white">Android (.aab / .apk)</strong> و <strong className="text-white">iOS Package</strong> دادەبەزێت کە دەتوانیت ڕاستەوخۆ بیخەیتە سەر Google Play Console و App Store Connect!</li>
                  </ol>
                </div>

                {/* Option 2: Capacitor Native */}
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">
                    ڕێگەی ٢: گۆڕین بۆ ئەپی نەیتیڤ بە Capacitor (پڕۆفێشناڵ)
                  </span>
                  <p className="text-[11px] text-zinc-300">
                    دەتوانیت پڕۆژەکە دابەزێنیت لە مێنیوی Settings بە شێوەی ZIP یان GitHub، و ئەم کۆدانە لێبدەیت:
                  </p>
                  <div className="p-2.5 rounded-lg bg-black font-mono text-[11px] text-zinc-300 dir-ltr text-left overflow-x-auto space-y-1 border border-zinc-800">
                    <div className="text-emerald-400"># دامەزراندنی Capacitor</div>
                    <div>npm install @capacitor/core @capacitor/cli</div>
                    <div>npm install @capacitor/android @capacitor/ios</div>
                    <div>npx cap init "Peshangay Shwan" "com.shwan.app"</div>
                    <div>npm run build</div>
                    <div>npx cap add android</div>
                    <div>npx cap add ios</div>
                    <div className="text-emerald-400"># کردنەوە لە Android Studio بۆ هەناردەکردنی APK</div>
                    <div>npx cap open android</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyAppUrl}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">لینکی ئەپ کۆپی کرا!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>کۆپیکردنی لینکی ئەپ</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all"
          >
            داخستن
          </button>
        </div>
      </div>
    </div>
  );
};
