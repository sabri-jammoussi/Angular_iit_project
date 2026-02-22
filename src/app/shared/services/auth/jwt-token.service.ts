import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({ providedIn: "root" })
export class JwtTokenService {
  constructor(private jwtHelper: JwtHelperService) {}

  /**
   * Decode the stored JWT and return the full payload object, or null if missing / invalid.
   */
  decodeToken(): any | null {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    return this.jwtHelper.decodeToken(token);
  }

  /**
   * Check whether the stored token is expired (or missing).
   */
  isTokenExpired(): boolean {
    const token = localStorage.getItem("auth_token");
    if (!token) return true;
    return this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Return the expiration Date of the stored token, or null.
   */
  getTokenExpirationDate(): Date | null {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    return this.jwtHelper.getTokenExpirationDate(token);
  }

  // ── Convenience helpers that read Microsoft WS-* claim URIs ──

  getUserName(): string {
    const p = this.decodeToken();
    return (
      this.getClaim(p, [
        "name",
        "given_name",
        "unique_name",
        "preferred_username",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
      ]) || "User"
    );
  }

  getUserSurname(): string {
    const p = this.decodeToken();
    return (
      this.getClaim(p, [
        "family_name",
        "family",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
      ]) || ""
    );
  }

  getUserFullName(): string {
    const name = this.getUserName();
    const surname = this.getUserSurname();
    return surname ? `${name} ${surname}` : name;
  }

  getUserEmail(): string {
    const p = this.decodeToken();
    return (
      this.getClaim(p, [
        "email",
        "emailAddress",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      ]) || ""
    );
  }

  getUserRole(): string {
    const p = this.decodeToken();
    return (
      this.getClaim(p, [
        "role",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
      ]) || ""
    );
  }

  /** Return the first non-empty value from a list of payload keys. */
  private getClaim(payload: any, keys: string[]): string | undefined {
    if (!payload) return undefined;
    for (const k of keys) {
      if (payload[k]) return payload[k];
    }
    return undefined;
  }
}
