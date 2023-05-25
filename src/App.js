import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import logo from "./logo.jpg";
import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Container, NavLink } from "react-bootstrap";
// import mapPlaceholder from "./mapPlaceholder.jpg";


function App() {
  const [pharm, setPharmacies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [zoneOptions, setZoneOptions] = useState([]);
  const [zone, setZone] = useState('');
  const [garde, setGarde] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState('');

  const menuData = [
    {
      path: '/',
      name: "Accueil"
    },
    {
      path: '/about',
      name: "A propos"
    },
    {
      path: '/contact',
      name: "Contact"
    },
  ];

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleButtonClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowModal(true);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  useEffect(() => {
    axios.get('https://backend-ashy-beta.vercel.app/villes')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const h1Styles = {
    textAlign: "center",
    color: "green"
  };

  useEffect(() => {
    axios.get(`https://backend-ashy-beta.vercel.app/zones?ville=${selectedCity}`)
      .then(response => {
        setZoneOptions(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedCity]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('https://backend-ashy-beta.vercel.app/pharmacies', {
        params: {
          selectedCity,
          zone,
          garde,
        },
      });
      setPharmacies(response.data);
    } catch (error) {
      // Display a user-friendly error message
      alert('Please try again later.');
      console.error(error);
    }
  };

  // const redirectToGoogleMaps = (pharmacy) => {
  //   if (pharmacy && pharmacy.latitude && pharmacy.longitude) {
  //     const { latitude, longitude } = pharmacy;
  //     const url = `https://www.google.com/maps/dir/Current+Location/${latitude},${longitude}`;
  //     window.open(url, '_blank');
  //   } else {
  //     console.log('Invalid pharmacy data');
  //   }
  // };


  return (
    <div className="Table">
      <Navbar className="navbar" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="brand d-flex justify-content-center align-items-center" style={{ color: "white" }}>
            <img
              src={logo} // add your logo here
              height="50"
              className="d-inline-block align-top me-3"
              alt="Pharmacie logo"
            />{" "}
            votre assistant pour trouver des pharmacies
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto ">
              {menuData.map((item) => (
                <NavLink to={item.path} key={item.name}>
                  <div className="list_item" style={{ color: "white" }}>{item.name}</div>
                </NavLink>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <h1 style={h1Styles}>Rechercher des pharmacies</h1>
      <form onSubmit={handleSubmit}>
        <span style={{ marginLeft: "200px" }}>
          <label htmlFor="city" style={{ fontFamily: "Arial", color: "green", marginRight: "100px", fontWeight: "bold" }}>Ville </label>
          <select id="city" value={selectedCity} onChange={handleCityChange} required style={{ marginRight: "230px" }}>
            <option value="">Sélectionner une ville</option>
            {cities.map(city => (
              <option key={city._id} value={city.name}>{city.name}</option>
            ))}
          </select>
        </span>

        <label htmlFor="zone" style={{ fontFamily: "Arial", color: "green", marginRight: "20px", fontWeight: "bold" }}>Zone </label>
        <select id="zone" value={zone} onChange={(event) => setZone(event.target.value)} required>
          <option value="">Sélectionnez une zone</option>
          {zoneOptions.map(zone => <option key={zone._id} value={zone.name}>{zone.name}</option>)}
        </select>

        <br /><br />
        <span style={{ marginLeft: "200px" }}>
          <label htmlFor="type" style={{ fontFamily: "Arial", color: "green", marginRight: "20px", fontWeight: "bold" }}>Type de garde</label>
          <select id="type" value={garde} onChange={(e) => setGarde(e.target.value)} style={{ marginRight: "220px" }} required >
            <option >Sélectionner une garde</option>
            <option >jour</option>
            <option >nuit</option>
          </select>

          <label htmlFor="date-input" style={{ fontFamily: "Arial", color: "green", marginRight: "20px", fontWeight: "bold" }}>Date</label>
          <input
            type="date"
            id="date-input"
            value={date}
            onChange={handleDateChange}
          />
        </span>
        <br /><br />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "40px" }}>
          <button type="submit" style={{ backgroundColor: "#439c50", color: "white", border: "1px solid white" }}>
            Rechercher
          </button>
        </div>
      </form>

      <div>

        <table className="table table-bordered table-striped" style={{ border: "2px solid white", fontWeight: "bold" }}>
          {pharm.length > 0 && (
            <thead>
              <tr style={{ backgroundColor: "#439c50", color: "white" }}>
                <th>nom</th>
                <th>Ville</th>
                <th>Zone</th>
                <th>Garde</th>
              </tr>
            </thead>
          )}
          <tbody>
            {pharm.map((pharmacy) => (
              <tr key={pharmacy._id}>
                <td style={{ fontWeight: "bold" }}>
                  {pharmacy.name}{" "}
                  <button
                    onClick={() => handleButtonClick(pharmacy)}
                    style={{
                      backgroundColor: "#439c50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    voir détails
                  </button>
                </td>
                <td>{pharmacy.ville}</td>
                <td>{pharmacy.zone}</td>
                <td>{pharmacy.garde}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title> Details de Pharmacie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedPharmacy?.src} alt="rien" style={{ maxWidth: "100%" }} />
            <p>Name: {selectedPharmacy?.name}</p>
            <p>Ville: {selectedPharmacy?.ville}</p>
            <p>Zone: {selectedPharmacy?.zone}</p>
            <p>Garde: {selectedPharmacy?.garde}</p>
            <p>Date De Garde: {selectedPharmacy?.dateGarde}</p>
            <a href={`https://www.google.com/maps/place/${selectedPharmacy?.latitude},${selectedPharmacy?.longitude}`} target="_blank" rel="noopener noreferrer">
              <button style={{ backgroundColor: "#439c50", color: "white" }}>itinéraire</button></a>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ backgroundColor: "#439c50" }} onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>


      </div>

      <footer className="bg-pharmacy" position="fixed" >
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h3>Informations de contact</h3>
              <p>Adresse : 123 Rue massira, El jadida</p>
              <p>Téléphone : 01 23 45 67 89</p>
              <p>Email : contact@app.com</p>
            </div>
            <div className="col-md-4">
              <h3>Horaires d'ouverture</h3>
              <p>Lundi - Vendredi : 9h - 18h</p>
              <p>Samedi : 9h - 12h</p>
              <p>Dimanche : fermé</p>
            </div>
            <div className="col-md-4">
              <h3>Follow us</h3>
              <ul className="list-inline">
                <li className="list-inline-item mr-4">
                  <a href="https://web.whatsapp.com/">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                </li>
                <li className="list-inline-item mr-4">
                  <a href="https://web.whatsapp.com/">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </li>
                <li className="list-inline-item mr-4">
                  <a href="https://web.whatsapp.com/">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
