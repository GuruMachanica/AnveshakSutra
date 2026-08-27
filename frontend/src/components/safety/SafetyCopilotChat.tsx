import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export const SafetyCopilotChat: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'AI' | 'USER'; text: string }>>([
    {
      sender: 'AI',
      text: "👋 Hi! I'm your Personal Safety Assistant. Ask me anything in plain English, like: \"Was my email in the boAt data leak?\", \"What should I do if Google Dark Web Report found my password?\", or \"How do I protect my WhatsApp against OTP scams?\"",
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'USER', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Here is what you should know in simple terms: Always use a unique password for each account, turn on 2-Factor Authentication, and never give SMS verification codes to anyone calling or texting you!";
      const q = userText.toLowerCase();

      if (q.includes('boat') || q.includes('boat lifestyle')) {
        reply = "🎧 About the boAt Lifestyle Breach (April 2024): A hacker named 'ShopifyGUY' dumped 7.5 million customer records on BreachForums. The leak contained customer names, phone numbers, email addresses, physical home delivery addresses, and order histories. What to do: 1) Watch out for fake courier/delivery SMS (scammers sending fake India Post / BlueDart links claiming unpaid customs). 2) Never share bank OTPs or UPI PINs with anyone claiming to confirm a boAt warranty or return. 3) Change your password on boAt and your email!";
      } else if (q.includes('google') || q.includes('dark web report') || q.includes('gmail') || q.includes('leaked')) {
        reply = "🔍 Google Dark Web Report Explanation: If Google Dark Web Report alerted you that your Gmail was leaked, it usually means an old website (like Naz.API combolists, Canva, Adobe, or a malware stealer dump) was breached. What to do right now: 1) Change your Google Account password. 2) Turn on 2-Step Verification (Passkeys or Authenticator App). 3) Go to myaccount.google.com/security and check 'Your Devices' to sign out of any device you don't recognize!";
      } else if (q.includes('whatsapp') || q.includes('phone') || q.includes('otp')) {
        reply = "📱 For WhatsApp & Phone Safety: Never share the 6-digit SMS code you receive with anyone, even if they claim to be WhatsApp Support or a friend. In WhatsApp Settings > Account > Two-Step Verification, set a custom PIN!";
      } else if (q.includes('instagram') || q.includes('social') || q.includes('hacked')) {
        reply = "📸 For Instagram: Go to Settings > Accounts Center > Password and Security. 1) Change your password to something strong. 2) Turn on Two-Factor Authentication. 3) Review 'Where You're Logged In' and log out of any unfamiliar phones or laptops!";
      }

      setChatMessages((prev) => [...prev, { sender: 'AI', text: reply }]);
    }, 600);
  };

  return (
    <div className="bg-[#1c1c1a] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-black font-bold shadow-lg shrink-0">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-sans">Ask Personal Safety Assistant</h3>
            <p className="text-[11px] sm:text-xs text-[#8e928e]">Ask any security question in plain English!</p>
          </div>
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
          ● AI ONLINE
        </span>
      </div>

      {/* Chat History Box */}
      <div className="space-y-2.5 max-h-60 sm:max-h-72 overflow-y-auto p-3 sm:p-4 bg-[#131312] border border-white/5 rounded-2xl">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'USER' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xl p-3 sm:p-3.5 rounded-2xl ${
                msg.sender === 'USER'
                  ? 'bg-white text-black font-medium rounded-tr-sm'
                  : 'bg-[#20201e] text-neutral-200 border border-white/10 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSendChat} className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask e.g. 'Was my email in the boAt data leak?'..."
          className="flex-1 bg-[#131312] border border-white/10 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-white placeholder-[#8e928e] focus:outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={!chatInput.trim()}
          className="bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-md shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
