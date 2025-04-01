import { createRequestHandler } from '@tanstack/react-start/server'

import type { AstroGlobal } from 'astro'
import { createAppRouter } from './router'

export async function handleSsrRequest(astroContext: AstroGlobal) {
	const router = createAppRouter(astroContext)

	const getServerRouter = () => router

	console.log(astroContext.request.url)

	const handler = createRequestHandler({
		request: new Request(
			astroContext.request.url.replace('.html', ''),
			astroContext.request,
		),
		createRouter: getServerRouter,
	})

	// trigger the handler, which loads the router for SSR
	// ref: https://github.com/TanStack/router/blob/main/packages/react-start-server/src/defaultRenderHandler.tsx
	const response = await handler(({ router, responseHeaders, request }) => {
		if (router.state.redirect) {
			return astroContext.redirect(
				router.state.redirect.to!,
				router.state.redirect.statusCode,
			)
		}
		return null
	})

	if (response) return { response, getServerRouter, scriptHtml: '' }

	// inject scripts for dehydrated router
	const scriptHtml = await Promise.all(
		router.serverSsr?.injectedHtml ?? [],
	).then((htmls) => htmls.join(''))

	return { response: null, getServerRouter, scriptHtml }
}
