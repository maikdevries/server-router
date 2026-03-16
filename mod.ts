/**
 * This module provides a flexible approach to routing incoming HTTP requests to handlers in a type-safe manner. Each
 * route defines the request properties it matches on and the request handler it dispatches to. Handlers receive
 * supplemental context data merged with route-specific properties. A fallback handler covers requests that do not match
 * a registered route. The type system ensures at compile-time that all required context properties are provided.
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
 *
 * @module
 */

export { route, type RouteContext } from '@self/core';
