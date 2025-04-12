import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { X, Check, Plus, Search, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// List of common tech skills
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
  'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
  'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Swift',
  'Kotlin', 'Go', 'Rust', 'SQL', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Redis', 'GraphQL', 'REST API', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  'Jira', 'Agile', 'Scrum', 'TDD', 'Jest', 'Mocha', 'Cypress',
  'Selenium', 'Jenkins', 'Travis CI', 'CircleCI', 'Terraform',
  'Ansible', 'Linux', 'Bash', 'Networking', 'Security',
  'Machine Learning', 'Data Science', 'AI', 'Figma', 'UI/UX',
  'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Bootstrap',
  'Material UI', 'Redux', 'MobX', 'RxJS', 'WebSockets', 'WebRTC'
];

interface SkillSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({
  selectedSkills,
  onSkillsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>(COMMON_SKILLS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSkills(
        COMMON_SKILLS.filter(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedSkills.includes(skill)
        )
      );
    } else {
      setFilteredSkills(COMMON_SKILLS.filter(skill => !selectedSkills.includes(skill)));
    }
  }, [searchTerm, selectedSkills]);

  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
      setSearchTerm('');
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onSkillsChange(selectedSkills.filter(s => s !== skill));
  };

  const handleCustomSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      onSkillsChange([...selectedSkills, newSkill.trim()]);
      setNewSkill('');
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Skills
        </label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSkills.map((skill) => (
            <Badge 
              key={skill} 
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 group flex items-center gap-1 px-3 py-1 transition-all duration-200 animate-fade-in"
            >
              {skill}
              <button 
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800 p-0.5 transition-colors"
              >
                <X className="h-3 w-3 text-red-500 dark:text-red-400" />
              </button>
            </Badge>
          ))}
          
          {selectedSkills.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No skills selected. Add skills to improve your profile visibility.
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" /> 
                Add Skills 
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search skills..." 
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  className="border-none focus:ring-0"
                />
                
                <CommandList>
                  <CommandEmpty>
                    <div className="p-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No skills found. Add custom skill:
                      </p>
                      <form onSubmit={handleCustomSkillAdd} className="flex mt-1">
                        <Input 
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Enter custom skill"
                          className="text-sm focus-visible:ring-offset-0"
                          ref={inputRef}
                        />
                        <Button type="submit" size="sm" className="ml-2">
                          Add
                        </Button>
                      </form>
                    </div>
                  </CommandEmpty>
                  
                  <CommandGroup heading="Popular Skills">
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <CommandItem
                        key={skill}
                        onSelect={() => {
                          handleAddSkill(skill);
                          setIsOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedSkills.includes(skill) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          <span>{skill}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  {filteredSkills.length > 10 && (
                    <CommandGroup heading="More Skills">
                      {filteredSkills.slice(10, 20).map((skill) => (
                        <CommandItem
                          key={skill}
                          onSelect={() => {
                            handleAddSkill(skill);
                            setIsOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center">
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedSkills.includes(skill) ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                            <span>{skill}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
                
                <div className="p-2 border-t">
                  <form onSubmit={handleCustomSkillAdd} className="flex">
                    <Input 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter custom skill"
                      className="text-sm focus-visible:ring-offset-0"
                    />
                    <Button type="submit" size="sm" className="ml-2">
                      Add
                    </Button>
                  </form>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => onSkillsChange([])}
            disabled={selectedSkills.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      {selectedSkills.length > 0 && (
        <div className="animate-slide-up">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggested Jobs Based on Your Skills
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              With these skills, you qualify for {Math.floor(selectedSkills.length * 1.5)} job opportunities.
              Complete challenges to improve your match score!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSelector;