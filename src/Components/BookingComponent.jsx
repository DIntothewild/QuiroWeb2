import { useState } from "react";
import { cancelBookedTerapias, availabilityTerapias } from "./BookingFunctions";
import axios from "axios";
import "../App.css";
import Modal from 'react-modal';

const BookingComponent = ({ terapias }) => {
  const [selectedTerapias, setSelectedTerapias] = useState(null);
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

  const handleCancel = async (terapia) => {
    try {
      await axios.delete(`http://localhost:3000/bookings/${terapia._id}`);
      cancelBookedTerapias(terapia);
      setConfirmationMessage(`Has cancelado la reserva de ${terapia.name} con éxito`);
      setConfirmationModalOpen(true);
    } catch (error) {
      console.error('Error al cancelar el terapia:', error);
    }
  };

  return (
    <div>
      <h2>Gestionar Reservas</h2>
      {terapias.map((t) => (
        <div key={t._id} style={{ border: "1px solid gray", margin: "10px" }}>
          <p>{t.name}</p>
          {/* Mostrar el tipo de masaje si es Quiromasaje */}
          {t.type === "quiromasaje" && t.tipoDeMasaje && (
            <p><strong>Tipo de Masaje:</strong> {t.tipoDeMasaje}</p>
          )}

          {/* Mostrar la zona del cuerpo si es Osteopatía */}
          {t.type === "osteopatia" && t.zonaDelCuerpo && (
            <p><strong>Zona del Cuerpo:</strong> {t.zonaDelCuerpo}</p>
          )}

          <button onClick={() => handleBooking(t.type)}>Reservar</button>
          <button onClick={() => handleCancel(t)}>Cancelar</button>
        </div>
      ))}
    </div>
  );
};

export default BookingComponent;