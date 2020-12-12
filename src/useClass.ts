import { useMemo } from 'react'

/**
 *
 * @param classes array of classes for concatenation
 */
export const useClass = (
	...classes: Array<string | null | void | undefined | false>
): string => {
	const concated = useMemo(() => {
		return classes.filter(Boolean).join(' ')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, classes)

	return concated
}