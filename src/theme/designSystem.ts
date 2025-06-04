// designSystem.ts – Mantine-8 single-source theme (strict-TS safe)
import {
  MantineTheme,
  MantineColorsTuple,
  createTheme,
  rem,
  MantineThemeOverride,
} from '@mantine/core';

/*──────────────── TYPES ────────────────*/
interface ColorScale {
  50:string;100:string;200:string;300:string;400:string;
  500:string;600:string;700:string;800:string;900:string;
}
export type Shade = 0|1|2|3|4|5|6|7|8|9;
export type StatusType = 'success'|'warning'|'error'|'info'|'neutral';

/*──────────────── MOTION / LAYOUT ───────*/
export const ANIMATION = {
  FAST : '150ms',
  BASE : '200ms',
  SLOW : '300ms',
  EASE : 'cubic-bezier(0.4,0,0.2,1)',
  SPRING:'cubic-bezier(0.175,0.885,0.32,1.275)',
} as const;

export const LAYOUT = {
  HEADER           : rem(64),
  SIDEBAR          : rem(256),
  SIDEBAR_COLLAPSED: rem(64),
  CONTENT_MAX      : rem(1400),
  Z : { DROPDOWN:1000, HEADER:1100, SIDEBAR:1200, MODAL:1300, NOTIFY:1400, TOOLTIP:1500 } as const,
  BP: { XS:'30em', SM:'48em', MD:'64em', LG:'80em', XL:'96em' } as const,
} as const;

/*──────────────── BASE PALETTE ─────────*/
const palette = {
  brand  : {50:'#F0F7FF',100:'#E0EFFF',200:'#BAD7FF',300:'#7AB8FF',400:'#3690FF',500:'#0D6EFD',600:'#0B5ED7',700:'#0A4FB3',800:'#084298',900:'#05357A'} as ColorScale,
  neutral: {50:'#FAFBFC',100:'#F6F8FA',200:'#E1E4E8',300:'#D1D5DA',400:'#959DA5',500:'#6A737D',600:'#586069',700:'#444D56',800:'#2F363D',900:'#24292E'} as ColorScale,
  semantic:{success:'#28A745',warning:'#FFC107',error:'#DC3545',info:'#17A2B8'},
  accent :{purple:'#6F42C1',teal:'#20C997',orange:'#FD7E14',indigo:'#6610F2'},
} as const;

const toTuple = (s:ColorScale):MantineColorsTuple =>
  [s[50],s[100],s[200],s[300],s[400],s[500],s[600],s[700],s[800],s[900]];
const brand   = toTuple(palette.brand);
const neutral = toTuple(palette.neutral);
const semanticTuple = (
  base:string,
  t:[string,string,string,string,string],
  d:[string,string,string,string],
):MantineColorsTuple => [...t, base, ...d];

const success = semanticTuple(
  palette.semantic.success,
  ['#F8FFF9','#E6FFED','#C3F7CB','#91F5A0','#51D96A'],
  ['#22863A','#176F2C','#165C26','#144620'],
);
const warning = semanticTuple(
  palette.semantic.warning,
  ['#FFFCF0','#FFF8DB','#FFECB3','#FFE082','#FFD54F'],
  ['#FFB300','#FF8F00','#FF6F00','#E65100'],
);
const error = semanticTuple(
  palette.semantic.error,
  ['#FFF5F5','#FFEBEE','#FFCDD2','#EF9A9A','#E57373'],
  ['#C62828','#AD1457','#880E4F','#4A148C'],
);
const info = semanticTuple(
  palette.semantic.info,
  ['#F0F9FF','#E0F2FE','#BAE6FD','#7DD3FC','#38BDF8'],
  ['#0284C7','#0369A1','#075985','#0C4A6E'],
);
const purple = semanticTuple(
  palette.accent.purple,
  ['#F8F4FF','#F1E8FF','#E5D1FF','#D4AFFF','#C084FC'],
  ['#5A2C91','#4C1D95','#3C1A78','#2D1B69'],
);
const teal = semanticTuple(
  palette.accent.teal,
  ['#F0FDF9','#E6FFFA','#B2F5EA','#81E6D9','#4FD1C7'],
  ['#319795','#2C7A7B','#285E61','#234E52'],
);

/*──────────────── STATUS TOKENS ─────────*/
export const STATUS = {
  success:{ color:success[5], bg:success[0], text:success[6], border:success[2] },
  warning:{ color:warning[5], bg:warning[0], text:warning[6], border:warning[2] },
  error  :{ color:error[5],   bg:error[0],   text:error[6],   border:error[2] },
  info   :{ color:info[5],    bg:info[0],    text:info[6],    border:info[2] },
  neutral:{ color:neutral[5], bg:neutral[1], text:neutral[7], border:neutral[2] },
} as const;

/*──────────────── THEME OVERRIDE ─────────*/
export const mantineTheme: MantineThemeOverride = createTheme({
  colors:{ brand, neutral, success, warning, error, info, purple, teal },
  primaryColor:'brand',
  primaryShade:{ light:5, dark:6 },

  fontFamily:'"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  headings:{
    fontFamily:'inherit',
    fontWeight:'600',
    textWrap:'balance',
    sizes:{
      h1:{fontSize:rem(32),lineHeight:'1.25'},
      h2:{fontSize:rem(28),lineHeight:'1.3'},
      h3:{fontSize:rem(24),lineHeight:'1.35'},
      h4:{fontSize:rem(20),lineHeight:'1.4'},
      h5:{fontSize:rem(18),lineHeight:'1.45'},
      h6:{fontSize:rem(16),lineHeight:'1.5'},
    },
  },

  fontSizes:{ xs:rem(12), sm:rem(14), md:rem(16), lg:rem(18), xl:rem(20) },
  spacing :{ xs:rem(4),  sm:rem(8),  md:rem(16), lg:rem(24), xl:rem(32) },
  radius  :{ xs:rem(2),  sm:rem(4),  md:rem(6),  lg:rem(8),  xl:rem(12) },
  breakpoints:{
    xs:LAYOUT.BP.XS, sm:LAYOUT.BP.SM, md:LAYOUT.BP.MD,
    lg:LAYOUT.BP.LG, xl:LAYOUT.BP.XL,
  },

  respectReducedMotion:true,
  other:{
    layout:LAYOUT,
    animation:ANIMATION,
    status:STATUS,
    focusRing:`0 0 0 2px ${brand[2]}, 0 0 0 4px ${brand[5]}`,
  },
});

/*──────────────── HELPERS ───────────────*/
export const utils = {
  getColor:<K extends keyof MantineTheme['colors'] & string>(
    family: K,
    shade: Shade = 5,
  ) => mantineTheme.colors?.[family]![shade], // non-null assertion ✔
  transition:(prop='all',dur=ANIMATION.BASE,ease=ANIMATION.EASE)=>
    `${prop} ${dur} ${ease}`,
};

export default { theme: mantineTheme } as const;
