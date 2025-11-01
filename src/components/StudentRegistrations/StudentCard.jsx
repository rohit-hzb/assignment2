import React from 'react';
import { Mail, Calendar, Trash2 } from 'lucide-react';
import Button from '../Common/Button';

const StudentCard = ({ 
  registration, 
  courseName, 
  courseTypeName, 
  onDelete 
}) => {
  return (
    <div className="card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {registration.firstName} {registration.lastName}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-400" />
              <span>{registration.email}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <span>Registered: {new Date(registration.registeredAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {courseTypeName} - {courseName}
            </p>
          </div>
        </div>
        
        <Button
          variant="danger"
          onClick={() => onDelete(registration.id)}
          className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default StudentCard;
