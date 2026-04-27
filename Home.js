import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to Voting System</p>
            <Link to="/register">Go to Register</Link>
        </div>
    );
}

export default Home;
