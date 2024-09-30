import AboutInfo from '../../components/aboutInfo/AboutInfo';
import SendMessage from '../../components/sendMessage/SendMessage';
import Smooth from '../../components/smooth/Smooth';

const AboutPage = () => {
    return (
        <Smooth>
            <AboutInfo />
            <SendMessage />
        </Smooth>
    );
};

export default AboutPage;
