import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, Users, History, MessageCircle, Phone, Video, Menu,  Send } from 'lucide-react';

export default function MessengerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "John Doe", time: "10:00 AM", isUser: false },
    { id: 2, text: "Hi there!", sender: "You", time: "10:01 AM", isUser: true }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState("John Doe");
  const [activeTab, setActiveTab] = useState('chats');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const contacts = [
    { id: 1, name: "John Doe", lastMessage: "Hello!", time: "10:00 AM", unread: 2, status: "online" },
    { id: 2, name: "Jane Smith", lastMessage: "See you tomorrow!", time: "9:45 AM", unread: 0, status: "offline" },
    { id: 3, name: "Team Chat", lastMessage: "Meeting at 3", time: "9:30 AM", unread: 1, status: "online" }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "You",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleChatSelect = (name) => {
    setSelectedChat(name);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        ${showSidebar ? 'flex' : 'hidden'} 
        md:flex w-full md:w-80 bg-white border-r border-gray-200 
        flex-col h-full fixed md:relative z-20
      `}>
        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="text-lg font-medium">JS</span>
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-900">James Smith</h2>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'chats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <MessageCircle className="h-5 w-5 mx-auto mb-1" />
            Chats
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'contacts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <Users className="h-5 w-5 mx-auto mb-1" />
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <History className="h-5 w-5 mx-auto mb-1" />
            History
          </button>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleChatSelect(contact.name)}
              className={`p-4 border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50 
                ${selectedChat === contact.name ? 'bg-blue-50' : ''}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white 
                  ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${showSidebar && isMobile ? 'hidden' : 'flex'}`}>
        {/* Chat Header */}
        <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={() => setShowSidebar(true)}
                className="mr-2 p-2 hover:bg-gray-100 rounded-full"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <h2 className="font-semibold text-gray-900">{selectedChat}</h2>
            <div className="ml-2 text-xs text-green-500">online</div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] px-4 py-2 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm break-words">{message.text}</p>
                <span className={`text-xs ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button 
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}