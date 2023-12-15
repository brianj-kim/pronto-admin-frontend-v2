import { FormEvent, useEffect, useRef } from "react";
import { CategoryData, MenuData, IModal } from "../../lib/definitions";
import { API_URL } from "../../lib/definitions";
import { useAuth } from "../../customHooks/useAuth";

export interface CreateMenuModalProps extends IModal {
  category: CategoryData,
  categories: CategoryData[],
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>,
}

export default function CreateMenuModal ({
  visible = false,
  onClose,
  category,
  categories,
  setCategories
}: CreateMenuModalProps) {
  const { user } = useAuth();

  const titleRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const isSpicyRef = useRef<HTMLInputElement>(null);
  const isVeggieRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(visible) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
  },[visible]);

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData();

    formData.append('cid', String(category.cid));
    formData.append('title', titleRef.current!.value);
    formData.append('details', detailsRef.current!.value);
    formData.append('price', String(priceRef.current!.value));
    formData.append('isVeggie', String(isVeggieRef.current!.checked));
    formData.append('isSpicy', String(isSpicyRef.current!.checked));
    formData.append('image', imageRef.current!.files![0]);

    (imageRef.current!.files! && imageRef.current!.files!.length) ? formData.append('image', imageRef.current!.files![0]) : null;

    await fetch(API_URL + '/menu/', {
      method: 'POST',
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      }, 
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data.result);        
        // console.log(category);
        // return;

        const newMenu: MenuData = {
          mid: data.result.mid,
          order: data.result.order,
          title: data.result.title,
          details: data.result.details,
          image: data.result.image,
          price: data.result.price,
          isSpicy: data.result.isSpicy,
          isVeggie: data.result.isVeggie
        }

        const newMenus: MenuData[] = [...category.menus!, newMenu]; 

        const newCategory: CategoryData = { ...category, menus: newMenus };

        const newCategories: CategoryData[] = categories.map(c => {
                                                if(c.cid === category.cid) {
                                                  return newCategory;
                                                }                                                
                                                return c;

                                              });

        setCategories?.(newCategories);
        
      })
      .catch((err) => {
        console.error("Error", err);
      });

      onClose?.();
  }

  useEffect(() => {
    titleRef.current!.focus();
    
  },[]);

  // console.log(categoryId);
  return (
    <>      
      { visible ? (
        <div 
          onClick={onClose}
          className="z-20 fixed flex items-center top-0 left-0 w-full h-full bg-gray-800/80 overflow-x-hidden overflow-y-auto"
        >
          <div 
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className={`z-30 w-4/5 m-auto rounded-lg shadow-md overflow-auto`}
          >
            <div className="w-full flex justify-between px-3 py-3 rounded-t-lg bg-[#474747]" >
              <span className="pt-2 pl-3 text-lime-400 text-base font-semibold">Create a menu { category.title ? `under ${category.title}` : null }</span>
              
              <button 
                type="button" 
                className="text-white bg-transparent hover:bg-lime-500 hover:text-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="w-full h-full px-6 py-3 bg-[#808080] rounded-b-lg">
              
              <form onSubmit={handleFormSubmit}>
                
                <div className="my-3 align-left">
                  <label htmlFor="title" className="block mb-2 text-xs uppercase text-white font-semibold text-left">menu title</label>
                  <input 
                    type="text" 
                    id="title" 
                    autoComplete='off'
                    ref={titleRef} 
                    className="bg-[#808080] border border-gray-600 shadow-sm text-white sm:text-sm rounded-lg focus:outline-none  block w-full p-2.5 focus:border-lime-400" 
                    required
                  />
                </div>

                <div className="my-3 align-left pt-2">
                  <label htmlFor="details" className="block mb-2 text-xs uppercase text-white font-semibold text-left">menu details</label>
                  <input 
                    type="text" 
                    id="details" 
                    autoComplete='off'
                    ref={detailsRef as React.RefObject<HTMLInputElement>} 
                    className="bg-[#808080] border border-gray-600 shadow-sm text-white sm:text-sm rounded-lg focus:outline-none  block w-full p-2.5 focus:border-lime-400"
                  />
                </div>

                <div className="my-3 align-left pt-2">
                  <label htmlFor="price" className="block mb-2 text-xs uppercase text-white font-semibold text-left">menu price</label>
                  <input 
                    id="price" 
                    required
                    autoComplete='off'
                    ref={priceRef as React.RefObject<HTMLInputElement>} 
                    className="bg-[#808080] border border-gray-600 shadow-sm text-white sm:text-sm rounded-lg focus:outline-none  block w-full p-2.5 focus:border-lime-400"
                  />
                </div>

                <div className="my-3 align-left pt-4">                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      ref={isSpicyRef as React.RefObject<HTMLInputElement>}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#474747] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                    <span className="ml-3 text-xs uppercase font-semibold text-white">Is it spicy ?</span>
                  </label>
                </div>

                <div className="my-3 align-left">
                  <label className="relative inline-flex items-center mb-5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      ref={isVeggieRef as React.RefObject<HTMLInputElement>}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#474747] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                    <span className="ml-3 text-xs uppercase font-semibold text-white">Is it a Vegan Menu?</span>
                  </label>
                </div>

                <div className="align-left ">
                  <label htmlFor="categoryImage" className="block mb-2 text-xs uppercase text-white font-semibold text-left">menu image</label>
                  <input 
                    type="file" 
                    id="categoryImage" 
                    ref={imageRef}
                    accept="image/*" 
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg focus:outline-none block w-full p-1 focus:border-lime-400 file:font-semibold file:border-1 file:border-gray-600 file:rounded-md file:shadow-none file:bg-[#808080] file:text-white file:py-1 file:px-2 file:ring-0 file:mr-3" 
                  />
                </div>

                <div className="my-3 align-left pt-8">
                  <button 
                    type="submit" 
                    className="text-gray-600 font-extrabold bg-lime-400 hover:bg-lime-500 focus:ring-2 focus:outline-none focus:ring-lime-600 rounded-lg text-xs uppercase px-6 py-3 text-center"
                  >
                    Submit
                  </button>
                  
                </div>
              </form>    
            </div>

          </div>
        </div>
      ) : null}
    </>
  );
}
