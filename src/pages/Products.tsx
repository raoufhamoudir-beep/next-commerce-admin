 
 import { useTranslation } from "react-i18next";
import PageContainer from "@/components/ui/PageContainer";
import BoxCard from "@/components/ui/BoxCard";
  import { useParams } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/UseProducts";
import { useStore } from "@/features/store/hooks/UseStore";
import ProductGrid from "@/features/products/components/ProductGrid";
import GeneralOverview from "@/components/ui/GeneralOverview";


const Products = () => {
    const { t } = useTranslation("product");
    const {id} = useParams() 
    const  {data: products} = useProducts(id)
    const  {data: store} = useStore(id)

    return (
        <PageContainer
            title={t('products')}
            about={t("management")}

        >
 
            <BoxCard
                about={t("Generaloverview")}
            >
                <GeneralOverview
                type="product"
                stats={products || []}
                   />
            </BoxCard>
            <BoxCard
                about={t("Productlist")}>
                <ProductGrid
                id={id || ""}
                    domain={store?.domain || '' }
                    products={products || [] }
                    
                />
            </BoxCard>
            
        </PageContainer>
    );
};

export default Products;