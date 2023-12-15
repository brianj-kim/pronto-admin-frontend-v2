import React, { FormEvent, useEffect, useRef } from "react";
import { API_URL, CategoryData, IModal } from "../../lib/definitions";
import { useAuth } from "../../customHooks/useAuth";

export interface CreateCategoryModalProps extends IModal {
  categories: CategoryData[] | null;
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>;
}

export default function CreateCategoryModal ({
  visible = false,
  onClose,
  categories,
  setCategories,
}: CreateCategoryModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const formData: FormData = new FormData();

    formData.append("title", titleRef.current!.value);
    formData.append("details", detailsRef.current!.value);
    imageRef.current!.files! && imageRef.current!.files!.length
      ? formData.append("image", imageRef.current!.files![0])
      : null;

    await fetch(API_URL + "/category/", {
      method: "POST",
      credentials: 'include',      
        headers: {
          Authorization: `Bearer ${user!.accessToken}`,
        }, 
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        // return;

        const newCategory: CategoryData = {
          cid: Number(data.id),
          order: Number(data.result.order),
          title: data.result.title,
          details: data.result.details,
          image: data.result.image,
          menus: [],
        };

        categories
          ? setCategories([...categories, newCategory])
          : setCategories([newCategory]);

        // console.log(categories);
      })
      .catch((err) => {
        console.error("Error", err);
      });

    onClose?.();
  };

  useEffect(() => {
    titleRef.current!.focus();
  },[]);
  
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
              <span className="pl-3 text-lime-400 text-lg font-semibold">
                Add New Category
              </span>

              <button
                type="button"
                className="text-white bg-transparent hover:bg-lime-500 hover:text-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-lime-400" 
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
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-lime-400" 
                  />
                </div>

                <div className="my-3 align-left pt-2">
                  <label
                    htmlFor="categoryImage"
                    className="block mb-2 text-xs uppercase text-white font-semibold text-left"
                  >
                    category image
                  </label>
                  <input
                    type="file"
                    id="categoryImage"
                    ref={imageRef}
                    accept="image/*"
                    className="bg-[#808080] border border-gray-600 text-white sm:text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-lime-400 file:font-semibold file:border-1 file:border-gray-600 file:rounded-md file:shadow-none file:bg-[#808080] file:text-white file:py-1 file:px-2 file:ring-0 file:mr-3"
                  />
                </div>

                <div className="my-3 align-left pt-4">
                  <button
                    type="submit"
                    className="text-[#474747] bg-lime-400 focus:ring-4 focus:outline-none focus:ring-lime-400 rounded-lg font-extrabold text-xs uppercase px-4 py-2 text-center"
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
