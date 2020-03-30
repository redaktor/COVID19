import { tsx, create } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
//import Link from '@dojo/framework/routing/Link';
import i18n from '@dojo/framework/core/middleware/i18n';
import i18nMarkdown from '../common/md';
import bundle from '../../nls/';
import * as css from './Hero.m.css';

const hero = require('../assets/covidCarteretTeaser.jpg');

const factory = create({ i18n, theme });
export default factory(function Hero({ middleware: { i18n, theme } }) {
	const { messages } = i18n.localize(bundle);
	const msg = i18nMarkdown(messages);
	const themedCss = theme.classes(css);
	var d = Date.now();
	return (
		<section key={d} styles={{ backgroundImage: `url(${hero})` }} classes={[themedCss.root]}>
			<h1 classes={[themedCss.headline]}>{msg.heroTitle}</h1>
			<a target="_blank" rel="noreferrer" href="https://redaktor.ushahidi.io" class={themedCss.build}>
				<h3>{messages.heroButtonText}</h3>
			</a>
			<div classes={[themedCss.textContainer]}>
				<div classes={[themedCss.text]}>{msg.heroContent1}</div>
				<div classes={[themedCss.text]}>{msg.heroContent2}</div>
			</div>
		</section>
	);
});
