import React, { useState } from 'react';
import { ExternalLink, Mail, Copy, Check, MapPin, Calendar, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { VC } from '../types/vc';

interface VCCardProps {
  vc: VC;
  searchQuery?: string;
}

const VCCard: React.FC<VCCardProps> = ({ vc, searchQuery }) => {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(vc.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getValidationBadge = () => {
    if (vc.emailValidated) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <Shield className="h-3 w-3 mr-1" />
          Verified Email
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Pending
        </div>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 p-6 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {highlightText(vc.name, searchQuery)}
            </h3>
            {getValidationBadge()}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {vc.description}
          </p>
        </div>
      </div>

      {/* Industries */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Focus Areas</h4>
        <div className="flex flex-wrap gap-2">
          {vc.industries.map((industry, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                searchQuery && industry.toLowerCase().includes(searchQuery.toLowerCase())
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {highlightText(industry, searchQuery)}
            </span>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
          <span>Founded {vc.founded}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
          <span>{vc.aum} AUM</span>
        </div>
        <div className="flex items-center col-span-2">
          <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
          <span>{vc.country}</span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        {/* Email Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Validated Email</span>
            </div>
            <button
              onClick={copyEmail}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center gap-1 cursor-pointer"
              title="Copy email address"
            >
              {emailCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy Email
                </>
              )}
            </button>
          </div>
          
          <div className="text-blue-800 dark:text-blue-200 font-medium text-sm mb-1">
            {vc.email}
          </div>
          
          {vc.emailValidated && (
            <div className="flex items-center text-xs text-green-700 dark:text-green-400">
              <Shield className="h-3 w-3 mr-1" />
              <span>Last verified: {formatDate(vc.lastValidated)}</span>
            </div>
          )}
        </div>

        {/* Website */}
        <div className="flex items-center">
          <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-3" />
          <a
            href={vc.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium cursor-pointer"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default VCCard;