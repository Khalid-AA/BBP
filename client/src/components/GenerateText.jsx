import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const GenerateText = () => {
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
    const [donationAmounts, setDonationAmounts] = useState({}); 

    const hospitalRef = useRef(null);
    const bloodGroupRef = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api');
            setHospitals(response.data.hospitals);
            setBloodTypes(response.data.blood_types);
            setDonationAmounts(response.data.donationAmounts); // Store donation amounts
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
        if (hospitalInput) {
            const filtered = hospitals.filter(hospital =>
                hospital.toLowerCase().includes(hospitalInput.toLowerCase())
            );
            setFilteredHospitals(filtered);
        } else {
            setFilteredHospitals(hospitals);
        }
    }, [hospitalInput, hospitals]);

    useEffect(() => {
        if (bloodGroupInput) {
            const filtered = bloodTypes.filter(bloodType =>
                bloodType.toLowerCase().includes(bloodGroupInput.toLowerCase())
            );
            setFilteredBloodTypes(filtered);
        } else {
            setFilteredBloodTypes(bloodTypes);
        }
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
        setHospitalInputFocused(false);
    };

    const handleBloodGroupSelect = (bloodType) => {
        setBloodGroupInput(bloodType);
        setBloodGroupInputFocused(false);
    };

    const handleHospitalSubmit = async () => {
        if (!hospitalInput) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/generate', { input: hospitalInput });
            setHospitalResponse(response.data.output || 'No response from server');
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Hospital fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBloodGroupSubmit = async () => {
        if (!bloodGroupInput) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/generate', { input: bloodGroupInput });
            setBloodGroupResponse(response.data.output.hospitals || 'No response from server');
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Blood group fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="generate-text" className="text-center p-8 text-black relative">
            <h3 className="text-3xl font-bold mb-4">Search Hospitals and Blood Types</h3>

            {/* Display Donation Amounts */}
            <div className="mb-4">
                <h4 className="text-xl font-semibold">Donation Amounts:</h4>
                <ul className="list-disc list-inside">
                    {Object.entries(donationAmounts).map(([bloodGroup, amount]) => (
                        <li key={bloodGroup}>
                            {bloodGroup} : {amount} ml
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <div className="relative mb-4 flex items-center justify-center" ref={hospitalRef}>
                    <input
                        type="text"
                        value={hospitalInput}
                        onChange={handleHospitalChange}
                        onFocus={() => setHospitalInputFocused(true)}
                        placeholder="Search Hospitals"
                        className="px-4 py-2 border rounded-lg text-white"
                    />
                    <button
                        onClick={handleHospitalSubmit}
                        className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg ${hospitalInput ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!hospitalInput}
                    >
                        Search
                    </button>
                    {hospitalInputFocused && (
                        <ul className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
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
                </div>
                {hospitalResponse && <p className="mt-1 mb-2 text-green-900 font-semibold">{hospitalResponse}</p>}

                <div className="relative mb-4 flex items-center justify-center" ref={bloodGroupRef}>
                    <input
                        type="text"
                        value={bloodGroupInput}
                        onChange={handleBloodGroupChange}
                        onFocus={() => setBloodGroupInputFocused(true)}
                        placeholder="Search Blood Types"
                        className="px-4 py-2 border rounded-lg text-white"
                    />
                    <button
                        onClick={handleBloodGroupSubmit}
                        className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg ${bloodGroupInput ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!bloodGroupInput}
                    >
                        Search
                    </button>
                    {bloodGroupInputFocused && (
                        <ul className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
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
                </div>
            </div>
            {bloodGroupResponse && <p className="mt-1 mb-2 text-green-900 font-semibold">{bloodGroupResponse}</p>}

            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </section>
    );
};

export default GenerateText;
