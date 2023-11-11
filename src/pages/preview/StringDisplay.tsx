import React from 'react';

import ToggleButton from '@mui/material/ToggleButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { isMobile } from 'src/configs/functions';


function StringDisplay({ InputString, StringSize } : any) {
  let truncatedString = InputString;
  const IsMobile = isMobile();
  if(StringSize > 0 && IsMobile == true) {
    truncatedString = InputString.slice(0, 4) + '...' + InputString.slice(0-4);
  }
  else if(StringSize >= 20 && IsMobile == false) {
    truncatedString = InputString;
  }
  else if(StringSize > 0 && IsMobile == false) {
    truncatedString = InputString.slice(0, StringSize) + '...' + InputString.slice(0-StringSize);
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(InputString);
    navigator.clipboard.writeText(InputString);
  }

  //console.log("isMobile", isMobile())

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>{truncatedString}</div>
        <div>　</div>
        <ToggleButton value='left' size="small">
            <Icon onClick={copyToClipboard} icon='material-symbols:content-copy-outline' fontSize={20} />
        </ToggleButton>
    </div>
  );
}

export default StringDisplay;
