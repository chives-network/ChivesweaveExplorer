// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import UserViewLeft from 'src/views/user/UserViewLeft'
import UserViewRight from 'src/views/user/UserViewRight'

// ** Next Import
import { useRouter } from 'next/router'

type Props = {
  tab: string
}

const UserView = ({ tab }: Props) => {
  
  const router = useRouter()
  const { id } = router.query

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft address={String(id)} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} address={String(id)} />
      </Grid>
    </Grid>
  )
}

export default UserView
