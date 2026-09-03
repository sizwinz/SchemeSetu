"use client";

import React from "react";
import Link from "next/link";
import { Store, User, Truck, GraduationCap, ArrowRight } from "lucide-react";

interface PopularSchemeItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  maxAmount: string;
  interestRate: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  cornerGradient: string;
  href: string;
}

const POPULAR_SCHEMES: PopularSchemeItem[] = [
  {
    id: "mcf",
    code: "MCF",
    title: "Micro Credit Finance",
    subtitle: "MCF",
    maxAmount: "₹1.40L",
    interestRate: "6.5%",
    icon: Store,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    cornerGradient: "from-blue-50/70",
    href: "/calculator?scheme=MCF",
  },
  {
    id: "msy",
    code: "MSY",
    title: "Mahila Samriddhi Yojana",
    subtitle: "MSY • FOR WOMEN",
    maxAmount: "₹1.40L",
    interestRate: "4.0%",
    icon: User,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    cornerGradient: "from-orange-50/70",
    href: "/calculator?scheme=MSY",
  },
  {
    id: "tls",
    code: "TLS",
    title: "Term Loan Scheme",
    subtitle: "TLS",
    maxAmount: "₹50.00L",
    interestRate: "8.0%",
    icon: Truck,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    cornerGradient: "from-sky-50/70",
    href: "/calculator?scheme=TERM_LOAN",
  },
  {
    id: "els",
    code: "ELS",
    title: "Education Loan Scheme",
    subtitle: "ELS",
    maxAmount: "₹40.00L",
    interestRate: "6.5%",
    icon: GraduationCap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    cornerGradient: "from-amber-50/70",
    href: "/calculator?scheme=ELS",
  },
];

export function PopularSchemesGrid() {
  return (
    <section className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Popular Schemes
        </h2>
        <Link
          href="/assistant"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1"
        >
          <span>Find All Matches</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {POPULAR_SCHEMES.map((scheme) => {
          const Icon = scheme.icon;
          return (
            <Link
              key={scheme.id}
              href={scheme.href}
              className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Corner decorative gradient */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-radial ${scheme.cornerGradient} to-transparent opacity-80 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110`}
              />

              {/* Top Row: Icon & Header */}
              <div className="space-y-3 relative z-10">
                <div
                  className={`w-10 h-10 rounded-xl ${scheme.iconBg} ${scheme.iconColor} flex items-center justify-center`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                    {scheme.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    {scheme.subtitle}
                  </p>
                </div>
              </div>

              {/* Divider & Financial Terms */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-end justify-between font-mono tabular-nums relative z-10">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Up to</span>
                  <span className="text-sm font-bold text-slate-900">{scheme.maxAmount}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-sans block">Interest</span>
                  <span className="text-sm font-bold text-amber-600">{scheme.interestRate}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
