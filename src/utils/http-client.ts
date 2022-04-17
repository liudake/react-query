const BASE_URL = "https://api.uomg.com";

const HEADERS = {
  "Content-Type": "application/json",
};

export interface ReqData {
  [x: string]: any;
}

export interface ReqConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: ReqData;
  handleError?: (error: any) => any;
}

class HttpClient {
  baseUrl: string;
  constructor() {
    this.baseUrl = BASE_URL;
  }

  stringify = (data) => {
    return JSON.stringify(data);
  };

  fetch = async ({ url, data, method }: ReqConfig) => {
    const reqOptions = {
      body: this.stringify(data),
      method,
      headers: HEADERS,
    };
    const parseUrl = `${this.baseUrl}${url}`;
    let res = { succ: false, data: null } as ReqData;
    try {
      const response = await fetch(parseUrl, reqOptions);
      res.data = await response.json();
      if (!response.ok) {
        throw new Error(res.data.error);
      }
      res.succ = true;
    } catch (err) {
      res.data = err;
      res.succ = false;
    }
    if (!res.succ) {
      throw res.data;
    }

    return res.data;
  };
}

const httpClient = new HttpClient();
export default httpClient;
