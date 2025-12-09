import { getIssuesFacade } from '@/modules/issue/facade';
import { getSession } from '@/modules/auth/server';

import { MapPageClient } from './map-page-client';

const Home = async () => {
	const issues = await getIssuesFacade();
	const session = await getSession();
	const currentUserId = session?.user?.id ?? null;

	return <MapPageClient initialIssues={issues} currentUserId={currentUserId} />;
};

export default Home;
