// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import authConfig from 'src/configs/auth'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { formatHash, formatXWE, getContentTypeAbbreviation } from 'src/configs/functions';

const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: theme.spacing(3)
}))

const ImgOriginal = styled('img')(({  }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  style: { zIndex: 1 }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
    fontWeight: 550,
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }))
  
function ImagePreview(ImageSource: string) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    useEffect(() => {
      const img = new Image();
      img.src = ImageSource;
  
      img.onload = () => {
        setImageError(false);
      };
  
      img.onerror = () => {
        setImageError(true);
      };
    }, [ImageSource]);
  
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!imageError && !isHovered && (
          <Img src={ImageSource} />
        )}
        {!imageError && isHovered && (
          <div className="preview">
            <ImgOriginal src={ImageSource} 
            />
          </div>
        )}
      </div>
    );
  }

function FormatTxInfoInRow({ TxRecord }: any) {
    const FileMap: { [key: string]: string } = {}
    TxRecord?.tags.map((Item: { [key: string]: string }) => {
      FileMap[Item.name] = Item.value;
    });
    const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
    
    console.log("FileMap", FileMap)
    switch(FileType) {
        case 'PNG':
        case 'GIF':
        case 'JPEG':
        case 'JPG':
        case 'WEBM':
            return ImagePreview(`${authConfig.backEndApi}/${TxRecord?.id}/thumbnail`)
        case 'PDF':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'XLS':
        case 'XLSX':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'DOC':
        case 'DOCX':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'PPT':
        case 'PPTX':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'MP4':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'MP3':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'WAV':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
        case 'JSON':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']?FileMap['File-Name']:FileType}</LinkStyled>
        case 'EXE':
        case 'TEXT': 
        case 'CSV':  
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
    }

    switch(FileMap['File-Name']?.slice(-4)) {
        case '.stl':
            return <LinkStyled href={`/txs/view/${TxRecord?.id}`}>{FileMap['File-Name']}</LinkStyled>
    }
  
    //Bundle Support
    const BundleFormat = getContentTypeAbbreviation(FileMap['Bundle-Format']);
    const BundleVersion = getContentTypeAbbreviation(FileMap['Bundle-Version']);
    if(BundleFormat == "binary") {
      return <div>Bundle: { BundleVersion} </div>;
    }
  
    //Video Format
  
    if(TxRecord?.recipient != "") {
          
      return (
          <Typography noWrap variant='body2'>
            {formatXWE(TxRecord?.quantity.winston, 4) + " -> "}
            <LinkStyled href={`/addresses/view/${TxRecord?.id}`}>{formatHash(TxRecord?.recipient, 5)}</LinkStyled>
          </Typography>  
      )
    }
    
    return <div>Unknown</div>;
  
  }
  
export default FormatTxInfoInRow;
