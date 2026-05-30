// InstallButton.tsx
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outCome: 'accepted' | 'dismissed'}>
}

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt ] =useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [installed, setInstalled] = useState(false)

    useEffect(() => {
        // Detect iPhone/iPad
        const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
        setIsIOS(ios);

        // Detect already installed
        if (
            window.matchMedia('(display-mode: standalone)').matches
        ) {
            setInstalled(true);
        }

        // Capture install prompt
        const handler = (e: Event) => {
            e.preventDefault();

            setDeferredPrompt(
                e as BeforeInstallPromptEvent
            );
        };

        window.addEventListener(
            'beforeinstallprompt',
            handler
        );
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const result = 
           await deferredPrompt.userChoice;

           if (result.outCome === 'accepted') {
            setDeferredPrompt(null);
           }
    };

    // Hide if already installed
    if (installed) return null;

    // iPhone instructions
    if (isIOS) {
        return (
            <button 
               className="btn btn-warning btn-sm"
               onClick={() => 
                alert(
                    'To install SmartBooks: \n\nTap Share -> Add to Home Screen'
                )
               }
            >
                Install SmartBooks
            </button>
        );
    }

    // Chrome/Android install
    if (deferredPrompt) {
        return (
            <button 
               className="btn btn-success btn-sm ms-2"
               onClick={handleInstall}
            >
                Install SmartBooks
            </button>    
        );
    }
    return null;
}