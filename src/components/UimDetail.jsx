import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import './UimDetail.css';

const UimDetail = () => {
  const { id } = useParams();
  const [uim, setUim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUim = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/uim/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUim(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUim();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="uim-container container">
      <div className="">
        <Container>
          <div className="home-link">
            <Link to="/">Артқа қайту</Link>
          </div>
        </Container>
      </div>
      <div className="uim-header">
        <ul>
          <li>
            <img className="borderraduis" src="https://www.vivesceramica.com/assets/images/p/40RM.jpg" alt="Uim Image" />
          </li>
          <li>
            <h2 className="uim-title">{uim.name}</h2>
          </li>
          <li>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 40L40 27.5H32.5V10H27.5V27.5H20L30 40Z" fill="#09364F"/>
              <path d="M50 45H10V27.5H5V45C5 47.7575 7.2425 50 10 50H50C52.7575 50 55 47.7575 55 45V27.5H50V45Z" fill="#09364F"/>
            </svg>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="uppercase">Ұйым өкілдері</h3>
        <div className="flex">
          <div className="item flex">
            <img className="borderraduis width80 margin5" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSkBPImcZXATRprILFD_Qj3dTr920wineSNwOfiwXzId-56bvbCGniisOvD26wfHzn_X4&usqp=CAU" alt="" />
            <p><strong>Директор: </strong>{uim.director?.name}</p>
          </div>
          {/* <p className="padding5"><strong>Қыметкер:</strong> {uim.person?.name}</p> */}
        </div>
      </div>
 
      <section className="padding10">
        <h3 className="uppercase">Ұйым қызметі: </h3>
        <div>{uim.body}</div>
      </section>
        
      <section className="padding10">
        <p>Қаласы: {uim.city?.name}</p>
      </section>
      <section className="padding10">
        <div className="table-container">
          <div className="table-header">Іс-шаралар:</div>
          <div className="table-body">
                  <div className="table-cell">
                  <p>{uim.events?.name}</p>
                  </div>
              </div>
        </div>
      </section>
      
      <div>
        <div className="table-container">
          <div className="table-header">
            <div className="table-cell friendly-header">БЕЙБІТ ҰЙЫМДАР</div>
            <div className="table-cell enemy-header">ТАТУ ЕМЕС ҰЙЫМДАР</div>
          </div>
          <div className="table-body">
            <div className="table-cell">
              {uim.statusAssociation?.peaceUim?.name ? (
                <a href={`/uim/${uim.statusAssociation.peaceUim.id}`} rel="noopener noreferrer">
                  {uim.statusAssociation.peaceUim.name}
                </a>
              ) : (
                'No data available'
              )}
            </div>
            <div className="table-cell">
              {uim.statusAssociation?.warUim?.name ? (
                <a href={`/uim/${uim.statusAssociation.warUim.id}`} rel="noopener noreferrer">
                  {uim.statusAssociation.warUim.name}
                </a>
              ) : (
                'No data available'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UimDetail;


