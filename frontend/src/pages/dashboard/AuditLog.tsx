"use client";
import { useEffect, useState } from "react";
import { api } from "../../utils/api"; // adjust the path as needed

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  createdAt: string;
  user?: User; // This will be populated by matching with users data
}

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch audit logs
        const logsResponse = await api.getAuditLogs(token);
        
        // Fetch users
        const usersResponse = await fetch(
          "https://eventflow-1wso.onrender.com/api/events/users"
        );
        const usersData = await usersResponse.json();
        
        // Match user data with audit logs
        const logsWithUsers = logsResponse.map((log: AuditLog) => {
          const user = usersData.data.find((u: User) => u.id === log.userId);
          return {
            ...log,
            user: user || undefined
          };
        });

        setLogs(logsWithUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <p className="text-sm text-gray-500">
            Overview of all actions performed in the system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
          />
        </div>
      </div>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && logs.length === 0 && <p>No audit logs available.</p>}

      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${log.action.includes('delet') ? 'bg-red-100 text-red-800' :
                        log.action.includes('creat') ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {log.user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {log.user?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.user?.email || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLog;