type Handler = (request: Request) => Response | Promise<Response>;

export interface Route {
	'method': string[];
	'pattern': URLPattern;
	'handler': Handler;
}

export default function route(routes: Route[], fallback: Handler): Handler {
	return (request: Request) => {
		for (const route of routes) {
			const match = route.pattern.exec(request.url);

			if (match && route.method.includes(request.method)) return route.handler(request);
		}

		return fallback(request);
	};
}
