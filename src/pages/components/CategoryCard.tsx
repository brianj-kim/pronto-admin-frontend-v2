import { FaCircleCheck, FaCircleXmark, FaCirclePlus, FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { CategoryData } from "../../lib/definitions";
import MenuCard from "./MenuCard";
import { useRef, useState } from "react";
import { useModal } from "../../customHooks/useModal";

type CategoryCardProps = {
  category: CategoryData;
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>;
}

export default function CategoryCard ({ category, categories, setCategories }: CategoryCardProps) {
  const menusDispRef = useRef<HTMLDivElement>(null);
  const [showCard, setShowCard] = useState<boolean>(true);

  const toggleCardShow = () => setShowCard(!showCard);

  const { 
    openEditCategoryModal,
    openDeleteCategoryModal
  } = useModal();
  
  const handleOpenEditCategoryModal = () => {
    openEditCategoryModal({
      category,
      categories,
      setCategories,
    });
  };

  const handleOpenDeleteCategoryModal = () => {
    openDeleteCategoryModal({
      category,
      categories,
      setCategories,
    });
  };

  // console.log(showCard);
  return (

    <div
      className="w-11/12 relative z-0 text-center rounded-md border border-gray-500 my-3 divide-y divide-gray-500 shadow-md"
    >
      <div className="w-full py-3 flex flex-col md:flex-row justify-between items-center">        
        <div className="flex flex-col justify-startitems-center pl-6">
          <div className="font-medium text-xl text-left">{category.title} </div>
          {category.details ? (<div className="text-base text-left">{category.details}</div>) : null }    

        </div>   
        <div className="flex flex-col md:flex-row justify-center px-4">
          <button 
            className="rounded-md border uppercase border-lime-500 mr-2 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
            onClick={handleOpenDeleteCategoryModal}
          >
            Delete<FaCircleXmark className="ml-2 text-lime-400" />
          </button>

          <button 
            className="rounded-md border uppercase border-lime-500 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
            onClick={handleOpenEditCategoryModal}
          >
            Edit<FaCircleCheck className="ml-2 text-lime-400"/>
          </button>

          <button 
            className="rounded-md ml-6 border uppercase border-lime-500 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
          >
            Add Menu<FaCirclePlus className="ml-2 text-lime-400" />
          </button>
          <button
            onClick={() => toggleCardShow()}
            className="ml-3 rounded-md border border-lime-400 p-1 text-sm items-center"
          >
            {showCard ? (<FaAngleUp className="text-lime-400 font-bold" />) 
            : (<FaAngleDown className="text-lime-400 font-bold" />)}
          </button>
        </div>         

      </div>
      <div className={`w-full transition-transform duration-150 ease-in-out ${showCard ? null : 'hidden'} `} ref={menusDispRef}>
        <div className={`py-3 px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {category.menus && category.menus.map((menu) => (
            <MenuCard key={menu.mid} menu={menu} />
          ))}
        </div>
      
      </div>
    </div>

      

  )
}
