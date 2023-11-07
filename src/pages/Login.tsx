import { FormEvent, useRef } from "react";
import InputFormComp from "../components/InputFormComp";
import Layout from "./Layout";
import { API_URL } from "../App";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const handleOnSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;

    await fetch(API_URL + '/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())    
    .then(data => {
      // console.log(data);
      if (data.hasOwnProperty!('access_token')) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        
      } else {
        console.log({ message: data.message});
      }
      emailRef.current!.value = "";
      passwordRef.current!.value = "";

      return;
    })
    .catch ((err) => {
      console.error("Error", err);

      return;
    });
   
  }

  return (
    <Layout >
      <div className="w-4/5 lg:w-1/2 px-4 mx-auto mt-[92px]">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-[#474747] mb-0 px-6 py-4">
            <div className="text-center flex justify-between">
              <h6 className="text-white text-md font-bold">
                Login
              </h6>
          
            </div>
          </div>

          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleOnSubmit}>                
              <div className="flex flex-wrap">                
                <div className="w-full lg:w-12/12 px-4 mt-6">
                  <InputFormComp 
                    label="email"
                    type="email"
                    style="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    ref={emailRef}
                    placeholder="email"
                    required={true}
                    
                  />
                </div>

                <div className="w-full lg:w-12/12 px-4">
                  <InputFormComp 
                    label="password"
                    type="password"
                    style="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    ref={passwordRef}
                    placeholder="password"
                    required={true}
                  />
                  
                </div>                

                <div className="w-full lg:w-12/12 px-4">
                  <div className="flex w-full mt-4 items-center justify-start">
                    
                    <Button >
                      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-800" />
                    </Button>

                  </div>
                </div>


              </div>
            </form>
            
          </div>
        </div>
            
      </div>
    </Layout>
  )
}

export default Login;
