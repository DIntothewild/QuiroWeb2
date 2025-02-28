import { useState } from "react";
import { cancelBookedTerapias, availabilityTerapias } from "./BookingFunctions";
import axios from "axios";
import "../App.css"; 
import Modal from 'react-modal';

const BookingComponent = ({ terapias }) => { 
  const [selectedTerapias, setSelectedTerapias] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleBooking = (type) => {
    const terapiasToBook = availabilityTerapias(terapias, type);
    if (terapiasToBook) {
      setSelectedTerapias(terapiasToBook);
      setModalOpen(true);
      setErrorMessage(""); 
    } else {
      setErrorMessage(`Lo sentimos, no hay terapias de tipo ${type} disponibles para la fecha seleccionada.`);
    }
  };

  const handleCancel = async (terapias) => {
    try {
      await axios.delete(`http://localhost:3000/bookings/${terapias._id}`);
      cancelBookedTerapias(terapias);
      setConfirmationMessage(`Has cancelado la reserva del terapia ${terapias.name} con éxito`);
      setConfirmationModalOpen(true);
    } catch (error) {
      console.error('Error al cancelar el terapia:', error);
    }
  };

  return null 
};

export default BookingComponent;
