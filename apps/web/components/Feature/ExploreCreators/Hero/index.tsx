"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import {
  CheckboxControl,
  CheckboxInput,
  Hero,
  HeroTitleText,
  Inner,
  Content,
  Title,
  Controls,
  FilterControlWrap,
  FilterBtn,
  FilterButtonText,
  FilterHeader,
  FilterOverlay,
  FilterSection,
  FilterSectionBody,
  FilterSectionBodyInner,
  FilterSectionButton,
  FilterSectionTitle,
  FilterSections,
  FilterTitle,
  OptionLabel,
  OptionList,
  OptionText,
  PriceField,
  PriceFieldLabel,
  PriceFields,
  PriceInput,
  PriceInputWrapper,
  PriceValue,
  RatingList,
  RatingOption,
  RatingStars,
  SectionIcon,
  ShowMoreButton,
  ShowMoreText,
  SortBox,
  SortText,
  StarIcon,
  StarIconWrap,
} from "./styles";
import SearchBar from "@/components/UI/SearchBar";
import { FilterIcon } from "@/assets/icons/filterIcon";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { Directions, INPUT_TYPE, KEYBOARD_KEYS } from "@/utils/ui";

type FilterGroupKey = "creators" | "categories" | "formats";
type FilterSectionKey = FilterGroupKey | "price" | "rating";

const CREATOR_OPTIONS = [
  "Kammas kantine",
  "Chief1",
  "Morten Bonde",
  "Simon Talbot",
  "Amin Jensen",
  "ADHDfokus",
  "Jacob Taarnhoj",
  "Tjeles venner",
  "Helt vild, kogebog",
  "Comedy-TV",
  "The Fit Lab",
  "Business Daily",
];

const CATEGORY_OPTION_KEYS = [
  "all",
  "business",
  "comedyShows",
  "musicAndAudio",
  "educational",
  "fitnessAndHealth",
  "food",
  "podcasts",
  "theater",
  "tutorials",
  "publications",
] as const;

const FORMAT_OPTION_KEYS = [
  "all",
  "video",
  "ePublication",
  "pdf",
  "audioFile",
  "webContent",
] as const;

const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;
const DEFAULT_VISIBLE_CREATORS = 10;

