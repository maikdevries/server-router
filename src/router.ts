type Override<T, U> = Omit<T, keyof U> & U;

type RouteContext<C> = Override<C, {
	'params': URLPatternResult;
	'url': URL;
}>;

type BaseHandler = (request: Request) => Response | Promise<Response>;
type Handler<C> = (request: Request, context: C) => Response | Promise<Response>;

export interface Route<C> {
	'handler': Handler<RouteContext<C>>;
	'method': string[];
	'pattern': URLPattern;
}

export default function route<C>(context: C, routes: Route<C>[], fallback: Handler<C>): BaseHandler {
	return (request: Request) => {
		for (const route of routes) {
			const match = route.pattern.exec(request.url);

			if (match && route.method.includes(request.method)) {
				return route.handler(request, {
					...context,
					'params': match,
					'url': new URL(request.url),
				});
			}
		}

		return fallback(request, context);
	};
}
