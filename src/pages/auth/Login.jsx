import React, { useState } from 'react';
import { Container, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const performLogin = (u, p) => {
        if (u === 'superadmin' && p === 'superadmin') {
            toast.success('Welcome back, Super Admin!');
            navigate('/superadmin/dashboard');
        } else if (u === 'admin' && p === 'admin') {
            toast.success('Welcome back, Admin!');
            navigate('/admin/dashboard');
        } else if (u === 'manager' && p === 'manager') {
            toast.success('Welcome back, Manager!');
            navigate('/management/dashboard');
        } else if (u === 'staff' && p === 'staff') {
            toast.success('Welcome back, Staff!');
            navigate('/management/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
            toast.error('Invalid credentials');
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        performLogin(username, password);
    };

    const handleQuickLogin = (role) => {
        let u = '', p = 'password';

        if (role === 'admin') {
            u = 'admin';
            p = 'admin';
        }
        if (role === 'staff') {
            u = 'manager';
            p = 'manager';
        }

        setUsername(u);
        setPassword(p);

        // Immediate login
        performLogin(u, p);
    };

    return (
        <div
            className="vh-100 d-flex align-items-center justify-content-center position-relative"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1920&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.3 }}></div>

            <Container style={{ maxWidth: '500px', zIndex: 2 }}>
                <div
                    className="p-5 rounded-4 text-center text-white"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                >
                    <div className="mb-4 d-inline-block border border-2 border-danger rounded p-2">
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <FaCog size={40} className="text-white mb-1" />
                            <h3 className="m-0 fw-bold text-white" style={{ fontFamily: 'sans-serif' }}>TURF<span className="text-success">PRO</span></h3>
                            <small className="text-white-50" style={{ fontSize: '0.7rem' }}>Smart Turf Management</small>
                        </div>
                    </div>

                    <h5 className="mb-4 fw-light text-uppercase" style={{ letterSpacing: '1px' }}>Login to your account</h5>

                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-0 text-secondary">
                                    <FaUser />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="USERNAME"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="border-0 shadow-none"
                                    style={{ height: '50px' }}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-0 text-secondary">
                                    <FaLock />
                                </InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-0 shadow-none"
                                    style={{ height: '50px' }}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Button
                            type="submit"
                            className="w-100 py-3 fw-bold text-uppercase mb-3"
                            style={{ backgroundColor: '#D90429', border: 'none', borderRadius: '5px', letterSpacing: '1px' }}
                        >
                            Log In
                        </Button>
                    </Form>

                    <div className="d-flex justify-content-end text-right text-white-50 text-decoration-none small mb-4">
                        <a href="#" className="text-white-50 text-decoration-none">Forget Password?</a>
                    </div>

                    <div className="border-top border-secondary pt-4 mt-3">
                        <p className="text-white-50 small mb-2">QUICK ACCESS DEMO</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={() => handleQuickLogin('admin')}
                                className="px-4"
                            >
                                Admin Dashboard
                            </Button>
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={() => handleQuickLogin('staff')}
                                className="px-4"
                            >
                                Staff Dashboard
                            </Button>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default Login;