export default function ExploreCreatorsHero() {
  const { t } = useTranslation();
  const theme = useTheme();
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] =
    useState<FilterSectionKey | null>(null);
  const [showAllCreators, setShowAllCreators] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<FilterGroupKey, string[]>
  >({
    creators: [],
    categories: [],
    formats: [],
  });
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const categoryOptions = CATEGORY_OPTION_KEYS.map((optionKey) =>
    t(`creators.filters.options.categories.${optionKey}`),
  );
  const formatOptions = FORMAT_OPTION_KEYS.map((optionKey) =>
    t(`creators.filters.options.formats.${optionKey}`),
  );

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        filterButtonRef.current?.contains(target) ||
        filterOverlayRef.current?.contains(target)
      ) {
        return;
      }

      setIsFilterOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen]);

  const toggleFilter = () => {
    setIsFilterOpen((previousValue) => {
      const nextValue = !previousValue;

      if (nextValue) {
        setExpandedSection(null);
      }

      return nextValue;
    });
  };

  const toggleSection = (sectionKey: FilterSectionKey) => {
    setExpandedSection((previousValue) =>
      previousValue === sectionKey ? null : sectionKey,
    );
  };

  const toggleOption = (group: FilterGroupKey, option: string) => {
    setSelectedOptions((previousValue) => {
      const currentOptions = previousValue[group];
      const isSelected = currentOptions.includes(option);
      const allOption =
        group === "categories"
          ? categoryOptions[0]
          : group === "formats"
            ? formatOptions[0]
            : null;

      if (allOption && option === allOption) {
        return {
          ...previousValue,
          [group]: isSelected ? [] : [option],
        };
      }

      const nextOptions = isSelected
        ? currentOptions.filter((currentOption) => currentOption !== option)
        : [
            ...currentOptions.filter(
              (currentOption) => currentOption !== allOption,
            ),
            option,
          ];

      return {
        ...previousValue,
        [group]: nextOptions,
      };
    });
  };

  const handlePriceChange =
    (field: "min" | "max") => (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value.replace(/[^\d]/g, "");

      setPriceRange((previousValue) => ({
        ...previousValue,
        [field]: nextValue,
      }));
    };

  const visibleCreators = showAllCreators
    ? CREATOR_OPTIONS
    : CREATOR_OPTIONS.slice(0, DEFAULT_VISIBLE_CREATORS);

  const renderOptionList = (group: FilterGroupKey, options: string[]) => (
    <OptionList>
      {options.map((option) => {
        const isSelected = selectedOptions[group].includes(option);

        return (
          <OptionLabel key={option}>
            <OptionText>{option}</OptionText>
            <CheckboxInput
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleOption(group, option)}
            />
            <CheckboxControl $checked={isSelected} />
          </OptionLabel>
        );
      })}
    </OptionList>
  );

  return (
    <Hero>
      <Inner>
        <Content>
          <Title>
            <HeroTitleText>{t("creators.title")}</HeroTitleText>
          </Title>
          <Controls>
            <FilterControlWrap>
              <FilterBtn
                ref={filterButtonRef}
                type="button"
                $active={isFilterOpen}
                onClick={toggleFilter}
                aria-expanded={isFilterOpen}
                aria-controls="creator-filters-overlay"
              >
                <FilterIcon color={theme.colors.primary.BLACK} />
                <FilterButtonText>{t("creators.filter")}</FilterButtonText>
              </FilterBtn>
              {isFilterOpen ? (
                <FilterOverlay
                  id="creator-filters-overlay"
                  ref={filterOverlayRef}
                  role="region"
                  aria-label={t("creators.filters.title")}
                >
                  <FilterHeader>
                    <FilterTitle as="h2">
                      {t("creators.filters.title")}
                    </FilterTitle>
                  </FilterHeader>
                  <FilterSections>
                    <FilterSection>
                      <FilterSectionButton
                        type="button"
                        onClick={() => toggleSection("creators")}
                        aria-expanded={expandedSection === "creators"}
                      >
                        <FilterSectionTitle>
                          {t("creators.filters.sections.creators")}
                        </FilterSectionTitle>
                        <SectionIcon>
                          <ArrowIcon
                            color={theme.colors.neutral.GRAY_400}
                            width={18}
                            height={10}
                            direction={
                              expandedSection === "creators"
                                ? Directions.DOWN
                                : Directions.RIGHT
                            }
                          />
                        </SectionIcon>
                      </FilterSectionButton>
                      <FilterSectionBody $open={expandedSection === "creators"}>
                        <FilterSectionBodyInner
                          $open={expandedSection === "creators"}
                        >
                          {renderOptionList("creators", visibleCreators)}
                          {CREATOR_OPTIONS.length > DEFAULT_VISIBLE_CREATORS &&
                          !showAllCreators ? (
                            <ShowMoreButton
                              type="button"
                              onClick={() => setShowAllCreators(true)}
                            >
                              <ShowMoreText>
                                {t("creators.filters.showMore")}
                              </ShowMoreText>
                            </ShowMoreButton>
                          ) : null}
                        </FilterSectionBodyInner>
                      </FilterSectionBody>
                    </FilterSection>

                    <FilterSection>
                      <FilterSectionButton
                        type="button"
                        onClick={() => toggleSection("categories")}
                        aria-expanded={expandedSection === "categories"}
                      >
                        <FilterSectionTitle>
                          {t("creators.filters.sections.categories")}
                        </FilterSectionTitle>
                        <SectionIcon>
                          <ArrowIcon
                            color={theme.colors.neutral.GRAY_400}
                            width={18}
                            height={10}
                            direction={
                              expandedSection === "categories"
                                ? Directions.DOWN
                                : Directions.RIGHT
                            }
                          />
                        </SectionIcon>
                      </FilterSectionButton>
                      <FilterSectionBody
                        $open={expandedSection === "categories"}
                      >
                        <FilterSectionBodyInner
                          $open={expandedSection === "categories"}
                        >
                          {renderOptionList("categories", categoryOptions)}
                        </FilterSectionBodyInner>
                      </FilterSectionBody>
                    </FilterSection>

                    <FilterSection>
                      <FilterSectionButton
                        type="button"
                        onClick={() => toggleSection("formats")}
                        aria-expanded={expandedSection === "formats"}
                      >
                        <FilterSectionTitle>
                          {t("creators.filters.sections.formats")}
                        </FilterSectionTitle>
                        <SectionIcon>
                          <ArrowIcon
                            color={theme.colors.neutral.GRAY_400}
                            width={18}
                            height={10}
                            direction={
                              expandedSection === "formats"
                                ? Directions.DOWN
                                : Directions.RIGHT
                            }
                          />
                        </SectionIcon>
                      </FilterSectionButton>
                      <FilterSectionBody $open={expandedSection === "formats"}>
                        <FilterSectionBodyInner
                          $open={expandedSection === "formats"}
                        >
                          {renderOptionList("formats", formatOptions)}
                        </FilterSectionBodyInner>
                      </FilterSectionBody>
                    </FilterSection>

                    <FilterSection>
                      <FilterSectionButton
                        type="button"
                        onClick={() => toggleSection("price")}
                        aria-expanded={expandedSection === "price"}
                      >
                        <FilterSectionTitle>
                          {t("creators.filters.sections.price")}
                        </FilterSectionTitle>
                        <SectionIcon>
                          <ArrowIcon
                            color={theme.colors.neutral.GRAY_400}
                            width={18}
                            height={10}
                            direction={
                              expandedSection === "price"
                                ? Directions.DOWN
                                : Directions.RIGHT
                            }
                          />
                        </SectionIcon>
                      </FilterSectionButton>
                      <FilterSectionBody $open={expandedSection === "price"}>
                        <FilterSectionBodyInner
                          $open={expandedSection === "price"}
                        >
                          <PriceFields>
                            <PriceField>
                              <PriceFieldLabel>
                                {t("creators.filters.price.minimum")}
                              </PriceFieldLabel>
                              <PriceInputWrapper>
                                <PriceValue>
                                  {t("creators.filters.price.currency")}
                                </PriceValue>
                                <PriceInput
                                  type={INPUT_TYPE.TEXT}
                                  inputMode="numeric"
                                  placeholder="0"
                                  value={priceRange.min}
                                  onChange={handlePriceChange("min")}
                                />
                              </PriceInputWrapper>
                            </PriceField>
                            <PriceField>
                              <PriceFieldLabel>
                                {t("creators.filters.price.maximum")}
                              </PriceFieldLabel>
                              <PriceInputWrapper>
                                <PriceValue>
                                  {t("creators.filters.price.currency")}
                                </PriceValue>
                                <PriceInput
                                  type={INPUT_TYPE.TEXT}
                                  inputMode="numeric"
                                  placeholder="0"
                                  value={priceRange.max}
                                  onChange={handlePriceChange("max")}
                                />
                              </PriceInputWrapper>
                            </PriceField>
                          </PriceFields>
                        </FilterSectionBodyInner>
                      </FilterSectionBody>
                    </FilterSection>

                    <FilterSection>
                      <FilterSectionButton
                        type="button"
                        onClick={() => toggleSection("rating")}
                        aria-expanded={expandedSection === "rating"}
                      >
                        <FilterSectionTitle>
                          {t("creators.filters.sections.rating")}
                        </FilterSectionTitle>
                        <SectionIcon>
                          <ArrowIcon
                            color={theme.colors.neutral.GRAY_400}
                            width={18}
                            height={10}
                            direction={
                              expandedSection === "rating"
                                ? Directions.DOWN
                                : Directions.RIGHT
                            }
                          />
                        </SectionIcon>
                      </FilterSectionButton>
                      <FilterSectionBody $open={expandedSection === "rating"}>
                        <FilterSectionBodyInner
                          $open={expandedSection === "rating"}
                        >
                          <RatingList
                            role="radiogroup"
                            aria-label={t("creators.filters.sections.rating")}
                          >
                            {RATING_OPTIONS.map((ratingValue) => {
                              const isSelected = selectedRating === ratingValue;

                              return (
                                <RatingOption key={ratingValue}>
                                  <OptionText>
                                    <RatingStars aria-hidden="true">
                                      {Array.from({ length: 5 }, (_, index) => (
                                        <StarIconWrap key={index}>
                                          <StarIcon
                                            viewBox="0 0 24 24"
                                            $filled={index < ratingValue}
                                          >
                                            <path d="M12 2.25L14.91 8.15L21.42 9.1L16.71 13.68L17.82 20.15L12 17.09L6.18 20.15L7.29 13.68L2.58 9.1L9.09 8.15L12 2.25Z" />
                                          </StarIcon>
                                        </StarIconWrap>
                                      ))}
                                    </RatingStars>
                                  </OptionText>
                                  <CheckboxInput
                                    type="radio"
                                    name="creator-rating-filter"
                                    aria-label={`${ratingValue} ${t(
                                      "creators.filters.sections.rating",
                                    )}`}
                                    checked={isSelected}
                                    onChange={() =>
                                      setSelectedRating(ratingValue)
                                    }
                                  />
                                  <CheckboxControl
                                    $checked={isSelected}
                                    $round
                                  />
                                </RatingOption>
                              );
                            })}
                          </RatingList>
                        </FilterSectionBodyInner>
                      </FilterSectionBody>
                    </FilterSection>
                  </FilterSections>
                </FilterOverlay>
              ) : null}
            </FilterControlWrap>
            <SearchBar placeholder={t("creators.search")} />
            <SortBox>
              <SortText>{t("creators.sort")}</SortText>
              <ArrowIcon
                color={theme.colors.primary.BLACK}
                direction={Directions.DOWN}
              />
            </SortBox>
          </Controls>
        </Content>
      </Inner>
    </Hero>
  );
}
