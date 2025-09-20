import axios from 'axios';
import { apiURL } from './apiURL';

type PanelUserType = {
    panelId: string;
    email: string;
    name: string;
    profilePic: string;
    panelType: string;
};

export const addPanelUser = async (data: PanelUserType) => {
    return await axios.post(`${apiURL}/panel-users`, data);
};
