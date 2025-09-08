
// types/xml2js.d.ts
declare module 'xml2js' {
  export class Builder {
    constructor(options?: any);
    buildObject(obj: any): string;
  }
}
