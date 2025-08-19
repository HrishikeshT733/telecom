import React, { useState, useEffect } from "react";
import { resetSimulationDate, getSimulationDate } from "../../api/dashboardApi"; // adjust path if needed

export default function HomeAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [simulationDate, setSimulationDate] = useState("");

  // fetch current simulation date on load
  useEffect(() => {
    fetchSimulationDate();
  }, []);

  const fetchSimulationDate = async () => {
    try {
      const data = await getSimulationDate();
      setSimulationDate(data.simulationDate);
    } catch (err) {
      setError("Failed to fetch simulation date");
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: If you reset the simulation date, all records (bills & usages) will be deleted.\n\nOnly SIMs and Plans will remain.\n\nDo you want to continue?"
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await resetSimulationDate();
      setMessage(data.message || "Simulation reset successfully");
      fetchSimulationDate(); // refresh date after reset
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="p-6 border rounded-2xl shadow-md text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-gray-700 mb-4">
          Current Simulation Date:{" "}
          <span className="font-bold text-blue-600">
            {simulationDate || "Loading..."}
          </span>
        </p>
        <p className="text-gray-700 mb-6">
          Resetting the simulation date will{" "}
          <span className="font-bold text-red-600">
            delete all bills and usage records
          </span>
          . Only SIMs and Plans will remain.
        </p>

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Resetting..." : "⚠️ Reset Simulation Date"}
        </button>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}
