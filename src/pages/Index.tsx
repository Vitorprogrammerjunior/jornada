
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    document.title = "Jornada Fluxo Digital";
  }, []);

  // Redirect to landing page
  return <Navigate to="/" replace />;
};

export default Index;
