import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Flag,
  CheckCircle,
  HelpCircle,
  PlusCircle,
  Shield,
  Search,
  Send,
  X,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { CommunityPost } from '../types/marketplace';
import {
  getCommunityPosts,
  createCommunityPost,
  answerCommunityPost,
  likeCommunityPost,
  bookmarkCommunityPost,
  reportCommunityPost,
  moderateCommunityPost
} from '../services/marketplaceDb';

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'discussions' | 'moderator'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Post Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'question' | 'discussion'>('question');
  const [newPostCategory, setNewPostCategory] = useState('Revit & BIM');

  // Selected Post Details
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [reportModalPostId, setReportModalPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  const categories = ['Revit & BIM', 'AutoCAD', 'AI & Automation', 'Interior Design', 'Construction', 'Freelancing'];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const loaded = await getCommunityPosts();
    setPosts(loaded);
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    await createCommunityPost({
      title: newPostTitle,
      content: newPostContent,
      postType: newPostType,
      category: newPostCategory,
      authorUserId: 'user-current',
      authorName: 'Architect Member',
      authorRole: 'Structural Engineer'
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowCreateModal(false);
    await loadPosts();
  };

  const handleAnswerSubmit = async () => {
    if (!selectedPost || !answerInput.trim()) return;
    await answerCommunityPost(selectedPost.id, answerInput);
    setAnswerInput('');
    await loadPosts();
    const updated = posts.find(p => p.id === selectedPost.id);
    if (updated) setSelectedPost(updated);
  };

  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await likeCommunityPost(postId, 'user-current');
    await loadPosts();
  };

  const handleBookmark = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await bookmarkCommunityPost(postId, 'user-current');
    await loadPosts();
  };

  const handleReportSubmit = async () => {
    if (!reportModalPostId || !reportReason.trim()) return;
    await reportCommunityPost(reportModalPostId, reportReason);
    setReportModalPostId(null);
    setReportReason('');
    await loadPosts();
    alert('Content reported to moderators for review.');
  };

  const handleModerateAction = async (postId: string, action: 'approve' | 'delete') => {
    await moderateCommunityPost(postId, action);
    await loadPosts();
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'questions') return matchesSearch && p.postType === 'question';
    if (activeTab === 'discussions') return matchesSearch && p.postType === 'discussion';
    if (activeTab === 'moderator') return matchesSearch && p.isReported;
    return matchesSearch;
  });

  const reportedCount = posts.filter(p => p.isReported).length;

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-indigo-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Architectural & Engineering Community Forum
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Discussion Forum & Technical Q&A</h1>
            <p className="text-xs text-neutral-400 mt-1">Ask questions about Revit LOD standards, AutoCAD block purges, structural formulas, or share design insights.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Start Discussion or Question
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'questions', label: 'Questions & Answers' },
              { id: 'discussions', label: 'Discussions' },
              { id: 'moderator', label: `Moderator Panel (${reportedCount})`, badge: reportedCount > 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.id === 'moderator' && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search community posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={post.authorAvatar} alt={post.authorName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-white">{post.authorName}</h4>
                    <span className="text-[10px] text-neutral-400">{post.authorRole} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                    {post.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    post.postType === 'question' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {post.postType}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-sm text-white hover:text-blue-400 transition-colors">{post.title}</h3>
              <p className="text-xs text-neutral-300 line-clamp-2">{post.content}</p>

              {/* Action row */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-neutral-400">
                <div className="flex items-center gap-4">
                  <button onClick={(e) => handleLike(post.id, e)} className="flex items-center gap-1.5 hover:text-blue-400">
                    <ThumbsUp className="w-3.5 h-3.5" /> {post.likesCount}
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> {post.answers.length} Answers
                  </span>
                  <button onClick={(e) => handleBookmark(post.id, e)} className="flex items-center gap-1.5 hover:text-amber-400">
                    <Bookmark className="w-3.5 h-3.5" /> {post.bookmarksCount}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportModalPostId(post.id);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-red-400"
                    title="Report Content"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  {activeTab === 'moderator' && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModerateAction(post.id, 'approve');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModerateAction(post.id, 'delete');
                        }}
                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                {selectedPost.category}
              </span>
              <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line mt-2">{selectedPost.content}</p>
            </div>

            {/* Answers */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Answers & Responses ({(selectedPost.answers || []).length})</h3>
              <div className="space-y-3">
                {(selectedPost.answers || []).map((ans) => (
                  <div key={ans.id} className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ans.authorName}</span>
                      {ans.isAccepted && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded text-[10px]">
                          Accepted Answer ✓
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-300 whitespace-pre-line">{ans.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Answer */}
              <div className="pt-2 space-y-2">
                <textarea
                  rows={3}
                  placeholder="Provide an answer or technical solution..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleAnswerSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Create Community Post</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={newPostType === 'question'} onChange={() => setNewPostType('question')} />
                    <span>Question</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={newPostType === 'discussion'} onChange={() => setNewPostType('discussion')} />
                    <span>Discussion</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. How to convert Revit parametric families into IFC?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Content Details</label>
                <textarea
                  rows={4}
                  placeholder="Describe your technical question or topic in detail..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Content Modal */}
      {reportModalPostId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setReportModalPostId(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Report Post to Moderators</h3>
            <textarea
              rows={3}
              placeholder="Reason for report (e.g. spam, incorrect CAD advice)..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white"
            />

            <button
              onClick={handleReportSubmit}
              className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
