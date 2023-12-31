
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { API_URL, CategoryData, UpdateOrdersDTO } from "../lib/definitions";
import { useAuth } from "../customHooks/useAuth";
import CategoryCard from "./components/CategoryCard";
import { useModal } from "../customHooks/useModal";
import { reorderCategories } from "../lib/actions";
import SearchMenus from "./components/SearchMenus";

function Menus() {
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<CategoryData[] | null>(null);
  const [originalCategories, setOriginalCategories] = useState<CategoryData[] | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const [dragCategory, setDragCategory] = useState<CategoryData | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<CategoryData | null>(null);

  const { 
    openJSONGeneratedModal,
  } = useModal();

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
      setOriginalCategories(data);
      setIsLoading(false);
    })    
    .catch((err) => console.error('Error', err));

    fetchMenus();
  },[user]);

  const { openCreateCategoryModal } = useModal();

  const handleOpenCreateCategoryModal = () => {
    openCreateCategoryModal({
      categories,
      setCategories,
    });
  };

  const handleOpenJSONGeneratedModal = () => {
    openJSONGeneratedModal({});
  }


  const dragStart = (cs: CategoryData) => {
    setDragCategory(cs);
    //setDragCategory(e);
  }

  const dragEnter = (ce: CategoryData) => {
    setDragOverCategory(ce);
  }

  const drop = () => {    
    const newCategories: CategoryData[] = categories!.filter((cf) => cf.cid !== dragCategory!.cid);
    // const dragIndex = categories!.indexOf(dragCategory!);
    const dragOverIndex = categories!.indexOf(dragOverCategory!);

    const newDragOverIndex = dragOverIndex;

    newCategories!.splice(newDragOverIndex, 0, dragCategory!);

    const newCategoryOrders: UpdateOrdersDTO[] = [];
    
    newCategories!.map((cp) => {
      if(cp.order !== newCategories!.indexOf(cp) + 1) {
        newCategoryOrders!.push({id: cp.cid, order: newCategories!.indexOf(cp) + 1});
      }
      cp.order = newCategories!.indexOf(cp) + 1;
      
    })

    if(newCategoryOrders.length > 0){
      reorderCategories(newCategoryOrders);
      setCategories(newCategories);
    }      
   
  }

  const saveJson = async () => {
    const res = await fetch(API_URL + '/json/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${user!.accessToken}`,
      }
    });

    if(res.ok) {
      //console.log('success in generating json menus file');
      handleOpenJSONGeneratedModal();
    }
  }

  // console.log(user);
  // console.log(categories);
  
  if (isLoading) return <div className="w-full h-screen text-white flex items-center justify-center text-3xl">Loading Menus...</div>;

  return (
    <Layout >
      <div className="w-full flex flex-col items-center justify-center mx-auto mt-[82px] text-white relative">
        <div className="w-full text-center text-xl font-medium mt-2 sm:mb-3">
          Pronto Menus 
        </div>
        <div className="w-11/12 absolute top-9 lg:top-0 flex justify-end items-center mt-2">
          
          <button
            className="rounded-md border border-lime-400 text-xs uppercase px-2 py-1 font-semibold"
            onClick={handleOpenCreateCategoryModal}
          >
            add category
          </button>
          <button 
            className="ml-3 rounded-md border border-lime-400 text-xs uppercase px-2 py-1 font-semibold hover:bg-lime-400 hover:text-gray-600 hover:font-semibold"
            onClick={() => saveJson()}
          >
            generate json
          </button>
          <button
            className="ml-3 rounded-md border border-lime-400 text-xs uppercase px-2 py-1 font-semibold hover:bg-lime-400 hover:text-gray-600 hover:font-semibold"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            { isCollapsed ? 'expand all' : 'collapse all' }
          </button>
        </div>

        <SearchMenus 
          originalCategories={originalCategories}
          setCategories={setCategories} 
        />
        
        { categories && categories.map((category) => (
          <CategoryCard 
            key={category.cid} 
            category={category} 
            categories={categories} 
            setCategories={setCategories} 
            isCollapsed={isCollapsed} 
            dragCategoryStart={dragStart}
            dragCategoryEnter={dragEnter}
            dropCategory={drop}
            
          />
        ))}
        
      </div>
    </Layout>
  )
}

export default Menus;
