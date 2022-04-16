const BASE_URL = "https://api.uomg.com";

const HEADERS = {
  "Content-Type": "application/json",
};

class HttpClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  stringify = (data) => {
    return JSON.stringify(data);
  };

  fetch = async ({ url, data, method }) => {
    const reqOptions = {
      body: this.stringify(data),
      method,
      headers: HEADERS,
    };
    const parseUrl = `${this.baseUrl}${url}`;
    let res = { succ: false, data: null };
    try {
      const response = await fetch(parseUrl, reqOptions);
      res.data = await response.json();
      if (!response.ok) {
        console.log("res.data", res.data);
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
