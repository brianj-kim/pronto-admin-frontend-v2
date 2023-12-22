import { useEffect, useRef, useState } from "react";
import { CategoryData } from "../../lib/definitions";


type SearchMenusProps = {
  originalCategories: CategoryData[] | null,
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>
}

export default function SearchMenus ({
  originalCategories,
  setCategories
}: SearchMenusProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  
  useEffect(() => {
    // console.log('called')
    if(query === "") {
      setCategories(originalCategories);

    } else {
      const newCategories = originalCategories!.map(c => ({
        ...c,
        menus: c.menus!.filter(m => m.title.toLowerCase().includes(query.toLowerCase()))
      }));

      setCategories(newCategories);
      // console.log(newCategories);
    }
    
  },[query]);

  // console.log(originalCategories);
  // console.log(query);
  return (
    <div className="w-11/12 flex items-center my-4">            
      <input 
        ref={searchRef}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        className="bg-[#808080] border border-lime-400 text-white text-base rounded-md focus:outline-none block w-full pl-3 p-2.5 placeholder-white" 
        placeholder="Search Menus" 
      />
    </div>
  );
}
