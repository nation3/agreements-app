import { ethers, providers } from 'ethers';
export async function fetchEnsAddress({
	provider,
	name,
}: {
	provider: providers.BaseProvider;
	name: string;
}): Promise<string | null> {
	const address = await provider.resolveName(name);

	try {
		return address ? ethers.utils.getAddress(address) : null;
	} catch (_error) {
		return null;
	}
}