// cutify-ui: one-colour 16 x 16 pixel icons from rectangle arrays. Takes the text colour. MIT.
type Rect = [x: number, y: number, w: number, h: number];
const path = (rects: Rect[]) => rects.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}z`).join("");

// Starter set. Add your own: draw on a 16 x 16 grid and list the filled rectangles.
const shapes = {
  signals: [[1, 11, 2, 3], [5, 8, 2, 6], [9, 5, 2, 9], [13, 2, 2, 12]],
  search: [[4, 1, 5, 1], [3, 2, 1, 1], [9, 2, 1, 1], [2, 3, 1, 5], [10, 3, 1, 5], [3, 8, 1, 1], [9, 8, 1, 1], [4, 9, 5, 1], [10, 10, 2, 2], [12, 12, 2, 2]],
  check: [[2, 8, 2, 2], [4, 10, 2, 2], [6, 12, 2, 2], [8, 10, 2, 2], [10, 8, 2, 2], [12, 6, 2, 2], [14, 4, 1, 2]],
  cross: [[2, 2, 2, 2], [4, 4, 2, 2], [6, 6, 4, 4], [10, 10, 2, 2], [12, 12, 2, 2], [12, 2, 2, 2], [10, 4, 2, 2], [4, 10, 2, 2], [2, 12, 2, 2]],
  gear: [[7, 1, 2, 2], [7, 13, 2, 2], [1, 7, 2, 2], [13, 7, 2, 2], [4, 4, 8, 8], [3, 3, 2, 2], [11, 3, 2, 2], [3, 11, 2, 2], [11, 11, 2, 2]],
  book: [[1, 3, 6, 10], [9, 3, 6, 10], [7, 4, 2, 9], [2, 13, 12, 1]],
  plug: [[5, 1, 2, 4], [9, 1, 2, 4], [3, 5, 10, 5], [5, 10, 6, 2], [7, 12, 2, 3]],
  compass: [[5, 1, 6, 1], [3, 2, 2, 1], [11, 2, 2, 1], [2, 3, 1, 2], [13, 3, 1, 2], [1, 5, 1, 6], [14, 5, 1, 6], [2, 11, 1, 2], [13, 11, 1, 2],
    [3, 13, 2, 1], [11, 13, 2, 1], [5, 14, 6, 1], [9, 4, 2, 2], [7, 6, 2, 4], [5, 10, 2, 2]],
} satisfies Record<string, Rect[]>;

export type PixelIconName = keyof typeof shapes;
const paths = Object.fromEntries(Object.entries(shapes).map(([k, v]) => [k, path(v as Rect[])])) as Record<PixelIconName, string>;

export function PixelIcon({ name, size = 16, label }: { name: PixelIconName; size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" fill="currentColor"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false })}>
      <path d={paths[name]} />
    </svg>
  );
}
