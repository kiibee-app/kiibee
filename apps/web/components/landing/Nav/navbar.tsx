"use client";

import React from "react";
import { Header, Inner, Left, Logo, Nav, Actions, CTA } from "./styles";

export default function NavBar() {
  return (
    <Header>
      <Inner>
        <Left>
          <Logo>kiibee</Logo>
        </Left>

        <Nav>
          <a href="#">How it works</a>
          <a href="#">Explore creators</a>
          <a href="#">About Kiibee</a>
        </Nav>

        <Actions>
          <a className="login" href="#">
            Log in
          </a>
          <CTA href="#">Start creating</CTA>
        </Actions>
      </Inner>
    </Header>
  );
}
