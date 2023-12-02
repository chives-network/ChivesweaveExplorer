import React, { Fragment } from 'react';

import ToggleButton from '@mui/material/ToggleButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { isMobile } from 'src/configs/functions';

import Link from 'next/link'
import { styled } from '@mui/material/styles'

interface Props {
  InputString: string
  StringSize: number
  href: string | null
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 550,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

function StringDisplay({ InputString, StringSize, href } : Props) {
  let truncatedString = InputString;
  if(InputString=="" || InputString==undefined) {
    return <Fragment></Fragment>
  }
  const IsMobile = isMobile();
  if(StringSize > 0 && IsMobile == true) {
    truncatedString = InputString.slice(0, 4) + '...' + InputString.slice(0-4);
  }
  else if(StringSize >= 40 && IsMobile == false) {
    truncatedString = InputString;
  }
  else if(StringSize > 0 && IsMobile == false) {
    truncatedString = InputString.slice(0, StringSize) + '...' + InputString.slice(0-StringSize);
  }
  if(InputString && InputString.length <= StringSize * 2) {
    truncatedString = InputString;
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(InputString);
    navigator.clipboard.writeText(InputString);
  }

  //console.log("isMobile", isMobile())

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {href && href != undefined ? 
          <LinkStyled href={href} sx={{pr: 2}}>
            <div>{truncatedString}</div>
          </LinkStyled>
        :
          <div style={{ paddingRight: 5}}>{truncatedString}</div>
        }
        {InputString && InputString.length > 20 ?
          <ToggleButton value='left' size="small">
              <Icon onClick={copyToClipboard} icon='material-symbols:content-copy-outline' fontSize={20} />
          </ToggleButton>
        :
          <Fragment></Fragment>
        }
    </div>
  );
}

export default StringDisplay;
