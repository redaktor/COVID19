import { tsx, create } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import intersection from '@dojo/framework/core/middleware/intersection';
import Card from '../card/Card';
import bundle from '../../nls/';
import i18n from '@dojo/framework/core/middleware/i18n';
import i18nMarkdown from '../common/md';
import * as css from './Features.m.css';

function details(e: Event) {
	try {
		const details = document.querySelectorAll("details");
		details.forEach((detail) => {
			if (detail !== e.target) {
				detail.removeAttribute("open");
			}
		})
	} catch(e) {}
}

const factory = create({ i18n, theme, intersection });

export default factory(function Features({ middleware: { i18n, theme, intersection } }) {
	const { messages } = i18n.localize(bundle);
	const msg = i18nMarkdown(messages);
	const themedCss = theme.classes(css);

	const { isIntersecting } = intersection.get('mapImgContainer');
	let mapImg = null;
	if (isIntersecting) {
		const map = require('../assets/map.gif');
		mapImg = <img classes={[themedCss.mapImg]} alt="map" src={map} />
	}

	return (
		<div classes={[themedCss.root]}>
			<section id="help" key="help" classes={[themedCss.featureRow, themedCss.featureOne]}>
				<h1 classes={[themedCss.featureTitle]}>{msg.helpTeaser}</h1>
				<div classes={[themedCss.featureCardRight]}>
					<Card depth={4}>
						{msg.helpText}
					</Card>
				</div>
			</section>
			<section classes={[themedCss.featureRow, themedCss.featureTwo]}>
				<div id="offer" key="offer" classes={[themedCss.featureCardLeft]}>
					<Card depth={4} classes={{ 'dojo.io/Card': { root: [themedCss.featureCardLeft] } }}>
						{msg.offerText}
					</Card>
				</div>
				<h1 classes={[themedCss.featureTitle]}>{msg.offerTeaser}</h1>
			</section>
			<section classes={[themedCss.featureRow, themedCss.featureThree]}>
				<h1 classes={[themedCss.featureTitle]}>{msg.infoTeaser}</h1>
				<div id="info" key="info" classes={[themedCss.featureCardRight]}>
					<Card depth={4} classes={{ 'dojo.io/Card': { root: [themedCss.featureCardRight] } }}>
						{msg.infoText}
						<h3 class="muted">{messages.countryDefault} – {messages.countryTitle}</h3>
						<details onclick={(e) => details(e)} open="open">
							<summary>{msg.country1}</summary>
							{msg.country1Text}
						</details>
						<details onclick={(e) => details(e)}>
							<summary>{msg.country2}</summary>
							{msg.country2Text}
						</details>
						<details onclick={(e) => details(e)}>
							<summary>{msg.country3}</summary>
							{msg.country3Text}
						</details>
						<details onclick={(e) => details(e)}>
							<summary>{msg.country4}</summary>
							{msg.country4Text}
						</details>
						<details onclick={(e) => details(e)}>
							<summary>{msg.country5}</summary>
							{msg.country5Text}
						</details>
						<br />
						{msg.infoTextMain}
					</Card>
				</div>
			</section>
			<nav id="links" key="links" classes={[themedCss.featureRow, themedCss.featureBottom]}>
				<div key="mapImgContainer">
					<a target="_blank" href="https://redaktor.ushahidi.io">{mapImg}</a>
				</div>
				<strong>Klicke den Knopf in der App und fülle die Karte</strong>
				<a target="_blank" href="https://redaktor.ushahidi.io" classes={[themedCss.btnPlus]}></a>
			</nav>
		</div>
	);
});
