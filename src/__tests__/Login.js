/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

describe("Given that I am a user on login page", () => {
  beforeEach(() => {
    document.body.innerHTML = LoginUI();
  });

  describe("When I do not fill fields and I click on employee button Login In", () => {
    test("Then It should render Login page", () => {
      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then It should render Login page", () => {
      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an Employee in the app and render Bills page", async () => {
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      const onNavigate = jest.fn();
      let PREVIOUS_LOCATION = "";
      const store = {
        login: jest.fn().mockResolvedValue({ jwt: "dummy_jwt" }),
      };

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });

      const form = screen.getByTestId("form-employee");
      fireEvent.submit(form);

      // Wait for the asynchronous operations to complete
      await waitFor(() => {
        expect(store.login).toHaveBeenCalledWith(
          JSON.stringify({
            email: inputData.email,
            password: inputData.password,
          })
        );

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify({
            type: "Employee",
            email: inputData.email,
            password: inputData.password,
            status: "connected",
          })
        );

        // Ensure that onNavigate is called with the correct route
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
      });
    });
  });
  
  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should render Login page", () => {
      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then it should render Login page", () => {
      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an HR admin in the app and render HR dashboard page", async () => {
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      const onNavigate = jest.fn();
      let PREVIOUS_LOCATION = "";
      const store = {
        login: jest.fn().mockResolvedValue({ jwt: "dummy_jwt" }),
      };

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      expect(inputPasswordUser.value).toBe(inputData.password);

      const form = screen.getByTestId("form-admin");
      fireEvent.submit(form);

      // Wait for the asynchronous operations to complete
      await waitFor(() => {
        expect(store.login).toHaveBeenCalledWith(
          JSON.stringify({
            email: inputData.email,
            password: inputData.password,
          })
        );

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify({
            type: "Admin",
            email: inputData.email,
            password: inputData.password,
            status: "connected",
          })
        );

        // Ensure that onNavigate is called with the correct route
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Dashboard"]);
      });
    });
  });
});
