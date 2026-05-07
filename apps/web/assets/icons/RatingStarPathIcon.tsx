import * as React from "react";

type Props = React.SVGProps<SVGPathElement>;

export default function RatingStarPathIcon(props: Props) {
  return (
    <path
      d="M12 2.25L14.91 8.15L21.42 9.1L16.71 13.68L17.82 20.15L12 17.09L6.18 20.15L7.29 13.68L2.58 9.1L9.09 8.15L12 2.25Z"
      {...props}
    />
  );
}
