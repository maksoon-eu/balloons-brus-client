import React, { useEffect, useContext } from 'react';
import { Context } from '../..';
import { fetchTypes } from '../../http/typesApi';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import CreateItem from '../../components/admin/CreateItem';
import CreateType from '../../components/admin/CreateType';
import CreateSubType from '../../components/admin/CreateSubType';
import DeleteType from '../../components/admin/DeleteCategory';
import DeleteSubType from '../../components/admin/DeleteSubType';
import Smooth from '../../components/smooth/Smooth';

const AdminPage = observer(() => {
    const { types, user, items } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isAuth) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        fetchTypes().then((data) => {
            types.setTypes(data);
            types.setTypesLoading(false);
        });
        items.setUpdateList(true);
    }, [types.updateTypes]);

    return (
        <Smooth classNames="create">
            <div className="create__flex">
                <CreateItem />
                <CreateType />
                <CreateSubType />
                <DeleteType />
                <DeleteSubType />
            </div>
        </Smooth>
    );
});

export default AdminPage;
