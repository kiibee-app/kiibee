"use client";

import Image from "next/image";
import { Wrapper, Header, SeeAll, List, Card, Avatar } from "./styles";
import { creators } from "@/utils/dummyData/creators.data";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@kiibee/ui/colors";

export default function TopCreators() {
  return (
    <Wrapper>
      <Header>
        <MonoText $use="H4_Medium">Top creators</MonoText>
        <SeeAll href="/explore-creators">
          <MonoText $use="Body_Medium">See all creators</MonoText>
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
              {creator.uploads}K Subscribers
            </MonoText>
          </Card>
        ))}
      </List>
    </Wrapper>
  );
}
