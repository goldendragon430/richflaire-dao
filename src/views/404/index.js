import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/proposals");
    }, []);

    return <></>;
}
