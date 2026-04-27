import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Register() {
    // State variables to store form data
    const [name, setName] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [phone, setPhone] = useState('');
    const [constituency, setConstituency] = useState('North');
    const [message, setMessage] = useState('');
    const [voterId, setVoterId] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Send data to backend
            const response = await api.post('/voters/register', {
                name: name,
                aadharNumber: aadhar,
                phoneNumber: phone,
                constituency: constituency
            });
            
            // Show success message
            setMessage('Registration successful!');
            setVoterId(response.data.voterId);
            
            // Clear form
            setName('');
            setAadhar('');
            setPhone('');
            
        } catch (error) {
            setMessage('Error: ' + error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Voter Registration</h2>
            
            {message && (
                <div style={{ 
                    background: message.includes('Error') ? '#f8d7da' : '#d4edda',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '5px'
                }}>
                    {message}
                    {voterId && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Your Voter ID:</strong>
                            <p style={{ 
                                background: '#fff', 
                                padding: '10px',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all'
                            }}>
                                {voterId}
                            </p>
                            <p style={{ color: '#856404' }}>
                                ⚠️ Save this ID to vote!
                            </p>
                        </div>
                    )}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Aadhar Number (12 digits):</label>
                    <input
                        type="text"
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value)}
                        pattern="[0-9]{12}"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone Number (10 digits):</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        pattern="[0-9]{10}"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Constituency:</label>
                    <select
                        value={constituency}
                        onChange={(e) => setConstituency(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>
                
                <button 
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Register
                </button>
            </form>
            
            <div style={{ marginTop: '20px' }}>
                <Link to="/">← Back to Home</Link>
            </div>
        </div>
    );
}

export default Register;
