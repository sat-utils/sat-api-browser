/* global fetch */
const BASE_URL = process.env.REACT_APP_API_URL;

export default async (endpoint, method, token, json) => {
  const config = {
    method,
    Accept: 'application/json',
    headers: { 'content-type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(json)
  };

  if (token) {
    config.headers = { Authorization: token };
  }

  const url = new URL(endpoint, BASE_URL);

  const response = await fetch(url.toString(), config);
  let responseJSON;
  if (response.ok) {
    responseJSON = await response.json();
  } else {
    throw new Error(response.statusText);
  }
  return responseJSON;
};
