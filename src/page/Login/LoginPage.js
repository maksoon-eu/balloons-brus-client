import LoginModal from '../../components/loginModal/LoginModal';
import Smooth from '../../components/smooth/Smooth';

const LoginPage = () => {
    return (
        <Smooth classNames="login">
            <LoginModal />
        </Smooth>
    );
};

export default LoginPage;
