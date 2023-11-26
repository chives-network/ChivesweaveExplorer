// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, getContentTypeAbbreviation } from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface TransactionCellType {
  row: TxRecordType
}

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
  fontSize: '1rem',
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

function parseTxAndGetMemoFileInfo(TxRecord: TxRecordType) {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  
  //console.log("FileType", FileType)
  switch(FileType) {
    case 'PNG':
    case 'GIF':
    case 'JPEG':
    case 'JPG':
    case 'WEBM':
      return ImagePreview(`${authConfig.backEndApi}/${TxRecord.id}/thumbnail`)
    case 'PDF':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'XLS':
    case 'XLSX':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'DOC':
    case 'DOCX':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'PPT':
    case 'PPTX':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'MP4':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'MP3':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'WAV':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
  }

  //Bundle Support
  const BundleFormat = getContentTypeAbbreviation(FileMap['Bundle-Format']);
  const BundleVersion = getContentTypeAbbreviation(FileMap['Bundle-Version']);
  if(BundleFormat == "binary") {
    return "Bundle " + BundleVersion;
  }

  //Video Format

  if(TxRecord.recipient != "") {
        
    return (
        <Typography noWrap variant='body2'>
          {formatXWE(TxRecord.quantity.winston, 4) + " -> "}
          <LinkStyled href={`/addresses/all/${TxRecord.id}`}>{formatHash(TxRecord.recipient, 5)}</LinkStyled>
        </Typography>

    )
  }

  return "Unknown";

}



export type propsType = {
  data: any[]
}

const AnalyticsTransactionList = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props

  const columns: GridColDef[] = [
    {
      flex: 0.12,
      minWidth: 150,
      field: 'TxId',
      headerName: `${t(`TxId`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/txs/view/${row.id}`}>{formatHash(row.id, 4)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'Info',
      headerName: `${t(`Info`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {parseTxAndGetMemoFileInfo(row)}
          </Typography>
        )
      }
    }
  ]

  return (
    <Card>
      <DataGrid autoHeight hideFooter rows={data} columns={columns} disableRowSelectionOnClick pagination={undefined} />
    </Card>
  )
}


export default AnalyticsTransactionList
