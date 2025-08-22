import type { Empty, Override } from './types.ts';

type Method = '*' | 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

export type RouteContext<C> = Override<C, {
	'params': URLPatternResult;
	'url': URL;
}>;

export type Handler<C = Empty> = (request: Request, context: C) => Response | Promise<Response>;

export interface Route<C = Empty> {
	'handler': Handler<RouteContext<C>>;
	'method': Method[];
	'pattern': URLPattern;
}

export function route<C = Empty>(routes: Route<C>[], fallback: Handler<C>): Handler<C> {
	return (request: Request, context: C) => {
		for (const route of routes) {
			const match = route.pattern.exec(request.url);

			if (match && route.method.some((m) => m === request.method || m === '*')) {
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
