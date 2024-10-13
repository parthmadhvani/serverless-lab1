// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await axios.post('https://filwteg7qe.execute-api.us-east-1.amazonaws.com/dev/reminder/login', {
//         username,
//         password
//       });

//       // Log the API response to inspect its structure
//       console.log('API response:', response);

//       // Parse the body from the response
//       const responseBody = JSON.parse(response.data.body);

//       // Check if the response is successful and contains the correct message
//       if (response.status === 200 && responseBody.message === 'Login successful') {
//         // Successful login, redirect to Dashboard
//         navigate('/dashboard');
//       } else {
//         // Invalid username or password
//         setError('Invalid username or password');
//       }
//     } catch (error) {
//       // Log any errors for debugging purposes
//       console.error('Error:', error);
      
//       // Set a user-friendly error message
//       setError('An error occurred during login. Please try again.');
//     }
//   };

//   const handleRedirectToSignUp = () => {
//     navigate('/signup'); // Redirect to the sign-up page
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
        
//         {error && <p className="text-red-500 mb-4">{error}</p>}
        
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
//           <input 
//             type="text" 
//             value={username}
//             onChange={(e) => setUsername(e.target.value)} 
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none" 
//             placeholder="Enter your username" 
//             required 
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//           <input 
//             type="password" 
//             value={password}
//             onChange={(e) => setPassword(e.target.value)} 
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none" 
//             placeholder="Enter your password" 
//             required 
//           />
//         </div>
        
//         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Login</button>
        
//         <p className="mt-4 text-center">
//           Don't have an account? 
//           <button 
//             onClick={handleRedirectToSignUp} 
//             className="text-blue-500 hover:underline"
//           >
//             Sign up
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://filwteg7qe.execute-api.us-east-1.amazonaws.com/dev/reminder/login', {
        username,
        password
      });

      console.log('API response:', response);
      const responseBody = JSON.parse(response.data.body);

      if (response.status === 200 && responseBody.message === 'Login successful') {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleRedirectToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter your username" 
            required 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter your password" 
            required 
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Login</button>
        
        <p className="mt-4 text-center">
          Don't have an account? 
          <button 
            onClick={handleRedirectToSignUp} 
            className="text-blue-500 hover:underline ml-1"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;