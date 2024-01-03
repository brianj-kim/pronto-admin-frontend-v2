import { FaCircleCheck, FaCircleXmark, FaCirclePlus, FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { CategoryData } from "../../lib/definitions";
import { useEffect, useRef, useState } from "react";
import { useModal } from "../../customHooks/useModal";
import MenuList from "./MenuList";

type CategoryCardProps = {
  isCollapsed: boolean;
  category: CategoryData;
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>;
  dragCategoryStart: (c: CategoryData) => void;
  dragCategoryEnter: (c: CategoryData) => void;
  dropCategory: (e: React.DragEvent) => void;
}

export default function CategoryCard ({ 
  dragCategoryStart, 
  dragCategoryEnter, 
  dropCategory, 
  isCollapsed, 
  category, 
  categories,
  setCategories 
}: CategoryCardProps) {
  const menusDispRef = useRef<HTMLDivElement>(null);
  const [showCard, setShowCard] = useState<boolean>(true);

  const toggleCardShow = () => setShowCard(!showCard);

  useEffect(() => {
    setShowCard(!isCollapsed);
  },[isCollapsed]);

  const { 
    openEditCategoryModal,
    openDeleteCategoryModal,

    openCreateMenuModal
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


  const handleOpenCreateMenuModal = () => {
    openCreateMenuModal({
      category,
      categories,
      setCategories
    })
  }

  
  return (

    <div
      className="w-11/12 relative z-0 text-center rounded-md bg-[#474747] border border-gray-500 my-3 divide-y divide-gray-600 shadow-md"
      onDragStart={() => dragCategoryStart?.(category)}
      onDragEnter={() => dragCategoryEnter?.(category)}
      onDragEnd={(e) => dropCategory?.(e)}
      draggable
      
    >
      <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-center">        
        <div className="flex flex-col justify-start items-center pl-6">
          <div className="w-full font-medium text-xl text-left">{category.title} </div>
          {category.details ? (<div className="text-base text-left">{category.details}</div>) : null }    

        </div>   
        <div className="flex flex-row sm: mt-3 justify-center px-4">
          <button 
            className="rounded-md border uppercase border-lime-500 mr-2 sm:mr-0 font-medium text-xs px-2 sm:px-1 py-1 sm:py-0 text-center flex flex-row justify-around items-center"
            onClick={handleOpenDeleteCategoryModal}
          >
            Delete<FaCircleXmark className="ml-2 text-lime-400" />
          </button>

          <button 
            className="rounded-md ml-3 border uppercase border-lime-500 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
            onClick={handleOpenEditCategoryModal}
          >
            Edit<FaCircleCheck className="ml-2 text-lime-400"/>
          </button>

          <button 
            className="rounded-md ml-5 border uppercase border-lime-500 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
            onClick={handleOpenCreateMenuModal}
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
          <MenuList 
            menus={category.menus}
            category={category}
            categories={categories}
            setCategories={setCategories}
    
          />
        </div>
      
      </div>
    </div>

      

  )
}
