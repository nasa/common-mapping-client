import React, {PropTypes} from 'react';
import * as config from '../config/MainMenuConfig';
import MiscUtil from '../utils/MiscUtil';
import Button from 'react-toolbox/lib/button';

const MainMenuControls = ({ openMainMenu, selectedTab }) => {
    return (
        <div id="mainMenuControls">
            <Button flat primary={selectedTab === config.DATASETS_LABEL} className="full-width text-left main-menu-control" onClick={() => openMainMenu(config.DATASETS_LABEL)} >
                <i className="ms ms-fw ms-database-o main-menu-control-icon"></i><span className="main-menu-control-label">{config.DATASETS_LABEL}</span>
            </Button>
            <br/>
            <Button flat primary={selectedTab === config.TOOLS_LABEL} className="full-width text-left main-menu-control" onClick={() => openMainMenu(config.TOOLS_LABEL)} >
                <i className="ms ms-fw ms-tools main-menu-control-icon"></i><span className="main-menu-control-label">{config.TOOLS_LABEL}</span>
            </Button>
            <br/>
            <Button flat primary={selectedTab === config.EXPORTS_LABEL} label={config.EXPORTS_LABEL} icon="file_download" className="full-width text-left main-menu-control" onClick={() => openMainMenu(config.EXPORTS_LABEL)} />
            <br/>
            <Button flat primary={selectedTab === config.SETTINGS_LABEL} label={config.SETTINGS_LABEL} icon="settings" className="full-width text-left main-menu-control" onClick={() => openMainMenu(config.SETTINGS_LABEL)} />
        </div>
    );
};
MainMenuControls.propTypes = {
    openMainMenu: PropTypes.func.isRequired,
    selectedTab: PropTypes.string.isRequired
};

export default MainMenuControls;
