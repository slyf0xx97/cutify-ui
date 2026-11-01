// Pantry Pals sample data. Everything here is made-up and labelled "sample" on the page.
import type { Animate, Palette, SpriteGrid } from "./PixelSprite";
import type { IconName } from "./PxIcon";

export type Food = { id: string; name: string; icon: IconName; inFridge: boolean };
export type Recipe = { id: string; name: string; icon: IconName; needs: string[] };

export const FOODS: Food[] = [
  { id: "eggs", name: "Eggs", icon: "egg", inFridge: true },
  { id: "spinach", name: "Spinach", icon: "greens", inFridge: true },
  { id: "cheese", name: "Cheese", icon: "cheese", inFridge: true },
  { id: "onion", name: "Onion", icon: "onion", inFridge: true },
  { id: "tomatoes", name: "Tomatoes", icon: "tomato", inFridge: true },
  { id: "garlic", name: "Garlic", icon: "garlic", inFridge: true },
  { id: "rice", name: "Rice", icon: "rice", inFridge: true },
  { id: "chicken", name: "Chicken", icon: "chicken", inFridge: true },
  { id: "peppers", name: "Peppers", icon: "pepper", inFridge: false },
  { id: "milk", name: "Milk", icon: "milk", inFridge: false },
  { id: "pasta", name: "Pasta", icon: "pasta", inFridge: false },
  { id: "yogurt", name: "Yogurt", icon: "bowl", inFridge: false },
];

export const RECIPES: Recipe[] = [
  { id: "omelette", name: "Spinach omelette", icon: "pan", needs: ["eggs", "spinach", "cheese", "onion"] },
  { id: "tomato-pasta", name: "Tomato pasta", icon: "pasta", needs: ["pasta", "tomatoes", "garlic", "onion", "basil"] },
  { id: "fried-rice", name: "Chicken fried rice", icon: "rice", needs: ["rice", "chicken", "eggs", "peppers", "onion", "soy sauce"] },
  { id: "stuffed-peppers", name: "Stuffed peppers", icon: "pepper", needs: ["peppers", "rice", "cheese", "tomatoes"] },
  { id: "curry", name: "Chicken curry", icon: "curry", needs: ["chicken", "onion", "garlic", "yogurt", "rice", "curry paste"] },
  { id: "pasta-bake", name: "Cheesy pasta bake", icon: "cheese", needs: ["pasta", "cheese", "milk", "tomatoes"] },
  { id: "shakshuka", name: "Shakshuka", icon: "tomato", needs: ["eggs", "tomatoes", "peppers", "onion", "bread"] },
  { id: "stir-fry", name: "Veggie stir-fry", icon: "greens", needs: ["peppers", "spinach", "garlic", "noodles", "soy sauce"] },
  { id: "wraps", name: "Chicken wraps", icon: "wrap", needs: ["chicken", "tortillas", "peppers", "yogurt", "lettuce"] },
  { id: "soup", name: "Tomato soup", icon: "soup", needs: ["tomatoes", "onion", "garlic", "milk", "bread"] },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const label = (id: string) => FOODS.find((f) => f.id === id)?.name ?? id[0].toUpperCase() + id.slice(1);

/** Stand-in for the Chef: rank recipes by how much of each is already in the fridge. */
export function chefPlan(fridge: ReadonlySet<string>) {
  const have = (r: Recipe) => r.needs.filter((n) => fridge.has(n)).length;
  const ranked = [...RECIPES].sort((a, b) => have(b) - have(a) || (a.needs.length - have(a)) - (b.needs.length - have(b)));
  return { plan: ranked.slice(0, DAYS.length).map((r) => r.id), bench: ranked.slice(DAYS.length).map((r) => r.id) };
}

/** Stand-in for the Shopper: everything the plan needs that the fridge doesn't have, most-used first. */
export function shopperList(plan: readonly string[], fridge: ReadonlySet<string>) {
  const count = new Map<string, number>();
  for (const id of plan) for (const n of recipe(id).needs) if (!fridge.has(n)) count.set(n, (count.get(n) ?? 0) + 1);
  return [...count].map(([id, meals]) => ({ id, name: label(id), meals }))
    .sort((a, b) => b.meals - a.meals || a.name.localeCompare(b.name));
}

export const recipe = (id: string) => RECIPES.find((r) => r.id === id)!;

// The cast: one sprite per helper in the brief, plus you. 16 x 16 grids, '.' is empty.
type Actor = { name: string; grid: SpriteGrid; palette: Palette; animate?: Animate };
const ink = "#16171a", skin = "#f1c7a3", mouth = "#7a3b2e";

export const CAST: Record<"chef" | "shopper" | "you", Actor> = {
  chef: {
    name: "Chef",
    palette: { k: ink, W: "#ffffff", s: skin, m: mouth, t: "#1fa98a", y: "#c99470" },
    animate: { y: "px-wl" },
    grid: [
      "....kk.kk.kk....", "...kWWkWWkWWk...", "..kWWWWWWWWWWk..", "..kWWWWWWWWWWk..",
      "...kWWWWWWWWk...", "...kWWWWWWWWk.k.", "...kkkkkkkkkkkyk", "...ksssssssskkyk",
      "...kskssssksk.k.", "...ksssmmsssk.y.", "....kssssssk..y.", "..kkkWkkkkWkkksk",
      ".kWWkttttttkWkk.", ".kWWkttyyttkWk..", ".kssktttttttk...", "..kkkkkkkkkkk...",
    ],
  },
  shopper: {
    name: "Shopper",
    palette: { k: ink, c: "#ef8b74", s: skin, m: mouth, g: "#3f9e57", b: "#c99470", r: "#e0533c" },
    animate: { g: "px-wl" },
    grid: [
      "................", "....kkkkkkk.....", "...kcccccccck...", "..kccccccccckk..",
      "..kkkkkkkkkkkkk.", "...kssssssssk...", "...kskssssksk...", "...ksssmmsssk...",
      "....kssssssk....", "...kkkkkkkkkk...", "..kcccccccckkkkk", "..kcccccccck.k.k",
      "..kccccccccskkkk", "..kccccccckbgrbk", "..kkkkkkkkkkbbkk", "...kk..kk..kkkk.",
    ],
  },
  you: {
    name: "You",
    palette: { k: ink, h: "#6b3f2a", s: skin, m: mouth, o: "#e8912d", d: "#3a4955" },
    grid: [
      "................", "....kkkkkkkk....", "...khhhhhhhhk...", "..khhhhhhhhhhk..",
      "..khsssssssshk..", "..khsksssskshk..", "...kssssssssk...", "...ksssmmsssk...",
      "....kssssssk....", "...kkkkkkkkkk...", "..kooooooooook..", ".kooooooooooook.",
      ".kskooooooooksk.", ".kskddddddddksk.", "...kddk..kddk...", "...kkkk..kkkk...",
    ],
  },
};
