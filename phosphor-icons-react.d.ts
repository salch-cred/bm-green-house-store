// Type shim: @phosphor-icons/react@2.1.10 ships runtime files but is missing
// per-icon .d.ts declarations under dist/csr, so `import { X } from
// "@phosphor-icons/react"` fails type-checking (TS2305) even though the
// runtime exports work fine. This ambient declaration covers every icon
// used in the app so `tsc` / `next build` pass without touching runtime.
declare module "@phosphor-icons/react" {
  import type {
    ForwardRefExoticComponent,
    SVGProps,
    RefAttributes,
  } from "react";
  export type IconWeight =
    | "thin"
    | "light"
    | "regular"
    | "bold"
    | "fill"
    | "duotone";
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    weight?: IconWeight;
    color?: string;
    mirrored?: boolean;
  }
  export type Icon = ForwardRefExoticComponent<
    IconProps & RefAttributes<SVGSVGElement>
  >;
  export const Package: Icon;
  export const ShoppingCart: Icon;
  export const Article: Icon;
  export const CheckCircle: Icon;
  export const Image: Icon;
  export const Video: Icon;
  export const Check: Icon;
  export const ShoppingCart: Icon;
  export const ArrowRight: Icon;
  export const ArrowLeft: Icon;
  export const CaretDown: Icon;
  export const Leaf: Icon;
  export const ShieldCheck: Icon;
  export const Lightning: Icon;
  export const Fire: Icon;
  export const Coffee: Icon;
  export const Drop: Icon;
  export const Star: Icon;
  export const Info: Icon;
  export const Sparkle: Icon;
  export const X: Icon;
  export const User: Icon;
  export const FacebookLogo: Icon;
  export const TwitterLogo: Icon;
  export const YoutubeLogo: Icon;
  export const InstagramLogo: Icon;
  export const LinkedinLogo: Icon;
  export const Truck: Icon;
  export const Gear: Icon;
  export const SquaresFour: Icon;
  export const SignOut: Icon;
  export const BookOpen: Icon;
  export const UploadSimple: Icon;
  export const DownloadSimple: Icon;
}
