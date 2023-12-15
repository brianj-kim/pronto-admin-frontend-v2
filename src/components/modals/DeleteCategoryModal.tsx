import { useAuth } from "../../customHooks/useAuth";
import { API_URL, HOME_URL } from "../../lib/definitions";
import { IModal, CategoryData } from "../../lib/definitions";

export interface DeleteCategoryModalProps extends IModal {
  category: CategoryData,
  categories: CategoryData[],
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>,
}

export default function DeleteCategoryModal ({
  visible = false,
  onClose,
  category,
  categories,
  setCategories
}: DeleteCategoryModalProps) {
  const { user } = useAuth();

  let menusString: string = '';
  category!.menus && category!.menus.map(m => menusString += m.title + ', ');
  menusString = menusString.substring(0, menusString.length-2);

  //console.log(menusString);

  const handleDeleteCategory = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await fetch(API_URL + `/category/${category.cid}`, {
      method: 'DELETE',
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      }      
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      // return;
      if(data.rowCount.deletedCategory > 0) {
        const newCategories = categories!.filter(c => c.cid !== category.cid);
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
              <div className="text-lime-400 text-base font-semibold pl-2">Category Deletion Confirmation</div>
              
              <button 
                type="button" 
                className="text-white bg-transparent hover:bg-lime-500 hover:text-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="w-full h-full px-5 py-3 bg-[#808080] rounded-b-lg">
              
              <div className="w-full border border-gray-500 rounded-md flex flex-col px-2 py-2 justify-center items-center">  
                <div className="mt-2">
                    {category!.image !== '' 
                    ? <div className="w-[144px] h-[144px] p-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md bg-cover bg-center" style={{ backgroundImage: 'url(' + HOME_URL + category.image + ')'}}></div> 
                    : <div className="w-[144px] h-[144px] p-2 bg-gray-400 border border-1 rounded-full border-gray-500 shadow-md flex items-center justify-center text-sm">
                    image <br/>
                    not ready
                  </div>}
                </div>
                <div className="flex flex-column">
                  <div className="w-full flex flex-col justify-center items-center">
                    <h5 className="text-base tracking-tight text-white font-bold mb-1 mt-3">{category!.title}</h5>                      
                    { category!.details != '' ? <p className="text-white text-sm mb-1">{category!.details}</p> : null }   
                    { menusString !== '' ? <span className="text-sm text-white"><span className="font-bold">Menus:</span> { menusString }</span> : null }
                  </div> 
                </div>
                
              </div>

              <div className="w-full py-3 flex flex-col justify-center items-center">
                <span className="text-sm text-white">Are sure to delete the category and the menus under the category?</span>
                <div>
                  <button 
                    className="mt-2 mr-4 px-3 py-2 uppercase rounded-md shadow-sm border border-lime-400 text-xs text-white font-bold"
                    onClick={onClose}
                  >
                    NO
                  </button>
                  <button 
                    className="px-3 py-2 uppercase rounded-md shadow-sm bg-lime-400 border border-lime-400 text-xs text-gray-600 font-bold"
                    onClick={handleDeleteCategory}
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
