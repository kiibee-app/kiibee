"use client";

import Image from "next/image";
import { Wrapper, Header, SeeAll, List, Card, Avatar } from "./styles";
import { creators } from "@/utils/dummyData/creators.data";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";

export default function TopCreators() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Header>
        <MonoText $use="H4_Medium">{t(CREATORS.topCreators)}</MonoText>
        <SeeAll href="/explore-creators">
          <MonoText $use="Body_Medium">{t(CREATORS.seeAll)}</MonoText>
        </SeeAll>
      </Header>

      <List>
        {creators.slice(0, 6).map((creator) => (
          <Card key={creator.id}>
            <Avatar>
              <Image
                src={creator.image}
                alt={creator.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </Avatar>

            <MonoText $use="Body_Medium">{creator.name}</MonoText>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t(CREATORS.subscribersCount, { count: creator.uploads })}
            </MonoText>
          </Card>
        ))}
      </List>
    </Wrapper>
  );
}
