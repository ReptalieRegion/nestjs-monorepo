'use client';

import { useState } from 'react';

const YourComponent = () => {
    const [inputFocused, setInputFocused] = useState(false);

    const handleInputFocus = () => {
        setInputFocused(true);
    };

    const handleInputBlur = () => {
        setInputFocused(false);
    };

    return (
        <div className={inputFocused ? 'h-[100vh] overflow-y-hidden' : 'flex-1'}>
            <div className="fixed bottom-90pxr">
                <input type="text" onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="Type something..." />
            </div>
        </div>
    );
};

export default YourComponent;
