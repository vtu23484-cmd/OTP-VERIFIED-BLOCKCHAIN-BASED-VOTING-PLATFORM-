import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Vote() {
    // Step management: 1 = Enter ID, 2 = Enter OTP, 3 = Vote
    const [step, setStep] = useState(1);
    const [voterId, setVoterId] = useState('');
    const [otp, setOtp] = useState('');
    const [candidateId, setCandidateId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Candidates list
    const candidates = [
        { id: 'cand1', name: 'Candidate A', party: 'Party A' },
        { id: 'cand2', name: 'Candidate B', party: 'Party B' },
        { id: 'cand3', name: 'Candidate C', party: 'Party C' }
    ];

    // Step 1: Generate OTP
    const handleGenerateOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        try {
            await api.post('/otp/generate', { voterId });
            setMessage('OTP sent! Check the server terminal for the code.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate OTP');
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        try {
            await api.post('/otp/verify', { voterId, otp });
            setMessage('OTP verified! Now select your candidate.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP');
        }
    };

    // Step 3: Cast Vote
    const handleCastVote = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        try {
            await api.post('/votes/cast', { voterId, candidateId });
            setMessage('✅ Vote cast successfully!');
            // Reset after 3 seconds
            setTimeout(() => {
                setStep(1);
                setVoterId('');
                setOtp('');
                setCandidateId('');
                setMessage('');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Vote casting failed');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
            <h2>Cast Your Vote</h2>
            
            {message && (
                <div style={{ 
                    background: '#d4edda',
                    padding: '15px',
                    margin: '20px 0',
                    borderRadius: '5px',
                    color: '#155724'
                }}>
                    {message}
                </div>
            )}
            
            {error && (
                <div style={{ 
                    background: '#f8d7da',
                    padding: '15px',
                    margin: '20px 0',
                    borderRadius: '5px',
                    color: '#721c24'
                }}>
                    {error}
                </div>
            )}

            {/* Step 1: Enter Voter ID */}
            {step === 1 && (
                <form onSubmit={handleGenerateOTP}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Enter your Voter ID:
                        </label>
                        <input
                            type="text"
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '5px'
                            }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Send OTP
                    </button>
                </form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
                <form onSubmit={handleVerifyOTP}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Enter OTP (check server terminal):
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            pattern="[0-9]{6}"
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '5px'
                            }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Verify OTP
                    </button>
                </form>
            )}

            {/* Step 3: Select Candidate */}
            {step === 3 && (
                <form onSubmit={handleCastVote}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Select Candidate:
                        </label>
                        <select
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '5px'
                            }}
                            required
                        >
                            <option value="">Choose a candidate</option>
                            {candidates.map(cand => (
                                <option key={cand.id} value={cand.id}>
                                    {cand.name} ({cand.party})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Cast Vote
                    </button>
                </form>
            )}

            <div style={{ marginTop: '20px' }}>
                <Link to="/">← Back to Home</Link>
            </div>
        </div>
    );
}

export default Vote;
