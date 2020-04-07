import { Links } from './interfaces';
const _B = 'https://redaktor.ushahidi.io/'
const _S = 'savedsearches/';

export const ACTION = ['default', 'help', 'needshelp', 'incidents', 'info'];
export const STATICLINKS: any = {
	register: `${_B}register`,
	login: `${_B}login`,
	enterIncident: `${_B}posts/create/1`,
	enterNeed: `${_B}posts/create/2`,
	enterOffer: `${_B}posts/create/3`,
	enterNeighbourhood: `${_B}posts/create/6`,
	//Füge solidarische Nachbarschaften hinzu.
}
export const LINKS: Links = {
	de: {
		default: `${_B}${_S}53/map`,
		help: `${_B}${_S}52/map`,
		needshelp: `${_B}${_S}61/map`,
		incidents: `${_B}${_S}62/map`
	},
	it: {
		default: `${_B}${_S}56/map`,
		help: `${_B}${_S}57/map`,
		needshelp: `${_B}${_S}65/map`,
		incidents: `${_B}${_S}66/map`
	},
	es: {
		default: `${_B}${_S}69/map`,
		help: `${_B}${_S}70/map`,
		needshelp: `${_B}${_S}71/map`,
		incidents: `${_B}${_S}72/map`
	},
	fr: {
		default: `${_B}${_S}54/map`,
		help: `${_B}${_S}55/map`,
		needshelp: `${_B}${_S}63/map`,
		incidents: `${_B}${_S}64/map`
	},
	us: {
		default: `${_B}${_S}77/map`,
		help: `${_B}${_S}78/map`,
		needshelp: `${_B}${_S}79/map`,
		incidents: `${_B}${_S}80/map`
	},
	us_west: {
		default: `${_B}${_S}81/map`,
		help: `${_B}${_S}82/map`,
		needshelp: `${_B}${_S}83/map`,
		incidents: `${_B}${_S}84/map`
	},
	us_east: {
		default: `${_B}${_S}85/map`,
		help: `${_B}${_S}86/map`,
		needshelp: `${_B}${_S}87/map`,
		incidents: `${_B}${_S}88/map`
	},
	en: {
		default: `${_B}${_S}58/map`,
		help: `${_B}${_S}59/map`,
		needshelp: `${_B}${_S}67/map`,
		incidents: `${_B}${_S}68/map`
	},
	cn: {
		default: `${_B}${_S}73/map`,
		help: `${_B}${_S}73/map`,
		needshelp: `${_B}${_S}75/map`,
		incidents: `${_B}${_S}76/map`
	},
	pk: {
		default: `${_B}${_S}89/map`,
		help: `${_B}${_S}90/map`,
		needshelp: `${_B}${_S}91/map`,
		incidents: `${_B}${_S}92/map`
	},
	za: {
		default: `${_B}${_S}94/map`,
		help: `${_B}${_S}95/map`,
		needshelp: `${_B}${_S}96/map`,
		incidents: `${_B}${_S}97/map`
	},
	dz: {
		default: `${_B}${_S}98/map`,
		help: `${_B}${_S}99/map`,
		needshelp: `${_B}${_S}100/map`,
		incidents: `${_B}${_S}101/map`
	},
	ng: {
		default: `${_B}${_S}102/map`,
		help: `${_B}${_S}103/map`,
		needshelp: `${_B}${_S}104/map`,
		incidents: `${_B}${_S}105/map`
	},
	eg: {
		default: `${_B}${_S}106/map`,
		help: `${_B}${_S}107/map`,
		needshelp: `${_B}${_S}108/map`,
		incidents: `${_B}${_S}109/map`
	},
	ve: {
		default: `${_B}${_S}110/map`,
		help: `${_B}${_S}111/map`,
		needshelp: `${_B}${_S}112/map`,
		incidents: `${_B}${_S}113/map`
	},
	br: {
		default: `${_B}${_S}114/map`,
		help: `${_B}${_S}115/map`,
		needshelp: `${_B}${_S}116/map`,
		incidents: `${_B}${_S}117/map`
	},
	mx: {
		default: `${_B}${_S}118/map`,
		help: `${_B}${_S}119/map`,
		needshelp: `${_B}${_S}120/map`,
		incidents: `${_B}${_S}121/map`
	}
}
