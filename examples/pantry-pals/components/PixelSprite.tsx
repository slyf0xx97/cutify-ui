// cutify-ui: a 16 x 16 pixel sprite from a string grid, rendered as crisp SVG. MIT.
import type { CSSProperties, ReactElement } from "react";

export type SpriteGrid = readonly string[];          // 16 strings of 16 characters, '.' = empty
export type Palette = Record<string, string>;         // character → colour
export type Animate = Record<string, string | readonly [left: string, right: string]>;

type Props = {
  grid: SpriteGrid;
  palette: Palette;
  animate?: Animate;      // character → class (e.g. "px-blink"), or [leftHalf, rightHalf] for mirrored parts
  size?: number;          // px
  label?: string;         // give a label when the sprite carries meaning; omit for decoration
  className?: string;
  style?: CSSProperties;
};

export function PixelSprite({ grid, palette, animate = {}, size = 96, label, className, style }: Props) {
  const rects: ReactElement[] = [];
  grid.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const fill = palette[ch];
      if (ch === "." || !fill) return;
      const a = animate[ch];
      const cls = !a ? undefined : typeof a === "string" ? a : a[x < 8 ? 0 : 1];
      // 1.1, not 1.02: the hero sprites bob at fractional scales, where a thinner overlap shows seams between rows
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.1} height={1.1} fill={fill} className={cls} />);
    }),
  );
  return (
    <svg
      viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges"
      className={"sprite" + (className ? " " + className : "")} style={style}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false })}
    >
      {rects}
    </svg>
  );
}
