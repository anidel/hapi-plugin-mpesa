import { Server, Request, RouteOptions } from "hapi";
// import { c2b_payment_request_template } from "./c2b_payment_template";
import { doMpesaLogin } from "./mpesaLogin";

export interface IRegister {
  (server: Server, options: any): void;
}

export interface IPlugin {
  name: string;
  version?: string;
  register: IRegister;
}

export interface IMpesaPluginOptions {
  path: string;
  vhost?: string;
  route?: RouteOptions;
  mpesaOptions: MpesaOptions;
}

export interface MpesaOptions {
  mpesaAuth: {
    username: string;
    password: string;
  };
  commandId: string;
  mpesaUrl: string;
}

const mpesaLogin = async (options: MpesaOptions): Promise<string> => {
  // mpesa login and token
  console.log(options);

  const sessionId = await doMpesaLogin({
    url: options.mpesaUrl,
    username: options.mpesaAuth.username,
    password: options.mpesaAuth.password
  });

  console.log(sessionId);
  return await sessionId;
};

const mpesaHapiPlugin: IPlugin = {
  name: "mpesaHapi",
  register: async (
    server: Server,
    options: IMpesaPluginOptions,
    next?: Function
  ) => {
    let sessionId: string;

    console.log("registering HAPI Mpesa Plugin...");
    if (!options) {
      throw new Error("HAPI Mpesa plugin requires options. Check code.");
    }

    // Register payment route
    server.route({
      method: ["GET", "POST"],
      path: options.path,
      handler: async (request: Request, h) => {
        try {
          await console.log(request, h, sessionId);
          return {};
          // const { graphqlResponse, responseInit } = await runHttpQuery(
          //   [request, h],
          //   {
          //     method: request.method.toUpperCase(),
          //     options: options.graphqlOptions,
          //     query:
          //       request.method === 'post'
          //         ? // TODO type payload as string or Record
          //           (request.payload as any)
          //         : request.query,
          //     request: convertNodeHttpToRequest(request.raw.req),
          //   },
          // );

          // const response = h.response(graphqlResponse);
          // Object.keys(responseInit.headers).forEach(key =>
          //   response.header(key, responseInit.headers[key]),
          // );
          // return response;
        } catch (error) {
          return {};
          //   if ('HttpQueryError' !== error.name) {
          //     throw Boom.boomify(error);
          //   }

          //   if (true === error.isGraphQLError) {
          //     const response = h.response(error.message);
          //     response.code(error.statusCode);
          //     response.type('application/json');
          //     return response;
          //   }

          //   const err = new Boom(error.message, { statusCode: error.statusCode });
          //   if (error.headers) {
          //     Object.keys(error.headers).forEach(header => {
          //       err.output.headers[header] = error.headers[header];
          //     });
          //   }
          //   // Boom hides the error when status code is 500
          //   err.output.payload.message = error.message;
          //   throw err;
          // }
        }
      }
    });

    // Login into MPESA and retrieve session token
    sessionId = await mpesaLogin(options.mpesaOptions);

    if (next) {
      next();
    }
  }
};

export { mpesaHapiPlugin };
