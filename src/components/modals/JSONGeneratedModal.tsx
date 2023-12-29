import { IModal } from "../../lib/definitions";

export interface JSONGeneratedModalProps extends IModal {}

export default function JSONGeneratedModal ({
  visible = false,
  onClose,
}: JSONGeneratedModalProps) {

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
              <div className="text-lime-400 text-base font-semibold pl-2">Menus JSON file Generation Confirmed</div>
              
              <button 
                type="button" 
                className="text-white bg-transparent hover:bg-lime-500 hover:text-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="w-full h-full px-5 py-3 bg-[#808080] rounded-b-lg flex justify-center items-center text-white">              
              <div className="w-full py-3 flex flex-col justify-center items-center">
                <span className="text-sm text-white">
                  Menu JSON file has been generated successfully.
                </span>
                <div>
                  <button 
                    className="mt-5 px-3 py-2 uppercase rounded-md shadow-sm border border-lime-400 text-xs text-white font-bold"
                    onClick={onClose}
                  >
                    close
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