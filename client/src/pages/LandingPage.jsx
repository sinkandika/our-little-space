import { useEffect, useState } from "react";
import { getAllTables } from "../services/tableService";
import { useNavigate } from "react-router-dom";
import logoFull from "../assets/logo-full.svg";
import TableCard from "../components/shared/TableCard";
import cafeImage from "../assets/cafe-image.jpeg";

const LandingPage = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  const [loadingTable, setLoadingTable] = useState(false);

  // FETCH ALL TABLES
  useEffect(() => {
    const fetchTables = async () => {

      setLoadingTable(true)

      try {
        const res = await getAllTables();
        setTables(res.data);
      } catch (error) {
        console.log("Failed to load tables:", error);
      } finally {
        setLoadingTable(false);
      }
    };

    fetchTables();
  }, []);

  // TABLE NAVIGATE
  const handleTableMove = (table) => {
    // save tableId to local storage(for local cart system)
    localStorage.setItem("tableId", table.id);

    navigate(`/table/${table.table_number}`);
  };

  return (
    <div className="min-h-screen bg-color-6 w-full flex flex-row justify-center items-center text-color-4">
      <div className="flex flex-row w-full max-w-4xl shadow-xl rounded-2xl">

        <div className="md:flex w-full hidden">
          <img
          src={cafeImage}
          alt="cafe image"
          className="object-cover rounded-l-2xl"
          />
        </div>
        
        <div className="w-full flex flex-col items-center bg-white p-6 rounded-2xl md:rounded-none md:rounded-r-2xl overflow-auto">
          <div className="py-4">
            <img
            src={logoFull}
            alt="logo-full"
            className="w-50"
            />
          </div>

          <div className="flex flex-col items-center gap-y-2">
            <p className="text-xl font-medium">
              Select Your Seat
            </p>
            <div className="border-b-2 border-color-1 w-50 md:w-50"></div>
          </div>

          <div className="flex flex-wrap py-4 gap-4 justify-center">
            {loadingTable ? (
              <div>
                <div className="flex flex-col justify-center items-center py-10 gap-4">
                  <div className="w-12 h-12 rounded-full border-color-2 border-t-color-1 border-4 animate-[spin_0.5s_linear_infinite] "></div>
                  <p>Loading table list.... </p>
                </div>
              </div>
            ) : (
              tables.map((table) => (
                <div>
                  <TableCard
                  key={table.id}
                  table={table}
                  onMove={handleTableMove}
                  />
                </div>
              ))
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;