"use client";

import React from "react";
import Link from "next/link";
import { Store, User, Truck, GraduationCap, ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Badge } from "@/components/ui/badge";

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
  spotlightColor: string;
  href: string;
}

const POPULAR_SCHEMES: PopularSchemeItem[] = [
  {
    id: "mcf",
    code: "MCF",
    title: "Micro Credit Finance",
    subtitle: "Micro-Enterprises & Small Vendors",
    maxAmount: "₹1.40L",
    interestRate: "6.5%",
    icon: Store,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    spotlightColor: "rgba(37, 99, 235, 0.08)",
    href: "/calculator?scheme=MCF",
  },
  {
    id: "msy",
    code: "MSY",
    title: "Mahila Samriddhi Yojana",
    subtitle: "Affirmative Credit for Women",
    maxAmount: "₹1.40L",
    interestRate: "4.0%",
    icon: User,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    spotlightColor: "rgba(217, 119, 6, 0.1)",
    href: "/calculator?scheme=MSY",
  },
  {
    id: "tls",
    code: "TLS",
    title: "Term Loan Scheme",
    subtitle: "Medium Business & Machinery",
    maxAmount: "₹50.00L",
    interestRate: "8.0%",
    icon: Truck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    spotlightColor: "rgba(16, 185, 129, 0.08)",
    href: "/calculator?scheme=TERM_LOAN",
  },
  {
    id: "els",
    code: "ELS",
    title: "Education Loan Scheme",
    subtitle: "Higher Technical & Professional Studies",
    maxAmount: "₹40.00L",
    interestRate: "6.5%",
    icon: GraduationCap,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
    spotlightColor: "rgba(99, 102, 241, 0.08)",
    href: "/calculator?scheme=ELS",
  },
];

export function PopularSchemesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Popular Schemes
          </h2>
          <p className="text-xs text-slate-500">
            Concessional credit windows under National Scheduled Castes Finance &amp; Development Corporation
          </p>
        </div>
        <Link
          href="/calculator"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
        >
          <span>Compare All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {POPULAR_SCHEMES.map((scheme) => {
          const Icon = scheme.icon;
          return (
            <Link key={scheme.id} href={scheme.href} className="group block">
              <SpotlightCard
                spotlightColor={scheme.spotlightColor}
                className="h-full flex flex-col justify-between p-5 border-slate-200/90 group-hover:border-slate-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className={`p-2.5 rounded-xl ${scheme.iconBg} ${scheme.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <Badge variant="outline" className="font-mono text-[10px] font-bold">
                      {scheme.code}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-1">
                    {scheme.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-4">
                    {scheme.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Up to</span>
                    <span className="font-bold text-slate-900">{scheme.maxAmount}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-sans block">Interest</span>
                    <span className="font-bold text-amber-700">{scheme.interestRate} p.a.</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
