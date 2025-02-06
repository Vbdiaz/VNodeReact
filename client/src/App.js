import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';  // No need for useLocation
import Table from './Table';
import NewPage from './NewPage';  // Import the NewPage component

const App = () => {
    const [data, setData] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Fetch data for the table
    useEffect(() => {
        fetch("http://localhost:3001/data")
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error("Error fetching data:", error));
    }, [data]);

    // Handle the form submission to register a user
    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { username, password };

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const result = await response.json();
            console.log(result);
            if (result.success) {
                setMessage("User registered successfully!");
                setUsername('');
                setPassword('');
            } else {
                setMessage(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error while submitting data');
        }
    };

    return (
        <Router> {/* Wrap everything inside Router */}
            <div>
                {/* Conditionally render the button */}
                <Routes>
                    {/* NewPage route */}
                    <Route path="/new-page" element={<NewPage />} />  {/* Render NewPage component when '/new-page' route is matched */}

                    {/* Main Page route */}
                    <Route path="/" element={
                        <div>
                            <h1>Database Table</h1>
                            <Table data={data} />

                            <h2>Register User</h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit">Submit</button>
                            </form>

                            {message && <p>{message}</p>}

                            {/* Only show the button on the main page */}
                            <Link to="/new-page">
                                <button>Go to New Page</button>
                            </Link>
                        </div>
                    } /> {/* Default content on main route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
