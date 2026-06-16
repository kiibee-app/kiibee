"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import { Main, Section } from "@/app/styles";
import Footer from "@/components/Layout/Footer";
import { useExploreNavTone } from "@/hooks/useExploreNavTone";
import { useTranslation } from "react-i18next";
import { useFormatContent } from "@/hooks/feed/useFormatContent";
import {
  Grid,
  PageWrapper,
} from "@/components/Feature/ExploreCreators/Creators/styles";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { MonoText } from "@/components/UI/Monotext";
import { ResultsState } from "@/components/Feature/ExploreCreators/LatestRelease/styles";
import SearchBar from "@/components/UI/SearchBar";
import SortDropdown from "@/components/UI/SortDropdown";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";
import { CREATORS } from "@/utils/translationKeys";
import {
  Hero,
  HeroTitleText,
  Inner,
  Content,
  Title,
  Controls,
} from "@/components/Feature/ExploreCreators/Hero/styles";
import { LocalPageContainer } from "@/app/(pages)/explore/category/[categoryName]/styles";

function FormatPageContent() {
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const { heroRef, trendingRef, navTextTone } = useExploreNavTone();

  const {
    tutorials: filteredTutorials,
    isLoading,
    setSortBy,
    searchQuery,
    setSearchQuery,
    formatTitle,
  } = useFormatContent(id);

  return (
    <LocalPageContainer $navTextTone={navTextTone}>
      <NavBar navTextTone={navTextTone} />
      <Main>
        <Section>
          <div ref={heroRef}>
            <Hero>
              <Inner>
                <Content>
                  <Title>
                    <HeroTitleText>{formatTitle}</HeroTitleText>
                  </Title>
                  <Controls>
                    <SearchBar
                      placeholder={t("creators.search")}
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                    <SortDropdown
                      options={SORT_OPTIONS}
                      value={DEFAULT_SORT}
                      onChange={setSortBy}
                      label={t(CREATORS.sort)}
                      renderSelectedLabel={(value) =>
                        t(CREATORS.value(value as SortValue)).toLowerCase()
                      }
                      renderOptionLabel={(option) =>
                        t(
                          CREATORS.value(option.value as SortValue),
                        ).toLowerCase()
                      }
                    />
                  </Controls>
                </Content>
              </Inner>
            </Hero>
          </div>
          <div ref={trendingRef}>
            <PageWrapper>
              {isLoading ? (
                <ResultsState>
                  <MonoText $use="Body_Medium">
                    {t("nav.explore.loading")}
                  </MonoText>
                </ResultsState>
              ) : filteredTutorials.length > 0 ? (
                <Grid>
                  {filteredTutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </Grid>
              ) : (
                <ResultsState>
                  <MonoText $use="Body_Medium">
                    {t("nav.explore.noResults")}
                  </MonoText>
                </ResultsState>
              )}
            </PageWrapper>
          </div>
        </Section>
      </Main>
      <Footer />
    </LocalPageContainer>
  );
}

export default function FormatPage() {
  return (
    <Suspense fallback={null}>
      <FormatPageContent />
    </Suspense>
  );
}
