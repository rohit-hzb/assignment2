import React from 'react';
import { BookOpen, Users, Package, UserPlus } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'course-types', label: 'Course Types', icon: Package },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'course-offerings', label: 'Course Offerings', icon: Users },
    { id: 'student-registrations', label: 'Student Registrations', icon: UserPlus },
  ];

  return (
    <aside className="bg-white shadow-lg h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
