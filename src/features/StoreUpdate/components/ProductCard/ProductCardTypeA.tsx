import { Search, ShoppingCart } from 'lucide-react';
 
interface ProductCardTypeProps {
    image: string;
name: string;
price: number;
Oldprice: number;
mainColor: string
}

const ProductCardTypeA = ({image, name, price, Oldprice, mainColor}:ProductCardTypeProps) => {
  return (
    <article
className="group relative  rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden"                            >
                                     {/* Product Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                        <img
                                            alt={name}
                                            width={300}
                                            height={300}
                                            src={image}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        {/* Quick Actions overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                            <button
                                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-indigo-600 hover:scale-110 transition-all"
                                                aria-label="عرض التفاصيل"
                                            >
                                                <Search size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        
                                        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                                            { name}
                                        </h3>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div>
                                                <span className="block text-lg font-bold text-gray-900">
                                                    { price} دج
                                                </span>
                                                     <span className="text-sm text-gray-400 line-through">
                                                        {Oldprice}
                                                    </span>
                                                
                                            </div>
                                            <button
                                                style={{ background: mainColor }}
                                                className="text-white p-2.5 rounded-lg hover:opacity-90 transition-colors shadow-lg shadow-indigo-200"
                                                aria-label="buy"
                                            >
                                                <ShoppingCart size={20} />
                                            </button>
                                        </div>
                                    </div>
                             </article>
  )
}

export default ProductCardTypeA