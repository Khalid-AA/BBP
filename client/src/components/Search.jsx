import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEnvelope, FaGlobe } from 'react-icons/fa';
import { FaPhone } from "react-icons/fa6";


const Search = () => {
    const [hospitalInput, setHospitalInput] = useState('');
    const [bloodGroupInput, setBloodGroupInput] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [filteredHospitals, setFilteredHospitals] = useState([]);
    const [filteredBloodTypes, setFilteredBloodTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hospitalInputFocused, setHospitalInputFocused] = useState(false);
    const [bloodGroupInputFocused, setBloodGroupInputFocused] = useState(false);
    const [hospitalResponse, setHospitalResponse] = useState('');
    const [bloodGroupResponse, setBloodGroupResponse] = useState('');

    const hospitalRef = useRef(null);
    const bloodGroupRef = useRef(null);
    const hospitalInputRef = useRef(null);
    const bloodGroupInputRef = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api');
            setHospitals(response.data.hospitals);
            setBloodTypes(response.data.blood_types);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setFilteredHospitals(
            hospitalInput
                ? hospitals.filter(hospital =>
                      hospital.toLowerCase().includes(hospitalInput.toLowerCase())
                  )
                : hospitals
        );
    }, [hospitalInput, hospitals]);

    useEffect(() => {
        setFilteredBloodTypes(
            bloodGroupInput
                ? bloodTypes.filter(bloodType =>
                      bloodType.toLowerCase().includes(bloodGroupInput.toLowerCase())
                  )
                : bloodTypes
        );
    }, [bloodGroupInput, bloodTypes]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (hospitalRef.current && !hospitalRef.current.contains(event.target)) {
                setHospitalInputFocused(false);
            }
            if (bloodGroupRef.current && !bloodGroupRef.current.contains(event.target)) {
                setBloodGroupInputFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleHospitalChange = (e) => {
        setHospitalInput(e.target.value);
    };

    const handleBloodGroupChange = (e) => {
        setBloodGroupInput(e.target.value);
    };

    const handleHospitalSelect = (hospital) => {
        setHospitalInput(hospital);
        setTimeout(() => {
            setHospitalInputFocused(false);
        }, 100);
        hospitalInputRef.current.focus();
        handleHospitalSubmit(hospital);
    };

    const handleBloodGroupSelect = (bloodType) => {
        setBloodGroupInput(bloodType);
        setTimeout(() => {
            setBloodGroupInputFocused(false);
        }, 100);
        bloodGroupInputRef.current.focus();
        handleBloodGroupSubmit(bloodType);
    };

    const handleHospitalSubmit = async (input) => {
        if (!input) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/generate', { input });
            setHospitalResponse(response.data.output || 'No response from server');
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Hospital fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBloodGroupSubmit = async (input) => {
        if (!input) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/generate', { input });
            setBloodGroupResponse(response.data.output.hospitals || 'No response from server');
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Blood group fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleHospitalKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleHospitalSubmit(hospitalInput);
        }
    };

    const handleBloodGroupKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBloodGroupSubmit(bloodGroupInput);
        }
    };

    return (
        <section id="generate-text" className="text-center p-8 text-black relative bg-gray-100 flex flex-col justify-center h-screen">
            <h3 className="text-3xl font-bold mb-4">Search Hospitals and Blood Types</h3>

            <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4 justify-center">
                <div className="relative mb-4 flex flex-col w-full lg:w-1/2" ref={hospitalRef}>
                    <input
                        ref={hospitalInputRef}
                        type="text"
                        value={hospitalInput}
                        onChange={handleHospitalChange}
                        onKeyDown={handleHospitalKeyDown}
                        onFocus={() => setHospitalInputFocused(true)}
                        placeholder="Search Hospitals"
                        className="px-4 py-2 border rounded-lg text-white w-full"
                    />
                    {hospitalInputFocused && (
                        <ul className="mt-10 absolute left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto" style={{ bottom: 'auto', top: 'auto' }}>
                            {filteredHospitals.length > 0 ? (
                                filteredHospitals.map((hospital, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleHospitalSelect(hospital)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {hospital}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No hospitals found</li>
                            )}
                        </ul>
                    )}

                    {hospitalResponse && (
                        <div className="mt-2 ml-4 text-black font-semibold text-left">
                            <p>{hospitalResponse}</p>
                            <div className="flex space-x-4 mt-2">
                                <a href={`tel:0123456789`} aria-label="Contact" className="text-black hover:text-blue-500">
                                    <FaPhone size={20}/>
                                </a>
                                <a href={`mailto:example@gmail.com`} aria-label="Email" className="text-black hover:text-blue-500">
                                    <FaEnvelope size={20}/>
                                </a>
                                <a href="https://example.com/" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-black hover:text-blue-500">
                                    <FaGlobe size={20}/>
                                </a>
                            </div>
                        </div>
                    )}



                </div>
                <div className="relative mb-4 flex flex-col w-full lg:w-1/2" ref={bloodGroupRef}>
                    <input
                        ref={bloodGroupInputRef}
                        type="text"
                        value={bloodGroupInput}
                        onChange={handleBloodGroupChange}
                        onKeyDown={handleBloodGroupKeyDown}
                        onFocus={() => setBloodGroupInputFocused(true)}
                        placeholder="Search Blood Groups"
                        className="px-4 py-2 border rounded-lg text-white w-full"
                    />
                    {bloodGroupInputFocused && (
                        <ul className="mt-10 absolute left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto" style={{ top: 'auto' }}>
                            {filteredBloodTypes.length > 0 ? (
                                filteredBloodTypes.map((bloodType, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleBloodGroupSelect(bloodType)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {bloodType}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No blood types found</li>
                            )}
                        </ul>
                    )}
                    {bloodGroupResponse && (
                        <div className="mt-2 ml-4 text-black font-semibold text-left max-h-[60vh] overflow-y-auto">
                            {bloodGroupResponse.split(',').map((hospital, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-black">
                                    <p>{hospital.trim()}</p>
                                    <div className="flex space-x-4 mr-10">
                                        <a href={`tel:0123456789`} aria-label="Contact" className="text-black hover:text-blue-500">
                                            <FaPhone />
                                        </a>
                                        <a href={`mailto:example@gmail.com`} aria-label="Email" className="text-black hover:text-blue-500">
                                            <FaEnvelope />
                                        </a>
                                        <a href="https://example.com/" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-black hover:text-blue-500">
                                            <FaGlobe />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </section>
    );
};

export default Search;
