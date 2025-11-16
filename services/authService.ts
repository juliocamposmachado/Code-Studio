// This service simulates the GitHub OAuth2 web application flow.
// In a real-world application, the exchange of the code for an access token
// would happen on a secure server to protect the client secret.

// NOTE: Replace this with your actual GitHub App Client ID.
const GITHUB_CLIENT_ID = 'Ov23litzWuiKJtZr0I7Y';

// !! SECURITY WARNING !!
// The Client Secret should NEVER be exposed in a client-side application.
// This is included for demonstration purposes only. In a real-world scenario,
// the token exchange must happen on a secure backend server.
//
// How to get your Client Secret:
// 1. Go to your GitHub App settings: https://github.com/settings/developers
// 2. Click on your OAuth App ("Code Studio com Gemini API").
// 3. Click "Generate a new client secret".
// 4. Copy the secret and paste it below.
const GITHUB_CLIENT_SECRET = 'YOUR_GITHUB_CLIENT_SECRET'; // <-- PASTE YOUR SECRET HERE

const REDIRECT_URI = window.location.origin + window.location.pathname;

// A CORS proxy is required to make the token exchange request from the browser.
// This is because the GitHub token endpoint does not support CORS.
// This public proxy is for demonstration and may be unreliable.
const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';


/**
 * Generates a random string for the 'state' parameter and stores it.
 * Redirects the user to the GitHub authorization page.
 */
export const redirectToGitHub = () => {
  const state = crypto.randomUUID();
  sessionStorage.setItem('github_oauth_state', state);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: 'user:email read:user', // Request basic user info
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
};

/**
 * Checks for 'code' and 'state' in the URL query parameters.
 * Verifies the 'state' to prevent CSRF attacks.
 * Cleans the URL after processing.
 * @returns The authorization code if the callback is valid, otherwise null.
 */
export const handleGitHubCallback = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const savedState = sessionStorage.getItem('github_oauth_state');

  // Clean the URL of OAuth parameters
  try {
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (error) {
    console.warn("Could not clean URL using history.replaceState:", error);
    // In some sandboxed environments (like blob URLs), replaceState can fail.
    // We'll ignore the error and proceed; the URL will just keep the query params.
  }
  
  if (code && state && state === savedState) {
    sessionStorage.removeItem('github_oauth_state');
    return code;
  }
  
  if (state && state !== savedState) {
    console.error('GitHub OAuth state mismatch. Possible CSRF attack.');
  }

  return null;
};

/**
 * Exchanges an authorization code for an access token by proxying the request.
 * @param code The authorization code from GitHub.
 * @returns An object containing the access_token.
 */
export const exchangeCodeForToken = async (code: string): Promise<{ access_token: string }> => {
  if (GITHUB_CLIENT_SECRET === 'YOUR_GITHUB_CLIENT_SECRET' || !GITHUB_CLIENT_SECRET) {
    throw new Error("GitHub Client Secret is not configured. Please add it to `services/authService.ts`.");
  }

  const tokenUrl = 'https://github.com/login/oauth/access_token';

  const response = await fetch(`${CORS_PROXY}${tokenUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    let errorData;
    try {
        errorData = await response.json();
    } catch(e) {
        errorData = { error_description: response.statusText };
    }
    throw new Error(`Failed to exchange code for token: ${errorData.error_description || 'Unknown error'}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`GitHub OAuth Error: ${data.error_description}`);
  }
  
  return { access_token: data.access_token };
};


/**
 * Fetches the authenticated user's profile from the GitHub API.
 * @param token The user's access token.
 * @returns The user's profile object from the GitHub API.
 */
export const fetchGitHubUser = async (token: string): Promise<any> => {
  if (!token) {
    throw new Error("Access token is missing.");
  }
  
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`);
  }

  return await response.json();
};
