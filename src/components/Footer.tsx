import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <div className="max-w-screen-xl flex flex-wrap mx-auto p-2 text-white text-sm">
      All rights reserved @Pronto (<Link to='http://gopronto.ca' target='_blank' className="text-lime-400 hover:underline">http://gopronto.ca</Link>) 
    </div>
  )
}

export default Footer;