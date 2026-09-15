"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, User, Truck } from "lucide-react";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Badge } from "@/components/ui/badge";

interface PopularSchemeItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  maxAmount: string;
  interestRate: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
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
    subtitle: "Micro-Enterprises & Small Retail Vendors",
    maxAmount: "₹1.40L",
    interestRate: "6.5%",
    image: "/images/scheme_mcf.jpg",
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
    subtitle: "Affirmative Credit for Women Artisans",
    maxAmount: "₹1.40L",
    interestRate: "4.0%",
    image: "/images/scheme_msy.jpg",
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
    subtitle: "Medium Business, Machinery & Transport",
    maxAmount: "₹50.00L",
    interestRate: "8.0%",
    image: "/images/scheme_tls.jpg",
    icon: Truck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    spotlightColor: "rgba(16, 185, 129, 0.08)",
    href: "/calculator?scheme=TERM_LOAN",
  },
];

export function PopularSchemesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
      {POPULAR_SCHEMES.map((scheme) => {
        const Icon = scheme.icon;
        return (
          <Link key={scheme.id} href={scheme.href} className="group block h-full">
            <SpotlightCard
              spotlightColor={scheme.spotlightColor}
              className="h-full flex flex-col justify-between p-3 sm:p-4 border-slate-200/90 group-hover:border-slate-300 transition-all shadow-2xs rounded-2xl overflow-hidden bg-white/95"
            >
              <div>
                {/* Photo Header */}
                <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <Image
                    src={scheme.image}
                    alt={scheme.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                  <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[10px] font-extrabold text-slate-900 shadow-2xs">
                      {scheme.code}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="text-xs font-bold text-amber-300 drop-shadow-xs">
                      {scheme.interestRate} p.a.
                    </span>
                    <span className="text-[10px] font-medium bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      Up to {scheme.maxAmount}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                    {scheme.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {scheme.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-amber-700 group-hover:underline flex items-center">
                  Calculate EMI &rarr;
                </span>
                <div className={`p-1.5 rounded-lg ${scheme.iconBg} ${scheme.iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
            </SpotlightCard>
          </Link>
        );
      })}
    </div>
  );
}
