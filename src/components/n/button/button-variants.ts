import { cva, type VariantProps } from "class-variance-authority";

/**
 * `color` and `variant` are declared empty and combined in compoundVariants, so
 * they stay orthogonal: any colour × any variant, without named combinations.
 */
export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-accent-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      color: { primary: "", secondary: "", gold: "", destructive: "", success: "", neutral: "", inverse: "" },
      variant: { solid: "", soft: "", outline: "", ghost: "", link: "h-auto! border-0 px-0! underline-offset-4 hover:underline" },
      size: {
        xs: "h-8 px-3 text-xs [&_svg]:size-3.5",
        sm: "h-9 px-3.5 text-sm [&_svg]:size-4",
        default: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-13 px-7 text-base [&_svg]:size-5",
        xl: "h-15 px-9 text-lg [&_svg]:size-5",
        "icon-xs": "size-8 [&_svg]:size-3.5",
        "icon-sm": "size-9 [&_svg]:size-4",
        icon: "size-11 [&_svg]:size-5",
      },
    },
    compoundVariants: [
      { color: "primary", variant: "solid", class: "border-accent-500 bg-accent-500 text-base-0 hover:border-accent-600 hover:bg-accent-600" },
      { color: "primary", variant: "soft", class: "border-accent-50 bg-accent-50 text-accent-600 hover:border-accent-100 hover:bg-accent-100" },
      { color: "primary", variant: "outline", class: "border-accent-150 bg-base-0 text-accent-600 hover:bg-accent-50" },
      { color: "primary", variant: "ghost", class: "border-transparent text-accent-600 hover:bg-accent-50" },
      { color: "primary", variant: "link", class: "text-accent-600" },

      { color: "secondary", variant: "solid", class: "border-flow-primary bg-flow-primary text-base-0 hover:bg-flow-s2" },
      { color: "secondary", variant: "outline", class: "border-base-150 bg-base-0 text-base-900 hover:border-base-400 hover:bg-base-50" },
      { color: "secondary", variant: "soft", class: "border-base-100 bg-base-100 text-base-900 hover:bg-base-150" },
      { color: "secondary", variant: "ghost", class: "border-transparent text-base-600 hover:bg-base-100 hover:text-base-900" },
      { color: "secondary", variant: "link", class: "text-base-900" },

      { color: "gold", variant: "solid", class: "border-flow-secondary bg-flow-secondary text-base-950 shadow-[0_8px_24px_-8px_rgb(245_184_0/0.6)] hover:bg-yellow-500" },
      { color: "gold", variant: "outline", class: "border-flow-secondary text-flow-secondary hover:bg-flow-secondary hover:text-base-950" },
      { color: "gold", variant: "soft", class: "border-flow-s6 bg-flow-s6 text-base-950 hover:bg-yellow-150" },

      { color: "destructive", variant: "solid", class: "border-red-500 bg-red-500 text-base-0 hover:bg-red-600" },
      { color: "destructive", variant: "soft", class: "border-red-50 bg-red-50 text-red-600 hover:bg-red-100" },
      { color: "destructive", variant: "outline", class: "border-red-150 bg-base-0 text-red-600 hover:bg-red-50" },
      { color: "destructive", variant: "ghost", class: "border-transparent text-red-600 hover:bg-red-50" },

      { color: "success", variant: "solid", class: "border-green-500 bg-green-500 text-base-0 hover:bg-green-600" },
      { color: "success", variant: "soft", class: "border-green-50 bg-green-50 text-green-600 hover:bg-green-100" },

      { color: "neutral", variant: "solid", class: "border-base-900 bg-base-900 text-base-0 hover:bg-base-950" },
      { color: "neutral", variant: "ghost", class: "border-transparent text-base-550 hover:bg-base-100 hover:text-base-900" },

      { color: "inverse", variant: "solid", class: "border-base-0 bg-base-0 text-base-950 hover:bg-base-100" },
      { color: "inverse", variant: "outline", class: "border-base-0/40 bg-base-0/5 text-base-0 backdrop-blur hover:bg-base-0/15" },
      { color: "inverse", variant: "ghost", class: "border-transparent text-base-0/85 hover:bg-base-0/10 hover:text-base-0" },
    ],
    defaultVariants: { color: "primary", variant: "solid", size: "default" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
