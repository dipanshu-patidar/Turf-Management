import React, { useState } from 'react';
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './StaffBooking.css';

const StaffBooking = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const courts = [
        "Football",
        "Cricket",
        "Badminton - Court 1",
        "Badminton - Court 2",
        "Pickleball"
    ];

    const timeSlots = [];
    for (let h = 6; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            timeSlots.push(time);
        }
    }

    // Mock Bookings Data
    const mockBookings = [
        {
            id: 1,
            customerName: "Rahul Sharma",
            court: "Football",
            startTime: "06:00",
            endTime: "07:00",
            status: "Fully Paid",
            date: selectedDate.toISOString().split('T')[0],
            phone: "9876543210"
        },
        {
            id: 2,
            customerName: "Priya Singh",
            court: "Badminton - Court 1",
            startTime: "09:00",
            endTime: "10:00",
            status: "Balance Pending",
            date: selectedDate.toISOString().split('T')[0],
            phone: "9876543211"
        },
        {
            id: 3,
            customerName: "Amit Verma",
            court: "Cricket",
            startTime: "17:00",
            endTime: "18:00",
            status: "Advance Pending",
            date: selectedDate.toISOString().split('T')[0],
            phone: "9876543212"
        },
        {
            id: 4,
            customerName: "Sneha Patel",
            court: "Pickleball",
            startTime: "10:00",
            endTime: "11:00",
            status: "Fully Paid",
            date: selectedDate.toISOString().split('T')[0],
            phone: "9876543213"
        },
        {
            id: 5,
            customerName: "Vivian D",
            court: "Badminton - Court 2",
            startTime: "18:00",
            endTime: "19:00",
            status: "Fully Paid",
            date: selectedDate.toISOString().split('T')[0],
            phone: "9876543214"
        }
    ];

    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState({ court: '', time: '' });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState(mockBookings);

    const [newBookingData, setNewBookingData] = useState({
        customerName: '',
        phone: '',
        status: 'Fully Paid'
    });

    const handleSlotClick = (court, time) => {
        const isBooked = bookings.find(b => b.court === court && b.startTime === time);
        if (isBooked) return;

        setSelectedSlot({ court, time });
        setShowNewModal(true);
    };

    const handleBookingClick = (e, booking) => {
        e.stopPropagation();
        setSelectedBooking(booking);
        setShowEditModal(true);
    };

    const handleNewBookingSubmit = (e) => {
        e.preventDefault();
        const newBooking = {
            id: Date.now(),
            customerName: newBookingData.customerName,
            court: selectedSlot.court,
            startTime: selectedSlot.time,
            endTime: (() => {
                const [h, m] = selectedSlot.time.split(':').map(Number);
                const newM = m + 15;
                const newH = h + Math.floor(newM / 60);
                const finalM = newM % 60;
                return `${newH.toString().padStart(2, '0')}:${finalM.toString().padStart(2, '0')}`;
            })(),
            status: newBookingData.status,
            date: selectedDate.toISOString().split('T')[0],
            phone: newBookingData.phone
        };
        setBookings([...bookings, newBooking]);
        toast.success('Booking created successfully');
        setShowNewModal(false);
        setNewBookingData({ customerName: '', phone: '', status: 'Fully Paid' });
    };

    const handleCancelBooking = () => {
        setBookings(bookings.filter(b => b.id !== selectedBooking.id));
        toast.success('Booking cancelled successfully');
        setShowEditModal(false);
    };

    const handlePrevDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        setSelectedDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next);
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Fully Paid': return 'staffbooking-badge-paid';
            case 'Balance Pending': return 'staffbooking-badge-pending-bal';
            case 'Advance Pending': return 'staffbooking-badge-pending-adv';
            default: return '';
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'Fully Paid': return 'paid';
            case 'Balance Pending': return 'pending-bal';
            case 'Advance Pending': return 'pending-adv';
            default: return '';
        }
    };

    return (
        <div className="staffbooking-container">
            {/* Header with Navigation */}
            <div className="staffbooking-page-header">
                <div>
                    <h2 className="staffbooking-title">Booking Calendar</h2>
                    <p className="text-muted m-0 small">Manage and view turf availability</p>
                </div>

                <div className="staffbooking-date-nav">
                    <button className="staffbooking-nav-btn" onClick={handlePrevDay} title="Previous Day">
                        <FaChevronLeft />
                    </button>
                    <div
                        className="staffbooking-current-date cursor-pointer"
                        onClick={() => document.getElementById('staff-booking-date-picker').showPicker()}
                        title="Click to select date"
                    >
                        <FaCalendarAlt className="me-2 text-primary" />
                        {formatDate(selectedDate)}
                        <input
                            type="date"
                            id="staff-booking-date-picker"
                            className="position-absolute invisible"
                            style={{ top: 0, left: '50%', width: 0 }}
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                    </div>
                    <button className="staffbooking-nav-btn" onClick={handleNextDay} title="Next Day">
                        <FaChevronRight />
                    </button>
                    <Button variant="outline-danger" size="sm" className="staffbooking-today-btn" onClick={handleToday}>
                        Today
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="staffbooking-calendar-wrapper">
                <div className="staffbooking-calendar-grid">
                    {/* Header Row */}
                    <div className="staffbooking-header-cell time-head">Time</div>
                    {courts.map(court => (
                        <div key={court} className="staffbooking-header-cell">{court}</div>
                    ))}

                    {/* Time Rows */}
                    {timeSlots.map(time => (
                        <div key={time} className="staffbooking-time-row">
                            <div className="staffbooking-time-cell">{time}</div>
                            {courts.map(court => {
                                // Check for booking in this slot
                                const booking = bookings.find(b =>
                                    b.court === court && b.startTime === time
                                );

                                return (
                                    <div
                                        key={`${court}-${time}`}
                                        className="staffbooking-slot"
                                        onClick={() => handleSlotClick(court, time)}
                                    >
                                        {booking && (
                                            <div
                                                className={`staffbooking-booked-card ${getStatusTheme(booking.status)}`}
                                                onClick={(e) => handleBookingClick(e, booking)}
                                            >
                                                <div>
                                                    <div className="staffbooking-slot-time">
                                                        {booking.startTime} - {booking.endTime}
                                                    </div>
                                                    <div className="staffbooking-customer-name">
                                                        {booking.customerName}
                                                    </div>
                                                </div>
                                                <div className={`staffbooking-status-badge ${getStatusBadgeClass(booking.status)}`}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            {/* New Booking Modal */}
            <Modal show={showNewModal} onHide={() => setShowNewModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">New Booking</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleNewBookingSubmit}>
                    <Modal.Body className="pt-0">
                        <div className="mb-3">
                            <Badge bg="light" text="dark" className="border px-3 py-2 w-100 text-start">
                                <div className="small text-muted mb-1">Court & Time</div>
                                <div className="fw-bold">{selectedSlot.court} | {selectedSlot.time}</div>
                            </Badge>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Customer Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter customer name"
                                required
                                value={newBookingData.customerName}
                                onChange={(e) => setNewBookingData({ ...newBookingData, customerName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Customer Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter mobile number"
                                required
                                value={newBookingData.phone}
                                onChange={(e) => setNewBookingData({ ...newBookingData, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Payment Status</Form.Label>
                            <Form.Select
                                value={newBookingData.status}
                                onChange={(e) => setNewBookingData({ ...newBookingData, status: e.target.value })}
                            >
                                <option value="Fully Paid">Fully Paid</option>
                                <option value="Balance Pending">Balance Pending</option>
                                <option value="Advance Pending">Advance Pending</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="light" onClick={() => setShowNewModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4">Create Booking</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit/View Booking Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    {selectedBooking && (
                        <>
                            <div className="mb-4">
                                <Badge bg="light" text="dark" className="border px-3 py-3 w-100 text-start">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="small text-muted">Court</div>
                                            <div className="fw-bold">{selectedBooking.court}</div>
                                        </div>
                                        <div className="col-6 text-end">
                                            <div className="small text-muted">Time Slot</div>
                                            <div className="fw-bold">{selectedBooking.startTime} - {selectedBooking.endTime}</div>
                                        </div>
                                    </div>
                                </Badge>
                            </div>
                            <div className="mb-3">
                                <label className="small text-muted d-block">Customer</label>
                                <h5 className="fw-bold mb-0">{selectedBooking.customerName}</h5>
                            </div>
                            <div className="mb-3">
                                <label className="small text-muted d-block">Customer Number</label>
                                <div className="fw-bold">{selectedBooking.phone || 'N/A'}</div>
                            </div>
                            <div className="mb-3">
                                <label className="small text-muted d-block">Payment Status</label>
                                <div className={`staffbooking-status-badge mt-1 ${getStatusBadgeClass(selectedBooking.status)}`}>
                                    {selectedBooking.status}
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 d-flex justify-content-between">
                    <Button variant="outline-danger" onClick={handleCancelBooking}>
                        <FaTrash className="me-2" /> Cancel Booking
                    </Button>
                    <div>
                        <Button variant="light" className="me-2" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={() => toast.error('Edit feature coming soon')}><FaEdit className="me-2" /> Edit</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StaffBooking;
