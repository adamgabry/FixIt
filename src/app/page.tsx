import { getIssuesFacade } from '@/modules/issue/facade';

import { MapPageClient } from './map-page-client';

const Home = async () => {
	const issues = await getIssuesFacade();

	return <MapPageClient initialIssues={issues} />;
};

export default Home;
