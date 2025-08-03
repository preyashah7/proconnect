import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Avatar,
  Chip,
  Fade,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomeFeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [commentText, setCommentText] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));
        setCurrentUserId(decodedPayload.id);
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        const filteredPosts = res.data.filter(
          (post) => post.user._id !== currentUserId
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchPosts();
    }
  }, [currentUserId]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLinkedInColor = (userId) => {
    const colors = [
      '#0077B5', // LinkedIn Blue
      '#2867B2', // Darker LinkedIn Blue
      '#1B4F72', // Professional Blue
      '#2E86AB', // Corporate Blue
      '#0E76A8', // Business Blue
      '#1E88E5', // Modern Blue
      '#1976D2', // Material Blue
      '#0D47A1', // Deep Blue
    ];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const handleLikeToggle = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the specific post's like data in state
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: res.data.liked
                  ? [...(p.likes || []), currentUserId]
                  : (p.likes || []).filter((id) => id !== currentUserId),
              }
            : p
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };


  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
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

  const LoadingSkeleton = () => (
    <Box sx={{ mb: 3 }}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ 
          mb: 2, 
          borderRadius: 2,
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: '#f0f0f0', 
                borderRadius: '50%', 
                mr: 2 
              }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '40%', height: 16, bgcolor: '#f0f0f0', borderRadius: 1, mb: 1 }} />
                <Box sx={{ width: '30%', height: 12, bgcolor: '#f5f5f5', borderRadius: 1 }} />
              </Box>
            </Box>
            <Box sx={{ width: '100%', height: 16, bgcolor: '#f0f0f0', borderRadius: 1, mb: 1 }} />
            <Box sx={{ width: '80%', height: 16, bgcolor: '#f0f0f0', borderRadius: 1, mb: 1 }} />
            <Box sx={{ width: '60%', height: 12, bgcolor: '#f5f5f5', borderRadius: 1, mt: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f3f2ef', // LinkedIn background color
    }}>
      <Navbar />
      
      <Container 
        maxWidth="md" 
        sx={{ 
          pt: 3, 
          pb: 6,
          px: { xs: 1, sm: 2 }
        }}
      >
        {/* LinkedIn-style header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{
              fontWeight: 600,
              color: '#0077B5',
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            Your Professional Feed
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.9rem'
            }}
          >
            Stay updated with your professional network
          </Typography>
        </Box>

        {loading ? (
          <LoadingSkeleton />
        ) : posts.length === 0 ? (
          <Card sx={{ 
            borderRadius: 2,
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            p: 4
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                color: '#0077B5',
                fontWeight: 600
              }}
            >
              🚀 Start Building Your Network
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect with professionals and discover insights from your industry
            </Typography>
          </Card>
        ) : (
          <Box>
            {posts.map((post, index) => (
              <Fade 
                key={post._id} 
                in={true} 
                timeout={400 + (index * 100)}
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
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* LinkedIn-style User Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 2
                    }}>
                      <Link
                        to={`/profile/${post.user._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: getLinkedInColor(post.user._id),
                            width: { xs: 48, sm: 56 },
                            height: { xs: 48, sm: 56 },
                            mr: 2,
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                          }}
                        >
                          {getInitials(post.user.name)}
                        </Avatar>
                      </Link>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Link
                          to={`/profile/${post.user._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#0077B5',
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline'
                              },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {post.user.name}
                          </Typography>
                        </Link>
                        
                        {post.user.bio && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontSize: '0.85rem',
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {post.user.bio}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#999',
                              fontSize: '0.75rem',
                            }}
                          >
                            {formatTimeAgo(post.createdAt)}
                          </Typography>
                          <Typography sx={{ color: '#999', fontSize: '0.75rem' }}>•</Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#999',
                              fontSize: '0.75rem',
                            }}
                          >
                            🌐 Public
                          </Typography>
                        </Box>
                      </Box>

                      {/* More options (LinkedIn-style) */}
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: '#666',
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>⋯</span>
                      </IconButton>
                    </Box>

                    {/* Post Content */}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2,
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        lineHeight: 1.5,
                        color: '#333',
                        fontWeight: 400
                      }}
                    >
                      {post.content}
                    </Typography>

                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                    }}>
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
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        <span style={{ marginRight: '6px', fontSize: '16px' }}>
                          {post.likes?.includes(currentUserId) ? '❤️' : '🤍'}
                        </span>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                          {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                        </Typography>
                      </Box>
                    </Box>

                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomeFeedPage;