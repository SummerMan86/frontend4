// dashboardStyles.ts – dashboard-level helper styles (strict TS)
import { MantineTheme, rem } from '@mantine/core';
import { Shade } from './designSystem';

export const dashboardStyles = (theme: MantineTheme) => {
  const c = <K extends keyof MantineTheme['colors'] & string>(
    fam: K, shade: Shade = 5,
  ) => theme.colors[fam][shade];

  const { animation:a, layout:l } = theme.other;

  return {
    /* animations */
    animations:{
      cardHover:{ transition:`transform ${a.BASE} ${a.EASE}`, '&:hover':{ transform:'translateY(-2px)' } },
      fadeIn :{ animation:`fadeIn ${a.BASE} ${a.EASE}` },
      slideIn:{ animation:`slideIn ${a.FAST} ${a.EASE}` },
      pulse  :{ animation:'pulse 2s infinite' },
    },

    /* navigation */
    navigation:{
      sidebar:{
        background:c('neutral',0),
        border:c('neutral',2),
        text:c('neutral',7),
        textHover:c('neutral',9),
        activeBackground:c('brand',0),
        activeText:c('brand',7),
        activeBorder:c('brand',5),
        width:l.SIDEBAR,
        collapsedWidth:l.SIDEBAR_COLLAPSED,
      },
      header:{
        background:'#FFF',
        border:c('neutral',2),
        text:c('neutral',8),
        shadow:'0 1px 3px rgba(0 0 0 / 0.1)',
        height:l.HEADER,
      },
    },

    /* status cards */
    statusCards:Object.fromEntries(
      Object.entries(theme.other.status).map(
        ([k,v]) => [k,{
          backgroundColor:(v as any).bg,
          borderColor:(v as any).border,
          color:(v as any).text,
        }],
      ),
    ) as Record<keyof typeof theme.other.status,{
      backgroundColor:string; borderColor:string; color:string;
    }>,

    /* component snippets */
    components:{
      dashboardCard:{
        background:'#FFF',
        border:`1px solid ${c('neutral',2)}`,
        borderRadius:theme.radius.lg,
        padding:theme.spacing.lg,
        boxShadow:`0 2px 8px ${c('neutral',2)}`,
        transition:`all ${a.BASE} ${a.EASE}`,
        '&:hover':{
          borderColor:c('neutral',3),
          boxShadow:`0 8px 24px ${c('neutral',3)}`,
        },
      },
      actionButton:{
        background:c('brand',5),
        color:'#FFF',
        border:'none',
        borderRadius:theme.radius.sm,
        padding:`${rem(8)} ${rem(16)}`,
        fontSize:theme.fontSizes.sm,
        fontWeight:500,
        cursor:'pointer',
        transition:`transform ${a.BASE} ${a.EASE}`,
        '&:hover':{ background:c('brand',6), transform:'translateY(-1px)' },
        '&:active':{ transform:'translateY(0)' },
        '&:disabled':{ background:c('neutral',4), cursor:'not-allowed' },
      },
    },
  } as const;
};

export default dashboardStyles;
