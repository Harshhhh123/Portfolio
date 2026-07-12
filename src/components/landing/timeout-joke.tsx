"use client";

import { motion } from "framer-motion";

export function TimeoutJoke() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]/95 p-6 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 font-mono text-sm text-white/50"
        >
          No selection detected. Auto-selecting cost-optimal provider...
        </motion.p>

        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="w-full max-w-sm rounded-xl border border-white/15 bg-gradient-to-br from-[#241a10] to-[#120d08] p-6"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b6b3d] text-sm font-bold text-[#120d08]">
              ₹0
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40">
                Vendor
              </p>
              <h3 className="text-base font-semibold text-white">
                FrugalCloud&trade; -- Cousin&apos;s Gaming PC
              </h3>
            </div>
          </div>
          <ul className="space-y-1.5 text-left text-sm text-white/60">
            <li>Uptime: whenever he&apos;s not gaming</li>
            <li>Region: under-the-study-table-1</li>
            <li>Free tier: forever, because it was never actually a cloud</li>
            <li>SLA: verbal, and not enforceable</li>
          </ul>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 font-mono text-sm text-white/50"
        >
          Just kidding. Choose wisely.
        </motion.p>
      </div>
    </motion.div>
  );
}
