import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Footer from '../Components/Footer';
import { bookTerapias, cancelBookedTerapias } from '../Components/BookingFunctions';
import './Home.css';
import DateTimeModal from '../Components/DateTimeModal';
import BookingComponent from '../Components/BookingComponent';

const Home = () => {
  const [open, setOpen] = useState(false);
  const [selectedTerapia, setSelectedTerapia] = useState(null);
  const [terapias, setTerapias] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/terapias")  
      .then(response => {
        console.log("🔍 Terapias recibidas:", response.data);
        setTerapias(response.data);
      })
      .catch(error => console.error("❌ Error al obtener terapias:", error));
  }, []);

  const handleOpen = (terapia) => {
    setSelectedTerapia(terapia);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTerapia(null);
  };
// Después de setTerapias(response.data), define el orden deseado
const desiredOrder = [
  "Quiromasaje",
  "Osteopatía",
  "Entrenamiento personal",
  "Consulta nutricional",
  "Naturopatía",
  "Eventos"
];

// Ordena las terapias según desiredOrder
const sortedTherapias = [...terapias].sort((a, b) => {
  return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
});

  return (
    <>
      <Grid container className="home-container" spacing={3}>
        {sortedTherapias.map((terapia) => (
          <Grid item xs={12} sm={6} key={terapia._id}>
            <div className="terapia-section">
              <img 
                src={`/images/${terapia.backgroundImage.includes('.') ? terapia.backgroundImage : terapia.backgroundImage + ".jpg"}`}  
                alt={terapia.name}  
                className="background-image" 
                onError={(e) => e.target.src = "/images/events.jpeg"} 
              />
              <div className="overlay">
                <Typography className="title" variant="h2">{terapia.name}</Typography>
                <Typography className="description" variant="body1">
                  {terapia.description || "Descripción no disponible"}
                </Typography>
                <div className="actions">
                  <Button variant="contained" onClick={() => handleOpen(terapia)}>
                    {terapia.isBooked ? 'Reservado' : 'Reservar'}
                  </Button>
                  {terapia.isBooked && (
                    <Button variant="contained" onClick={() => cancelBookedTerapias(terapia)}>
                      Cancelar Reserva
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
   {/*    <BookingComponent terapias={terapias} /> */}
      <Footer />
      <DateTimeModal open={open} handleClose={handleClose} terapia={selectedTerapia} />
    </>
  );
};

export default Home;