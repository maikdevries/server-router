export interface Route {
	'method': string[];
	'pattern': URLPattern;
	'handler': (request: Request) => Response | Promise<Response>;
}

export default function route(
	routes: Route[],
	fallback: (request: Request) => Response | Promise<Response>,
): (request: Request) => Response | Promise<Response> {
	return (request: Request) => {
		for (const route of routes) {
			const match = route.pattern.exec(request.url);

			if (match && route.method.includes(request.method)) return route.handler(request);
		}

		return fallback(request);
	};
}
