import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationTriangle } from 'react-icons/fa'; 

const BarChartComponent = () => {
    const [donationAmounts, setDonationAmounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lowBloodTypes, setLowBloodTypes] = useState([]); 

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api');
            if (response.status === 200) {
                setDonationAmounts(response.data.donationAmounts);
            } else {
                setError('Error fetching data from server');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowBloodTypesList = Object.entries(donationAmounts)
          .filter(([, amount]) => amount < 20000)
          .map(([bloodType]) => bloodType);
        
        setLowBloodTypes(lowBloodTypesList);
    }, [donationAmounts]);

    useEffect(() => {
        fetchData();
    }, []);

    // Convert the dictionary into an array of objects
    const chartData = Object.entries(donationAmounts).map(([key, BloodGroup]) => ({
        name: key,
        'Blood Groups': BloodGroup,
    }));

    return (
        <section className="flex flex-col items-center justify-center p-4 bg-gray-200 h-screen">
            <h2 className="mb-4 text-xl font-semibold text-black">Blood Groups Distribution</h2>
            {loading && <p className="mt-4 text-black">Loading...</p>}
            {error && (
                <div className="mt-4 text-red-500">
                    <p>{error}</p>
                    <button onClick={fetchData} className="mt-2 bg-blue-500 text-white p-2 rounded">Retry</button>
                </div>
            )}
            {!loading && !error && chartData.length === 0 && (
                <p className="mt-4">No data available</p>
            )}
            {!loading && !error && chartData.length > 0 && (
                <ResponsiveContainer width="70%" height="70%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid stroke="#000" strokeDasharray="1 1" />
                        <XAxis dataKey="name" />
                        <YAxis
                            label={{
                                value: 'Distribution in ml',
                                angle: -90,
                                position: 'insideLeft',
                                offset: -5,
                                style: { textAnchor: 'middle', fill: '#000' }
                            }}
                            style={{ fill: '#000' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Blood Groups" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {/* Alerts Section */}
            <section className="alert-section bg-gray-200 p-4 rounded-md shadow-md max-w-3xl mx-auto my-4">
                <div className="alert-box flex items-center space-x-2">
                    <FaExclamationTriangle className="alert-icon text-yellow-500" size={24} />
                    <div className="flex flex-col">
                        {lowBloodTypes.length > 0 ? (
                            lowBloodTypes.map((bloodType, index) => (
                                <p key={index} className="alert-text text-gray-800">
                                    <strong>Alert:</strong> Blood type <strong>{bloodType}</strong> is low. Please <a href="https://www.redcross.org/give-blood.html" target="_blank" rel="noopener noreferrer">donate!</a>
                                </p>
                            ))
                        ) : (
                            <p className="alert-text text-gray-800">No current alerts.</p>
                        )}
                    </div>
                </div>
            </section>
        </section>
    );
};

export default BarChartComponent;
