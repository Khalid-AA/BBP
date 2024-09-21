import PropTypes from 'prop-types';
import { FaGithubSquare, FaLinkedin } from 'react-icons/fa'
import { FaSquareXTwitter, FaPhone } from 'react-icons/fa6'
import { MdOutlineEmail } from "react-icons/md";


const Footer = ({ currentYear, handleScrollTo }) => {
  return (
    <footer className="w-full bg-white py-4 text-black">
      <div className="px-4 mx-auto">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div>
            <h1 className="text-3xl font-bold">CrimsonSync.</h1>
            <p className="py-4">
              CrimsonSync is a project aimed at revolutionizing the way blood donation drives
              and blood bank management are handled. Our platform allows users to find available
              blood types across various hospitals, helping connect donors and recipients more
              efficiently.
            </p>
            <div className="flex gap-4 my-6">
              <a href="https://github.com/Khalid-AA/BBP" target="_blank" rel="noopener noreferrer" className="flex items-center text-black hover:text-blue-500 transition-colors duration-200">
                <FaGithubSquare size={30} />
              </a>
              <FaSquareXTwitter size={30} />
              <FaLinkedin size={30} />
            </div>
          </div>

          {/* Center Columns */}
          <div className="lg:col-span-2 flex gap-10">
            <div>
              <h6 className="font-medium pb-2">CrimsonSync features</h6>
              <ul>
                <li className="py-1 text-sm">AI Predictive blood shortage</li>
                <li className="py-1 text-sm">Blood Type Availability dashboard</li>
                <li className="py-1 text-sm">Blood donation drives</li>
                <li className="py-1 text-sm">Donor registration & notification</li>
                <li className="py-1 text-sm">Real-time blood tracking</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium pb-2">Resources</h6>
              <ul>
                <li className="py-1 text-sm">Blog on blood donation trends</li>
                <li className="py-1 text-sm">Best practices for blood management</li>
                <li className="py-1 text-sm">Blood types and their demand</li>
                <li className="py-1 text-sm">AI in Healthcare</li>
                <li className="py-1 text-sm">Developer resources</li>
                <li className="py-1 text-sm">FAQs</li>
                <li className="py-1 text-sm">Support & Contact</li>
              </ul>
            </div>
            {/* Right Column */}
            <div>
              <h6 className="font-medium pb-2">Contact Us</h6>
              <ul>
                <li className='flex'>
                  <a
                    href="mailto:support@crimsons.com"
                    className="flex items-center text-black hover:text-blue-500 transition-colors duration-200">
                    <MdOutlineEmail size={25} className="text-black hover:text-blue-500 transition-colors duration-200" />
                    <span className="py-1 text-sm ml-2">support@crimsons.com</span>
                  </a>
                </li>
                <li className='flex'>
                  <a
                    href="tel:123-456-7890"
                    className="flex items-center text-black hover:text-blue-500 transition-colors duration-200">
                    <FaPhone size={20} className="text-black hover:text-blue-500 transition-colors duration-200" />
                    <span className="py-1 text-sm ml-2">123-456-7890</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-center mt-4">
          <h2 className="text-xl">
            Copyright © {currentYear}
            <span
              style={{ fontFamily: 'Merriweather, serif' }}
              className="font-burtons text-black cursor-pointer ml-1 mr-1"
              onClick={() => handleScrollTo('root')}>
              CS
            </span>
            All rights reserved.
          </h2>
        </div>
      </div>
    </footer>
  );
};

// Add PropTypes to validate the props being passed
Footer.propTypes = {
  currentYear: PropTypes.number.isRequired,
  handleScrollTo: PropTypes.func.isRequired,
};

export default Footer;
