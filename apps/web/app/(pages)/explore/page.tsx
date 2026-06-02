"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "@/components/Layout/Navbar";
import { ExploreSection, Main, PageContainer } from "@/app/styles";
import ExploreCreatorsHero from "@/components/Feature/ExploreCreators/Hero";
import RecentlyAdded from "@/components/Feature/ExploreCreators/RecentlyAdded";
import Footer from "@/components/Layout/Footer";
import TopCreators from "@/components/Feature/ExploreCreators/TopCreators";
import TrendingContent from "@/components/Feature/ExploreCreators/TrendingContent";
import LatestRelease from "@/components/Feature/ExploreCreators/LatestRelease";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  useEffect(() => {
    const sections = document.querySelectorAll(".reveal-section");
    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const elementsToAnimate = section.querySelectorAll(
          "h1, h2, h3, h4, h5, a, button, [class*='Card'], [class*='Grid'] > div, [class*='List'] > div",
        );

        if (elementsToAnimate.length > 0) {
          gsap.fromTo(
            elementsToAnimate,
            {
              opacity: 0,
              y: 40,
              scale: 0.96,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              onComplete: () => {
                gsap.set(elementsToAnimate, { clearProps: "transform" });
              },
            },
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
    >
      <PageContainer>
        <NavBar navTextTone={navTextTone} />
        <Main>
          <ExploreSection>
            <div ref={heroRef} className="reveal-section">
              <ExploreCreatorsHero showControls={false} />
            </div>
            <div ref={trendingRef} className="reveal-section">
              <TrendingContent />
            </div>
            <div className="reveal-section">
              <TopCreators />
            </div>
            <div className="reveal-section">
              <LatestRelease />
            </div>
            <div className="reveal-section">
              <RecentlyAdded />
            </div>
          </ExploreSection>
        </Main>
        <Footer />
      </PageContainer>
    </motion.div>
  );
}
