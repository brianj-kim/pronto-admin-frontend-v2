import Footer from "../components/Footer";
import Header from "../components/Header";


const Layout = ({children}: {children: React.ReactNode}) => {

  return (
    <div className="w-full h-screen flex flex-col">
      <Header />

      {children}

      <Footer />
    </div>
  )
}

export default Layout;