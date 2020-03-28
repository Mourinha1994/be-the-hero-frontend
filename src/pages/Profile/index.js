import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import api from '../../services/api';

import './styles.css';

export default function Profile () {
    const [incidents, setIncidents ] = useState([]);

    const history = useHistory();

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('/profiles', {
            headers: {
                authorization: ongId
            }
        }).then(response => setIncidents(response.data))
    },[ongId]);

    /**
     * 
     * @param {Incident id} id 
     */
    async function HandleDeleteIncident(id) {
        try {
            await api.delete(`/incidents/${id}`, {
                headers: {
                    authorization: ongId
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id))
        } catch (err) {
            alert(`Erro ao deletar caso com id: ${id}`)
        }
    }

    /**
     * Logout from application
     */
    async function HandleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">

            {/**
             * Header
             */}
            <header>
                <img src={logoImg} alt="Be the hero" />
                <span>Bem vindo(a), {ongName}</span>
                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={HandleLogout} type="button">
                    <FiPower size={18} />
                </button>
            </header>

            {/**
             * Listagem de casos cadastrados
             */}
             <h1>Casos cadastrados</h1>

             <ul>
                 {incidents.map(incident => (
                     <li key={incident.id}>
                         <strong>CASO:</strong>
                         <p>{incident.title}</p>

                         <strong>DESCRIÇÃO:</strong>
                         <p>{incident.description}</p>

                         <strong>VALOR:</strong>
                         <p>
                             {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}
                         </p>

                         <button onClick={() => HandleDeleteIncident(incident.id)} type="button">
                             <FiTrash2 size={20} color="#a8a8b3" />
                         </button>
                     </li>
                 ))}
             </ul>

        </div>
    )
}