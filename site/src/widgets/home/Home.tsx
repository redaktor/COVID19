import { tsx, create } from '@dojo/framework/core/vdom';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';

import Ethos from './Ethos';
import Features from './Features';
import Hero from './Hero';
//import GetGoing from './GetGoing';

import * as css from './Home.m.css';

const factory = create({ i18n, theme });

export default factory(function Home({ middleware: { i18n, theme } }) {
	const themedCss = theme.classes(css);
	const { locale } = i18n.get() || {locale: 'en'};
	return (
		<main lang={ locale } classes={[themedCss.root]}>
			<Hero />
			<Features />
			<Ethos />
		</main>
	);
});
