export function pxToRem(px: number, base = 16) {
  return `${px / base}rem`;
}

export function fluid(
  minPx: number,
  maxPx: number,
  minViewportPx = 320,
  maxViewportPx = 1200,
) {
  const minRem = pxToRem(minPx);
  const maxRem = pxToRem(maxPx);

  const minVwRem = `${minViewportPx / 16}rem`;
  const maxVwRem = `${maxViewportPx / 16}rem`;

  return `clamp(${minRem}, calc(${minRem} + (${parseFloat(maxRem)} - ${parseFloat(
    minRem,
  )}) * ((100vw - ${minVwRem}) / (${parseFloat(maxVwRem)} - ${parseFloat(
    minVwRem,
  )}))), ${maxRem})`;
}
