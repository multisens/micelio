import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Thanks () {
    return (
        <>
            <div className={'content-body'}>
                <Header title="Experimento Finalizado"/>
                    <div className={'container'}>
                        <div className={'thanks'}>
                            Obrigado pela sua participação!
                        </div>
                    </div>
                <Footer/>
            </div>
        </>
    );
};

export default Thanks;