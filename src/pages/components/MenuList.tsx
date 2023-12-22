import { useState } from "react";
import { CategoryData, MenuData, UpdateOrdersDTO } from "../../lib/definitions";
import MenuCard from "./MenuCard";
import { reorderMenus } from "../../lib/actions";

type MenuListProps = {
  menus: MenuData[] | null;
  category: CategoryData;
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>;
}

export default function MenuList ({
  menus,
  category,
  categories,
  setCategories

}: MenuListProps) {

  // TODO:: Menu Drag & Drop 
  const [dragMenu, setDragMenu] = useState<MenuData | null>(null);
  const [dragOverMenu, setDragOverMenu] = useState<MenuData | null>(null);

  const dragMenuStart = (ms: MenuData) => {
    setDragMenu(ms);
    //console.log(dragMenu);
  }

  const dragMenuEnter = (me: MenuData) => {
    setDragOverMenu(me);
    //console.log(dragOverMenu);
  }

  const dropMenu = () => {

    const newMenus: MenuData[] = menus!.filter((mf) => mf.mid !== dragMenu!.mid);
    const dragOverIndex = menus!.indexOf(dragOverMenu!);

    const newDragOverIndex = dragOverIndex;

    newMenus?.splice(newDragOverIndex, 0, dragMenu!);

    const newMenuOrders: UpdateOrdersDTO[] = [];
    newMenus!.map((mp: MenuData) => {
      if(mp.order !== newMenus!.indexOf(mp) + 1) {
        newMenuOrders!.push({ id: mp.mid, order: newMenus!.indexOf(mp) + 1 });
      }
      mp.order = newMenus!.indexOf(mp) + 1;
      
    });
   
    //console.log(menus, newMenus, newMenuOrders);

    const newCategory: CategoryData = {...category, menus: newMenus};
    const newCategories: CategoryData[] = categories!.map((c) => {
      if(c.cid === category.cid) {
        return newCategory;
      } else {
        return c;
      }
    });

    //console.log(newMenuOrders);
    if(newMenuOrders.length > 0) {
      reorderMenus(newMenuOrders);
      setCategories(newCategories);
      
    }  
  
  }

  return (
    <>
    {menus && menus.map((menu) => (
      <MenuCard 
        key={menu.mid}
        menu={menu} 
        category={category} 
        categories={categories} 
        setCategories={setCategories} 
        dragMenuStart={dragMenuStart}
        dragMenuEnter={dragMenuEnter}
        dropMenu={dropMenu}
      />
    ))}
    </>
    
  )
}