import { tsx } from '@dojo/framework/core/vdom';
import * as MarkdownIt from 'markdown-it';
const parse = require('html-dom-parser');
const md = new MarkdownIt({ html: true, breaks: true });
interface Parsed {
	name: string;
	type: 'tag'|'text'|'script'|'style'|'comment';
	data: string;
	attribs: any;
	children: Parsed[];
}

//function lb(item: string) { return <span>{item}<br /></span> }
const mdFn: any = {
	br: () => <br />,
	hr: () => <hr />,
	code: (o: Parsed) => <code>{...toEls(o)}</code>,
	details: (o: Parsed) => <details>{...toEls(o)}</details>,
	summary: (o: Parsed) => <summary>{...toEls(o)}</summary>,
	address: (o: Parsed) => <address>{...toEls(o)}</address>,
	blockquote: (o: Parsed) => <blockquote>{...toEls(o)}</blockquote>,
	cite: (o: Parsed) => <cite>{...toEls(o)}</cite>,
	span: (o: Parsed) => <span>{...toEls(o)}</span>,
	strong: (o: Parsed) => <strong>{...toEls(o)}</strong>,
	em: (o: Parsed) => <em>{...toEls(o)}</em>,
	b:  (o: Parsed) => <b>{...toEls(o)}</b>,
	i:  (o: Parsed) => <i>{...toEls(o)}</i>,
	h1: (o: Parsed) => <h1>{...toEls(o)}</h1>,
	h2: (o: Parsed) => <h2>{...toEls(o)}</h2>,
	h3: (o: Parsed) => <h3>{...toEls(o)}</h3>,
	h4: (o: Parsed) => <h4>{...toEls(o)}</h4>,
	del:(o: Parsed) => <del>{...toEls(o)}</del>,
	pre: (o: Parsed) => <pre>{...toEls(o)}</pre>,
	ol: (o: Parsed) => <ol>{...toEls(o)}</ol>,
	ul: (o: Parsed) => <ul>{...toEls(o)}</ul>,
	li: (o: Parsed) => <li>{...toEls(o)}</li>,
	p:  (o: Parsed) => <p>{...toEls(o)}</p>,
	a:  (o: Parsed) => <a class="ext" target="_blank" rel="noopener noreferrer" href={o.attribs.href}>
		{...(toEls(o) || [o.attribs.href])}
	</a>,
	img:(o: Parsed) => <img class="ext" alt={o.attribs.alt ? o.attribs.alt : ' '} src={o.attribs.src} />,

}
function toEls(o: Parsed): any[] {
	var a: any = [];
	if (o.hasOwnProperty('data') && !!o.data) { a.push(o.data) }
	if (!!o.children.length) { a = a.concat(o.children).map(tagToEl) }
	return a
}
function tagToEl(o: Parsed) {
	if (o.type === 'text') { return o.data }
	if (o.type === 'tag' && mdFn.hasOwnProperty(o.name)) {
		return mdFn[o.name](o)
	}
	return ''
}

export default function i18nMarkdown(messages: any) {
	const o: any = {};
	for (let k in messages) {
		const markHTML = md.render(messages[k]);
		o[k] = parse(markHTML).map((o: any) => o.type === 'text' ? o.data : tagToEl(o))
	}
	return o
}
