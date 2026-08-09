import { EXPIRY_DATE_REGEX, NON_DIGIT_REGEX } from "@/utils/Constants";

export const isValidLuhn = (num: string): boolean => {
  const digits = num.replace(NON_DIGIT_REGEX, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = parseInt(digits[digits.length - 1 - i], 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
};

export const isValidCardExpiry = (val: string): boolean => {
  const match = val.match(EXPIRY_DATE_REGEX);
  if (!match) return false;
  const [, m, y] = match;
  return new Date(2000 + Number(y), Number(m)) > new Date();
};
