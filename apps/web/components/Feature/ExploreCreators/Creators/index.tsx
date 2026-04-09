"use client";

import Image from "next/image";
import {
  Grid,
  Card,
  ImageWrapper,
  Content,
  Badge,
  PageWrapper,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { creators } from "@/utils/dummyData/creators.data";

export default function ExploreCreators() {
  const { t } = useTranslation();
  return (
    <PageWrapper>
      <Grid>
        {creators.map((creator) => (
          <Card key={creator.id}>
            <ImageWrapper>
              <Badge>
                <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
                  {creator.category}
                </MonoText>
              </Badge>

              <Image
                src={creator.image}
                alt={creator.name}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </ImageWrapper>

            <Content>
              <MonoText $use="Body_Medium">{creator.name}</MonoText>
              <MonoText $use="Body_Small">{creator.uploads} uploads</MonoText>
            </Content>

            <GenericButton asAnchor href="#profile" variant="secondary">
              {t("creators.viewProfile")}
            </GenericButton>
          </Card>
        ))}
      </Grid>

      <GenericButton asAnchor href="#load" variant="primary">
        {t("creators.loadMore")}
      </GenericButton>
    </PageWrapper>
  );
}
