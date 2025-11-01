import React from 'react';
import { Mail, Calendar, Trash2, Eye, Phone, MapPin } from 'lucide-react';
import Button from '../Common/Button';

const StudentCard = ({ 
  registration, 
  courseName, 
  courseTypeName, 
  onDelete,
  onViewDetails,
  onUpdateStatus,
  onUpdatePaymentStatus
}) => {
  return (
    <div className="card group hover:border-primary-200 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {registration.firstName} {registration.lastName}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{registration.email}</span>
            </div>
            
            {registration.phone && (
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-gray-400" />
                <span>{registration.phone}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Calendar size={14} className="text-gray-400" />
              <span>{new Date(registration.registeredAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-3 p-3 bg-primary-50 rounded-lg">
        <p className="text-sm font-medium text-primary-900">
          {courseTypeName} - {courseName}
        </p>
      </div>

      {/* Status Badges */}
      <div className="flex items-center space-x-2 mb-3">
        <select
          value={registration.status || 'active'}
          onChange={(e) => onUpdateStatus(registration.id, e.target.value)}
          className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
          <option value="withdrawn">Withdrawn</option>
        </select>

        <select
          value={registration.paymentStatus || 'pending'}
          onChange={(e) => onUpdatePaymentStatus(registration.id, e.target.value)}
          className={`text-xs px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            registration.paymentStatus === 'paid'
              ? 'bg-green-100 text-green-800 border-green-300'
              : registration.paymentStatus === 'partial'
              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Button
          variant="secondary"
          onClick={() => onViewDetails(registration)}
          className="flex items-center space-x-1 text-xs py-1 px-3"
        >
          <Eye size={14} />
          <span>View Details</span>
        </Button>
        
        <Button
          variant="danger"
          onClick={() => onDelete(registration.id)}
          className="flex items-center space-x-1 text-xs py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
          <span>Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default StudentCard;
