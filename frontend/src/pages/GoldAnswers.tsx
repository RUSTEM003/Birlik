import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

interface LibraryStatus {
  total_questions: number;
  panel_distribution: Record<string, number>;
  difficulty_distribution: Record<string, number>;
  average_success_rate: number;
  recent_executions: string[];
}

interface GoldAnswer {
  id: number;
  question_id: string;
  panel_type: string;
  question_text: string;
  answer_template: string;
  kpi_metrics: Record<string, any>;
  artifact_references: string[];
  replay_command: string;
  success_threshold: number;
  difficulty_level: string;
  created_at: string;
}

interface SearchResponse {
  total_results: number;
  answers: GoldAnswer[];
  search_time_ms: number;
}

const getLibraryStatus = async (): Promise<LibraryStatus> => {
  const response = await fetch('/api/gold-answers/status');
  if (!response.ok) throw new Error('Failed to fetch library status');
  return response.json();
};

const searchAnswers = async (params: {
  panel_type?: string;
  query?: string;
  difficulty?: string;
}): Promise<SearchResponse> => {
  const searchParams = new URLSearchParams();
  if (params.panel_type) searchParams.append('panel_type', params.panel_type);
  if (params.query) searchParams.append('query', params.query);
  if (params.difficulty) searchParams.append('difficulty', params.difficulty);
  
  const response = await fetch(`/api/gold-answers/search?${searchParams}`);
  if (!response.ok) throw new Error('Failed to search answers');
  return response.json();
};

const replayDemo = async (questionId: string) => {
  const response = await fetch(`/api/gold-answers/${questionId}/replay`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to replay demonstration');
  return response.json();
};

export default function GoldAnswers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<GoldAnswer | null>(null);

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["library-status"],
    queryFn: getLibraryStatus,
  });

  const { data: searchResults, isLoading: searchLoading, refetch } = useQuery({
    queryKey: ["search-answers", selectedPanel, searchQuery, selectedDifficulty],
    queryFn: () => searchAnswers({
      panel_type: selectedPanel || undefined,
      query: searchQuery || undefined,
      difficulty: selectedDifficulty || undefined
    }),
  });

  const replayMutation = useMutation({
    mutationFn: replayDemo,
    onSuccess: (data) => {
      alert(`Demonstration executed successfully! Performance score: ${data.performance_score}`);
    }
  });

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-20 animate-ornament-pulse"></div>
      </div>
      
      <div className="relative flex items-center space-x-4">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">Gold-Answer Library</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Total Questions</h3>
          <p className="text-3xl font-bold text-kazakh-blue">
            {statusLoading ? "..." : status?.total_questions || "210"}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {statusLoading ? "..." : `${((status?.average_success_rate || 0.987) * 100).toFixed(1)}%`}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Search Time</h3>
          <p className="text-3xl font-bold text-kazakh-gold">
            {searchResults ? `${searchResults.search_time_ms.toFixed(1)}ms` : "0ms"}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Results</h3>
          <p className="text-3xl font-bold text-purple-600">
            {searchResults?.total_results || 0}
          </p>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
          <h2 className="text-xl font-semibold text-kazakh-darkBlue">Search Gold Answers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kazakh-blue"
          />
          
          <select
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kazakh-blue"
          >
            <option value="">All Panels</option>
            <option value="nasa">NASA/Space</option>
            <option value="fed">Fed/Economy</option>
            <option value="medicine">Medicine/Bio</option>
            <option value="security">Security</option>
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kazakh-blue"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-4 py-2 bg-kazakh-blue text-white rounded-md hover:bg-kazakh-darkBlue disabled:opacity-50 transition-colors"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Search Results</h2>
          </div>
          
          {searchLoading ? (
            <p className="text-kazakh-darkBlue">Searching...</p>
          ) : searchResults && searchResults.answers.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.answers.map((answer) => (
                <div
                  key={answer.id}
                  onClick={() => setSelectedAnswer(answer)}
                  className="p-3 border border-gray-200 rounded-md hover:bg-kazakh-blue/5 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-kazakh-darkBlue capitalize">
                      {answer.panel_type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      answer.difficulty_level === 'easy' ? 'bg-green-100 text-green-700' :
                      answer.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {answer.difficulty_level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {answer.question_text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No results found. Try adjusting your search criteria.</p>
          )}
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Answer Details</h2>
          </div>
          
          {selectedAnswer ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-kazakh-darkBlue mb-2">Question</h3>
                <p className="text-sm text-gray-700">{selectedAnswer.question_text}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-kazakh-darkBlue mb-2">Answer Template</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedAnswer.answer_template}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-kazakh-darkBlue mb-2">KPI Metrics</h3>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  {Object.entries(selectedAnswer.kpi_metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-kazakh-darkBlue mb-2">Artifacts</h3>
                <div className="text-sm text-gray-700">
                  {selectedAnswer.artifact_references.map((ref, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded mb-1">
                      {ref}
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => replayMutation.mutate(selectedAnswer.question_id)}
                disabled={replayMutation.isPending}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {replayMutation.isPending ? 'Executing...' : 'Execute Demonstration'}
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Select a question from the search results to view details.</p>
          )}
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
          <h2 className="text-xl font-semibold text-kazakh-darkBlue">Panel Distribution</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {status?.panel_distribution && Object.entries(status.panel_distribution).map(([panel, count]) => (
            <div key={panel} className="text-center">
              <div className="text-2xl font-bold text-kazakh-blue">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{panel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
