import React, { useEffect } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
  const fetchData = () => {
    axios
      .get("http://localhost:8092/user")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative w-full md:h-[600px] h-[1000px] mt-[75px] mx-auto">
      <h1>Employee Dashboard</h1>
      <p>Employee Dashboard is under construction.</p>
    </div>
  );
};

export default EmployeeDashboard;
