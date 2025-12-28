import { useState, useEffect } from "react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // Add job
  const addJob = (e) => {
    e.preventDefault(); // prevent page reload
    if (!title || !company) return;

    const newJob = { id: Date.now(), title, company, status };
    setJobs([...jobs, newJob]);

    // reset form
    setTitle("");
    setCompany("");
    setStatus("Applied");
  };

  // Delete job
  const deleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  // Update status
  const updateStatus = (id, newStatus) => {
    setJobs(jobs.map(job => job.id === id ? {...job, status: newStatus} : job));
  };

  const statusColor = {
    Applied: "bg-blue-100 text-blue-700",
    Interviewing: "bg-yellow-100 text-yellow-700",
    Offer: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700"
  };

  // Filter and search
  const filteredJobs = jobs.filter(
    job =>
      (filter ? job.status === filter : true) &&
      (job.title.toLowerCase().includes(search.toLowerCase()) ||
       job.company.toLowerCase().includes(search.toLowerCase()))
  );

  const count = (s) => jobs.filter(job => job.status === s).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">React Job Tracker</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {["Applied", "Interviewing", "Offer", "Rejected"].map(s => (
            <div key={s} className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">{s}</p>
              <p className="text-2xl font-bold">{count(s)}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={addJob} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-4 mb-6">
          <input
            className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <select
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <button className="bg-blue-600 text-white px-6 rounded-md hover:bg-blue-700 transition" type="submit">
            Add Job
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Search job or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Job Title</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">No jobs found</td>
                </tr>
              )}

              {filteredJobs.map(job => (
                <tr key={job.id} className="border-t">
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4">{job.company}</td>
                  <td className="p-4">
                    <select
                      value={job.status}
                      onChange={(e) => updateStatus(job.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[job.status]}`}
                    >
                      <option>Applied</option>
                      <option>Interviewing</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
