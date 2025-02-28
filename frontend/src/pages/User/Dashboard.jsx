import React, { useState } from 'react';
import { 
  Menu, X, MessageSquare, File, Users, BarChart2, Bell, Settings, 
  LogOut, Home, Shield, Lock, UserCheck, Activity, UploadCloud 
} from 'lucide-react';
import Chat from '../Chat';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(1);
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Parker', email: 'sarah@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Manager', status: 'Active' },
  ]);
  const [files, setFiles] = useState([
    { id: 1, filename: 'project-report.pdf', size: '2.3 MB', date: 'Feb 22, 2025', status: 'Encrypted' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User', status: 'Active' });
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const usageData = [
    { name: 'Jan', users: 400, files: 240, messages: 180 },
    { name: 'Feb', users: 300, files: 139, messages: 220 },
    { name: 'Mar', users: 200, files: 280, messages: 250 },
    { name: 'Apr', users: 278, files: 390, messages: 210 },
    { name: 'May', users: 189, files: 480, messages: 230 },
    { name: 'Jun', users: 239, files: 380, messages: 240 },
    { name: 'Jul', users: 349, files: 430, messages: 300 },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleTabChange = (tab) => setActiveTab(tab);
  const clearNotifications = () => setNotifications(0);
  const handleLogout = () => alert('Logged out!');

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const newFiles = uploadedFiles.map((file, index) => ({
      id: files.length + index + 1,
      filename: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toLocaleDateString(),
      status: 'Encrypted',
    }));
    setFiles([...files, ...newFiles]);
    setNotifications(notifications + uploadedFiles.length);
  };

  const addUser = (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setNewUser({ name: '', email: '', role: 'User', status: 'Active' });
      setShowAddUserForm(false);
      setNotifications(notifications + 1);
    }
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setNotifications(notifications + 1);
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
    setNotifications(notifications + 1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-lg`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold flex items-center">
              <Shield className="mr-2" /> SecureHub
            </h1>
          )}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-800" title={isSidebarOpen ? 'Collapse' : 'Expand'}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {[
              { tab: 'home', icon: Home, label: 'Home' },
              { tab: 'chat', icon: MessageSquare, label: 'Messages' },
              { tab: 'files', icon: File, label: 'Files' },
              { tab: 'users', icon: Users, label: 'Users' },
              { tab: 'analytics', icon: BarChart2, label: 'Analytics' },
            ].map(({ tab, icon: Icon, label }) => (
              <li key={tab}>
                <button
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center px-4 py-3 w-full text-left ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                  }`}
                  title={label}
                >
                  <Icon className="mr-3" size={20} />
                  {isSidebarOpen && <span>{label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <ul className="space-y-1">
            <li>
              <button className="flex items-center px-4 py-3 w-full hover:bg-gray-800 text-gray-300">
                <Settings className="mr-3" size={20} />
                {isSidebarOpen && <span>Settings</span>}
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full hover:bg-gray-800 text-gray-300">
                <LogOut className="mr-3" size={20} />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            {activeTab === 'home' && 'Dashboard Overview'}
            {activeTab === 'chat' && 'Secure Messaging'}
            {activeTab === 'files' && 'Secure File Transfer'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'analytics' && 'System Analytics'}
          </h2>
          <div className="flex items-center space-x-4">
            <button onClick={clearNotifications} className="relative p-1 text-gray-600 hover:text-gray-800" title="Notifications">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <UserCheck size={16} />
              </div>
              {isSidebarOpen && <span className="font-medium text-gray-700">Admin</span>}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {/* Home Dashboard */}
          {activeTab === 'home' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Users className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-medium">Total Users</h3>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{users.length}</span>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MessageSquare className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-medium">Secure Messages</h3>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">8,942</span>
                      </div>
                      <div className="p-3 rounded-full bg-green-50">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <File className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-medium">Transferred Files</h3>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{files.length}</span>
                      </div>
                      <div className="p-3 rounded-full bg-purple-50">
                        <File className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Activity className="h-5 w-5 mr-2" />
                          <h3 className="text-sm font-medium">Active Sessions</h3>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                          {users.filter((u) => u.status === 'Active').length}
                        </span>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-50">
                        <Activity className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Shield className="mr-2" /> System Status
                    </h3>
                    <Settings className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-shrink-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="mr-2" /> Secure Chat
                </h2>
                <Lock className="text-green-600" title="End-to-end encrypted" />
              </div>
              <div className="flex-1 min-h-0">
                <Chat />
              </div>
            </div>
          )}

          {/* File Transfer */}
          {activeTab === 'files' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <File className="mr-2 h-5 w-5" /> Secure File Transfer
                  </h2>
                  <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                    <UploadCloud className="mr-2 h-5 w-5" /> Upload File
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50">
                  <UploadCloud size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Drop your encrypted files here or</p>
                  <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                    <File className="mr-2" /> Select Files
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <Lock className="mr-1 h-4 w-4" /> End-to-end encryption enabled
                  </p>
                </div>
                <div className="mt-6 flex-1">
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                    <BarChart2 className="mr-2" /> Transfer History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-4">Filename</th>
                          <th className="p-4">Size</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map((file) => (
                          <tr key={file.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 flex items-center">
                              <File className="mr-2 h-4 w-4" /> {file.filename}
                            </td>
                            <td className="p-4">{file.size}</td>
                            <td className="p-4">{file.date}</td>
                            <td className="p-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                                <Shield className="mr-1 h-4 w-4" /> {file.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Users className="mr-2 h-5 w-5" /> User Management
                  </h2>
                  <button
                    onClick={() => setShowAddUserForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <UserCheck className="mr-2 h-5 w-5" /> Add New User
                  </button>
                </div>
                {showAddUserForm && (
                  <form onSubmit={addUser} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Name"
                        className="p-2 border rounded-lg"
                      />
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email"
                        className="p-2 border rounded-lg"
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="p-2 border rounded-lg"
                      >
                        <option value="User">User</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <select
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        className="p-2 border rounded-lg"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Add User
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUserForm(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">{user.role}</td>
                          <td className="p-4">
                            <span
                              onClick={() => toggleUserStatus(user.id)}
                              className={`cursor-pointer px-2 py-1 rounded-full text-sm flex items-center ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              <Activity className="mr-1 h-4 w-4" /> {user.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 flex items-center">
                                <Settings className="mr-1 h-4 w-4" /> Edit
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 flex items-center"
                              >
                                <X className="mr-1 h-4 w-4" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5" /> Usage Analytics
                    </h2>
                    <button className="text-gray-600 hover:text-gray-800">
                      <Settings size={20} title="Chart Settings" />
                    </button>
                  </div>
                  <div className="h-64">
                    <svg viewBox="0 0 800 300" className="w-full h-full">
                      <line x1="50" y1="250" x2="750" y2="250" stroke="black" strokeWidth="2" />
                      <line x1="50" y1="50" x2="50" y2="250" stroke="black" strokeWidth="2" />
                      {usageData.map((point, index) => (
                        <text
                          key={point.name}
                          x={100 + index * 100}
                          y="270"
                          textAnchor="middle"
                          fontSize="12"
                        >
                          {point.name}
                        </text>
                      ))}
                      {[0, 100, 200, 300, 400, 500].map((value) => (
                        <text
                          key={value}
                          x="40"
                          y={250 - (value / 500) * 200}
                          textAnchor="end"
                          fontSize="10"
                          fill="#666"
                        >
                          {value}
                        </text>
                      ))}
                      {usageData.map((point, index) => (
                        <rect
                          key={`users-${index}`}
                          x={80 + index * 100}
                          y={250 - (point.users / 500) * 200}
                          width="20"
                          height={(point.users / 500) * 200}
                          fill="#3b82f6"
                          opacity="0.8"
                        />
                      ))}
                      {usageData.map((point, index) => (
                        <rect
                          key={`files-${index}`}
                          x={100 + index * 100}
                          y={250 - (point.files / 500) * 200}
                          width="20"
                          height={(point.files / 500) * 200}
                          fill="#10b981"
                          opacity="0.8"
                        />
                      ))}
                      {usageData.map((point, index) => (
                        <rect
                          key={`messages-${index}`}
                          x={120 + index * 100}
                          y={250 - (point.messages / 500) * 200}
                          width="20"
                          height={(point.messages / 500) * 200}
                          fill="#8b5cf6"
                          opacity="0.8"
                        />
                      ))}
                      <g transform="translate(600, 50)">
                        <rect x="0" y="0" width="15" height="15" fill="#3b82f6" />
                        <text x="20" y="12" fontSize="12">Users</text>
                        <rect x="0" y="20" width="15" height="15" fill="#10b981" />
                        <text x="20" y="32" fontSize="12">Files</text>
                        <rect x="0" y="40" width="15" height="15" fill="#8b5cf6" />
                        <text x="20" y="52" fontSize="12">Messages</text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;