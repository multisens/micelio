import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

function ConsentTerm () {

    const params = useParams();

    const [consentTerm, setConsentTerm] = useState(null);

    useEffect(() => {
        getConsentTerm();
      }, [])
    
    const getConsentTerm = async () => {
        try {
            const termResponse = await Api.get(`/consentTerm`);

            const {data} = termResponse.data.data;

            setConsentTerm(data);
        } catch (e) {
            //
        }
    }

    const beginForm = async () => {
        try {
            
        } catch (e) {
            // Erro
        }
    }

    return (
        <div className={'content-body'}>
            <Header title="Termo de Consentimento Livre e Esclarecido"/>
            <div className={'container'}>
                <div>
                    <div>
                        Digite no campo abaixo o termo de consentimento que ser&aacute; assinado pelos participantes do experimento:
                    </div>
                    <div>
                        <form onSubmit={beginForm}>
                            <div className={'text-field'}>
                                <textarea required className={'primary'} name={'consentTerm'} rows="5" cols="50" value={consentTerm}
                                    onChange={e => {
                                        setConsentTerm(e.target.value)
                                    }}/>
                            </div><br/><br/>
                            <button className={'primary'}>Seguinte</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );

};

export default ConsentTerm;