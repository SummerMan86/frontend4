// components.ts – MantineTheme.components overrides
import type { MantineThemeComponents, MantineTheme } from '@mantine/core';

export const components: MantineThemeComponents = {
  /* BUTTON */
  Button:{
    defaultProps:{ radius:'md', size:'sm', variant:'filled' },
    styles:(theme: MantineTheme, params: any)=>{
      const a = theme.other.animation;
      const base = { fontWeight:600, transition:`all ${a.BASE} ${a.EASE}` };

      switch (params.variant){
        case 'outline':
          return { root:{
            ...base,
            borderColor:theme.colors.neutral[3],
            color:theme.colors.neutral[9],
            '&:hover':{
              backgroundColor:theme.colors.neutral[0],
              borderColor:theme.colors.brand[5],
              color:theme.colors.brand[7],
            },
          }};
        case 'light':
          return { root:{
            ...base,
            backgroundColor:theme.colors.brand[0],
            color:theme.colors.brand[7],
            '&:hover':{ backgroundColor:theme.colors.brand[1] },
          }};
        default: // filled
          return { root:{
            ...base,
            backgroundColor:theme.colors.brand[5],
            color:'#FFF',
            '&:hover':{ backgroundColor:theme.colors.brand[6] },
          }};
      }
    },
  },

  /* CARD */
  Card:{
    defaultProps:{ shadow:'sm', withBorder:true, radius:'lg', padding:'lg' },
    styles:(theme: MantineTheme)=>({
      root:{
        background:'#FFF',
        border:`1px solid ${theme.colors.neutral[2]}`,
        transition:`all ${theme.other.animation.BASE} ${theme.other.animation.EASE}`,
        '&:hover':{
          transform:'translateY(-2px)',
          boxShadow:theme.shadows.md,
        },
      },
    }),
  },

  /* TEXTINPUT / SELECT */
  TextInput:{
    defaultProps:{ radius:'md', size:'sm' },
    styles:(theme: MantineTheme)=>({
      input:{
        borderColor:theme.colors.neutral[3],
        '&:focus':{
          borderColor:theme.colors.brand[5],
          boxShadow:theme.other.focusRing,
        },
      },
      label:{ fontWeight:600, color:theme.colors.neutral[8] },
    }),
  },
  Select:{
    defaultProps:{ radius:'md', size:'sm' },
    styles:(theme: MantineTheme)=>({
      input:{
        borderColor:theme.colors.neutral[3],
        '&:focus':{
          borderColor:theme.colors.brand[5],
          boxShadow:theme.other.focusRing,
        },
      },
      label:{ fontWeight:600, color:theme.colors.neutral[8] },
    }),
  },

  /* TABLE */
  Table:{
    defaultProps:{ striped:true, highlightOnHover:true, withColumnBorders:false },
    styles:(theme: MantineTheme)=>({
      table:{ fontVariantNumeric:'tabular-nums' },
      th:{
        fontWeight:600,
        color:theme.colors.neutral[7],
        backgroundColor:theme.colors.neutral[0],
        fontSize:theme.fontSizes.xs,
      },
      td:{ fontWeight:500, color:theme.colors.neutral[9] },
    }),
  },

  /* BADGE */
  Badge:{
    defaultProps:{ radius:'sm', variant:'light' },
    styles:(theme: MantineTheme, params: any)=>{
      const map = theme.other.status as Record<string,{
        bg:string; border:string; text:string;
      }>;
      const token = map[params.color ?? ''];
      return token ? {
        root:{
          backgroundColor:token.bg,
          border:`1px solid ${token.border}`,
          color:token.text,
          fontWeight:600,
        },
      } : { root:{ fontWeight:600 } };
    },
  },

  /* TYPOGRAPHY & MISC */
  Text:{ styles:()=>({ root:{ fontVariantNumeric:'tabular-nums', fontFeatureSettings:'\"tnum\" 1, \"kern\" 1' } }) },
  Title:{ styles:(t: MantineTheme)=>({ root:{ color:t.colors.neutral[9], letterSpacing:'-0.015em' } }) },
  Container:{ defaultProps:{ size:'xl', py:'xl' } },
  ThemeIcon:{ styles:()=>({ root:{ borderRadius:'50%' } }) },
};
