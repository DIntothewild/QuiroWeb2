// 1. Importaciones y definiciones
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bookTerapias, fetchReservedTimes } from './BookingFunctions';

const availableTimes = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00'
];

const DateTimeModal = ({ open, handleClose, terapia }) => {
  // ESTADOS
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
  const [name, setName] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [reservedTimes, setReservedTimes] = useState({});

  // Para "Quiromasaje"
  const [tipoMasaje, setTipoMasaje] = useState('relajante');
  const [comentario, setComentario] = useState('');

  //Para Osteopatia
  const [zonaTratar, setZonaTratar] = useState("");
  const [osteoComentario, setosteoComentario] = useState(""); 

  // Para "Entrenamiento personal"
  const [perderPeso, setPerderPeso] = useState(false);
  const [ganarMusculo, setGanarMusculo] = useState(false);
  const [ponermeEnForma, setPonermeEnForma] = useState(false);
  const [recuperarmeLesion, setRecuperarmeLesion] = useState(false);
  const [comentarioEntrenamiento, setComentarioEntrenamiento] = useState('');


  // CARGA de reservas
  useEffect(() => {
    const loadReservedTimes = async () => {
      try {
        const bookings = await fetchReservedTimes();
        const timesByDate = bookings.reduce((acc, booking) => {
          const { date, time } = booking;
          if (!acc[date]) acc[date] = [];
          acc[date].push(time);
          return acc;
        }, {});
        setReservedTimes(timesByDate);
      } catch (error) {
        console.error('Error al cargar las horas reservadas:', error);
      }
    };
    loadReservedTimes();
  }, []);

  // MANEJADOR DE FECHA
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedTime(availableTimes[0]);
  };

  // MANEJADOR DE CONFIRMAR
  const handleConfirm = async () => {
    try {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const dateTime = `${formattedDate} ${selectedTime}`;

      // Llama a bookTerapias con distintos campos según la terapia
      if (terapia?.name === "Quiromasaje") {
        await bookTerapias(terapia, dateTime, name, tipoMasaje, comentario);
      } else if (terapia?.name === "Entrenamiento personal") {
        await bookTerapias(terapia, dateTime, name, {
          perderPeso,
          ganarMusculo,
          ponermeEnForma,
          recuperarmeLesion,
          comentarioEntrenamiento
        });
      } else if (terapia?.name === "Osteopatía") {
        await bookTerapias (terapia, dateTime, name, zonaTratar, osteoComentario);
        // Otras terapias sin campos extra
        await bookTerapias(terapia, dateTime, name);
      }

      setConfirmationMessage(`${name}, tu reserva ha sido realizada con éxito para el ${dateTime}`);

      // Actualiza horas reservadas
      setReservedTimes({
        ...reservedTimes,
        [formattedDate]: [...(reservedTimes[formattedDate] || []), selectedTime]
      });

      // Resetea campos
      setName('');
      setSelectedTime(availableTimes[0]);
      setTipoMasaje('relajante');
      setComentario('');
      setPerderPeso(false);
      setGanarMusculo(false);
      setPonermeEnForma(false);
      setRecuperarmeLesion(false);
      setComentarioEntrenamiento('');
      setosteoComentario("");

      handleClose();
      setConfirmationModalOpen(true);
    } catch (error) {
      console.error('Error al reservar el terapia:', error);
      setConfirmationMessage(`Error al reservar: ${error.message}`);
      setConfirmationModalOpen(true);
    }
  };

  // Filtra horas
  const filteredTimes = selectedDate
    ? availableTimes.filter(
        time => !(reservedTimes[selectedDate.format('YYYY-MM-DD')] || []).includes(time)
      )
    : availableTimes;

  // **Campos extras** según la terapia
  let extraFields = null;
  if (terapia?.name === "Quiromasaje") {
    extraFields = (
      <>
        <Typography variant="h6" sx={{ mt: 2 }}>Tipo de masaje</Typography>
        <Select
          value={tipoMasaje}
          onChange={(e) => setTipoMasaje(e.target.value)}
          fullWidth
        >
          <MenuItem value="relajante">Relajante</MenuItem>
          <MenuItem value="lesiones">Lesiones</MenuItem>
          <MenuItem value="espalda">Espalda</MenuItem>
          <MenuItem value="piernas">Piernas</MenuItem>
          <MenuItem value="otra">Otra parte del cuerpo</MenuItem>
        </Select>

        <Typography variant="h6" sx={{ mt: 2 }}>Comentarios</Typography>
        <TextField
          multiline
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          fullWidth
        />
      </>
    );
  } else if (terapia?.name === "Entrenamiento personal") {
    extraFields = (
      <>
        <Typography variant="h6" sx={{ mt: 2 }}>
          ¿Cuál es tu objetivo con el entrenamiento?
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={perderPeso}
                onChange={(e) => setPerderPeso(e.target.checked)}
              />
            }
            label="Perder peso"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ganarMusculo}
                onChange={(e) => setGanarMusculo(e.target.checked)}
              />
            }
            label="Ganar músculo"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ponermeEnForma}
                onChange={(e) => setPonermeEnForma(e.target.checked)}
              />
            }
            label="Ponerme en forma"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={recuperarmeLesion}
                onChange={(e) => setRecuperarmeLesion(e.target.checked)}
              />
            }
            label="Recuperarme de una lesión"
          />
        </FormGroup>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Comentarios
        </Typography>
        <TextField
          multiline
          rows={3}
          value={comentarioEntrenamiento}
          onChange={(e) => setComentarioEntrenamiento(e.target.value)}
          fullWidth
        />
      </>
    ); 
  }  else if (terapia?.name === "Osteopatía") {
    extraFields = (
      <>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Zona a tratar
        </Typography>
        <TextField
          placeholder="Ej: Cervical, lumbar..."
          value={zonaTratar}
          onChange={(e) => setZonaTratar(e.target.value)}
          fullWidth
        />
        
        <Typography variant="h6" sx={{ mt: 2 }}>Comentarios</Typography>
        <TextField
          multiline
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          fullWidth
        />
        {/* Más campos si quieres */}
      </>
    );
  }

  // RENDER
  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: '10%',
          zIndex: 99999
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '80%'
          }}
        >
          {/* Campo Nombre */}
          <Typography variant="h6">Nombre</Typography>
          <TextField
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          {/* Campos específicos */}
          {extraFields}

          {/* Fecha */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Selecciona Fecha
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha"
              value={selectedDate}
              onChange={handleDateChange}
              slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
            />
          </LocalizationProvider>

          {/* Hora */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Selecciona Hora
          </Typography>
          <Select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            fullWidth
          >
            {filteredTimes.map(time => (
              <MenuItem key={time} value={time}>{time}</MenuItem>
            ))}
          </Select>

          {/* Botón Reservar */}
          <Button sx={{ mt: 2 }} onClick={handleConfirm} variant="contained">
            Reservar
          </Button>
        </Box>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmationModalOpen && (
        <Modal
          open={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: '10%',
            zIndex: 99999
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              maxWidth: '400px',
              width: '80%'
            }}
          >
            <Typography variant="h6">
              {confirmationMessage}
            </Typography>
            <Button
              onClick={() => setConfirmationModalOpen(false)}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default DateTimeModal;