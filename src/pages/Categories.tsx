import BoxCard from '@/components/ui/BoxCard';
import GeneralOverview from '@/components/ui/GeneralOverview';
import PageContainer from '@/components/ui/PageContainer';
import CategoriesGrid from '@/features/Categories/components/CategoriesGrid';
import { useStore } from '@/features/store/hooks/UseStore';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
 
const Categories = () => {
  const { t } = useTranslation("Categories");
  const { id } = useParams();
  const { data: store } = useStore(id);    
    return (
        <PageContainer
            about={t('Categories')}
            title={t("management")}
        >
            <BoxCard
                about={t("Generaloverview")}
            >
                <GeneralOverview
                    type={"Categories"}
                    stats={store?.categories || []} />
            </BoxCard>
            <BoxCard
                about={t("Categorieslist")}>
                <CategoriesGrid
                store={store}
                    Categories={store?.categories || []}
                    id={id || "dsd"}
                    domain={store?.domain || ""}
                />

            </BoxCard>
        </PageContainer>
    )
}
export default Categories