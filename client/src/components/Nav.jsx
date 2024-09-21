import { useState } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Nav = ({ nav, handleNav, handleScrollTo, navRef }) => {
  const [activeItem] = useState('home');

  const handleNavClick = (section) => {
    handleScrollTo(section);
  };
  return (
    <nav className="bg-white p-2 w-full flex justify-between items-center fixed top-0 left-0 z-50">
      {/* Logo and Home Link */}
      <h1
        style={{ fontFamily: 'Merriweather, serif' }}
        className="text-3xl font-bold text-black cursor-pointer"
        onClick={() => handleScrollTo('root')}>
        CS
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center space-x-6">

        <li>
          <a href="https://www.redcross.org/give-blood.html" target="_blank" rel="noopener noreferrer" className="flex items-center text-black hover:text-blue-500 transition-colors duration-200">
            Find Donors
          </a>
        </li>

        <li
          className={`cursor-pointer ${activeItem === 'enlightenment' ? 'text-red-400' : 'text-black'} hover:text-red-400`}
          onClick={() => handleNavClick('enlightenment')}>
          Enlightenment
        </li>

        <li
          className={`cursor-pointer ${activeItem === 'graph' ? 'text-red-400' : 'text-black'} hover:text-red-400`}
          onClick={() => handleNavClick('graph')}>
          Graph
        </li>

        <li
          className={`cursor-pointer ${activeItem === 'contact' ? 'text-red-400' : 'text-black'} hover:text-red-400`}
          onClick={() => handleNavClick('footer')}>
          Contact
        </li>
        
      </ul>
      
      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center gap-4">
        
        <div
          onClick={handleNav}
          className="cursor-pointer text-black hover:text-red-400">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        ref={navRef}
        className={`fixed right-0 top-0 w-[40%] h-full bg-white text-black transition-transform duration-500 z-10 ${nav ? 'translate-x-0' : 'translate-x-full'}`}>
        {nav && (
          <div
            onClick={handleNav}
            className="absolute top-8 right-4 cursor-pointer hover:text-red-400">
            <AiOutlineClose size={24} />
          </div>
        )}

        <ul className="uppercase p-4 text-center mt-8">

          <li
            className="p-4 border-b border-black">
            <a href="https://www.redcross.org/give-blood.html" target="_blank" rel="noopener noreferrer" className=" items-center text-black hover:text-blue-500 transition-colors duration-200">
              Find Donors
            </a>
          </li>

          <li
            className="p-4 border-b border-black hover:text-red-400 cursor-pointer"
            onClick={() => handleScrollTo('enlightenment')}>
            Enlightenment
          </li>

          <li
            className="p-4 border-b border-black hover:text-red-400 cursor-pointer"
            onClick={() => handleScrollTo('graph')}>
              Graph
          </li>

          <li
            className="p-4 border-b border-black hover:text-red-400 cursor-pointer"
            onClick={() => handleScrollTo('footer')}>
            Contact
          </li>
          
        </ul>
      </div>
    </nav>
  );
};

// Add PropTypes for type-checking
Nav.propTypes = {
  nav: PropTypes.bool.isRequired,
  handleNav: PropTypes.func.isRequired,
  handleScrollTo: PropTypes.func.isRequired,
  navRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
};

export default Nav;
