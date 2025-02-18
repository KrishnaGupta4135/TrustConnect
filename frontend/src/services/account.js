import { useState } from "react";
import { useNavigate } from "react-router-dom";

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL_USER;

// Function to handle user registration
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    const data = await response.json();
    // Save access token to localStorage
    localStorage.setItem("accessToken", data.access_token);

    return data;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    // Save both tokens to localStorage
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    return data;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

// Custom hook for handling form submission and navigation
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      await createUser(userData);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      return data; // Return the response so we can check for OTP requirement
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, handleLogin, loading, error };
};
