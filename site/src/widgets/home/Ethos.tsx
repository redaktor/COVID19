import { tsx, create } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import i18n from '@dojo/framework/core/middleware/i18n';
import i18nMarkdown from '../common/md';
import bundle from '../../nls/';
import Card from '../card/Card';

import * as css from './Ethos.m.css';

const factory = create({ i18n, theme });
export default factory(function Ethos({ middleware: { i18n, theme } }) {
	const { messages } = i18n.localize(bundle);
	const msg = i18nMarkdown(messages);
	const themedCss = theme.classes(css);

	return (
		<section classes={[themedCss.root]}>
			<Card classes={{ 'dojo.io/Card': { root: [themedCss.ethosPoint], content: [themedCss.ethosContent] } }}>
				<div>{msg.infoTextMain1}</div>
			</Card>
			<Card classes={{ 'dojo.io/Card': { root: [themedCss.ethosPoint], content: [themedCss.ethosContent] } }}>
				<div>{msg.infoTextMain2}</div>
			</Card>
			<Card classes={{ 'dojo.io/Card': { root: [themedCss.ethosPoint], content: [themedCss.ethosContent] } }}>
				<div>{msg.infoTextMain3}</div>
			</Card>
		</section>
	);
});
