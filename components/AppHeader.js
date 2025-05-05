import React from 'react';
import useInstallPrompt from '../hooks/use-installprompt';

const AppHeader = () => {
    const { promptInstall, isPromptAvailable } = useInstallPrompt();

    return (
        <header>
            <h1>Your PWA</h1>
            {isPromptAvailable && (
                <button onClick={promptInstall}>Install App</button>
            )}
        </header>
    );
};

export default AppHeader;