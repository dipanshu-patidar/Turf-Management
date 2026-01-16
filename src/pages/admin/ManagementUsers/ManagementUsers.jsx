import React, { useState } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaBan } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ManagementUsers.css'; // Importing collocated CSS

const ManagementUsers = () => {
    // --- Mock Data ---
    const [staffList, setStaffList] = useState([
        { id: 1, name: 'Rahul Sharma', email: 'rahul@turf.com', phone: '9876543210', role: 'Management', status: 'Active' },
        { id: 2, name: 'Priya Singh', email: 'priya@turf.com', phone: '9123456780', role: 'Management', status: 'Active' },
        { id: 3, name: 'Amit Verma', email: 'amit@turf.com', phone: '9988776655', role: 'Management', status: 'Inactive' },
    ]);

    // --- State ---
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null); // null means "Add Mode"
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', status: 'Active' });

    // --- Handlers ---
    const handleClose = () => {
        setShowModal(false);
        setEditingStaff(null);
        setFormData({ name: '', email: '', phone: '', password: '', status: 'Active' });
    };

    const handleShowAdd = () => {
        setEditingStaff(null);
        setFormData({ name: '', email: '', phone: '', password: '', status: 'Active' });
        setShowModal(true);
    };

    const handleShowEdit = (staff) => {
        setEditingStaff(staff);
        setFormData({ ...staff, password: '' }); // Don't show existing password
        setShowModal(true);
    };

    // Delete Handlers
    const handleShowDelete = (staff) => {
        setStaffToDelete(staff);
        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setStaffToDelete(null);
    };

    const confirmDelete = () => {
        if (staffToDelete) {
            setStaffList(staffList.filter(s => s.id !== staffToDelete.id));
            toast.success('Staff member deleted successfully');
            handleCloseDelete();
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingStaff) {
            // Edit Logic
            const updatedList = staffList.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s);
            setStaffList(updatedList);
            toast.success('Staff details updated successfully');
        } else {
            // Add Logic
            const newStaff = { id: Date.now(), ...formData, role: 'Management' };
            setStaffList([...staffList, newStaff]);
            toast.success('New staff member added');
        }
        handleClose();
    };

    const toggleStatus = (id) => {
        const updatedList = staffList.map(s => {
            if (s.id === id) {
                const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
                toast.success(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
                return { ...s, status: newStatus };
            }
            return s;
        });
        setStaffList(updatedList);
    };

    return (
        <div className="mu-container rounded-4 shadow-sm">
            {/* Header */}
            <div className="mu-page-header">
                <h2 className="mu-title">Management Users</h2>
                <Button className="mu-btn-primary" onClick={handleShowAdd}>
                    <FaPlus className="me-2" /> Add Staff
                </Button>
            </div>

            {/* Table */}
            <div className="mu-table-container">
                <Table responsive hover className="mu-table">
                    <thead>
                        <tr>
                            <th>Staff Name</th>
                            <th>Email / Username</th>
                            <th>Phone Number</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map((staff) => (
                            <tr key={staff.id}>
                                <td>
                                    <div className="fw-bold">{staff.name}</div>
                                </td>
                                <td>{staff.email}</td>
                                <td>{staff.phone}</td>
                                <td>
                                    <Badge bg="secondary" className="fw-normal">{staff.role}</Badge>
                                </td>
                                <td>
                                    <span className={`mu-badge ${staff.status === 'Active' ? 'mu-badge-active' : 'mu-badge-inactive'}`}>
                                        {staff.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <button className="mu-action-btn edit" title="Edit" onClick={() => handleShowEdit(staff)}>
                                            <FaEdit />
                                        </button>

                                        <button
                                            className="mu-action-btn delete"
                                            title="Delete User"
                                            onClick={() => handleShowDelete(staff)}
                                        >
                                            <FaTrash />
                                        </button>

                                        {staff.status === 'Active' ? (
                                            <button
                                                className="mu-action-btn delete"
                                                title="Deactivate"
                                                onClick={() => { if (window.confirm('Deactivate this user?')) toggleStatus(staff.id) }}
                                            >
                                                <FaBan />
                                            </button>
                                        ) : (
                                            <button
                                                className="mu-action-btn text-success"
                                                title="Activate"
                                                onClick={() => { if (window.confirm('Activate this user?')) toggleStatus(staff.id) }}
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {staffList.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No staff members found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton className="mu-modal-header">
                    <Modal.Title className="fw-bold">{editingStaff ? 'Edit Staff Details' : 'Add New Staff'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSave}>
                    <Modal.Body className="p-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. John Doe"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Email (Username) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@turf.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!!editingStaff}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="10-digit number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                                {editingStaff ? 'New Password (leave blank to keep current)' : 'Password'} {(!editingStaff) && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Secret password"
                                required={!editingStaff}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="status-switch"
                                label={formData.status === 'Active' ? 'Account Active' : 'Account Inactive'}
                                checked={formData.status === 'Active'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="mu-modal-footer">
                        <Button variant="light" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" className="mu-btn-primary px-4">Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center pt-0 pb-4">
                    <div className="mb-3 text-danger">
                        <FaTrash size={40} />
                    </div>
                    <h5 className="fw-bold mb-2">Delete User?</h5>
                    <p className="text-muted">
                        Are you sure you want to delete <strong>{staffToDelete?.name}</strong>?
                        <br />This action cannot be undone.
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-4">
                        <Button variant="light" onClick={handleCloseDelete} className="px-4">Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete} className="px-4">Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ManagementUsers;
