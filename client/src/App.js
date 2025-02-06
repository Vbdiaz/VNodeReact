import React, { useState, useEffect } from 'react';
import Table from './components/Table';

const App = () => {
    // State hooks for storing data, user input, and messages
    const [data, setData] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Function to fetch data for the table
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:3001/data");
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetch data for the table on component mount
    useEffect(() => {
        fetchData(); // Fetch data initially
    }, []); 

    // Handle the form submission for registering a user
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission

        const user = { username, password };

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type for the request
                },
                body: JSON.stringify(user), // Convert user data to JSON
            });

            const result = await response.json();

            if (result.success) {
                // Handle success response
                setMessage("User registered successfully!");
                setUsername(''); // Reset input fields
                setPassword('');
                fetchData(); // Re-fetch the data after successful registration
            } else {
                // Handle error response from server
                setMessage(`Error: ${result.message}`);
            }
        } catch (error) {
            // Handle any errors during the fetch request
            console.error('Error:', error);
            setMessage('Error while submitting data');
        }
    };

    return (
        <div>
            <h1>Database Table</h1>
            {/* Display table with fetched data */}
            <Table data={data} />

            <h2>Register User</h2>
            {/* Form to register a user */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

            {/* Display message based on submission result */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default App;
