import { useEffect, useRef, useState } from "react";
import { API_URL, CategoryData, IModal, MenuData } from "../../lib/definitions";
import { useAuth } from "../../customHooks/useAuth";

export interface EditCategoryModalProps extends IModal {
  category: CategoryData;
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[]|null>>;
}

export default function EditCategoryModal ({
  visible = false,
  onClose,
  category,
  categories,
  setCategories
}: EditCategoryModalProps) {
  const [hasImage, setHasImage] = useState<boolean>(false);

  const { user } = useAuth();

  const titleRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current!.value = category.title;
    detailsRef.current!.value = category.details;
    imageRef.current!.value = category.image;
  });

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    let imagePath: string = category.image;

    //TODO:: if the edit form has an image file, upload it and get the file path 
    if(imageRef.current!.files && imageRef.current!.files!.length > 0 ) {
      const imageFormData = new FormData();
      imageFormData.append('image', imageRef.current!.files[0]);

      await fetch(API_URL + '/file/', {
        method: 'POST',
        credentials: 'include',      
        headers: {
          Authorization: `Bearer ${user!.accessToken}`,
        }, 
        body: imageFormData,
      })
      .then(res => res.json())
      .then(data => {
        data.image && data.image !== '' ? imagePath = data.image : null
        
      }).catch((err) => console.error('Error', err));

    }
    // return;

    const updateData = JSON.stringify({
      cid: category.cid,
      order: category.order,
      title: titleRef.current!.value,
      details: detailsRef.current!.value,
      image: imagePath
    });

    //TODO: If the form has image file, upload separately and then get the file path and add to updateData.    
    await fetch(API_URL + `/category/${category.cid}`, {
      method: 'PATCH',      
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      },
      body: updateData,
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        // return

        if(data.rows > 0) {
          const prevCategory = categories?.find(c => c.cid === category.cid);
          const newMenus: MenuData[] | null = prevCategory!.menus;
          const newCategory: CategoryData = {
            cid: category.cid,
            order: data.result.order,
            title: data.result.title,
            details: data.result.details,
            image: data.result.image,
            menus: newMenus,
          };

          const newCategories: CategoryData[] | null = categories!.map((c) => {
            if (c.cid === category.cid) {
              return newCategory;
            }
            return c;
          });

          setCategories?.(newCategories);
        }
      })
      .catch((err) => console.error('Error', err));

    setHasImage(false);
    onClose?.();
  };

  const handleImageOnDelete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
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
          <div className="w-full flex justify-between items-center px-3 py-3 rounded-t-lg bg-[#474747]">
            <span className="pl-3 text-white text-lg font-semibold">
              Edit Category
            </span>

            <button
              type="button"
              className="text-white bg-transparent hover:bg-lime-400 hover:text-gray-500 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
            <form onSubmit={handleFormSubmit}>
              <div className="my-3 align-left">
                <label
                  htmlFor="title"
                  className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                >
                  category title
                </label>
                <input
                  type="text"
                  id="title"
                  autoComplete="off"
                  ref={titleRef}
                  className="border border-gray-600 text-white bg-[#808080] sm:text-sm rounded-lg focus:outline-none focus:border-lime-400 shadow-md block w-full p-2.5"
                  required
                />
              </div>

              <div className="my-3 align-left pt-2">
                <label
                  htmlFor="details"
                  className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                >
                  details
                </label>
                <input
                  type="text"
                  id="details"
                  autoComplete="off"
                  ref={detailsRef as React.RefObject<HTMLInputElement>}
                  className={`bg-[#808080] border border-gray-600 text-white shadow-md sm:text-sm rounded-lg focus:outline-none focus:border-lime-400 block w-full p-2.5`}
                />
              </div>

              {hasImage ? (
                <div className="mt-5 my-3 py-3 flex flex-col justify-between">
                  <span className="">menu image: </span>
                  <div className="flex flex-col mx-auto justify-center">
                    <img
                      src={category!.image}
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
              ) : (
                <div className="mt-5 my-3 align-left">
                  <label
                    htmlFor="categoryImage"
                    className="block mb-2 text-xs uppercase text-white text-left font-semibold"
                  >
                    category image
                  </label>
                  <input
                    type="file"
                    id="categoryImage"
                    ref={imageRef}
                    accept="image/*"
                    className="bg-[#808080] border border-gray-600 text-white shadow-md sm:text-sm rounded-lg file:font-semibold focus:outline-none focus:border-lime-400 block w-full py-1.5 pl-1.5 file:border-1 file:border-gray-600 file:rounded-md file:shadow-none file:bg-[#808080] file:text-white file:py-1 file:px-2 file:ring-0 file:mr-3"
                  />
                </div>
              )}

              <div className="my-3 align-left pt-4">
                <button
                  type="submit"
                  className="text-[#474747] bg-lime-400 focus:ring-4 focus:outline-none focus:ring-lime-400 rounded-lg font-extrabold text-xs uppercase px-6 py-3 text-center"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      ) : (
        null
      )}
    </>
  )
}