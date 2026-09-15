import React from "react";
import { TrendingUp, ShieldAlert, Heart, ExternalLink, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { NavTab } from "../types";
import { FinNewsLogo } from "./FinNewsLogo";

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenGlossary: () => void;
  onOpenSimplifyModal: () => void;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenGlossary,
  onOpenSimplifyModal,
  isDarkMode,
}) => {
  return (
    <footer className="glass-header border-t transition-colors mt-16 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div>
              <FinNewsLogo size="md" onClick={() => onSelectTab("home")} />
            </div>
            <p className="text-xs leading-relaxed max-w-md text-slate-800 dark:text-slate-200 font-semibold">
              FinNews AI is an AI-powered financial news simplification platform designed to convert complex market jargon, corporate earnings, and macroeconomic policies into easy, digestible takeaways.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-800 dark:text-slate-200 font-bold">
              <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-extrabold text-slate-950 dark:text-white">
                Version 1.0
              </span>
              <span>• Powered by Google Gemini AI</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <li>
                <button
                  onClick={() => onSelectTab("home")}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Home Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("latest")}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Latest Financial News
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("markets")}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Live Market Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("saved")}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Saved Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("about")}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  About FinNews AI
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Educational Tools */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white mb-3">
              Features & Tools
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <li>
                <button
                  onClick={onOpenSimplifyModal}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Simplify Any News URL
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGlossary}
                  className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Financial Terms Dictionary
                </button>
              </li>
              <li>
                <span className="text-slate-800 dark:text-slate-200">Multi-Language Summaries</span>
              </li>
              <li>
                <span className="text-slate-800 dark:text-slate-200">Sentiment Classification</span>
              </li>
              <li>
                <span className="text-slate-800 dark:text-slate-200">Interactive Gemini Chat</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Credit Row */}
        <div className="pt-6 border-t border-slate-300/40 dark:border-white/10 text-xs font-extrabold text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-purple-950 dark:text-purple-300 font-black tracking-wide">
              Designed by{" "}
              <a
                href="https://kunal-portfolio-6ab38.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                title="View Kunal Patil Portfolio"
                className="underline decoration-purple-500/60 hover:decoration-purple-600 hover:text-purple-700 dark:hover:text-purple-200 transition-all"
              >
                Kunal Patil
              </a>
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/in/kunal-patil-023873379?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="p-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-400/10 dark:hover:bg-blue-500 dark:text-blue-400 dark:hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=s0tok1b"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Profile"
                className="p-1.5 rounded-xl bg-pink-600/10 hover:bg-pink-600 text-pink-600 hover:text-white dark:bg-pink-400/10 dark:hover:bg-pink-500 dark:text-pink-400 dark:hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:kunalpatil1730@gmail.com"
                title="Send Email (kunalpatil1730@gmail.com)"
                className="p-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-400/10 dark:hover:bg-emerald-500 dark:text-emerald-400 dark:hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+919359200267"
                title="Call (+91 9359200267)"
                className="p-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-600 hover:text-white dark:bg-purple-400/10 dark:hover:bg-purple-500 dark:text-purple-400 dark:hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-slate-800 dark:text-slate-200">
            © {new Date().getFullYear()} FinNews AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
