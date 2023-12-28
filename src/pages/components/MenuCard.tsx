import { useEffect, useState } from "react";
import { CategoryData, HOME_URL, MenuData } from "../../lib/definitions";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useModal } from "../../customHooks/useModal";

export type MenuCardProps = {
  menu: MenuData;
  category: CategoryData,
  categories: CategoryData[],
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>
  dragMenuStart: (m: MenuData) => void;
  dragMenuEnter: (m: MenuData) => void;
  dropMenu: () => void;
}

export default function MenuCard ({ 
  menu, 
  category, 
  categories,
  setCategories, 
  dragMenuStart, 
  dragMenuEnter, 
  dropMenu 
}: MenuCardProps) {
  const [imagePath, setImagePath] = useState<string>('');
  const {
    openEditMenuModal,
    openDeleteMenuModal
  } = useModal();
  
  useEffect(() => {
    menu.image !== '' ? setImagePath(menu.image) : setImagePath('');
  },[menu.image, imagePath]);

  const handleOpenEditMenuModal = () => {
    openEditMenuModal({
      menu,
      category,
      categories,
      setCategories
    })
  }

  const handleOpenDeleteMenuModal = () => {
    openDeleteMenuModal({
      menu,
      category,
      categories,
      setCategories
    });
  }
  
  return (
    <div 
      className="flex flex-col justify-between bg-[#808080] border border-gray-500 rounded-md shadow-md py-4"
      onDragStart={() => dragMenuStart?.(menu)}
      onDragEnter={() => dragMenuEnter?.(menu)}
      onDragEnd={() => dropMenu?.()}
      draggable
    >
      <div className="w-full flex items-start justify-center">
        {imagePath !== '' ? (
          <div 
            className="w-[130px] h-[130px] mb-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md flex items-center justify-center text-sm text-gray-600 bg-cover bg-center"
            style={{ backgroundImage: 'url(' + HOME_URL + imagePath + ')'}}
          ></div>
        ): (
          <div className="w-[130px] h-[130px] mb-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md flex items-center justify-center text-sm text-gray-600">
          image <br/>
          not ready
        </div>
        )}

      </div>
      <div className="w-full flex flex-col justify-start"> 
        <div className="w-full px-2">
          <div className="font-medium text-xl text-white mb-2 mt-1">{menu.title}</div>
          {menu.details && (<div className="text-base mb-3">{menu.details}</div>)}       
        </div>
        <div className="flex items-center justify-center">
          
          <div className={`mx-1 px-3 py-1 uppercase font-semibold border border-white rounded-md text-white text-xs ${menu.isOnSale ? 'text-white border-white' : 'text-gray-600 border-gray-600'}`}>
            {menu.isOnSale ? 'on sale' : 'hidden'}
          </div>
          {menu.isSpicy ? (<div className="mx-1 px-3 py-1 font-semibold rounded-md border border-red-600 text-red-600 uppercase text-xs bg-[#808080]">spicy</div>) : null}
          {menu.isVeggie ? (<div className="mx-1 px-3 py-1 uppercase font-semibold border border-lime-400 rounded-md text-lime-400 text-xs">vegan</div>) : null}
        </div>         
        <div className="mt-2 text-lg">${menu.price}</div>
      </div>
      

      <div className="mt-4 w-full">
        <div className="w-full flex flex-row justify-center px-4">
          <button 
            className="w-fit rounded-md border uppercase border-lime-500 mr-2 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
            onClick={handleOpenDeleteMenuModal}
          >
            Delete <FaCircleXmark className="ml-2 text-lime-400" />
          </button>

          <button 
            className="rounded-md border uppercase border-lime-500 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
            onClick={handleOpenEditMenuModal}
          >
            Edit <FaCircleCheck className="ml-2 text-lime-400 "/>
          </button>
        </div>
      </div>
    </div>
  )
}