import { Container, Top, Column, Logo, LinkItem, Bottom } from "./styles";

const Footer = () => {
  return (
    <Container>
      <Top>
        <Column>
          <Logo>kiibee</Logo>
        </Column>

        <Column>
          <h4>Explore</h4>
          <LinkItem>Categories</LinkItem>
          <LinkItem>Creators</LinkItem>
        </Column>

        <Column>
          <h4>Company</h4>
          <LinkItem>About</LinkItem>
          <LinkItem>Contact</LinkItem>
        </Column>

        <Column>
          <h4>Legal</h4>
          <LinkItem>Terms</LinkItem>
          <LinkItem>Privacy</LinkItem>
        </Column>
      </Top>

      <Bottom>© {new Date().getFullYear()} Kiibee. All rights reserved.</Bottom>
    </Container>
  );
};

export default Footer;
