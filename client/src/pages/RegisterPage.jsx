import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Link as MuiLink
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, form);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f3f2ef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#0a66c2',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              letterSpacing: '-0.02em'
            }}
          >
            ProConnect
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontWeight: 400,
              fontSize: { xs: '0.95rem', sm: '1rem' },
              maxWidth: '300px',
              mx: 'auto',
              lineHeight: 1.4
            }}
          >
            Join the professional community today
          </Typography>
        </Box>

        <Card
          elevation={1}
          sx={{
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 1,
                textAlign: 'center',
                fontSize: { xs: '1.4rem', sm: '1.6rem' }
              }}
            >
              Join ProConnect
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '0.875rem', sm: '0.95rem' }
              }}
            >
              Create your professional account
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1
                }}
              >
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                autoComplete="name"
                autoFocus
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1rem',
                    '&:hover fieldset': {
                      borderColor: '#0a66c2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0a66c2',
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0a66c2',
                  }
                }}
              />

              <TextField
                required
                fullWidth
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                autoComplete="email"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1rem',
                    '&:hover fieldset': {
                      borderColor: '#0a66c2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0a66c2',
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0a66c2',
                  }
                }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                autoComplete="new-password"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1rem',
                    '&:hover fieldset': {
                      borderColor: '#0a66c2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0a66c2',
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0a66c2',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#666',
                    fontSize: '0.75rem'
                  }
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#666',
                  mb: 3,
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                  textAlign: 'center'
                }}
              >
                By clicking "Join now", you agree to ProConnect's Terms of Service and Privacy Policy
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: '#0a66c2',
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(10, 102, 194, 0.2)',
                  '&:hover': {
                    bgcolor: '#004182',
                    boxShadow: '0 4px 8px rgba(10, 102, 194, 0.3)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    bgcolor: '#ccc',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Creating account...</span>
                  </Box>
                ) : (
                  'Join now'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4, mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              mb: 2
            }}
          >
            Already on ProConnect?{' '}
            <MuiLink
              component={Link}
              to="/"
              sx={{
                color: '#0a66c2',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign in
            </MuiLink>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#999',
              fontSize: '0.75rem'
            }}
          >
            © 2025 Postify. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;