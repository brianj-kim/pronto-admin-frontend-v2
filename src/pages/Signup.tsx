import { FormEvent, useRef, useState } from "react";
import InputFormComp from "../components/InputFormComp";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { API_URL } from "../lib/definitions";

const Signup = () => {

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordMatchRef = useRef<HTMLInputElement>(null);

  const [emailValidateMessage, setEmailValidateMessage] = useState<string>('');
  const [passwordValidateMessage, setPasswordValidateMessage] = useState<string>('');
  
  
  const navigate = useNavigate();

  const handleSigupSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email: string = emailRef.current!.value;
    const username: string = usernameRef.current!.value;
    const password: string = passwordRef.current!.value;
    const passwordMatch: string = passwordMatchRef.current!.value;

    // email validation
    const EMAIL_EXP: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    
    if(!EMAIL_EXP.test(email)) {
      setEmailValidateMessage('email is invalid.');

      return;
    }

    // password validation
    const PASSWORD_EXP: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    if (!PASSWORD_EXP.test(password)) {
      setPasswordValidateMessage('password is invalid. (must be over 8 and less than 24 letters including alphabet, numbers, and speical characters (!@#$%)');

      return;
    }

    // password matching
    if (password !== passwordMatch) {
      setPasswordValidateMessage('password and password confirm do not match');

      return;
    }

    // post request to create the user
    await fetch(API_URL + '/register', {
      method: 'POST',
      body: JSON.stringify({email, username, password})      
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);

        if (data.message == 'user created successfully') {
          navigate('/admin/login');
        }

      })
      .catch((err) => {
        console.error("Erro", err);
        return false;
      });
  }

  return (
    <Layout >      
      <div className="w-11/12 sm:w-4/5 px-4 mx-auto mt-[92px]">
        <div className="w-full relative flex flex-col break-words mb-6 shadow-md rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-[#474747] mb-0 flex justify-center sm:justify-start sm:px-4 py-4">
            <div className="text-center flex justify-between">
              <h6 className="text-white text-lg font-bold">
                Signup - New Account
              </h6>
          
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSigupSubmit}>              
                
              <div className="flex flex-wrap">                
                <div className="w-full lg:w-12/12 px-4 mt-6">
                  <InputFormComp 
                    label="email"
                    type="email"
                    style="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    ref={emailRef}
                    placeholder="email"
                    required={true}
                    message={emailValidateMessage}
                  />
                </div>

                <div className="w-full lg:w-12/12 px-4">
                  <InputFormComp 
                    label="username"
                    type="text"
                    style="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    ref={usernameRef}
                    placeholder="username"
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
                    message={passwordValidateMessage}
                  />
                </div>

                <div className="w-full lg:w-12/12 px-4">
                  <InputFormComp 
                    label="password confirm"
                    type="password"
                    style="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    ref={passwordMatchRef}
                    placeholder="password confirm"
                    required={true}
                  />
                </div>

                <div className="w-full lg:w-12/12 px-4">
                  
                    <Button 
                      type="submit"
                      className="w-full mt-6 py-3 uppercase text-xs font-bold"
                    >
                      Submit
                    </Button>
                    
                      {/* <button 
                      type="submit"
                      className="rounded-md bg-lime-500 px-3 py-2 uppercase text-xs font-semibold"
                    >
                      Submit
                    </button> */}

                  
                </div>


              </div>
            </form>
            
          </div>
        </div>
            
      </div>
    </Layout>
  )
}

export default Signup;
