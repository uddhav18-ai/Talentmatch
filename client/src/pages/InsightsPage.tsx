import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import ProgressBar from '../components/ui/progress-bar';

const InsightsPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const salaryData = [
    { title: 'Senior Software Engineer', median: '$145,000', range: '$125,000 - $170,000', change: '+5.2%' },
    { title: 'UX/UI Designer', median: '$110,000', range: '$90,000 - $135,000', change: '+7.8%' },
    { title: 'Data Scientist', median: '$135,000', range: '$115,000 - $160,000', change: '+6.5%' },
    { title: 'Product Manager', median: '$140,000', range: '$120,000 - $165,000', change: '+4.3%' },
    { title: 'Marketing Manager', median: '$105,000', range: '$85,000 - $125,000', change: '+3.1%' }
  ];

  const experienceLevels = [
    { level: 'Entry Level', salary: '$80K', percentage: 50 },
    { level: 'Mid Level', salary: '$115K', percentage: 70 },
    { level: 'Senior', salary: '$145K', percentage: 90 }
  ];

  const companySizes = [
    { size: 'Startup (1-50)', salary: '$95K', percentage: 60 },
    { size: 'Mid-size (51-500)', salary: '$120K', percentage: 75 },
    { size: 'Enterprise (500+)', salary: '$140K', percentage: 85 }
  ];

  const industries = [
    { industry: 'Finance/FinTech', salary: '$135K', percentage: 85 },
    { industry: 'Healthcare/BioTech', salary: '$125K', percentage: 78 },
    { industry: 'E-commerce/Retail', salary: '$115K', percentage: 72 }
  ];

  const growingSkills = [
    { skill: 'AI/Machine Learning', growth: '+85%', percentage: 85 },
    { skill: 'Data Engineering', growth: '+72%', percentage: 72 },
    { skill: 'Cloud Architecture', growth: '+68%', percentage: 68 },
    { skill: 'UX Research', growth: '+54%', percentage: 54 },
    { skill: 'DevOps/SRE', growth: '+48%', percentage: 48 }
  ];

  const highestPayingSkills = [
    { skill: 'ML Engineering', salary: '$175K' },
    { skill: 'Backend Systems (Rust/Go)', salary: '$165K' },
    { skill: 'Cloud Security', salary: '$160K' },
    { skill: 'Data Science', salary: '$155K' },
    { skill: 'iOS Development (Swift)', salary: '$150K' }
  ];

  const companies = [
    { 
      name: 'FlexiTech Inc.', 
      industry: 'Software Services',
      initial: 'F',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      ratings: {
        workLifeBalance: 5,
        careerGrowth: 4,
        compensation: 4
      }
    },
    { 
      name: 'GrowthPath', 
      industry: 'FinTech',
      initial: 'G',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      ratings: {
        workLifeBalance: 3,
        careerGrowth: 5,
        compensation: 5
      }
    },
    { 
      name: 'Diversity Tech', 
      industry: 'Healthcare Tech',
      initial: 'D',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      ratings: {
        workLifeBalance: 4,
        careerGrowth: 4,
        diversityInclusion: 5
      }
    }
  ];

  return (
    <div className="mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hiring Insights</h1>
        <p className="text-xl text-gray-600">Transparent data about compensation, skills in demand, and company culture.</p>
      </div>

      {/* Salary Data Section */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Salary Transparency</h2>
          
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-semibold">Average Salaries by Role</h3>
              <div className="mt-2 sm:mt-0">
                <Select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  <option value="sf">San Francisco, CA</option>
                  <option value="ny">New York, NY</option>
                  <option value="austin">Austin, TX</option>
                  <option value="remote">Remote (US)</option>
                </Select>
              </div>
            </div>
            
            <div className="relative overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left">
                <thead className="text-xs bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Median Salary</th>
                    <th className="px-6 py-3">Salary Range</th>
                    <th className="px-6 py-3">YoY Change</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.map((job, index) => (
                    <tr key={index} className={`bg-white ${index < salaryData.length - 1 ? 'border-b' : ''}`}>
                      <td className="px-6 py-4 font-medium">{job.title}</td>
                      <td className="px-6 py-4">{job.median}</td>
                      <td className="px-6 py-4">{job.range}</td>
                      <td className="px-6 py-4 text-green-600">{job.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Salary Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
                <h4 className="font-medium mb-2">Experience Level</h4>
                <div className="space-y-3">
                  {experienceLevels.map((level, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{level.level}</span>
                        <span>{level.salary}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-blue-${400 + (index * 100)} h-2 rounded-full`}
                          style={{ width: `${level.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
                <h4 className="font-medium mb-2">Company Size</h4>
                <div className="space-y-3">
                  {companySizes.map((company, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{company.size}</span>
                        <span>{company.salary}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-green-${400 + (index * 100)} h-2 rounded-full`}
                          style={{ width: `${company.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
                <h4 className="font-medium mb-2">Industry</h4>
                <div className="space-y-3">
                  {industries.map((industry, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{industry.industry}</span>
                        <span>{industry.salary}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${industry.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills in Demand */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Skills in Demand</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fastest Growing Skills</h3>
              <div className="space-y-4">
                {growingSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-green-600">{skill.growth}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Highest Paying Skills</h3>
              <div className="space-y-4">
                {highestPayingSkills.map((skill, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">{skill.skill}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{skill.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Skills Comparison Tool</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Select>
                <option>Select first skill</option>
                <option>JavaScript</option>
                <option>Python</option>
                <option>UI/UX Design</option>
                <option>Data Analysis</option>
                <option>Product Management</option>
              </Select>
              <Select>
                <option>Select second skill</option>
                <option>JavaScript</option>
                <option>Python</option>
                <option>UI/UX Design</option>
                <option>Data Analysis</option>
                <option>Product Management</option>
              </Select>
              <Button className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 transition-colors">
                Compare
              </Button>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-center">
              <p className="text-gray-700 dark:text-gray-300">Select two skills to see a detailed comparison of demand, salary impact, and growth trends.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Culture */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Company Culture Insights</h2>
          
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-semibold">Top Rated Companies by Category</h3>
              <div className="mt-2 sm:mt-0">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="worklife">Work-Life Balance</option>
                  <option value="career">Career Growth</option>
                  <option value="compensation">Compensation</option>
                  <option value="diversity">Diversity & Inclusion</option>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companies.map((company, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-colors">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 ${company.bgColor} dark:bg-opacity-80 rounded-full flex items-center justify-center mr-3`}>
                      <span className={`font-bold ${company.textColor}`}>{company.initial}</span>
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{company.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{company.industry}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {company.ratings.workLifeBalance && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Work-Life Balance</span>
                        <span className="text-yellow-500">{'★'.repeat(company.ratings.workLifeBalance) + '☆'.repeat(5 - company.ratings.workLifeBalance)}</span>
                      </div>
                    )}
                    {company.ratings.careerGrowth && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Career Growth</span>
                        <span className="text-yellow-500">{'★'.repeat(company.ratings.careerGrowth) + '☆'.repeat(5 - company.ratings.careerGrowth)}</span>
                      </div>
                    )}
                    {company.ratings.compensation && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Compensation</span>
                        <span className="text-yellow-500">{'★'.repeat(company.ratings.compensation) + '☆'.repeat(5 - company.ratings.compensation)}</span>
                      </div>
                    )}
                    {company.ratings.diversityInclusion && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Diversity & Inclusion</span>
                        <span className="text-yellow-500">{'★'.repeat(company.ratings.diversityInclusion) + '☆'.repeat(5 - company.ratings.diversityInclusion)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Culture Insights Search</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-3/4">
                <div className="flex space-x-2">
                  <Input 
                    type="text" 
                    className="flex-grow" 
                    placeholder="Search for a company..." 
                  />
                  <Button className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 transition-colors">
                    Search
                  </Button>
                </div>
                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-gray-700 dark:text-gray-300">Enter a company name to see detailed culture metrics, reviews, and insights from current and former employees.</p>
                </div>
              </div>
              <div className="md:w-1/4 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Why This Matters</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Company culture has one of the strongest correlations with job satisfaction and retention. Use these insights to find your ideal workplace.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPage;
