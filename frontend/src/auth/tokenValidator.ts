/**
 * Enhanced JWT token validation for frontend
 */

interface JWTPayload {
  exp: number;
  iat: number;
  iss: string;
  aud: string;
  sub: string;
  scope?: string;
  role?: string;
}

export class TokenValidator {
  private readonly expectedIssuer: string;
  private readonly expectedAudience: string;
  private readonly clockSkewTolerance: number = 300; // 5 minutes
  
  constructor(issuer: string, audience: string) {
    this.expectedIssuer = issuer;
    this.expectedAudience = audience;
  }
  
  validateToken(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
    try {
      const payload = this.decodeToken(token);
      
      if (!payload) {
        return { valid: false, error: 'Invalid token format' };
      }
      
      const validationResult = this.validatePayload(payload);
      if (!validationResult.valid) {
        return validationResult;
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: `Token validation failed: ${error}` };
    }
  }
  
  private decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
  
  private validatePayload(payload: JWTPayload): { valid: boolean; error?: string } {
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < (now - this.clockSkewTolerance)) {
      return { valid: false, error: 'Token has expired' };
    }
    
    if (payload.iat && payload.iat > (now + this.clockSkewTolerance)) {
      return { valid: false, error: 'Token not yet valid' };
    }
    
    if (payload.iss !== this.expectedIssuer) {
      return { valid: false, error: 'Invalid issuer' };
    }
    
    if (payload.aud !== this.expectedAudience) {
      return { valid: false, error: 'Invalid audience' };
    }
    
    if (!payload.sub) {
      return { valid: false, error: 'Missing subject' };
    }
    
    return { valid: true };
  }
  
  isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const threshold = thresholdMinutes * 60;
    
    return payload.exp < (now + threshold);
  }
  
  getTokenClaims(token: string): JWTPayload | null {
    const validation = this.validateToken(token);
    return validation.valid ? validation.payload! : null;
  }
}

export const tokenValidator = new TokenValidator(
  'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_XXXXXXXXX',
  'agi-portal-client'
);
