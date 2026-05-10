import { test, expect } from "@playwright/test";
test("signup and signin endpoints return success", async ({ request }) => {

  const apiURL = process.env.E2E_API_URL || "http://localhost:3001";
  const timestamp = Date.now();
  const email = `e2e_${timestamp}@example.com`;
  const password = "TestPass123";
  const name = "E2E Test User";

  const registerResponse = await request.post(`${apiURL}/register`, {
    data: {
      name,
      email,
      password,
    },
  });

  const registerText = await registerResponse.text();
  expect(
    registerResponse.ok(),
    `register failed: ${registerResponse.status()} ${registerText}`,
  ).toBeTruthy();
  const registerBody = JSON.parse(registerText);
  expect(registerBody.message).toBe("User registered successfully");

  const loginResponse = await request.post(`${apiURL}/login`, {
    data: {
      email,
      password,
    },
  });

  const loginText = await loginResponse.text();
  expect(
    loginResponse.ok(),
    `login failed: ${loginResponse.status()} ${loginText}`,
  ).toBeTruthy();
  const loginBody = JSON.parse(loginText);
  expect(typeof loginBody.token).toBe("string");
  expect(loginBody.token.length).toBeGreaterThan(0);
});
