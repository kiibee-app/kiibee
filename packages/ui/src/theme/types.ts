export interface Theme {
  name: "light" | "dark";
  colors: {
    brand: {
      dark: string;
      light: string;
      lightest: string;
    };
    text: {
      main: string;
      muted: string;
    };
    border: string;
    bg: {
      app: string;
      white: string;
      browser: string;
    };
  };
}
