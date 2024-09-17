import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <div className= "container mx-auto my-auto ">
            <h1 className="text-3xl font-bold mb-6 text-center text-white"> 
                LoginPage
            </h1>
            
        </div>
    );
};

export default LoginPage;