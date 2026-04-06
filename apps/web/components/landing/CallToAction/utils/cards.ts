import imageOne from "../../../../assets/images/call_to_action/creator-1.jpg";
import imageTwo from "../../../../assets/images/call_to_action/creator-2.png";
import imageThree from "../../../../assets/images/call_to_action/creator-3.png";
import imageFour from "../../../../assets/images/call_to_action/creator-4.png";

const orderedImages = {
  1: imageFour.src,
  2: imageThree.src,
  3: imageTwo.src,
  4: imageOne.src,
  5: imageFour.src,
  6: imageThree.src,
} as const;

export const desktopCards = [
  { src: orderedImages[1], left: -6.6, top: 0.8, width: 15.4, height: 31.2 },
  { src: orderedImages[2], left: 16.0, top: 0.8, width: 13.8, height: 31.2 },
  { src: orderedImages[3], left: 30.2, top: 0.8, width: 15.8, height: 31.2 },
  { src: orderedImages[4], left: 46.8, top: 0.8, width: 15.7, height: 31.2 },
  { src: orderedImages[5], left: 63.4, top: 0.8, width: 15.7, height: 31.2 },
  { src: orderedImages[6], left: 80.0, top: 0.8, width: 13.9, height: 31.2 },
  { src: orderedImages[5], left: -3.8, top: 32.6, width: 16.3, height: 31.8 },
  { src: orderedImages[6], left: 12.0, top: 32.6, width: 15.5, height: 31.8 },
  { src: orderedImages[3], left: 28.3, top: 32.6, width: 16.3, height: 31.8 },
  { src: orderedImages[4], left: 44.9, top: 32.6, width: 15.8, height: 31.8 },
  { src: orderedImages[1], left: 61.3, top: 32.6, width: 16.1, height: 31.8 },
  { src: orderedImages[2], left: 77.7, top: 32.6, width: 13.8, height: 31.8 },
  { src: orderedImages[5], left: -4.4, top: 65.0, width: 15.6, height: 34.0 },
  { src: orderedImages[6], left: 16.0, top: 65.0, width: 14.2, height: 34.0 },
  { src: orderedImages[3], left: 32.0, top: 65.0, width: 16.0, height: 34.0 },
  { src: orderedImages[4], left: 48.6, top: 65.0, width: 15.8, height: 34.0 },
  { src: orderedImages[1], left: 65.0, top: 65.0, width: 16.0, height: 34.0 },
  { src: orderedImages[2], left: 81.5, top: 65.0, width: 13.8, height: 34.0 },
] as const;

export const mobileCards = [
  orderedImages[1],
  orderedImages[2],
  orderedImages[3],
  orderedImages[4],
  orderedImages[5],
  orderedImages[6],
  orderedImages[3],
  orderedImages[4],
] as const;
