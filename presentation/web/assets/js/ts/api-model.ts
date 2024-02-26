/// <reference path='./third_party_definitions/_definitions.ts' />

namespace Api {

  export interface Session {
    id: number;
    alias: string;
    lastLifeProffRequestTime: number; // in seconds, since epoch (a.k.a. "unix time")
  }

  export interface Answer {
    status: string;
    details?: string;
  }
}
