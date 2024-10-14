import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [reminderText, setReminderText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State to manage the selected image for modal
  const navigate = useNavigate();

  // Function to fetch reminders from the API
  const fetchReminders = async () => {
    try {
      const response = await axios.get('https://filwteg7qe.execute-api.us-east-1.amazonaws.com/dev/reminder/get');
      console.log('API Response:', response.data);

      const parsedBody = JSON.parse(response.data.body); // Properly parse the JSON body
      if (parsedBody && parsedBody.reminders) {
        setReminders(parsedBody.reminders);
      } else {
        setReminders([]); // Set to an empty array if no reminders are found
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  // Fetch reminders when the component mounts
  useEffect(() => {
    fetchReminders();
  }, []);

  // Handle form submission for creating a reminder
  const handleCreateReminder = async (e) => {
    e.preventDefault();

    // Construct the request body
    const requestBody = {
      reminderText,
      dueDate,
      photoBase64, // Send base64 encoded image data
    };

    try {
      const response = await axios.post('https://filwteg7qe.execute-api.us-east-1.amazonaws.com/dev/reminder/create', requestBody);
      if (response.status === 200) {
        toast.success('Reminder created successfully!'); // Show toast notification
        setReminderText('');
        setDueDate('');
        setPhotoBase64('');
        // Re-fetch reminders after creating a new one
        await fetchReminders();
      }
    } catch (error) {
      toast.error('Error creating reminder. Please try again.'); // Show error toast
      console.error('Error creating reminder:', error);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove metadata and store only base64 string
      const base64String = reader.result.split(',')[1];
      setPhotoBase64(base64String);
    };
    if (file) {
      reader.readAsDataURL(file); // Read the file as data URL
    }
  };

  // Handle logout action
  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  // Function to open the image in the modal
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image URL
  };

  // Function to close the modal for image
  const closeModal = () => {
    setSelectedImage(null); // Clear the selected image URL
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      {/* Form to add a reminder styled as a search bar */}
      <form onSubmit={handleCreateReminder} className="bg-white shadow-md rounded-lg p-4 mx-4 mt-4 flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Reminder Text" 
          value={reminderText} 
          onChange={(e) => setReminderText(e.target.value)} 
          required 
          className="flex-grow p-2 border rounded shadow-sm"
        />
        
        <div className="relative">
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            required 
            placeholder="Due date" // Use a placeholder instead of type="date"
            className="p-2 border rounded shadow-sm"
          />
        </div>

        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange} 
          className="p-2 border rounded shadow-sm"
        />

        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Add Reminder
        </button>
      </form>

      <div className="p-4 flex items-center justify-center">
        {/* Display reminders in a card format */}
        {reminders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2"> {/* Adjusted margin */}
            {reminders.map((reminder) => (
              <div key={reminder.id} className="max-w-sm bg-white border border-gray-300 rounded-lg shadow-md">
                {reminder.photoKey ? (
                  <img 
                    className="rounded-t-lg" 
                    src={`https://serverlesslab155.s3.amazonaws.com/${reminder.photoKey}`} 
                    alt="Reminder" 
                  />
                ) : null} {/* Show image only if available */}
                <div className={`p-5 ${reminder.photoKey ? '' : 'flex flex-col justify-center items-center'}`}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{reminder.reminderText}</h5>
                  <p className="mb-3 font-normal text-gray-700">Due: {reminder.dueDate}</p>
                  {!reminder.photoKey && ( // Center the text if no image is present
                    <p className="text-center text-xl font-semibold">No image available.</p>
                  )}
                  {reminder.photoKey && ( // Show button to open image in modal
                    <button 
                      onClick={() => openImageModal(`https://serverlesslab155.s3.amazonaws.com/${reminder.photoKey}`)} 
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                      Open Image
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-3xl font-semibold">No reminders available.</p> // Message when no reminders
        )}
      </div>

      {/* Modal for displaying the image */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <img src={selectedImage} alt="Reminder" className="max-w-full max-h-[80vh]" />
            <button 
              onClick={closeModal} 
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer /> {/* Include ToastContainer here */}
    </div>
  );
};

export default Dashboard;