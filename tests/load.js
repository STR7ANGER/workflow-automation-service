import http from "k6/http";
export const options = {
  vus: 20,
  duration: "30s",
  thresholds: { http_req_duration: ["p(95)<500"] },
};
export default () =>
  http.get(`${__ENV.API_URL ?? "http://localhost:4000"}/health`);
