"use client";

import React from "react";
import Image from "next/image";
import { Header, Inner, Left, Logo, Nav, Actions } from "./styles";
import logo from "../../../assets/images/logo.png";
import GenericButton from "@/components/UI/GenericButton";

export default function NavBar() {
  return (
    <Header>
      <Inner>
        <Left>
          <Logo>
            <Image src={logo} alt="Kiibee" width={80} height={25} priority />
          </Logo>
        </Left>

        <Nav>
          <a href="#">How it works</a>
          <a href="#">Explore creators</a>
          <a href="#">About Kiibee</a>
        </Nav>

        <Actions>
          <GenericButton asAnchor href="#" variant="secondary">
            Log in
          </GenericButton>
          <GenericButton asAnchor href="#" variant="primary">
            Start creating
          </GenericButton>
        </Actions>
      </Inner>
    </Header>
  );
}
