import * as soapRequest from "easy-soap-request";
import * as XMLParser from "react-xml-parser";

import { c2b_login_request_template } from "./c2b_login_template";

export interface MPESALoginParams {
  url: string;
  username?: string;
  password?: string;
}

interface XMLDataItem {
  name: string;
  attributes: object;
  value: string;
}

const headers = {
  "user-agent": "altech-sombabien-app",
  "Content-Type": "text/xml;charset=UTF-8"
};

export const doMpesaLogin = async (
  options: MPESALoginParams
): Promise<string> => {
  console.log(options);

  const soapLoginXML = c2b_login_request_template({
    username: options.username,
    password: options.password
  });

  console.log("Sending SOAP request to: ", options.url);
  const { response } = await soapRequest(options.url, headers, soapLoginXML);
  console.log("Got response: ", response);
  const { body, statusCode } = response;

  const parsedBody = XMLParser().parseFromString(body);
  const sessionId: string = parsedBody
    .getElementsByTagName("name")
    .filter((dataItem: XMLDataItem) => dataItem.name === "SessionId")
    .map((sessionItem: XMLDataItem) => sessionItem.value)[0];

  console.log("MPESA login - status code: ", statusCode);
  console.log("MPESA login - body response: ", body);

  return sessionId;
};
