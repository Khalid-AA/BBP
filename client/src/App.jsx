import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import axios from "axios"
import { FaArrowUp } from 'react-icons/fa'
// components
import Nav from './components/Nav.jsx';
import BloodTypes from './components/BloodTypes.jsx';
import Footer from './components/Footer.jsx'
import GenerateText from './components/GenerateText.jsx';

function App() {
  const [array, setArray] = useState([])
  const [nav, setNav] = useState(false);
  const scrollTopButtonRef = useRef(null);
  const navRef = useRef(null);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api"); 
    setArray(response.data.blood_types);
  }

  useEffect(() => {
    fetchAPI();
  }, []);


  const handleNav = () => {
    setNav(prev => !prev);
  };

  const closeNav = () => {
    setNav(false);
  };

  const handleScroll = useCallback(() => {
    if (nav) {
      closeNav();
    }
    if (scrollTopButtonRef.current) {
      if (window.scrollY > 100) {
        scrollTopButtonRef.current.classList.add('opacity-100');
        scrollTopButtonRef.current.classList.remove('opacity-0');
      } else {
        scrollTopButtonRef.current.classList.add('opacity-0');
        scrollTopButtonRef.current.classList.remove('opacity-100');
      }
    }
  }, [nav]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleScrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    closeNav();
  };

  const currentYear = new Date().getFullYear();


  return (
    <>
      <Nav nav={nav} handleNav={handleNav} handleScrollTo={handleScrollTo} navRef={navRef} />

      <main className="bg-gray-200 px-0 lg:pt-[60px]">
        <section id="cover-page" className="flex flex-col items-center justify-center min-h-screen">
          {/* Cover Page */}
          <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-center md:gap-10">
            <div className="md:flex-grow">
              <h2 className="text-5xl py-2 text-black font-bold text-center md:text-6xl">
                CrimsonSync
              </h2>
              <h3 className="text-2xl py-2 text-gray-600 text-center md:text-3xl ">
                Redefining blood banks, Empowering Donations
              </h3>
              {/* <p className="text-md py-4 leading-8 text-black text-center md:text-xl max-w-xl">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                Porro minima quis ut, quo esse facere est quas illum eligendi 
                laborum nihil dolorem impedit? Libero, nam. Provident a obcaecati 
                architecto cumque.
              </p> */}
            </div>
          </div>
          <div className="mt-6 flex justify-center w-full">
            <button
              onClick={() => alert('Get Started Clicked!')}
              className="px-6 py-2 bg-gray-400 text-black rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-gray-500">
                Get Started
            </button>
          </div>
        </section>

        <BloodTypes bloodTypes={array} />
        <GenerateText /> {/* Add the GenerateText component here */}

        <Footer currentYear={currentYear} handleScrollTo={handleScrollTo} />
      </main>

      {/* Scroll to Top Button */}
      <button
        ref={scrollTopButtonRef}
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 p-3 bg-black text-white rounded-full shadow-lg transition-all duration-300 ease-in-out"
        aria-label="Scroll to top">
        <FaArrowUp size={24} />
      </button>
    </>
  )
}

export default App
