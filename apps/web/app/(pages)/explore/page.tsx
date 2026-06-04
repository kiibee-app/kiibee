"use client";

import React, { Suspense, useEffect } from "react";
import gsap from "gsap";
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

const REVEAL_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "a",
  "button",
  "[class*='Card']",
  "[class*='Grid'] > div",
  "[class*='List'] > div",
].join(", ");

const REVEAL_FROM: gsap.TweenVars = {
  opacity: 0,
  y: 40,
  scale: 0.96,
};

const REVEAL_TO: gsap.TweenVars = {
  opacity: 1,
  y: 0,
  scale: 1,
  duration: 0.8,
  stagger: 0.08,
  ease: "power2.out",
};

const SCROLL_TRIGGER_CONFIG: ScrollTrigger.Vars = {
  start: "top 85%",
  toggleActions: "play none none none",
};

function animateSection(section: Element): void {
  const elements = section.querySelectorAll(REVEAL_SELECTOR);
  if (elements.length === 0) return;

  gsap.fromTo(elements, REVEAL_FROM, {
    ...REVEAL_TO,
    scrollTrigger: { trigger: section, ...SCROLL_TRIGGER_CONFIG },
    onComplete: () => gsap.set(elements, { clearProps: "transform" }),
  });
}

export default function ExplorePage() {
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sections = document.querySelectorAll(".reveal-section");
    const ctx = gsap.context(() => sections.forEach(animateSection));
    return () => ctx.revert();
  }, []);

  return (
    <PageContainer>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <ExploreSection>
          <div ref={heroRef}>
            <ExploreCreatorsHero showControls={false} />
          </div>
          <div ref={trendingRef} className="reveal-section">
            <TrendingContent />
          </div>
          <div className="reveal-section">
            <TopCreators />
          </div>
          <Suspense fallback={null}>
            <div className="reveal-section">
              <LatestRelease />
            </div>
          </Suspense>
          <div className="reveal-section">
            <RecentlyAdded />
          </div>
        </ExploreSection>
      </Main>
      <Footer />
    </PageContainer>
  );
}
