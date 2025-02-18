// GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../services/account";

const GoogleCallback = () => {
  const API_URL = import.meta.env.VITE_API_URL_USER;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // The user info should already be in the session on the backend
      // You can make a request to get the current user's info
      fetch(`${API_URL}/api/users/me`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          navigate("/login");
        });
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Processing login...</h2>
      </div>
    </div>
  );
};

export default GoogleCallback;
