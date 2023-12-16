
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { API_URL, CategoryData } from "../lib/definitions";
import { useAuth } from "../customHooks/useAuth";
import CategoryCard from "./components/CategoryCard";
import { useModal } from "../customHooks/useModal";

function Menus() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenus = async () => await fetch(API_URL + '/menu/', {
      method: 'GET',
      credentials: 'include',      
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      },
      
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      setCategories(data);
      setIsLoading(false);
    })    
    .catch((err) => console.error('Error', err));

    fetchMenus();
  },[]);

  const { openCreateCategoryModal } = useModal();

  const handleOpenCreateCategoryModal = () => {
    openCreateCategoryModal({
      categories,
      setCategories,
    });
  };

  // console.log(user);
  console.log(categories);
  
  if (isLoading) return <div className="w-full h-screen text-white flex items-center justify-center text-3xl">Loading Menus...</div>;

  return (
    <Layout >
      <div className="w-full flex flex-col items-center justify-center mx-auto mt-[82px] text-white relative">
        <div className="w-full text-center text-xl font-medium">
          Pronto Menus 
        </div>
        <div className="w-11/12 absolute top-0 flex justify-end items-center">
          <button
            className="rounded-md border border-lime-400 text-xs uppercase px-2 py-1 font-medium"
            onClick={handleOpenCreateCategoryModal}
          >
            add category
          </button>
        </div>
        
        { categories && categories.map((category) => (
          <CategoryCard key={category.cid} category={category} categories={categories} setCategories={setCategories}/>
        ))}
        
      </div>
    </Layout>
  )
}

export default Menus;
