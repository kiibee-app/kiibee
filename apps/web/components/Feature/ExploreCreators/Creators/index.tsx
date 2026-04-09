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
import { CreatorProfile, creators } from "@/utils/dummyData/creators.data";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";

export default function ExploreCreators() {
  return (
    <PageWrapper>
      <Grid>
        {creators.map((creator: CreatorProfile) => (
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
            <GenericButton asAnchor href="#creators" variant="secondary">
              View Profile
            </GenericButton>
          </Card>
        ))}
      </Grid>
      <GenericButton asAnchor href="#load" variant="primary">
        Load more
      </GenericButton>
    </PageWrapper>
  );
}
