import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        try {
            const response = await api.get('/votes/results');
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
        // Refresh every 10 seconds
        const interval = setInterval(fetchResults, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading results...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h2>Election Results</h2>
            <p style={{ color: '#666' }}>Live updates every 10 seconds</p>
            
            {results.length === 0 ? (
                <p>No votes cast yet</p>
            ) : (
                <div>
                    {results.map((result, index) => (
                        <div
                            key={index}
                            style={{
                                margin: '20px 0',
                                padding: '15px',
                                background: '#f8f9fa',
                                borderRadius: '5px',
                                border: '1px solid #dee2e6'
                            }}
                        >
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{ margin: 0 }}>{result.candidate}</h3>
                                <span style={{ 
                                    background: '#007bff',
                                    color: 'white',
                                    padding: '5px 15px',
                                    borderRadius: '20px',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    {result.votes} votes
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ marginTop: '30px' }}>
                <Link to="/">← Back to Home</Link>
            </div>
        </div>
    );
}

export default Results;
