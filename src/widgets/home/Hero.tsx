import { tsx, create } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import icache from '@dojo/framework/core/middleware/icache';
//import Link from '@dojo/framework/routing/Link';
import { systemLocale } from "@dojo/framework/i18n/i18n";
import i18n from '@dojo/framework/core/middleware/i18n';
import Select from '@dojo/widgets/select';
import i18nMarkdown from '../common/md';
import { LINKS, STATICLINKS, ACTION } from '../constants';
import bundle from '../../nls/';
import * as css from './Hero.m.css';

const hero = require('../assets/covidCarteretTeaser.jpg');

const factory = create({ i18n, theme, icache });
export default factory(function Hero({ middleware: { i18n, theme, icache } }) {
	const { messages } = i18n.localize(bundle);
	const msg = i18nMarkdown(messages);
	const themedCss = theme.classes(css);
	const d = Date.now();
	const m: any = messages;
	const actionItems = ACTION.map((k) => {
		const label = m.hasOwnProperty(`see_${k}`) ? m[`see_${k}`] : k;
		return { label, value: k }
	});

	const getSelectLinks: any = () => {
		const { locale = systemLocale } = i18n.get() || {locale: systemLocale};
		const baseLocale = locale.split('-')[0];
		let links = Object.keys(LINKS);
		if (baseLocale === 'en' || baseLocale === 'fr') {
			const o = {
				en: [
					'us','us_west','us_east','en','cn','mx','br','ve',
					'za','dz','ng','eg','it','fr','de','es','pk'
				],
				fr: [
					'fr','es','it','dz','ng','eg','de','en',
					'us','us_west','us_east','cn','pk','za','mx','br','ve'
				]
			}
			links = links.sort((a: string, b: string) => {
				return o[baseLocale].indexOf(a) > o[baseLocale].indexOf(b) ? 1 : -1
			})
		}
		return links.map((k) => {
			const label = m.hasOwnProperty(`region_${k}`) ? m[`region_${k}`] : k;
			return { label, value: LINKS[k] }
		})
	}

	const getDefaultLinks: any = () => {
		const { locale = systemLocale } = i18n.get() || {locale: systemLocale};
		const baseLocale = locale.split('-')[0];
		if (locale === 'en-US') { return LINKS.us }
		return LINKS.hasOwnProperty(baseLocale) ? LINKS[baseLocale] :
			{default: 'https://redaktor.ushahidi.io', help: 'https://redaktor.ushahidi.io'};
	};

	const state = icache.get<{ [index: string]: string }>('state') || {
		mode: 'map',
		regionlinks: getDefaultLinks(),
		action: 'default'
	};


	const getLink: any = () => {
		const { regionlinks } = state;
		console.log(regionlinks);
		const key: any = !state.action ? 'default' : state.action;
		let link = !regionlinks[key] ? state.action : regionlinks[key];
		if (state.mode === 'data' && link.substr(-3) === 'map') {
			link = `${link.substr(0, link.length-3)}data`;
		} else if (state.mode === 'map' && link.substr(-4) === 'data') {
			link = `${link.substr(0, link.length-4)}map`;
		}
		return link
	}
	const directLink = (v: any) => () => icache.set('state', { ...state, action: v });
	const getNav: any = () => {
		const { regionlinks } = state;
		const wClasses = {'@dojo/widgets/select': {
			root: [themedCss.select], dropdown: [themedCss.selectDropdown]
		}};
		return [
			<Select options={getSelectLinks()} label={messages.regionLabel} value={state.regionlinks} classes={wClasses}
				getOptionLabel={(option: any) => option.label}
				getOptionValue={(option: any) => option.value}
				onChange={(option: any) => {
					if (!regionlinks || regionlinks.default !== option.value.default) {
						icache.set('state', { ...state, regionlinks: option.value })}
					}
				}
			/>,
			<Select options={actionItems} label={messages.seeLabel} value={state.action} classes={wClasses}
				getOptionLabel={(option: any) => option.label}
				getOptionValue={(option: any) => option.value}
				onChange={(option: any) => icache.set('state', { ...state, action: option.value })}
			/>
		]
	}
	const getSubNav = () => {
		return ['register', 'login', 'enterNeed', 'enterOffer', 'enterNeighbourhood'].map((s) => {
			return <a classes={[themedCss.build]} onclick={directLink(STATICLINKS[s])}>{msg[s]}</a>
		})
	}

	return (
		<div>
			<section key={d} styles={{ backgroundImage: `url(${hero})` }} classes={[themedCss.root]}>
				<h1 classes={[themedCss.headline]}>{msg.heroTitle}</h1>
				<nav classes={[themedCss.buttonContainer]}>
					{...getNav()}
					<a href="#ushahidi" classes={[themedCss.btnDown, themedCss.btnDown1]} onclick={(e) => {
						e.preventDefault()
						window.scrollTo(0,448);}
					}></a>
				</nav>
				<div classes={[themedCss.textContainer]}>
					<div classes={[themedCss.text]}>{msg.heroContent1}</div>
					<div classes={[themedCss.text]}>{msg.heroContent2}</div>
				</div>
			</section>
			<div classes={[themedCss.frameContainer]}>
				<div classes={[themedCss.frameLinks]}>
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
					width="32px" height="32px" viewBox="0 0 540 540" style="enable-background:new 0 0 32 32;"
					classes={[themedCss.svg, state.mode === 'map' ? themedCss.active : '']}
					onclick={() => icache.set('state', { ...state, mode: 'map' })}>
						<g>
							<path d="M242.606,0C142.124,0,60.651,81.473,60.651,181.955c0,40.928,13.504,
						78.659,36.31,109.075l145.646,194.183L388.252,291.03   c22.808-30.416,36.31-68.146,
						36.31-109.075C424.562,81.473,343.089,0,242.606,0z M242.606,303.257   c-66.989,
						0-121.302-54.311-121.302-121.302c0-66.989,54.313-121.304,121.302-121.304c66.991,0,
						121.302,54.315,121.302,121.304   C363.908,248.947,309.598,303.257,242.606,303.257z" />
						</g>
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32"
					viewBox="0 0 20 20" classes={[themedCss.svg, state.mode === 'data' ? themedCss.active : '']}
					onclick={() => icache.set('state', { ...state, mode: 'data' })}>
					  <path d="M7 15h12v2H7zm0-6h12v2H7zm0-6h12v2H7z"/>
					  <circle cx="3" cy="4" r="2"/>
					  <circle cx="3" cy="10" r="2"/>
					  <circle cx="3" cy="16" r="2"/>
					</svg>
					<a classes={[themedCss.svg, themedCss.extLink]} target="_blank" rel="noopener noreferrer" href={getLink()}>
					App
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1850 1850" width="32" height="32">
						<g transform="matrix(1,0,0,-1,30.372881,1426.9492)">
							<path
								 d="M 1408,608 V 288 Q 1408,169 1323.5,84.5 1239,0 1120,0 H 288 Q 169,0 84.5,84.5 0,
								 169 0,288 v 832 Q 0,1239 84.5,1323.5 169,1408 288,1408 h 704 q 14,0 23,-9 9,-9 9,
								 -23 v -64 q 0,-14 -9,-23 -9,-9 -23,-9 H 288 q -66,0 -113,-47 -47,-47 -47,-113 V 288 q 0,
								 -66 47,-113 47,-47 113,-47 h 832 q 66,0 113,47 47,47 47,113 v 320 q 0,14 9,23 9,9 23,
								 9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 384,864 V 960 q 0,-26 -19,-45 -19,-19 -45,-19 -26,
								 0 -45,19 L 1507,1091 855,439 q -10,-10 -23,-10 -13,0 -23,10 L 695,553 q -10,10 -10,
								 23 0,13 10,23 l 652,652 -176,176 q -19,19 -19,45 0,26 19,45 19,19 45,19 h 512 q 26,
								 0 45,-19 19,-19 19,-45 z" />
						</g>
					</svg>
					</a>
					{...getNav()}
					{...getSubNav()}
				</div>
				<iframe id="ushahidi" classes={[themedCss.frame]} name="ushahidi"
					src={getLink()} frameborder="0" allowfullscreen
				/>
				<a href="#ushahidi" classes={[themedCss.btnDown, themedCss.btnDown2]} onclick={(e) => {
					e.preventDefault()
					window.scrollTo(0,1100);}
				}></a>
			</div>
		</div>
	);
});
