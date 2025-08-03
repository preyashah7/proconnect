import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLaptop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [user, setUser] = useState({ name: '', email: '', bio: '' });
  const [currentUserId, setCurrentUserId] = useState('');
  const [editUser, setEditUser] = useState({ name: '', email: '', bio: '' });
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [commentText, setCommentText] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);


  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://proconnect-6254.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://proconnect-6254.onrender.com/api/posts/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Fetch posts error:', err);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLikeToggle = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://proconnect-6254.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: res.data.liked
                  ? [...post.likes, currentUserId]
                  : post.likes.filter((id) => id !== currentUserId),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };



  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'https://proconnect-6254.onrender.com/api/users/me',
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setProfileDialogOpen(false);
      showSnackbar('Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      showSnackbar('Failed to update profile', 'error');
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://proconnect-6254.onrender.com/api/${postId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: res.data } : post
        )
      );
      setCommentText('');
      setCommentingPostId(null);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://proconnect-6254.onrender.com/api/posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchPosts();
      showSnackbar('Post created successfully!');
    } catch (err) {
      console.error('Post error:', err.response?.data || err.message);
      showSnackbar('Failed to create post', 'error');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://proconnect-6254.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
      showSnackbar('Post deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      showSnackbar('Failed to delete post', 'error');
    }
  };

  const handleEditSave = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://proconnect-6254.onrender.com/api/posts/${postId}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingPostId(null);
      setEditingContent('');
      fetchPosts();
      showSnackbar('Post updated successfully!');
    } catch (err) {
      console.error('Edit error:', err);
      showSnackbar('Failed to update post', 'error');
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return postDate.toLocaleDateString();
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user._id) {
      setCurrentUserId(user._id);
    }
  }, [user]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f2ef' }}>
      <Navbar />
      <Fade in={true} timeout={400}>
          <Box sx={{ mb: 2 , textAlign: 'center', mt:2 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 700,
                color: '#333',
                mb: 1 
              }}
            >
              Welcome back, {user.name?.split(' ')[0] || 'Professional'}!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: '#666' }}
            >
              Manage your posts and grow your professional network
            </Typography>
          </Box>
        </Fade>
      
      {/* Profile Header Section */}
      <Container maxWidth="md" sx={{ pt: 3 }}>
        <Fade in={true} timeout={600}>
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            {/* Cover Area */}
            <Box sx={{
              height: { xs: 120, sm: 150 },
              background: 'linear-gradient(135deg, #0077B5 0%, #0077B588 100%)',
              position: 'relative'
            }}>
              {/* Profile Picture */}
              <Avatar
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                  bgcolor: '#0077B5',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  fontWeight: 700,
                  position: 'absolute',
                  bottom: { xs: -50, sm: -60 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            </Box>

            {/* Profile Info */}
            <CardContent sx={{ 
              pt: { xs: 7, sm: 8 }, 
              pb: 3, 
              textAlign: 'center' 
            }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {user.name || 'Your Name'}
              </Typography>
              
              {user.bio && (
                <Typography 
                  variant="h6" 
                  sx={{
                    color: '#666',
                    fontWeight: 400,
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.4
                  }}
                >
                  {user.bio}
                </Typography>
              )}

              {!user.bio && (
                <Typography 
                  variant="body1" 
                  sx={{
                    color: '#999',
                    fontStyle: 'italic',
                    mb: 2
                  }}
                >
                  Add your professional headline
                </Typography>
              )}

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2, 
                mt: 3,
                mb: 2,
                flexWrap: 'wrap'
              }}>
                <Chip
                  label={`${posts.length} ${posts.length === 1 ? 'Post' : 'Posts'}`}
                  sx={{
                    bgcolor: '#0077B5',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#005885' }
                  }}
                />
                <Chip
                  label="Professional"
                  variant="outlined"
                  sx={{
                    borderColor: '#0077B5',
                    color: '#0077B5',
                    fontWeight: 500
                  }}
                />
              </Box>

              <Button
                variant="outlined"
                onClick={() => setProfileDialogOpen(true)}
                sx={{
                  borderColor: '#0077B5',
                  color: '#0077B5',
                  fontWeight: 500,
                  px: 4,
                  '&:hover': {
                    bgcolor: '#f3f2ef',
                    borderColor: '#005885'
                  }
                }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Container>

      {/* Posts Section - Centered with increased width */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Box sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
            px: { xs: 2, sm: 0 }
          }}>
            {/* Create New Post Header */}
            <Fade in={true} timeout={700}>
              <Box sx={{ 
                textAlign: 'center', 
                mb: 3,
                mt: 2
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#333',
                    mb: 1,
                    fontSize: { xs: '1.3rem', sm: '1.5rem' }
                  }}
                >
                   Create a New Post
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Share your professional insights with the community
                </Typography>
              </Box>
            </Fade>

            {/* Post Creation Card */}
            <Fade in={true} timeout={800}>
              <Card sx={{ 
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                mb: 4
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#0077B5',
                        width: 45,
                        height: 45,
                        fontSize: '1rem',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Share your professional insights..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem'
                          }
                        }}
                      />
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 0 }
                      }}>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Share your thoughts with the community
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={handlePost}
                          disabled={!content.trim()}
                          size="medium"
                          sx={{
                            bgcolor: '#0077B5',
                            borderRadius: 3,
                            px: 3,
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#005885' },
                            '&:disabled': { bgcolor: '#ccc' }
                          }}
                        >
                          Share Post
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>

            {/* Posts Section */}
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#333',
                    mb: 3,
                    textAlign: 'center',
                    fontSize: { xs: '1.2rem', sm: '1.25rem' }
                  }}
                >
                  Your Recent Posts
                </Typography>

                {posts.length === 0 ? (
                  <Card sx={{ 
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    p: 5
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        color: '#0077B5',
                        fontWeight: 600
                      }}
                    >
                      🚀 Ready to Share?
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      Your first post is waiting! Share your professional thoughts above.
                    </Typography>
                  </Card>
                ) : (
                  <Box>
                    {posts.map((post, index) => (
                      <Fade 
                        key={post._id} 
                        in={true} 
                        timeout={600 + (index * 150)}
                      >
                        <Card 
                          sx={{ 
                            mb: 2, 
                            borderRadius: 2,
                            bgcolor: 'white',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e0e0e0',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Post Header */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              mb: 2
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                  sx={{
                                    bgcolor: '#0077B5',
                                    width: 45,
                                    height: 45,
                                    mr: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {getInitials(user.name)}
                                </Avatar>
                                
                                <Box>
                                  <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: '#0077B5',
                                      fontSize: '1rem',
                                    }}
                                  >
                                    {user.name}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                      variant="caption"
                                      sx={{ 
                                        color: '#999', 
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      {formatTimeAgo(post.createdAt)}
                                    </Typography>
                                    <Typography sx={{ 
                                      color: '#999', 
                                      fontSize: '0.75rem'
                                    }}>•</Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ 
                                        color: '#999', 
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      🌐 Public
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              <IconButton size="small" sx={{ color: '#666' }}>
                                <span style={{ fontSize: '16px' }}>⋯</span>
                              </IconButton>
                            </Box>

                            {/* Post Content */}
                            {editingPostId === post._id ? (
                              <Box>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  sx={{ 
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2
                                    }
                                  }}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleEditSave(post._id)}
                                    sx={{
                                      bgcolor: '#0077B5',
                                      '&:hover': { bgcolor: '#005885' }
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      setEditingPostId(null);
                                      setEditingContent('');
                                    }}
                                    sx={{
                                      borderColor: '#ccc',
                                      color: '#666'
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <Box>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    mb: 2,
                                    fontSize: '1rem',
                                    lineHeight: 1.5,
                                    color: '#333'
                                  }}
                                >
                                  {post.content}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                                  <Box
                                    onClick={() => handleLikeToggle(post._id)}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                      py: 1,
                                      px: 2,
                                      borderRadius: 1,
                                      transition: 'background-color 0.2s ease',
                                      '&:hover': { bgcolor: '#f5f5f5' },
                                    }}
                                  >
                                    <span style={{ marginRight: '6px', fontSize: '16px' }}>
                                      {post.likes?.includes(currentUserId) ? '❤️' : '🤍'}
                                    </span>
                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                                      {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                                    </Typography>
                                  </Box>

                                  <Button
                                    size="small"  
                                    variant="text"
                                    onClick={() => {
                                      setEditingPostId(post._id);
                                      setEditingContent(post.content);
                                    }}
                                    sx={{
                                      color: '#0077B5',
                                      fontWeight: 500,
                                      '&:hover': { bgcolor: '#f3f2ef' },
                                    }}
                                  >
                                    ✏️ Edit
                                  </Button>

                                  <Button
                                    size="small"
                                    variant="text"
                                    color="error"
                                    onClick={() => handleDelete(post._id)}
                                    sx={{
                                      fontWeight: 500,
                                      '&:hover': { bgcolor: '#ffeaea' },
                                    }}
                                  >
                                    🗑️ Delete
                                  </Button>
                                </Box>

                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>

      {/* Profile Edit Dialog */}
      <Dialog 
        open={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#0077B5', 
          color: 'white',
          fontWeight: 600
        }}>
          ✏️ Edit Your Profile
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="Full Name"
            fullWidth
            value={editUser.name}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, name: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email Address"
            fullWidth
            type="email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, email: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Professional Headline"
            fullWidth
            multiline
            rows={2}
            value={editUser.bio}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="e.g., Software Engineer at Tech Company"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setProfileDialogOpen(false)}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            variant="contained"
            sx={{
              bgcolor: '#0077B5',
              '&:hover': { bgcolor: '#005885' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;