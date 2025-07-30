// Authentication utilities for admin access

export interface AdminSession {
  isAuthenticated: boolean;
  timestamp: number;
}

// Session timeout: 8 hours
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

export function checkAdminAuth(): AdminSession {
  try {
    const authFlag = sessionStorage.getItem('candela_admin_auth');
    const timestamp = sessionStorage.getItem('candela_admin_timestamp');
    
    if (!authFlag || !timestamp) {
      return { isAuthenticated: false, timestamp: 0 };
    }
    
    const sessionTime = parseInt(timestamp, 10);
    const now = Date.now();
    
    // Check if session has expired
    if (now - sessionTime > SESSION_TIMEOUT) {
      clearAdminAuth();
      return { isAuthenticated: false, timestamp: 0 };
    }
    
    // Update timestamp to extend session
    sessionStorage.setItem('candela_admin_timestamp', now.toString());
    
    return { 
      isAuthenticated: authFlag === 'true', 
      timestamp: sessionTime 
    };
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return { isAuthenticated: false, timestamp: 0 };
  }
}

export function clearAdminAuth(): void {
  try {
    sessionStorage.removeItem('candela_admin_auth');
    sessionStorage.removeItem('candela_admin_timestamp');
  } catch (error) {
    console.error('Error clearing admin auth:', error);
  }
}

export function setAdminAuth(): void {
  try {
    sessionStorage.setItem('candela_admin_auth', 'true');
    sessionStorage.setItem('candela_admin_timestamp', Date.now().toString());
  } catch (error) {
    console.error('Error setting admin auth:', error);
  }
}

export function getSessionTimeRemaining(): number {
  try {
    const timestamp = sessionStorage.getItem('candela_admin_timestamp');
    if (!timestamp) return 0;
    
    const sessionTime = parseInt(timestamp, 10);
    const now = Date.now();
    const elapsed = now - sessionTime;
    
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  } catch (error) {
    return 0;
  }
}

export function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}