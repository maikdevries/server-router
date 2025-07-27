export interface Context {
	'params': URLPatternResult;
	'url': URL;
}

type BaseHandler = (request: Request) => Response | Promise<Response>;
type Handler = (request: Request, context: Context) => Response | Promise<Response>;

export interface Route {
	'handler': Handler;
	'method': string[];
	'pattern': URLPattern;
}

export default function route(routes: Route[], fallback: BaseHandler): BaseHandler {
	return (request: Request) => {
		for (const route of routes) {
			const match = route.pattern.exec(request.url);

			if (match && route.method.includes(request.method)) {
				return route.handler(request, {
					'params': match,
					'url': new URL(request.url),
				});
			}
		}

		return fallback(request);
	};
}
