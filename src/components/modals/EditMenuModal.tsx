import { FormEvent, useEffect, useRef, useState } from "react";
import { CategoryData, MenuData, IModal, API_URL, HOME_URL } from "../../lib/definitions";
import { useAuth } from "../../customHooks/useAuth";
import { updateMenuState } from "../../lib/actions";

export interface EditMenuModalProps extends IModal {
  menu: MenuData;
  category: CategoryData,
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>;
}

export default function EditMenuModal ({
  visible = false,
  onClose,
  category,
  menu,
  categories,
  setCategories,
}: EditMenuModalProps) {

  const titleRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const isSpicyRef = useRef<HTMLInputElement>(null);
  const isVeggieRef = useRef<HTMLInputElement>(null);
  const isOnSaleRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [imagePath, setImagePath] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    setImagePath(menu.image);
  },[menu.image]);

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

  useEffect(() => {
    titleRef.current!.focus();

    titleRef.current!.value = menu.title;
    detailsRef.current!.value = menu.details;
    priceRef.current!.value = String(menu.price);
    isVeggieRef.current!.checked = menu.isVeggie;
    isSpicyRef.current!.checked = menu.isSpicy;
    isOnSaleRef.current!.checked = menu.isOnSale;
    (menu.image !== '') ? setImagePath(menu.image) : null;
  }, [categories, menu]);

  useEffect(() => {
    setImagePath(menu.image);
  },[menu.image]);

  const handleEditFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    let image: string = menu.image;

    //TODO:: if the edit form has an image file, upload it and get the file path 
    if(imageRef.current!.files && imageRef.current!.files.length > 0) {
      const imageFormData = new FormData();
      imageFormData.append('image', imageRef.current!.files[0]);
      imageFormData.append('dest', 'menu_images');

      await fetch(API_URL + '/file/menu_images', {
        method: 'POST',
        credentials: 'include',      
        headers: {
          Authorization: `Bearer ${user!.accessToken}`,
        }, 
        body: imageFormData,
      })
      .then(res => res.json())
      .then(data => {
        image = data.image;   
        
      }).catch((err) => console.error('Error', err));

    }

    const updateMenuData = JSON.stringify({
      title: titleRef.current!.value,
      details: detailsRef.current!.value,
      price: priceRef.current!.value,
      isSpicy: isSpicyRef.current!.checked,
      isVeggie: isVeggieRef.current!.checked,
      isOnSale: isOnSaleRef.current!.checked,
      image
    });

    await fetch(API_URL + `/menu/${menu.mid}`, {
      method: 'PATCH',
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      }, 
      body: updateMenuData,
    })
      .then(res => res.json())
      .then(data => {
        
        const newMenu: MenuData = {
          mid: menu.mid,
          title: data.result.title,
          details: data.result.details,
          order: data.result.order,
          price: data.result.price,
          image: data.result.image,
          isSpicy: data.result.isSpicy,
          isVeggie: data.result.isVeggie,
          isOnSale: data.result.isOnSale
        };

        updateMenuState(newMenu, category, categories, setCategories);
        
      })
      .catch((err) => console.error(err));

    onClose?.();
  };

  const handleImageOnDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await fetch(API_URL + "/file/menu_images", {
      method: "DELETE",
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      },
      body: JSON.stringify({
        image: menu.image,
        mid: menu.mid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if(data.deleted) {
          setImagePath('');
          
        }        
      })
      .catch((err) => console.error(err));

  };
  return (
    <>
      {visible ? (
        <div
          onClick={onClose}
          className="z-20 fixed flex items-center top-0 left-0 w-full h-full bg-gray-800/80 overflow-x-hidden overflow-y-auto"
        >
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
            className={`z-30 w-4/5 m-auto rounded-lg shadow-md overflow-auto`}
          >
            <div className="w-full flex justify-between px-3 py-3 rounded-t-lg bg-[#474747]">
              <span className="pt-2 pl-3 text-white text-base font-medium">
                Edit a menu{" "}
                {category.title
                  ? `under the category of ${category.title}`
                  : null}
              </span>

              <button
                type="button"
                className="text-white bg-transparent hover:bg-lime-400 hover:text-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="w-full h-full px-6 py-3 bg-[#808080] rounded-b-lg">
              <form onSubmit={handleEditFormSubmit}>
                <div className="my-3 align-left">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                  >
                    menu title
                  </label>
                  <input
                    type="text"
                    id="title"
                    autoComplete="off"
                    ref={titleRef as React.RefObject<HTMLInputElement>}
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg shadow-sm focus:outline-none  block w-full p-2.5 focus:border-lime-400"
                    required
                  />
                </div>

                <div className="my-3 align-left pt-2">
                  <label
                    htmlFor="details"
                    className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                  >
                    menu details
                  </label>
                  <input
                    type="text"
                    id="details"
                    autoComplete="off"
                    ref={detailsRef as React.RefObject<HTMLInputElement>}
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg shadow-sm focus:outline-none block w-full p-2.5 focus:border-lime-400"
                  />
                </div>

                <div className="my-3 align-left pt-2">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                  >
                    menu price
                  </label>
                  <input
                    id="price"
                    required
                    autoComplete="off"
                    ref={priceRef as React.RefObject<HTMLInputElement>}
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg shadow-sm focus:outline-none  block w-full p-2.5 focus:border-lime-400"
                  />
                </div>

                <div className="my-3 align-left pt-4">
                  <label className="relative inline-flex items-center mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      ref={isOnSaleRef as React.RefObject<HTMLInputElement>}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#474747] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                    <span className="ml-3 text-xs uppercase font-semibold text-white">
                      is on Sale ? (You can hide from the menu list while not deleting the menu)
                    </span>
                  </label>
                </div>
                
                <div className="my-3 align-left pt-4">
                  <label className="relative inline-flex items-center mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      ref={isSpicyRef as React.RefObject<HTMLInputElement>}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#474747] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                    <span className="ml-3 text-xs uppercase font-semibold text-white">
                      is it spicy?
                    </span>
                  </label>
                </div>

                <div className="my-3 align-left align-middle">
                  <label className="relative inline-flex items-center mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      ref={isVeggieRef as React.RefObject<HTMLInputElement>}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#474747] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                    <span className="ml-3 text-xs uppercase font-semibold text-white">
                      is a Vegan Menu?
                    </span>
                  </label>
                </div>

                
                <div className={`mt-5 my-3 py-3 flex flex-col justify-between ${imagePath !== '' ? null : 'hidden' }`}>
                  <span className="text-white font-semibold text-sm">menu image: </span>
                  <div className="flex flex-col mx-auto justify-center">
                    <img
                      src={HOME_URL + menu!.image}
                      alt="category image"
                      className="max-w-xl"
                    />
                    <button
                      onClick={handleImageOnDelete}
                      className="text-white text-xs uppercase px-3 py-2 my-2 mx-auto bg-red-700 hover:bg-red-600 rounded-md shadow-sm"
                    >
                      delete
                    </button>
                  </div>
                </div>
                
                <div className={`mt-5 my-3 align-left ${imagePath === '' ? null : 'hidden'}`}>
                  <label
                    htmlFor="menuImage"
                    className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                  >
                    menu image
                  </label>
                  <input
                    type="file"
                    id="menuImage"
                    ref={imageRef}
                    accept="image/*"
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg focus:outline-none block w-full p-1 focus:border-lime-400 file:font-semibold file:border-1 file:border-gray-600 file:rounded-md file:shadow-none file:bg-[#808080] file:text-white file:py-1 file:px-2 file:ring-0 file:mr-3"
                  />
                </div>
              

                <div className="my-3 align-left pt-8">
                  <button
                    type="submit"
                    className="text-gray-600 font-bold bg-lime-400 hover:bg-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 rounded-lg text-xs uppercase px-6 py-3 text-center"
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
