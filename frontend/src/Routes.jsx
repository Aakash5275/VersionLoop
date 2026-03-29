import React , {useEffect } from 'react';
import {useNavigate , useRoutes} from 'react-router-dom';

// pages Lista 
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Loging";
import Signup from "./components/auth/Signup";

//Auth Context 
import { useAuth } from './authContext';

const ProjectRoutes = () => {
    const { currentUser , setCurrentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage && !currentUser) {
            setCurrentUser({ id: userIdFromStorage });
        }

        if (!userIdFromStorage && ! ["/auth", "/signup"].includes(window.location.pathname)) {
            navigate('/auth');
        }


        if(userIdFromStorage && window.location.pathname === "/auth"){
            navigate('/');
        }
    } , [currentUser, navigate, setCurrentUser]);
    
    let elements = useRoutes([
        {
            path: "/",
            element: <Dashboard />
        },
        
        {
            path: "/auth",
            element: <Login />
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path: "/profile",
            element: <Profile />
        }
    ]);

    return elements;
}

export default ProjectRoutes;


