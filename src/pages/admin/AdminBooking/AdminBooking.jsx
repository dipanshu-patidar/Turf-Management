import React, { useState, useRef } from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaRupeeSign, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AdminBooking.css';

const AdminBooking = () => {
    // Courts configuration
    const courts = ['Football', 'Cricket', 'Badminton - Court 1', 'Badminton - Court 2', 'Pickleball'];

    // Time slots (6 AM to 11 PM in 1-hour intervals)
    const timeSlots = [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00'
    ];

    // Mock pricing (weekday/weekend)
    const courtPricing = {
        'Football': { weekday: 1200, weekend: 1500 },
        'Cricket': { weekday: 1000, weekend: 1300 },
        'Badminton - Court 1': { weekday: 400, weekend: 600 },
        'Badminton - Court 2': { weekday: 400, weekend: 600 },
        'Pickleball': { weekday: 500, weekend: 700 }
    };

    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateInputRef = useRef(null);
    const [bookings, setBookings] = useState([
        {
            id: 1,
            court: 'Football',
            date: new Date().toISOString().split('T')[0],
            timeSlot: '09:00',
            customerName: 'Rahul Sharma',
            phone: '9876543210',
            totalPrice: 1200,
            advancePaid: 1200,
            paymentStatus: 'paid'
        },
        {
            id: 2,
            court: 'Cricket',
            date: new Date().toISOString().split('T')[0],
            timeSlot: '10:00',
            customerName: 'Priya Singh',
            phone: '9123456780',
            totalPrice: 1000,
            advancePaid: 500,
            paymentStatus: 'balance'
        }
    ]);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        advancePaid: 0
    });

    // Helper functions
    const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    };

    const getPrice = (court, date) => {
        const pricing = courtPricing[court];
        return isWeekend(date) ? pricing.weekend : pricing.weekday;
    };

    const dateToString = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Navigation handlers
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    // Open date picker
    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    // Check if slot is booked
    const getBookingForSlot = (court, timeSlot) => {
        return bookings.find(b =>
            b.court === court &&
            b.timeSlot === timeSlot &&
            b.date === dateToString(selectedDate)
        );
    };

    // Handle empty slot click
    const handleEmptySlotClick = (court, timeSlot) => {
        const price = getPrice(court, selectedDate);
        setSelectedSlot({ court, timeSlot, price });
        setFormData({ customerName: '', phone: '', advancePaid: 0 });
        setShowAddModal(true);
    };

    // Handle booked slot click
    const handleBookedSlotClick = (booking) => {
        setEditingBooking(booking);
        setFormData({
            customerName: booking.customerName,
            phone: booking.phone,
            advancePaid: booking.advancePaid
        });
        setShowEditModal(true);
    };

    // Add booking
    const handleAddBooking = (e) => {
        e.preventDefault();

        // Check for double booking
        const existing = getBookingForSlot(selectedSlot.court, selectedSlot.timeSlot);
        if (existing) {
            toast.error('This slot is already booked!');
            return;
        }

        const totalPrice = selectedSlot.price;
        const advancePaid = parseFloat(formData.advancePaid) || 0;
        const balance = totalPrice - advancePaid;

        let paymentStatus = 'advance';
        if (advancePaid >= totalPrice) {
            paymentStatus = 'paid';
        } else if (advancePaid > 0) {
            paymentStatus = 'balance';
        }

        const newBooking = {
            id: Date.now(),
            court: selectedSlot.court,
            date: dateToString(selectedDate),
            timeSlot: selectedSlot.timeSlot,
            customerName: formData.customerName,
            phone: formData.phone,
            totalPrice,
            advancePaid,
            balance,
            paymentStatus
        };

        setBookings([...bookings, newBooking]);
        toast.success('Booking created successfully!');
        setShowAddModal(false);
        setSelectedSlot(null);
    };

    // Update booking
    const handleUpdateBooking = (e) => {
        e.preventDefault();

        const totalPrice = editingBooking.totalPrice;
        const advancePaid = parseFloat(formData.advancePaid) || 0;
        const balance = totalPrice - advancePaid;

        let paymentStatus = 'advance';
        if (advancePaid >= totalPrice) {
            paymentStatus = 'paid';
        } else if (advancePaid > 0) {
            paymentStatus = 'balance';
        }

        const updatedBookings = bookings.map(b =>
            b.id === editingBooking.id
                ? { ...b, ...formData, advancePaid, balance, paymentStatus }
                : b
        );

        setBookings(updatedBookings);
        toast.success('Booking updated successfully!');
        setShowEditModal(false);
        setEditingBooking(null);
    };

    // Delete booking
    const handleShowDelete = () => {
        setBookingToDelete(editingBooking);
        setShowEditModal(false);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setBookings(bookings.filter(b => b.id !== bookingToDelete.id));
        toast.success('Booking deleted successfully!');
        setShowDeleteModal(false);
        setBookingToDelete(null);
    };

    // Render booking card
    const renderBookingCard = (booking) => {
        return (
            <div
                className="adminbooking-card"
                onClick={() => handleBookedSlotClick(booking)}
            >
                <div>
                    <div className="adminbooking-card-customer">{booking.customerName}</div>
                    <div className="adminbooking-card-time">{booking.timeSlot} - {getEndTime(booking.timeSlot)}</div>
                    <div className="adminbooking-card-phone">📞 {booking.phone}</div>
                </div>
                <div>
                    <span className={`adminbooking-payment-badge ${booking.paymentStatus}`}>
                        {booking.paymentStatus === 'paid' && '🟢 Fully Paid'}
                        {booking.paymentStatus === 'balance' && '🟡 Balance Pending'}
                        {booking.paymentStatus === 'advance' && '🔴 Advance Pending'}
                    </span>
                </div>
            </div>
        );
    };

    const getEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':');
        const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
        return `${endHour}:${minutes}`;
    };

    return (
        <div className="adminbooking-container">
            {/* Header */}
            <div className="adminbooking-header">
                <div>
                    <h2 className="adminbooking-title">Booking Calendar</h2>
                    <p className="text-muted m-0 small">Manage court bookings and schedules</p>
                </div>
            </div>

            {/* Date Navigation */}
            <div className="adminbooking-date-nav">
                <Button className="adminbooking-nav-btn" onClick={goToPreviousDay}>
                    <FaChevronLeft /> Previous
                </Button>
                <div
                    className="adminbooking-date-display"
                    onClick={openDatePicker}
                    style={{ cursor: 'pointer' }}
                >
                    <FaCalendarDay className="me-2" />
                    {formatDate(selectedDate)}
                </div>
                <Button className="adminbooking-nav-btn" onClick={goToNextDay}>
                    Next <FaChevronRight />
                </Button>
                <Button className="adminbooking-today-btn" onClick={goToToday}>
                    Today
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="adminbooking-calendar-wrapper">
                <div className="adminbooking-calendar-grid">
                    {/* Time Header */}
                    <div className="adminbooking-time-header">Time</div>

                    {/* Court Headers */}
                    {courts.map(court => (
                        <div key={court} className="adminbooking-court-header">
                            {court}
                        </div>
                    ))}

                    {/* Time Slots and Bookings */}
                    {timeSlots.map(timeSlot => (
                        <React.Fragment key={timeSlot}>
                            {/* Time Cell */}
                            <div className="adminbooking-time-cell">
                                {timeSlot}
                            </div>

                            {/* Court Slots */}
                            {courts.map(court => {
                                const booking = getBookingForSlot(court, timeSlot);
                                return (
                                    <div
                                        key={`${court}-${timeSlot}`}
                                        className={`adminbooking-slot-cell ${booking ? 'booked' : 'empty'}`}
                                        onClick={() => !booking && handleEmptySlotClick(court, timeSlot)}
                                    >
                                        {booking && renderBookingCard(booking)}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Add Booking Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered backdrop="static">
                <Modal.Header closeButton className="adminbooking-modal-header">
                    <Modal.Title className="fw-bold">Add New Booking</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddBooking}>
                    <Modal.Body className="p-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Date</Form.Label>
                            <Form.Control
                                type="text"
                                value={formatDate(selectedDate)}
                                className="adminbooking-readonly-field"
                                readOnly
                            />
                        </Form.Group>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <Form.Label className="adminbooking-form-label">Court</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedSlot?.court || ''}
                                    className="adminbooking-readonly-field"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="adminbooking-form-label">Time Slot</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedSlot ? `${selectedSlot.timeSlot} - ${getEndTime(selectedSlot.timeSlot)}` : ''}
                                    className="adminbooking-readonly-field"
                                    readOnly
                                />
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Customer Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter customer name"
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="10-digit mobile number"
                                required
                                pattern="[0-9]{10}"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Form.Group>

                        <div className="adminbooking-price-display">
                            <div className="adminbooking-price-row">
                                <span>Total Price:</span>
                                <span className="fw-bold">₹ {selectedSlot?.price || 0}</span>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Advance Payment</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaRupeeSign size={12} /></InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    max={selectedSlot?.price || 0}
                                    value={formData.advancePaid}
                                    onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>

                        <div className="adminbooking-price-display">
                            <div className="adminbooking-price-row">
                                <span>Remaining Balance:</span>
                                <span className="fw-bold text-danger">
                                    ₹ {(selectedSlot?.price || 0) - (parseFloat(formData.advancePaid) || 0)}
                                </span>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="adminbooking-modal-footer">
                        <Button variant="light" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button type="submit" className="adminbooking-btn-primary">Create Booking</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Booking Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered backdrop="static">
                <Modal.Header closeButton className="adminbooking-modal-header">
                    <Modal.Title className="fw-bold">Edit Booking</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateBooking}>
                    <Modal.Body className="p-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Court & Time</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingBooking ? `${editingBooking.court} - ${editingBooking.timeSlot}` : ''}
                                className="adminbooking-readonly-field"
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Customer Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                required
                                pattern="[0-9]{10}"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Form.Group>

                        <div className="adminbooking-price-display">
                            <div className="adminbooking-price-row">
                                <span>Total Price:</span>
                                <span className="fw-bold">₹ {editingBooking?.totalPrice || 0}</span>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="adminbooking-form-label">Advance Payment</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaRupeeSign size={12} /></InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max={editingBooking?.totalPrice || 0}
                                    value={formData.advancePaid}
                                    onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>

                        <div className="adminbooking-price-display">
                            <div className="adminbooking-price-row">
                                <span>Remaining Balance:</span>
                                <span className="fw-bold text-danger">
                                    ₹ {(editingBooking?.totalPrice || 0) - (parseFloat(formData.advancePaid) || 0)}
                                </span>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="adminbooking-modal-footer">
                        <Button variant="danger" onClick={handleShowDelete}>
                            <FaTrash className="me-2" /> Delete
                        </Button>
                        <div className="ms-auto d-flex gap-2">
                            <Button variant="light" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button type="submit" className="adminbooking-btn-primary">Update Booking</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center pt-0 pb-4">
                    <div className="mb-3 text-danger">
                        <FaTrash size={40} />
                    </div>
                    <h5 className="fw-bold mb-2">Delete Booking?</h5>
                    <p className="text-muted">
                        Are you sure you want to delete the booking for <strong>{bookingToDelete?.customerName}</strong>?
                        <br />This action cannot be undone.
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-4">
                        <Button variant="light" onClick={() => setShowDeleteModal(false)} className="px-4">Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete} className="px-4">Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Date Picker Modal */}
            <Modal show={showDatePicker} onHide={() => setShowDatePicker(false)} centered>
                <Modal.Header closeButton className="adminbooking-modal-header">
                    <Modal.Title className="fw-bold">Select Date</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form.Group>
                        <Form.Label className="adminbooking-form-label">Choose a date</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateToString(selectedDate)}
                            onChange={(e) => {
                                setSelectedDate(new Date(e.target.value));
                                setShowDatePicker(false);
                            }}
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminBooking;
