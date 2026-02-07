 import { useTranslation } from 'react-i18next';
import PageContainer from '../ui/PageContainer'
import { Outlet } from 'react-router-dom'

const StoreUpdateLayout = () => {
     const { t } = useTranslation("store"); // 👈 load dashboard.json
  
  return (
   <PageContainer
   title={t("Update your")}
   about={t("Store")}
   >
    <Outlet />
   </PageContainer>
  )
}

export default StoreUpdateLayout