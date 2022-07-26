import React from "react";
import { Alert } from "react-bootstrap";

interface LoginAlertInterface {
  message: string;
}

export const LoginPageAlert = (props: LoginAlertInterface) => {
  return (
    <Alert variant="info" className="text-center w-30">
      {props.message}
    </Alert>
  );
};
