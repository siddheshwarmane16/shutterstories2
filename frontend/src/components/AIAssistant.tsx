'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          content: 'Welcome to Shutter Stories. I am your Editorial Visual Assistant. Ask me about our luxury packages, destination commissions, portfolio stories, or booking dates!',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: 'View Packages', text: 'What are your package details and pricing?' },
    { label: 'Udaipur Shoots', text: 'Have you covered weddings in Udaipur?' },
    { label: 'Custom Quote', text: 'How do I build a custom photography quote?' },
    { label: 'Travel Commissions', text: 'Do you travel worldwide for destination weddings?' },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      let reply = '';
      const query = text.toLowerCase();

      if (query.includes('package') || query.includes('pricing') || query.includes('cost') || query.includes('silver') || query.includes('gold') || query.includes('platinum')) {
        reply = 'We offer three main editorial tiers: \n\n• **Silver (₹150,000)**: Lead photographer, cinematic filmmaker, 8h coverage, and 3-min highlight film.\n• **Gold (₹350,000 - Recommended)**: 2 photographers, 2 filmmakers, drone, full-day coverage, 5-min trailer, and documentary film.\n• **Platinum (₹600,000)**: 3 photographers, 3 filmmakers, multi-day coverage, layflat laybook album, and lifetime portal access. \n\nYou can view details on our /pricing page.';
      } else if (query.includes('udaipur') || query.includes('palace') || query.includes('taj') || query.includes('rajasthan')) {
        reply = 'Yes, Udaipur is one of our most frequent destination backdrops! We have shot at the Taj Lake Palace, Jagmandir Island, and the Leela Palace. Our team is fully experienced with the lighting and grand setups of heritage Rajasthani palace weddings.';
      } else if (query.includes('custom') || query.includes('calculator') || query.includes('quote')) {
        reply = 'You can build a bespoke commission using our Interactive Quote Builder on the /pricing page. Simply toggle the number of crew members, ceremony days, drone capabilities, and custom layflat storybooks to generate a direct estimate.';
      } else if (query.includes('travel') || query.includes('worldwide') || query.includes('como') || query.includes('italy') || query.includes('destination')) {
        reply = 'We are available globally! Our team has documented visual stories across Lake Como (Italy), Milan, Paris, Bali, Cappadocia (Turkey), and various heritage sites in India. We handle all crew travel planning and logistics.';
      } else if (query.includes('book') || query.includes('appointment') || query.includes('consultation') || query.includes('date')) {
        reply = 'You can log a pre-production date query on our /book page! It will autoprovision a secure client portal credentials for you. Alternatively, click the WhatsApp button on the bottom right to chat directly with our lead producer.';
      } else {
        reply = 'I am trained on Shutter Stories luxury visuals. I can tell you about our pricing packages (Silver, Gold, Platinum), Udaipur destination shoots, custom quote building, global travel, or guide you to our Booking portal.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 z-[9990] flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#D4A44B] border border-[#D4A44B] shadow-lg shadow-[#D4A44B]/20 transition-all duration-300 hover:scale-110 hover:bg-[#D4A44B] hover:text-black focus:outline-none group"
        aria-label="Ask AI Assistant"
      >
        <span className="absolute inset-0 rounded-full border border-[#D4A44B] opacity-0 group-hover:animate-ping group-hover:opacity-70 pointer-events-none" />
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6 transition-transform group-hover:rotate-12" />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[520px] rounded-sm z-[9995] shadow-2xl flex flex-col justify-between overflow-hidden border border-[var(--border-color)] bg-[var(--chat-bg)] text-[var(--foreground)] backdrop-blur-xl animate-fade-in">
          
          {/* Header */}
          <div className="bg-black/90 p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full border border-[#D4A44B]/35 flex items-center justify-center bg-[#D4A44B]/10">
                <Sparkles className="h-4 w-4 text-[#D4A44B]" />
              </div>
              <div>
                <span className="font-editorial text-sm font-bold uppercase tracking-wider text-white">Visual AI Agent</span>
                <span className="block text-[8.5px] text-[#D4A44B] uppercase tracking-widest font-semibold mt-0.5">Online Consultation</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-neutral-900/5 dark:bg-neutral-950/20">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <div className="h-7 w-7 rounded-full border border-[#D4A44B]/20 bg-black flex items-center justify-center shrink-0 text-[#D4A44B]">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  
                  <div className={`max-w-[78%] p-3 rounded-sm text-xs leading-relaxed ${
                    isBot 
                      ? 'bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)]' 
                      : 'bg-[#D4A44B]/10 text-[var(--foreground)] border border-[#D4A44B]/25 ml-auto'
                  }`}>
                    {/* Render markdown bold tags nicely */}
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                        {line.split('**').map((chunk, ci) => 
                          ci % 2 === 1 ? <strong key={ci} className="text-[#D4A44B] font-semibold">{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  {!isBot && (
                    <div className="h-7 w-7 rounded-full border border-[var(--border-color)] bg-[var(--beige)] flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full border border-[#D4A44B]/20 bg-black flex items-center justify-center shrink-0 text-[#D4A44B]">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] p-3 rounded-sm text-xs flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-[#D4A44B] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-[#D4A44B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 bg-[#D4A44B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick reply tags */}
          <div className="px-4 py-2 border-t border-[var(--border-color)] flex gap-2 overflow-x-auto scrollbar-none shrink-0 bg-neutral-900/5">
            {quickPrompts.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(tag.text)}
                className="text-[9px] uppercase tracking-wider bg-[var(--beige)] hover:bg-[#D4A44B]/10 hover:text-[#D4A44B] hover:border-[#D4A44B]/40 px-3 py-1.5 rounded-sm border border-[var(--border-color)] shrink-0 transition-all cursor-pointer font-light"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-[var(--border-color)] bg-black/90 flex gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-neutral-900 border border-white/5 focus:border-[#D4A44B]/40 text-white text-xs px-3.5 py-2.5 rounded-sm outline-none placeholder-white/20"
            />
            <button
              type="submit"
              className="h-9 w-9 bg-white text-black hover:bg-[#D4A44B] rounded-sm flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
