/**
 * An empty object type that accepts no properties.
 *
 * Equivalent to `{}` but explicit in intent.
 */
export type Empty = Record<never, never>;

/**
 * Merges `A` with `B`, where `B` takes precedence for overlapping keys.
 *
 * @internal
 */
type Override<A, B> = Omit<A, keyof B> & B;

/**
 * A request handler that processes an HTTP request with supplemental context data.
 *
 * @template C - Context properties available within this handler, defaults to {@link Empty}
 */
export type Handler<C = Empty> = (request: Request, context: C) => Response | Promise<Response>;

/**
 * An HTTP request method with `'*'` serving as wildcard.
 */
export type Method = '*' | 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

/**
 * A route definition that maps request properties to a request handler.
 */
export interface Route<C = Empty> {
	/**
	 * The handler that is called when the request matches the route.
	 */
	'handler': Handler<RouteContext<C>>;
	/**
	 * The HTTP methods the request method must match.
	 */
	'method': Method[];
	/**
	 * The route pattern the request URL must match.
	 */
	'pattern': URLPattern;
}

/**
 * Represents the context properties available within the matched route's handler.
 *
 * @template C - Context properties to merge with route-specific properties, which take precedence on overlapping keys.
 */
export type RouteContext<C> = Override<C, {
	/**
	 * The results of matching the request URL to the route pattern.
	 */
	'params': URLPatternResult;
	/**
	 * The parsed {@link URL} of the request.
	 */
	'url': URL;
}>;

/**
 * Combines an ordered list of routes and a fallback handler into a single request handler.
 *
 * @template C - Context properties available within the matched route's handler, defaults to {@link Empty}
 *
 * @example Basic usage
 * ```ts
 * import { route, type RouteContext } from '@maikdevries/server-router';
 *
 * interface Context {
 * 	'uuid': string;
 * }
 *
 * const router = route<Context>(
 * 	[
 * 		{
 * 			'method': ['GET'],
 * 			'pattern': new URLPattern({ 'pathname': '/uuid' }),
 * 			'handler': (request, context: RouteContext<Context>) => Response.json({ 'uuid': context.uuid }),
 * 		},
 * 	],
 * 	() => new Response('404 Not Found', { 'status': 404 }),
 * );
 *
 * const app = (request: Request) => router(request, { 'uuid': self.crypto.randomUUID() });
 * ```
 */
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
