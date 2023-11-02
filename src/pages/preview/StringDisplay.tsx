import React from 'react';

import ToggleButton from '@mui/material/ToggleButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


function StringDisplay({ InputString, StringSize } : any) {
  let truncatedString = InputString;
  if(StringSize > 0) {
    truncatedString = InputString.slice(0, StringSize) + '...' + InputString.slice(0-StringSize);
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(InputString);
    navigator.clipboard.writeText(InputString);
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
