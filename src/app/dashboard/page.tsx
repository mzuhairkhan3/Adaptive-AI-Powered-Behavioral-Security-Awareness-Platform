"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  risk_score: number;
}

interface Campaign {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Create User
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");

  // Create Campaign
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDesc, setCampaignDesc] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, campaignsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/users/"),
        fetch("http://127.0.0.1:8000/campaigns/"),
      ]);

      const usersData = await usersRes.json();
      const campaignsData = await campaignsRes.json();

      setUsers(usersData);
      setCampaigns(campaignsData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createUser = async () => {
    if (!fullName || !email) return alert("Please fill name and email");

    const res = await fetch("http://127.0.0.1:8000/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, role }),
    });

    if (res.ok) {
      alert("User created!");
      setFullName("");
      setEmail("");
      fetchData();
    } else {
      alert("Failed to create user");
    }
  };

  const createCampaign = async () => {
    if (!campaignTitle) return alert("Please enter campaign title");

    const res = await fetch("http://127.0.0.1:8000/campaigns/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: campaignTitle, description: campaignDesc }),
    });

    if (res.ok) {
      alert("Campaign created!");
      setCampaignTitle("");
      setCampaignDesc("");
      fetchData();
    } else {
      alert("Failed to create campaign");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("User deleted");
      fetchData();
    } else {
      alert("Failed to delete user");
    }
  };

  const deleteCampaign = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    const res = await fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Campaign deleted");
      fetchData();
    } else {
      alert("Failed to delete campaign");
    }
  };

  const averageRisk =
    users.length > 0
      ? Math.round(users.reduce((sum, user) => sum + user.risk_score, 0) / users.length)
      : 0;

  const getRiskColor = (score: number) => {
    if (score >= 70) return "bg-red-100 text-red-700";
    if (score >= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Adaptive Security Platform</h1>
          <div className="space-x-6">
            <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium">
              Generate Email
            </Link>
            <Link href="/dashboard" className="text-blue-600 font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            <p className="text-gray-600 text-sm mt-1">Manage users, campaigns and monitor risk</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Generate Phishing Email
            </Link>
            <button
              onClick={fetchData}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-600 mb-1">Average Risk Score</p>
            <p className="text-3xl font-bold">{averageRisk}</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold">{campaigns.length}</p>
          </div>
        </div>

        {/* Create Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-lg mb-4">Create New User</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={createUser}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
              >
                Create User
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-lg mb-4">Create New Campaign</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Campaign Title"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Description (optional)"
                value={campaignDesc}
                onChange={(e) => setCampaignDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
              />
              <button
                onClick={createCampaign}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h3 className="font-medium">All Users</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Risk Score</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{user.full_name}</td>
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-sm capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRiskColor(user.risk_score)}`}>
                        {user.risk_score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-medium">All Campaigns</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No campaigns found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{campaign.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{campaign.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {campaign.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {campaign.is_active ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-gray-500">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}