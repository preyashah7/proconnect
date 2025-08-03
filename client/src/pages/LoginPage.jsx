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
  Divider,
  useTheme,
  useMediaQuery,
  Link as MuiLink
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/home'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0a66c2',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            ProConnect
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
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 3,
                textAlign: 'center',
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              Sign in
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

            <Box component="form" onSubmit={handleSubmit}>
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
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                sx={{
                  mb: 1,
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

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <MuiLink
                  href="#"
                  sx={{
                    color: '#0a66c2',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {/* Forgot password? */}
                </MuiLink>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 6,
                  bgcolor: '#0a66c2',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#004182'
                  },
                  '&:disabled': {
                    bgcolor: '#ccc'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Sign in'
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
            New to ProConnect?{' '}
            <MuiLink
              component={Link}
              to="/register"
              sx={{
                color: '#0a66c2',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Join now
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

export default LoginPage;