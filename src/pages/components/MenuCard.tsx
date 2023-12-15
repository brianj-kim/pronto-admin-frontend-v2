import { useEffect, useState } from "react";
import { HOME_URL, MenuData } from "../../lib/definitions";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";


export default function MenuCard ({ menu }: { menu: MenuData}) {
  const [imagePath, setImagePath] = useState<string>('');
  
  useEffect(() => {
    menu.image !== '' ? setImagePath(menu.image) : null;
  },[setImagePath, imagePath, menu.image]);

  return (
    <div 
      className="flex flex-col justify-between border border-gray-500 rounded-md shadow-md py-4"
    >
      
      <div className="w-full flex items-start justify-center">
        {imagePath !== '' ? (
          <div 
            className="w-[120px] h-[120px] p-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md flex items-center justify-center text-sm text-gray-600 bg-cover bg-center"
            style={{ backgroundImage: 'url(' + HOME_URL + imagePath + ')'}}
          ></div>
        ): (
          <div className="w-[120px] h-[120px] p-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md flex items-center justify-center text-sm text-gray-600">
          image <br/>
          not ready
        </div>
        )}

      </div>
      <div className="w-full flex flex-col justify-start mt-3"> 
        <div className="font-medium text-lg">{menu.title}</div>
        <div className="flex items-center justify-center">
          {menu.isSpicy ? (<div className="my-2 px-2 uppercase font-semibold border border-red-600 rounded-md text-red-600 text-sm">spicy</div>) : null}
          {menu.isVeggie ? (<div className="my-2 px-2 ml-3 uppercase font-semibold border border-lime-400 rounded-md text-lime-400 text-sm">vegan</div>) : null}
        </div>

        {menu.details && (<div className="text-base">{menu.details}</div>)}        
        <div className="pt-2 text-lg">${menu.price}</div>
      </div>
      

      <div className="mt-4 w-full">
        <div className="flex flex-col md:flex-row justify-center px-4">
          <button 
            className="rounded-md border uppercase border-lime-500 mr-2 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
          >
            Delete <FaCircleXmark className="ml-2 text-lime-400" />
          </button>

          <button 
            className="rounded-md border uppercase border-lime-500 font-medium text-xs px-2 py-1 text-center flex flex-row justify-around items-center"
          >
            Edit <FaCircleCheck className="ml-2 text-lime-400 "/>
          </button>
        </div>
      </div>
    </div>
  )
}