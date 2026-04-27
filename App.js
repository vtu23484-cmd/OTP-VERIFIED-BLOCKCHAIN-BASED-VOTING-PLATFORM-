import React, { useState, useEffect } from 'react';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    
    // Registration State
    const [fullName, setFullName] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [constituency, setConstituency] = useState('');
    
    // OTP State
    const [otpPhone, setOtpPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [sessionId, setSessionId] = useState('');
    
    // Vote State
    const [selectedCandidate, setSelectedCandidate] = useState('');
    
    // UI State
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const API = 'http://localhost:4000/api';

    const fetchResults = async () => {
        try {
            const res = await fetch(`${API}/results`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error('Error fetching results:', err);
        }
    };

    useEffect(() => {
        if (currentPage === 'results') {
            fetchResults();
            const interval = setInterval(fetchResults, 5000);
            return () => clearInterval(interval);
        }
    }, [currentPage]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('Registering...');
        
        if (phoneNumber.length !== 10) {
            setError('Phone number must be 10 digits');
            return;
        }
        
        if (aadharNumber.length !== 12) {
            setError('Aadhar number must be 12 digits');
            return;
        }
        
        try {
            const res = await fetch(`${API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, aadharNumber, phoneNumber, constituency })
            });
            const data = await res.json();
            
            if (data.success) {
                setMessage('✅ ' + data.message);
                setIsRegistered(true);
                setOtpPhone(`+91${phoneNumber}`);
                setTimeout(() => {
                    setCurrentPage('vote');
                    setMessage('');
                }, 1500);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Cannot connect to backend: ' + err.message);
        }
    };

    const sendOTP = async () => {
        setError('');
        setMessage('Sending OTP...');
        
        try {
            const res = await fetch(`${API}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: otpPhone })
            });
            const data = await res.json();
            
            if (data.error) {
                setError(data.error);
            } else {
                setMessage('✅ OTP sent to ' + otpPhone);
            }
        } catch (err) {
            setError('Failed to send OTP: ' + err.message);
        }
    };

    const verifyOTP = async () => {
        setError('');
        setMessage('Verifying...');
        
        try {
            const res = await fetch(`${API}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: otpPhone, code: otpCode })
            });
            const data = await res.json();
            
            if (data.valid) {
                setSessionId(data.sessionId);
                setMessage('✅ Phone verified successfully!');
            } else {
                setError(data.error || 'Invalid OTP code');
            }
        } catch (err) {
            setError('Verification failed: ' + err.message);
        }
    };

    const castVote = async () => {
        if (!sessionId) {
            setError('Please verify OTP first');
            return;
        }
        
        setError('');
        setMessage('Casting vote on blockchain...');
        
        try {
            const res = await fetch(`${API}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionId,
                    voterId: otpPhone,
                    candidateId: selectedCandidate
                })
            });
            const data = await res.json();
            
            if (data.success) {
                setMessage('✅ Vote recorded on blockchain successfully!');
                setTimeout(() => {
                    setCurrentPage('results');
                    setSelectedCandidate('');
                    setOtpCode('');
                    setSessionId('');
                    fetchResults();
                }, 2000);
            } else {
                setError(data.error || 'Vote failed');
            }
        } catch (err) {
            setError('Vote failed: ' + err.message);
        }
    };

    const resetRegistration = () => {
        setFullName('');
        setAadharNumber('');
        setPhoneNumber('');
        setConstituency('');
        setOtpPhone('');
        setOtpCode('');
        setSessionId('');
        setSelectedCandidate('');
        setMessage('');
        setError('');
        setIsRegistered(false);
    };

    const NavBar = () => (
        <div style={{ background: '#2c3e50', padding: '15px', marginBottom: '30px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: 'auto', flexWrap: 'wrap', gap: '10px' }}>
                <button onClick={() => { setCurrentPage('home'); resetRegistration(); }} style={{ background: currentPage === 'home' ? '#3498db' : 'transparent', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>🏠 Home</button>
                <button onClick={() => { setCurrentPage('register'); resetRegistration(); }} style={{ background: currentPage === 'register' ? '#3498db' : 'transparent', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>📝 Register</button>
                <button onClick={() => { setCurrentPage('vote'); }} style={{ background: currentPage === 'vote' ? '#3498db' : 'transparent', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>🗳️ Vote</button>
                <button onClick={() => { setCurrentPage('results'); fetchResults(); }} style={{ background: currentPage === 'results' ? '#3498db' : 'transparent', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>📊 Results</button>
            </div>
        </div>
    );

    // Home Page
    const HomePage = () => (
        <div style={{ textAlign: 'center' }}>
            <h2>Welcome to Blockchain Voting Platform</h2>
            <p style={{ fontSize: '18px', margin: '20px 0' }}>Secure • Transparent • Tamper-Proof</p>
            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
                <h3>📌 How It Works</h3>
                <ol style={{ textAlign: 'left', display: 'inline-block' }}>
                    <li>📝 Register with your Aadhar and Phone</li>
                    <li>📱 Verify your phone with OTP</li>
                    <li>🗳️ Cast your vote securely</li>
                    <li>📊 View real-time results</li>
                </ol>
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentPage('register')} style={{ padding: '15px 30px', background: '#3498db', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}>Register Now →</button>
                <button onClick={() => setCurrentPage('vote')} style={{ padding: '15px 30px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}>Already Registered? Vote →</button>
            </div>
        </div>
    );

    // Register Page - Fixed Cursor Focus Issue
    const RegisterPage = () => (
        <div>
            <h2>📝 Voter Registration</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Please fill your details to register as a voter</p>
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                    autoFocus
                />
                <input 
                    type="text" 
                    placeholder="Aadhar Number (12 digits)" 
                    maxLength="12" 
                    value={aadharNumber} 
                    onChange={(e) => setAadharNumber(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                />
                <input 
                    type="tel" 
                    placeholder="Phone Number (10 digits)" 
                    maxLength="10" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                />
                <select 
                    value={constituency} 
                    onChange={(e) => setConstituency(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
                >
                    <option value="">Select Constituency</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                </select>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>Register</button>
            </form>
        </div>
    );

    // Vote Page - Fixed Cursor Focus Issue
    const VotePage = () => (
        <div>
            <h2>🗳️ Cast Your Vote</h2>
            
            {!sessionId && (
                <div>
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                        <h3>Step 1: Verify Your Phone</h3>
                        <input 
                            type="tel" 
                            placeholder="Phone Number (+919866203492)" 
                            value={otpPhone} 
                            onChange={(e) => setOtpPhone(e.target.value)} 
                            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                            autoFocus={!sessionId}
                        />
                        <button onClick={sendOTP} style={{ width: '100%', padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Send OTP</button>
                    </div>
                    
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                        <h3>Step 2: Enter OTP</h3>
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit OTP" 
                            maxLength="6" 
                            value={otpCode} 
                            onChange={(e) => setOtpCode(e.target.value)} 
                            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                        />
                        <button onClick={verifyOTP} style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Verify OTP</button>
                    </div>
                </div>
            )}
            
            {sessionId && (
                <div>
                    <div style={{ background: '#e8f8f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                        <h3 style={{ color: 'green' }}>✅ Phone Verified! Now select your candidate</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '20px 0' }}>
                        <button onClick={() => setSelectedCandidate('candidate1')} style={{ padding: '20px', background: selectedCandidate === 'candidate1' ? '#2ecc71' : '#ecf0f1', border: '2px solid', borderColor: selectedCandidate === 'candidate1' ? '#27ae60' : '#bdc3c7', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '16px' }}>
                            <h3 style={{ margin: 0 }}>👨‍💼 Candidate A</h3>
                            <p style={{ margin: '5px 0 0 0' }}>Progressive Alliance</p>
                        </button>
                        <button onClick={() => setSelectedCandidate('candidate2')} style={{ padding: '20px', background: selectedCandidate === 'candidate2' ? '#2ecc71' : '#ecf0f1', border: '2px solid', borderColor: selectedCandidate === 'candidate2' ? '#27ae60' : '#bdc3c7', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '16px' }}>
                            <h3 style={{ margin: 0 }}>👩‍💼 Candidate B</h3>
                            <p style={{ margin: '5px 0 0 0' }}>United Front</p>
                        </button>
                        <button onClick={() => setSelectedCandidate('candidate3')} style={{ padding: '20px', background: selectedCandidate === 'candidate3' ? '#2ecc71' : '#ecf0f1', border: '2px solid', borderColor: selectedCandidate === 'candidate3' ? '#27ae60' : '#bdc3c7', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '16px' }}>
                            <h3 style={{ margin: 0 }}>🧑‍💼 Candidate C</h3>
                            <p style={{ margin: '5px 0 0 0' }}>People's Movement</p>
                        </button>
                    </div>
                    <button onClick={castVote} disabled={!selectedCandidate} style={{ width: '100%', padding: '12px', background: selectedCandidate ? '#e67e22' : '#bdc3c7', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: selectedCandidate ? 'pointer' : 'not-allowed' }}>Confirm Vote</button>
                </div>
            )}
        </div>
    );

    // Results Page
    const ResultsPage = () => (
        <div>
            <h2>📊 Live Election Results</h2>
            {results ? (
                <div style={{ marginTop: '20px' }}>
                    {Object.entries(results).map(([candidate, votes]) => {
                        const total = Object.values(results).reduce((a,b) => a+b, 0);
                        const percentage = total > 0 ? (votes / total) * 100 : 0;
                        return (
                            <div key={candidate} style={{ margin: '15px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <strong>{candidate}</strong>
                                    <span>{votes} votes ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div style={{ background: '#ecf0f1', borderRadius: '10px', overflow: 'hidden', height: '30px' }}>
                                    <div style={{ background: '#3498db', width: `${percentage}%`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {percentage > 10 ? `${percentage.toFixed(0)}%` : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '10px' }}>
                        <strong>Total Votes Cast:</strong> {Object.values(results).reduce((a,b) => a+b, 0)}
                    </div>
                </div>
            ) : (
                <p>Loading results...</p>
            )}
            <button onClick={fetchResults} style={{ marginTop: '20px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>🔄 Refresh Results</button>
        </div>
    );

    return (
        <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🗳️ Blockchain Voting Platform</h1>
            <NavBar />
            
            {error && <div style={{ background: '#ffcccc', color: 'red', padding: '12px', margin: '15px 0', borderRadius: '5px' }}>❌ {error}</div>}
            {message && <div style={{ background: '#ccffcc', color: 'green', padding: '12px', margin: '15px 0', borderRadius: '5px' }}>✅ {message}</div>}
            
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'register' && <RegisterPage />}
            {currentPage === 'vote' && <VotePage />}
            {currentPage === 'results' && <ResultsPage />}
        </div>
    );
}

export default App;
