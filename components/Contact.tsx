import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "hello@dev.studio";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between h-full p-2 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <Sparkles className="w-6 h-6 text-neutral-900" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 uppercase">Let's Talk</h3>
        </div>
        <p className="text-neutral-600 text-lg font-light leading-relaxed max-w-md">
          Have a vision? Let's break the internet together. <br/>
          <span className="font-semibold text-neutral-900">Available for Q3 2024.</span>
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="group relative w-full mt-auto py-4 px-6 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between transition-all hover:shadow-lg active:scale-95 overflow-hidden"
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-40 transition-opacity duration-500">
            <div className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-transparent via-neutral-100 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>

        <span className="text-neutral-600 font-mono text-base group-hover:text-black transition-colors relative z-10 font-bold">
          {email}
        </span>
        <div className="relative z-10">
          <AnimatePresence mode='wait'>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Check className="w-5 h-5 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Copy className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Confetti bursts */}
          <AnimatePresence>
            {copied && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-neutral-900 rounded-full"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 100,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
};

export default Contact;