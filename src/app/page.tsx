"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("General");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateEmail = async () => {
  if (!name.trim()) {
    setError("Please enter employee name");
    return;
  }

  setLoading(true);
  setResult("");
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/generate-phishing/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_name: name,
        department: department,
        company: "TechCorp",
      }),
    });

    const data = await response.json();

    // Handle different possible response formats
    if (typeof data.generated_email === "string") {
      setResult(data.generated_email);
    } else if (data.generated_email?.text) {
      setResult(data.generated_email.text);
    } else if (typeof data === "string") {
      setResult(data);
    } else {
      setResult(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    setError("Could not connect to backend. Make sure the server is running.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Adaptive Security Platform</h1>
          <div className="space-x-4">
            <Link href="/" className="text-blue-600 font-medium">Generate Email</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Phishing Email Generator</h2>
          <p className="text-gray-500 mb-6">Create personalized simulation emails using AI</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Khan"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Finance"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={generateEmail}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? "Generating with AI..." : "Generate Phishing Email"}
            </button>
          </div>

          {result && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Generated Email</h3>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-sm whitespace-pre-wrap text-gray-700">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}