import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import SkillPill from '../candidates/SkillPill';

const WorkSampleForm: React.FC = () => {
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'API Integration']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      e.preventDefault();
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
        <Input 
          type="text" 
          className="w-full" 
          placeholder="e.g., UX Designer, Full Stack Developer" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department/Team</label>
          <Input 
            type="text" 
            className="w-full" 
            placeholder="e.g., Product Design, Engineering" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location/Remote Policy</label>
          <Select>
            <option>On-site (San Francisco, CA)</option>
            <option>Remote (US only)</option>
            <option>Remote (Worldwide)</option>
            <option>Hybrid (San Francisco, CA)</option>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Work Sample Description</label>
        <Textarea 
          rows={4} 
          className="w-full" 
          placeholder="Describe a real task/project that the candidate would work on in this role..." 
        />
        <p className="mt-1 text-sm text-gray-500">Be specific about the deliverables and context. This helps candidates understand the actual work.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
        <div className="border border-gray-300 rounded-md p-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill, index) => (
              <SkillPill
                key={index}
                name={skill}
                removable
                onRemove={handleRemoveSkill}
              />
            ))}
          </div>
          <Input
            type="text"
            className="w-full px-2 py-1 border-0 focus:ring-0"
            placeholder="Type and press Enter to add skills..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <div className="flex items-center space-x-2">
            <Input type="text" className="w-full" placeholder="Min" />
            <span>to</span>
            <Input type="text" className="w-full" placeholder="Max" />
          </div>
          <p className="mt-1 text-sm text-gray-500">Being transparent about compensation attracts better candidates.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <Select>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Freelance</option>
            <option>Internship</option>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company Culture & Benefits</label>
        <Textarea 
          rows={3} 
          className="w-full" 
          placeholder="Share information about your company culture, values, and benefits..." 
        />
      </div>
      
      <div>
        <Button 
          type="submit" 
          className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-colors shadow-sm"
        >
          Post Work Sample
        </Button>
      </div>
    </form>
  );
};

export default WorkSampleForm;
