import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { authQueries } from '~/pages/_app/queries'
import { tryCatch } from '~/pages/_app/try-catch'

export const Route = createFileRoute('/_auth-csr')({
	beforeLoad: async ({ context: { astroContext, queryClient } }) => {
		const { data, error } = await tryCatch(
			queryClient.fetchQuery(authQueries.get(astroContext)),
		)

		if (error || !data.user) {
			throw redirect({ to: '/csr/login' })
		}
	},

	component: Component,
})

function Component() {
	return <Outlet />
}
