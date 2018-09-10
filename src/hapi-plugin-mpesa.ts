import { Server, Request, RouteOptions } from 'hapi';

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
}

const mpesaHapi: IPlugin = {
  name: 'mpesaHapi',
  register: (server: Server, options: IMpesaPluginOptions, next?: Function) => {
    if (!options) {
      throw new Error('HAPI Server requires options.');
    }
    server.route({
      method: ['GET', 'POST'],
      path: options.path || '/graphql',
      vhost: options.vhost || undefined,
      options: options.route || {},
      handler: async (request: Request, h) => {
        try {
          await console.log(request, h)
          return {}
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
          return {}
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

    if (next) {
      next();
    }
  },
};

export { mpesaHapi };