import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import Button from '../Common/Button';

const CourseOfferingCard = ({ 
  offering, 
  courseName, 
  courseTypeName, 
  studentCount,
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="bg-green-100 p-2 rounded-lg">
            <Users className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {courseTypeName} - {courseName}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Users size={16} />
                <span>{studentCount} students enrolled</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Created: {new Date(offering.createdAt).toLocaleDateString()}
        </p>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            onClick={() => onEdit(offering)}
            className="flex items-center space-x-1 text-sm py-1 px-3"
          >
            <Edit2 size={14} />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(offering.id)}
            className="flex items-center space-x-1 text-sm py-1 px-3"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseOfferingCard;
