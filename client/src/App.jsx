import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import axios from "axios";
import { FaArrowUp } from 'react-icons/fa';
// components
import Nav from './components/Nav.jsx';
import Enlightenment from './components/Enlightenment.jsx';
import BarChart from './components/BarChart';
import Search from './components/Search.jsx';
import Footer from './components/Footer.jsx';
import bloodpacksImage from './assets/bloodpacks.jpg';
import bloodsamplesImage from './assets/bloodsamples.jpg';
import labscreeningImage from './assets/labscreening.jpg';

function App() {
  const [nav, setNav] = useState(false);
  const scrollTopButtonRef = useRef(null);
  const navRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [donationAmounts, setDonationAmounts] = useState({});


  const slides = [bloodpacksImage, bloodsamplesImage, labscreeningImage];

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      console.log("Fetched data:", response.data);
      setDonationAmounts(response.data.donationAmounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

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

      <main className="px-0 lg:pt-[50px]">
        <section id="cover-page" className="relative flex flex-col items-center justify-center min-h-screen">
          <div className="slideshow">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide})` }}
              ></div>
            ))}
          </div>

          <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-center md:gap-10 relative z-10">
            <div className="md:flex-grow">
              <h2 className="text-5xl text-black font-bold text-center md:text-6xl">
                CrimsonSync
              </h2>
              <h3 className="text-2xl py-2 text-gray-600 font-semibold text-center md:text-3xl">
                Redefining blood banks, Empowering Donations
              </h3>
            </div>
          </div>
          <div className="mt-6 flex justify-center w-full">
            <button
              className="px-6 py-2 bg-gray-400 text-black rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-gray-500"
              onClick={() => handleScrollTo('search')}>
              Find Blood
            </button>
          </div>
        </section>

        <section id='enlightenment'>
          <Enlightenment />
        </section>

        <section id='graph'>
          <BarChart donationAmounts={donationAmounts} />
        </section>

        <section id='search'>
          <Search />
        </section>
        
        <section id='footer'>
          <Footer currentYear={currentYear} handleScrollTo={handleScrollTo} />
        </section>
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
  );
}

export default App;
