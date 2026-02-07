interface CategoryCardTypeProps {
    image: string;
name: string;
mainColor?: string

}
const CategoryCardTypeC =({image, name, mainColor}:CategoryCardTypeProps)  => {
  return (
     <div className="w-11/12 md:w-44 bg-white rounded-2xl   ">
            <img src={image} className='w-full hover:scale-105 rounded-xl h-40 object-cover' alt="" />
            <div
                className='mt-auto flex justify-center flex-col p-3 z-[500]  '
            >
                <span
                    className='text-center mx-auto'
                >{name}</span>
                <button
                                style={{backgroundColor: mainColor || "black"}}

                    className='   text-white  px-3 py-1 rounded-xl w-full mt-2'
                >
                    explore
                </button>
            </div>
        </div>
  )
}

export default CategoryCardTypeC