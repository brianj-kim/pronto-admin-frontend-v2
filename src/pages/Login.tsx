import { FormEvent, useEffect, useRef, useState } from "react";
import InputFormComp from "../components/InputFormComp";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../lib/definitions";
import { tokenToUser } from "../lib/actions";
import { useAuth } from "../customHooks/useAuth";
import { useLocalStorage } from "../customHooks/useLocalStorage";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, setUser } = useAuth();
  const { setItem } = useLocalStorage();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null)

  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    emailRef!.current!.focus();
    setErrMsg('');
  },[]);

  useEffect(() => {
    if(user) {
      (location.state === null) ? navigate('/admin', {replace: true}) : navigate(location.state!.from, {replace: true});
    }
  });

  const handleOnSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;

    await fetch(API_URL + '/login/', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email, password }),      
    })
    .then(res => res.json())    
    .then(data => {      
      // console.log(data);
      // return;

      setUser(tokenToUser(data.access_token));
      setItem('isAuthenticated', 'true');
      setItem('refreshExp', data.refresh_exp);

      (location.state === null) ? navigate('/admin', {replace: true}) : navigate(location.state!.from, {replace: true});
    })
    .catch ((err) => {
      console.error("Error", err);

      if(!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing email and password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login failed')
      }
      errRef.current!.focus();

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
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          
            </div>
          </div>

          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleOnSubmit}>                
              <div className="flex flex-wrap">                
                <div className="w-full lg:w-12/12 px-4 mt-6">
                  <InputFormComp 
                    label="email"
                    type="email"
                    autoComplete={false}
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
