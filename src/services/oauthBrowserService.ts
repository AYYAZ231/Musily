export interface OAuthResult {
  success: boolean;
  provider: 'spotify' | 'youtube';
  username?: string;
  channelTitle?: string;
  avatar?: string;
  email?: string;
  token?: string;
  error?: string;
}

export class OAuthBrowserService {
  private static activePopup: Window | null = null;
  private static popupCheckInterval: number | null = null;

  /**
   * Opens a dedicated browser window for Spotify or YouTube authentication.
   * Connects directly with the user's active browser session or opens provider credentials.
   */
  static openOAuth(provider: 'spotify' | 'youtube', initialAccount: string = ''): Promise<OAuthResult> {
    return new Promise((resolve) => {
      // Close any previously opened popup
      if (this.activePopup && !this.activePopup.closed) {
        try {
          this.activePopup.close();
        } catch {}
      }

      const width = 520;
      const height = 680;
      const screenLeft = window.screenLeft ?? window.screenX ?? 0;
      const screenTop = window.screenTop ?? window.screenY ?? 0;
      const outerWidth = window.outerWidth ?? document.documentElement.clientWidth ?? 1024;
      const outerHeight = window.outerHeight ?? document.documentElement.clientHeight ?? 768;

      const left = Math.round(screenLeft + (outerWidth - width) / 2);
      const top = Math.round(screenTop + (outerHeight - height) / 2);

      const targetUrl = `${window.location.origin}/?oauth=${provider}&account=${encodeURIComponent(
        initialAccount
      )}&t=${Date.now()}`;
      const popupWindow = window.open(
        targetUrl,
        `Musily_${provider}_OAuth`,
        `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`
      );

      this.activePopup = popupWindow;

      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        if (this.popupCheckInterval) {
          window.clearInterval(this.popupCheckInterval);
          this.popupCheckInterval = null;
        }
        this.activePopup = null;
      };

      const handleMessage = (event: MessageEvent) => {
        // Ensure message origin matches or payload structure matches
        if (
          event.data &&
          event.data.type === 'MUSILY_OAUTH_SUCCESS' &&
          event.data.provider === provider
        ) {
          cleanup();
          const payload = event.data.payload || {};
          resolve({
            success: true,
            provider,
            username: payload.username,
            channelTitle: payload.channelTitle,
            avatar: payload.avatar,
            email: payload.email,
            token: payload.token
          });
        } else if (
          event.data &&
          event.data.type === 'MUSILY_OAUTH_CANCEL' &&
          event.data.provider === provider
        ) {
          cleanup();
          resolve({
            success: false,
            provider,
            error: 'Authentication cancelled by user.'
          });
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup blocked or closed manually
      if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
        cleanup();
        resolve({
          success: false,
          provider,
          error: 'Popup was blocked by your browser. Please allow popups for localhost.'
        });
        return;
      }

      this.popupCheckInterval = window.setInterval(() => {
        if (popupWindow.closed) {
          cleanup();
          resolve({
            success: false,
            provider,
            error: 'Authentication window closed.'
          });
        }
      }, 800);
    });
  }
}
