import type { Override } from './types.ts';

export type RouteContext<C> = Override<C, {
	'params': URLPatternResult;
	'url': URL;
}>;

export type Handler<C> = (request: Request, context: C) => Response | Promise<Response>;

export interface Route<C> {
	'handler': Handler<RouteContext<C>>;
	'method': string[];
	'pattern': URLPattern;
}

export function route<C>(routes: Route<C>[], fallback: Handler<C>): Handler<C> {
	return (request: Request, context: C) => {
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
