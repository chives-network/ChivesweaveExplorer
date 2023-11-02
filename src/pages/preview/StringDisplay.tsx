import React from 'react';

import ToggleButton from '@mui/material/ToggleButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


function StringDisplay({ inputString, StringSize } : any) {
  let truncatedString = inputString;
  if(StringSize > 0) {
    truncatedString = inputString.slice(0, StringSize) + '...' + inputString.slice(0-StringSize);
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputString);
  }

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
