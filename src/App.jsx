import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import CourseTypeList from './components/CourseTypes/CourseTypeList';
import CourseList from './components/Courses/CourseList';
import CourseOfferingList from './components/CourseOfferings/CourseOfferingList';
import StudentRegistrationList from './components/StudentRegistrations/StudentRegistrationList';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [activeTab, setActiveTab] = useState('course-types');
  const [courseTypes, setCourseTypes] = useLocalStorage('courseTypes', []);
  const [courses, setCourses] = useLocalStorage('courses', []);
  const [offerings, setOfferings] = useLocalStorage('courseOfferings', []);
  const [registrations, setRegistrations] = useLocalStorage('studentRegistrations', []);

  const renderContent = () => {
    switch (activeTab) {
      case 'course-types':
        return <CourseTypeList courseTypes={courseTypes} setCourseTypes={setCourseTypes} />;
      case 'courses':
        return <CourseList courses={courses} setCourses={setCourses} />;
      case 'course-offerings':
        return (
          <CourseOfferingList
            offerings={offerings}
            setOfferings={setOfferings}
            courses={courses}
            courseTypes={courseTypes}
            registrations={registrations}
          />
        );
      case 'student-registrations':
        return (
          <StudentRegistrationList
            registrations={registrations}
            setRegistrations={setRegistrations}
            offerings={offerings}
            courses={courses}
            courseTypes={courseTypes}
          />
        );
      default:
        return <CourseTypeList courseTypes={courseTypes} setCourseTypes={setCourseTypes} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full lg:w-64 lg:min-h-screen">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <main className="flex-1 p-4 lg:p-8">
          <div className="container mx-auto max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
