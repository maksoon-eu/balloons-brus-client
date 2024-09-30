import { observer } from 'mobx-react-lite';

import Sidebar from '../../components/sideBar/SideBar';
import Catalog from '../../components/catalog/Catalog';
import Smooth from '../../components/smooth/Smooth';

const CatalogPage = observer(() => {
    return (
        <Smooth classNames="catalog">
            <Sidebar />
            <Catalog />
        </Smooth>
    );
});

export default CatalogPage;
