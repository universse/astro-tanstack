import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { dataQueries } from '~/pages/_app/queries'

export const Route = createFileRoute('/ssr_/no-hydration')({
	loader: async ({ context: { astroContext, queryClient } }) => {
		await queryClient.ensureQueryData(dataQueries.ssr(astroContext))
	},

	component: Component,
})

function Component() {
	const { data } = useQuery(dataQueries.ssr())

	return (
		<div>
			<div>Server-side rendered, no hydration</div>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	)
}
