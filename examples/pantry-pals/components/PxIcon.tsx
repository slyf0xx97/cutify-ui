// cutify-ui: 12 x 12 pixel icons for food and stage marks, drawn with PixelSprite. Same grids as index.html. MIT.
import { PixelSprite, type SpriteGrid } from "./PixelSprite";

const PAL = {"k": "#16171a", "r": "#e0533c", "g": "#3f9e57", "G": "#7cc65a", "w": "#ffffff", "c": "#f3e3c3", "y": "#f6d877", "Y": "#e0a92e", "o": "#c9772a", "b": "#d9a066", "B": "#a8693a", "n": "#3a4955", "s": "#d9f0fb", "S": "#8fd0f0", "t": "#1fa98a", "P": "#c08ad6", "p": "#7d4a96", "l": "#c8ced6"};

const ICONS = {
  tomato: ["............", ".....gg.....", "...gggggg...", "..kkkggkkk..", ".krrrrrrrrk.", "krrwrrrrrrrk", "krwrrrrrrrrk", "krrrrrrrrrrk", "krrrrrrrrrrk", ".krrrrrrrrk.", "..kkkkkkkk..", "............"],
  plan: ["....kkkk....", ".kkkyyyykkk.", ".kbkkkkkkbk.", ".kbwwwwwwbk.", ".kbwkkkkwbk.", ".kbwwwwwwbk.", ".kbwkkkwwbk.", ".kbwwwwwwbk.", ".kbwkkkkwbk.", ".kbwwwwwwbk.", ".kbbbbbbbbk.", ".kkkkkkkkkk."],
  receipt: [".kkkkkkkkkk.", ".kwwwwwwwwk.", ".kwkkkwwkwk.", ".kwwwwwwwwk.", ".kwkkkkwkwk.", ".kwwwwwwwwk.", ".kwkkwwwkwk.", ".kwwwwwwwwk.", ".kwwwwkkkwk.", ".kwwwwwwwwk.", ".kwwwwwwwwk.", ".kk.kk.kk.k."],
  fridge: ["..kkkkkkkk..", "..kssssssk..", "..kssssnsk..", "..kssssnsk..", "..kssssssk..", "..kkkkkkkk..", "..kssssssk..", "..kssssnsk..", "..kssssnsk..", "..kssssssk..", "..kkkkkkkk..", "...k....k..."],
  pan: ["............", "............", "..kkkkkk....", ".knnnnnnk...", "knnwwwwnnk..", "knwwyywwnk..", "knwwyywwnkkk", "knwwwwwwnnnk", "knnwwwwnnkkk", ".knnnnnnk...", "..kkkkkk....", "............"],
  basket: ["............", "....kkkk....", "...k....k...", "..k......k..", "kkkkkkkkkkkk", "kbbbbbbbbbbk", "kbBbBbBbBbbk", ".kbbbbbbbbk.", ".kbBbBbBbBk.", ".kbbbbbbbbk.", "..kkkkkkkk..", "............"],
  check: [".kkkkkkkkkk.", "kggggggggggk", "kggggggggwgk", "kgggggggwwgk", "kggggggwwggk", "kgwgggwwgggk", "kgwwgwwggggk", "kggwwwgggggk", "kgggwggggggk", "kggggggggggk", ".kkkkkkkkkk.", "............"],
  egg: ["............", "....kkkk....", "...kwwwwk...", "..kwwwwwwk..", "..kwwwwwwk..", ".kwwwwwwwwk.", ".kwwwwwwwwk.", ".kwwwwwwwwk.", ".kcwwwwwwck.", "..kcwwwwck..", "...kkkkkk...", "............"],
  greens: ["............", "...kk..kk...", "..kGGkkGGk..", ".kGGgGGgGGk.", ".kGgGGGGgGk.", "kGGGgGGgGGGk", "kGgGGgGGGgGk", ".kGGGggGGGk.", "..kGGggGGk..", "...kkwwkk...", "....kwwk....", ".....kk....."],
  cheese: ["............", ".........kk.", "......kkkYk.", "...kkkyyyYk.", ".kkyyyyyyYk.", "kkkkkkkkkkk.", "kyyyyYyyyyk.", "kyYyyyyyYyk.", "kyyyyyyyyyk.", "kyyyYyyyyyk.", "kkkkkkkkkkk.", "............"],
  onion: [".....gg.....", ".....gg.....", "....kPPk....", "...kPpPPk...", "..kPPpPPPk..", ".kPPPpPPPPk.", ".kPPpPPpPPk.", ".kPPpPPpPPk.", "..kPPpPpPk..", "...kPPPPk...", "....kkkk....", "....k..k...."],
  garlic: [".....kk.....", ".....kk.....", "....kwwk....", "...kwwwwk...", "..kwwlwwwk..", ".kwwlwwlwwk.", ".kwwlwwlwwk.", ".kwwlwwlwwk.", "..kwwlwwwk..", "...kkkkkk...", "....k.k.k...", "............"],
  rice: ["............", "............", "...kkkkkk...", "..kwwwwwwk..", ".kwwwwwwwwk.", "kkkkkkkkkkkk", "kttttttttttk", "kttttttttttk", ".kttttttttk.", "..kttttttk..", "...kkkkkk...", "............"],
  chicken: ["............", ".....kkkk...", "....kbbbbk..", "...kbbBbbbk.", "...kbbbbbBk.", "...kbBbbbbk.", "....kbbbbk..", "...kwkkkk...", "..kwk.......", "kkwk........", "kwwk........", ".kk........."],
  pepper: [".....kk.....", ".....gk.....", "..kkkgkkkk..", ".kGGGkGGGGk.", "kGwGGGGGGGGk", "kGwGGkGGGGGk", "kGGGGkGGGGGk", "kGGGGkGGGGgk", "kGGGGkGGGggk", ".kGGGkGGGgk.", "..kkk.kkkk..", "............"],
  milk: ["....kkkk....", "...kSSSSk...", "..kkkkkkkk..", "..kwwwwwwk..", "..kwSSSSwk..", "..kwSwwSwk..", "..kwSSSSwk..", "..kwwwwwwk..", "..kwwwwwwk..", "..kwwwwwwk..", "..kkkkkkkk..", "............"],
  pasta: ["............", "............", "....kkkk....", "..kkyyyykk..", ".kyyrrrryyk.", ".kyrryrrryk.", "kkyyyyyyyykk", "kwkkkkkkkkwk", ".kwwwwwwwwk.", "..kkkkkkkk..", "............", "............"],
  bowl: [".........kk.", "........kk..", ".......kk...", ".kkkkkkkkkk.", "kwwwwwwkwwwk", "kkkkkkkkkkkk", "kSSSSSSSSSSk", "kSwSSSSSSSSk", ".kSSSSSSSSk.", "..kSSSSSSk..", "...kkkkkk...", "............"],
  soup: [".........kk.", "........kk..", ".......kk...", ".kkkkkkkkkk.", "krrrrrrkrrrk", "kkkkkkkkkkkk", "kSSSSSSSSSSk", "kSwSSSSSSSSk", ".kSSSSSSSSk.", "..kSSSSSSk..", "...kkkkkk...", "............"],
  curry: ["............", "............", "....kkkk....", "..kkwwookk..", ".kwwwoooook.", ".kwwwwoBook.", "kkwwwoooookk", "kwkkkkkkkkwk", ".kwwwwwwwwk.", "..kkkkkkkk..", "............", "............"],
  wrap: ["............", "............", "..kkkkkkkk..", ".kbbbbBbbkk.", "kbbBbbbbbkgk", "kbbbbbBbbkrk", "kbBbbbbbbkck", ".kbbbBbbbkk.", "..kkkkkkkk..", "............", "............", "............"],
} satisfies Record<string, SpriteGrid>;

export type IconName = keyof typeof ICONS;

/** Decorative, sized by CSS (.sprite.pxi: 1.15em, like the emoji it replaced). */
export function PxIcon({ name }: { name: IconName }) {
  return <PixelSprite grid={ICONS[name]} palette={PAL} size={16} className="pxi" />;
}
