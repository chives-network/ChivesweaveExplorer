// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const Subscription = () => {
    // ** Hook
    const { t } = useTranslation()
    
    return (
        <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title={`${t('Subscription')}`} />
                <CardContent>{`${t('user_subscribe_intro')}`}</CardContent>
            </Card>
        </Grid>
        </Grid>
    )
}

export default Subscription
