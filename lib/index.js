import Debug from 'sketch-debugger';
import Core from './core';
import HttpRequest from './http-request';

export const FetchCore = Core;

export const handleResponses = fn => {
  const responses = SFHttpRequestUtils.getResponses();
  if (typeof fn !== 'function' || !responses) {
    return;
  }
  // Loop through responses and pass down two callbacks,
  //  one with the ALWAYS postfix and one with the relevant
  //  postfix according the the response success
  for (let key in responses) {
    const response = responses[key];
    const callback = response.callback;
    fn(`${callback}.ALWAYS`, response);
    if (response.result == 'error') {
      fn(`${callback}.FAILURE`, response);
    } else {
      fn(`${callback}.SUCCESS`, response);
    }
  }
}

// Main fetch function
export default function (url, options = {}) {
  // We need an URL to be able to create request instance
  if (!url) {
    return;
  }
  // Initiate and return request class instance
  const request = new HttpRequest();
  const defaultOptions = {method: 'GET'};
  request.setUrl(url);
  request.setOptions(Object.assign({}, defaultOptions, options));
  return request;
}