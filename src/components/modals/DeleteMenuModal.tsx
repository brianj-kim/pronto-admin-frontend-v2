import { useAuth } from "../../customHooks/useAuth";
import { CategoryData, MenuData, IModal, API_URL, HOME_URL } from "../../lib/definitions";

export interface DeleteMenuModalProps extends IModal {
  menu: MenuData,
  category: CategoryData,
  categories: CategoryData[],
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>,
}

export default function DeleteMenuModal ({
  visible = false,
  onClose,
  menu,
  category,
  categories,
  setCategories
}: DeleteMenuModalProps) {
  const { user } = useAuth();
  // console.log(categoryId);

  const handleDeleteMenu = async () => {
    // console.log("Deleteing menu id of " + menu.mid + " & category id of " + categoryId);

    await fetch(API_URL + `/menu/${menu.mid}`, {
      method: 'DELETE',
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      },
      body: JSON.stringify({ cid: category.cid }) 
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // return;

      if(data.deletedRowCount === 1) {
        let newMenus: MenuData[] | null = category.menus!.filter((m) => m.mid !== menu.mid);
        
        if(data.orderUpdated > 0) {// If there exist orders to update after the menu deletion
          newMenus = newMenus.map((m) => 
            m.order > menu.order ? {...m, order: m.order - 1} : m
          )
        }

        const newCategory: CategoryData = {...category, menus: newMenus!};

        const newCategories: CategoryData[] = categories!.map((c) => {
          if(c.cid === category.cid) {
            return newCategory;
          }          
          return c;
        });

        setCategories?.(newCategories);
      }

      
    })
    .catch(err => console.error(err));
    
    onClose?.();
  }

  return (
    <>      
      { visible ? (
        <div 
          onClick={onClose}
          className="z-20 fixed flex items-center top-0 left-0 w-full h-full bg-gray-800/80 overflow-x-hidden overflow-y-auto"
        >
          <div 
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className={`z-30 w-3/5 m-auto rounded-lg shadow-md overflow-auto`}
          >
            <div className="w-full flex justify-between items-center px-3 py-3 rounded-t-lg bg-[#474747]" >
              <div className="text-white font-semibold text-base pl-2">Delete a menu: {menu!.title}</div>
              
              <button 
                type="button" 
                className="text-white bg-transparent hover:bg-lime-400 hover:text-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="w-full h-full px-5 py-3 bg-[#808080] rounded-b-lg">

              <div className="w-full border border-gray-500 rounded-md flex flex-col px-2 py-2 justify-center items-center">  
                <div className="mt-2">
                    {menu!.image !== '' 
                    ? <div className="w-[144px] h-[144px] p-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md bg-cover bg-center" style={{ backgroundImage: 'url(' + HOME_URL + menu.image + ')'}}></div> 
                    : <div className="w-[144px] h-[144px] p-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md flex items-center justify-center text-sm">
                    image <br/>
                    not ready
                  </div>}
                </div>
                <div className="flex flex-column">
                  <div className="w-full flex flex-col justify-center items-center mb-2">
                    <h5 className="text-lg tracking-tight text-white font-medium mb-1 mt-3">{menu.title}</h5>                      
                    { menu.details != '' ? <p className="text-white text-base mb-2">{menu.details}</p> : null }   
                    <p className="text-lime-400 text-xl font-medium mb-2">${menu!.price}</p>
          
                    { menu!.isSpicy ? <div className="px-3 py-1 font-semibold rounded-md border border-red-600 text-red-600 uppercase text-xs bg-[#808080]">spicy</div> : null}         
                    { menu!.isVeggie ? <div className="mb-1 px-3 py-1 uppercase text-lime-400 text-sm font-semibold rounded-md border border-lime-400 bg-[#808080]">vegan</div> : null } 
                  </div> 
                </div>
                
              </div>

              <div className="w-full py-3 flex flex-col justify-center items-center">
                <span className="text-white">Are sure to delete the menu?</span>
                <div>
                  <button 
                    className="mt-2 mr-4 px-3 py-2 uppercase rounded-md shadow-sm border border-lime-400 text-lime-400 text-xs font-bold"
                    onClick={onClose}
                  >
                    NO
                  </button>
                  <button 
                    className="px-3 py-2 uppercase rounded-md shadow-sm bg-lime-400 border border-lime-500 text-xs text-gray-600 font-bold"
                    onClick={handleDeleteMenu}
                  >
                    YES
                  </button>
                </div>                
              </div>
                
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
