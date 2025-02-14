import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import QuizGame from "./components/QuizGame";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/game" element={<QuizGame />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
