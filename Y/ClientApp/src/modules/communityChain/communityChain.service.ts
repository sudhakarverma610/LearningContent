import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommunityChainService {
  constructor(private http: HttpClient) { }

  sendInvite(data) {
    const requestbody = {
      friends: data
    };
    return this.http.post('/api/referral', requestbody);
  }

  getCommunityChainLink() {
    return this.http.get('/api/getReferralLink');
  }
}
