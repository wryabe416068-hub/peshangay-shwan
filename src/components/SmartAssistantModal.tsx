import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  CreditCard, 
  Gift, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Product, ShopSettings } from '../types';
import { formatPrice } from '../utils/helpers';

interface SmartAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  settings: ShopSettings;
  currency: 'IQD' | 'USD';
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedProducts?: Product[];
  actionLink?: {
    type: 'cart' | 'whatsapp' | 'product';
    label: string;
    payload?: any;
  };
}

export const SmartAssistantModal: React.FC<SmartAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
  settings,
  currency,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `سڵاو بەخێربێیت بۆ پێشەنگای شوان! 🌿\nمن یاریدەدەری زیرەکی پێشەنگام. چۆن دەتوانم ئەمڕۆ یارمەتیت بدەم؟ دەتوانیت دەربارەی نرخەکان، کاڵاکان، گەیاندن بۆ شارەکەت، یان پێشنیاری دیاری پرسیارم لێبکەیت.`,
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: '🔥 داشکاندن و ئۆفەرەکان', query: 'ئۆفەر و داشکاندنەکانتان چین؟' },
    { label: '⌚ کاتژمێری زیرەک', query: 'باشترین کاتژمێری زیرەکتان کامەیە؟' },
    { label: '🚚 گەیاندن بۆ شارەکان', query: 'گەیاندنتان بۆ کام شارانەیە و چەندە؟' },
    { label: '🎁 پێشنیاری دیاری', query: 'پێشنیاری دیارییەکی جوانم بۆ بکە' },
    { label: '💳 پارەدان بە فاستپەی یان FIB', query: 'چۆن بە فاستپەی یان FIB پارە بدەم؟' },
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateSmartAnswer(query);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const generateSmartAnswer = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    // 1. Delivery info
    if (q.includes('گەیاندن') || q.includes('دیلیڤەری') || q.includes('شار') || q.includes('delivery')) {
      return {
        id: `ans-${Date.now()}`,
        sender: 'assistant',
        text: `🚚 خزمەتگوزاری گەیاندنی پێشەنگای شوان زۆر خێرایە:\n\n• **هەولێر**: ٣,٠٠٠ د.ع (گەیاندن لە ماوەی ١ بۆ ٢٤ کاتژمێر)\n• **سلێمانی و دهۆک و زاخۆ**: ٤,٠٠٠ د.ع (٢٤ بۆ ٤٨ کاتژمێر)\n• **کەرکووک، هەڵەبجە، سۆران، ڕانیە، گەرمیان**: ٥,٠٠٠ د.ع\n\n✨ **خاڵی زێڕین**: ئەگەر بڕی کڕینەکەت بگاتە **١٠٠,٠٠٠ دینار**، گەیاندن بە خۆڕایی (بێ بەرامبەر) دەبێت!`,
      };
    }

    // 2. Payments (FastPay / FIB)
    if (q.includes('فاستپەی') || q.includes('fib') || q.includes('پارەدان') || q.includes('fastpay') || q.includes('سوپەر')) {
      return {
        id: `ans-${Date.now()}`,
        sender: 'assistant',
        text: `💳 شێوازەکانی پارەدان لە پێشەنگای شوان زۆر ئاسانن:\n\n1️⃣ **کاش لەکاتی وەرگرتن**: پارەکە بدە بە شۆفێری دیلیڤەری کاتێک کاڵاکەت بەردەست دەبێت و پشکنینت بۆ کرد.\n2️⃣ **فاستپەی (FastPay)**: بۆ ژمارەی ${settings.fastPayNumber || '0750 123 4567'} بە کۆدی QR ڕاستەوخۆ لە ناو ئەپەکە.\n3️⃣ **بانکی FIB (First Iraqi Bank)**: بە حیسابی ئەلیکترۆنی ${settings.fibAccountNumber || '9647501234567'}.\n4️⃣ **سوپەر کی (Super Qi)**.\n\nتەنانەت دەتوانیت لە کاتی داواکردن وێنەی وەسڵەکە ڕاستەوخۆ ئەپلۆد بکەیت!`,
      };
    }

    // 3. Watches / Electronics
    if (q.includes('کاتژمێر') || q.includes('watch') || q.includes('ئۆڵترا') || q.includes('زیرەک')) {
      const watches = products.filter(p => p.category === 'electronics' || p.category === 'watches-perfumes');
      return {
        id: `ans-${Date.now()}`,
        sender: 'assistant',
        text: `⌚ لێرەدا باشترین مۆدێلەکانی کاتژمێرمان هەیە! بۆ نموونە کاتژمێری زیرەکی Ultra 2 Pro بە بەستەری تیتانیۆم کە پشتگیری تەواوی زمانی کوردی دەکات و پەیوەندی و لێدانی دڵ دەپێوێت:`,
        suggestedProducts: watches.slice(0, 2),
      };
    }

    // 4. Discounts & Offers
    if (q.includes('داشکاندن') || q.includes('ئۆفەر') || q.includes('داشکاندنەکان') || q.includes('discount') || q.includes('کۆد')) {
      const saleProducts = products.filter(p => p.originalPriceIqd && p.originalPriceIqd > p.priceIqd);
      return {
        id: `ans-${Date.now()}`,
        sender: 'assistant',
        text: `🔥 ئێستا داشکاندنی نایابمان هەیە! دەتوانیت کۆدی داشکاندنی **SHWAN10** بەکاربهێنیت لە سەبەتەدا بۆ وەرگرتنی %١٠ داشکاندنی زیاتر.\n\nئەمەش چەند کاڵایەکی داشکێنراوە لە پێشەنگا:`,
        suggestedProducts: saleProducts.slice(0, 2),
      };
    }

    // 5. Gifts
    if (q.includes('دیاری') || q.includes('کادۆ') || q.includes('gift') || q.includes('سێت')) {
      const giftItems = products.filter(p => p.category === 'watches-perfumes' || p.titleKu.includes('دیاری') || p.titleKu.includes('بۆن'));
      return {
        id: `ans-${Date.now()}`,
        sender: 'assistant',
        text: `🎁 بۆ دیاری، سێتی کاتژمێر و قۆڵبەستی ڕۆز گۆڵد بە سندوقی کەشخەوە یان بۆنی فەڕەنسی شاهانە باشترین هەڵبژاردنن کە بە کڕیارە ئازیزەکانمان پێشنیار دەکەین:`,
        suggestedProducts: giftItems.slice(0, 2),
      };
    }

    // 6. General search match
    const matchedProducts = products.filter(p => 
      p.titleKu.toLowerCase().includes(q) || 
      p.descriptionKu.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (matchedProducts.length > 0) {
      return {
        id: `ans-${Date.now()}`,
        sender: 'assistant',
        text: `ئەم کاڵایانەم دۆزیەوە لە پێشەنگا کە لەگەڵ پرسیارەکەت دەگونجێن:`,
        suggestedProducts: matchedProducts.slice(0, 2),
      };
    }

    // Default friendly response
    return {
      id: `ans-${Date.now()}`,
      sender: 'assistant',
      text: `سوپاس بۆ پرسیارەکەت! هەموو کاڵاکانی پێشەنگای شوان بە گەرەنتی و کاڵای ڕەسەنن بە گەیاندنی خێرا بۆ هەموو کوردستان. دەتوانیت ڕاستەوخۆ لە ڕێگەی واتسئاپیشەوە لەگەڵ کاک شوان لە پەیوەندیدا بیت ئەگەر پرسیاری تایبەتت هەیە. 🌸`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="smart-assistant-modal"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[650px] text-right animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white">یاریدەدەری زیرەکی پێشەنگای شوان</h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  AI Online
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">وەڵامدەرەوەی خێرای نرخ و کاڵا و گەیاندن</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-3 py-2 bg-zinc-950/50 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 text-[11px] text-zinc-300 hover:text-amber-400 font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isUser 
                        ? 'bg-amber-500 text-black font-semibold rounded-tr-none' 
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Suggested Products Card Attachments */}
                  {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                    <div className="space-y-2 w-full">
                      {m.suggestedProducts.map((p) => (
                        <div 
                          key={p.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 transition-all gap-2"
                        >
                          <div 
                            className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                            onClick={() => {
                              onSelectProduct(p);
                              onClose();
                            }}
                          >
                            <img 
                              src={p.images[0]} 
                              alt={p.titleKu} 
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-900 shrink-0" 
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-white text-[11px] truncate">{p.titleKu}</h5>
                              <span className="text-amber-400 font-mono font-black text-[11px]">
                                {formatPrice(currency === 'USD' ? p.priceUsd : p.priceIqd, currency)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => onAddToCart(p)}
                            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold shrink-0 transition-colors"
                            title="زیادکردن بۆ سەبەتە"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 items-center text-zinc-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/90">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="پرسیارێک بنووسە دەربارەی کاڵاکان..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold transition-all"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
