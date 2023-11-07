import { forwardRef } from "react";

type InputFormCompProps = {
  label?: string,
  placeholder?: string,
  type?: string,
  value?: string,
  style?: string,
  required?: boolean,
  message?: string
}

const InputFormComp = forwardRef<HTMLInputElement, InputFormCompProps>((props, ref) => {  
    return ( 
      <div className="relative w-full mb-4">
        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2 text-white" >
          {props.label}
        </label>
        <input 
          placeholder={props.placeholder}
          type={props.type || 'text'}
          value={props.value}
          ref={ref}
          className={props.style} 
          required={props.required}
        />
        <div className={props.message === '' ? 'hidden' : 'w-full text-lime-400 text-sm text-left pl-2 mt-1'}>{props.message}</div>
      </div>

    )
});


export default InputFormComp;
