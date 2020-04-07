import { tsx, create } from '@dojo/framework/core/vdom';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import Link from '@dojo/framework/routing/Link';

import bundle from '../../nls/';
import * as css from './Footer.m.css';

const rLogo = require('../assets/redaktorlogo.svg');
const externalLink = require('../assets/external-link.svg');

const factory = create({ theme, i18n });

export default factory(function Footer({ middleware: { theme, i18n } }) {
	const { messages } = i18n.localize(bundle);
	const themedCss = theme.classes(css);
	const lang = (locale: string) => (e: Event) => { e.preventDefault(); i18n.set({ locale }); }

	return (
		<footer classes={themedCss.root}>
			<div classes={themedCss.wrapper}>
				<div classes={themedCss.content}>
					<div classes={themedCss.contentRow}>
						<div classes={themedCss.copyright}>
							<img classes={[themedCss.logo]} alt="logo" src={rLogo} />
							{`© ${new Date().getFullYear()} redaktor & contributors`}
						</div>
						<div classes={themedCss.linksWrapper}>
							<div classes={themedCss.linksRow}>
								<div classes={themedCss.links}>
									<div classes={themedCss.title}>{messages.docs}</div>
									<a target="_blank"
										rel="noopener noreferrer"
										href="https://www.ushahidi.com/features"
										classes={css.link}
									>
										{messages.toolOverview}
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>
									<a target="_blank"
										rel="noopener noreferrer"
										href="https://redaktor.ushahidi.io/posts/5005"
										classes={css.link}
									>
										{messages.blogpost}
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>
									<a target="_blank"
										rel="noopener noreferrer"
										href="https://redaktor.me"
										classes={css.link}
									>
										Home
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>
								</div>
								<div classes={themedCss.links}>
									<div classes={themedCss.title}>{messages.community}</div>
									<a target="_blank"
										rel="noopener noreferrer"
										href="https://www.contributor-covenant.org/version/1/4/code-of-conduct/"
										classes={css.link}
									>
										{messages.codeOfConduct}
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="https://github.com/redaktor/"
										classes={css.link}
									>
										GitHub
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="https://socialhub.activitypub.rocks/c/software/redaktor-me/22"
										classes={css.link}
									>
										Discourse
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="https://chaos.social/web/accounts/235880"
										classes={css.link}
									>
										<span class='color-ap'>ActivityPub<br />
											@sl007@mastodon.social @redaktor@chaos.social
											<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
										</span>
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="https://twitter.com/sl007"
										classes={css.link}
									>
										<span class='color-twitter'>
											Twitter<br /> sl007@twitter.com
											<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
										</span>
									</a>
									<Link to="examples" classes={css.link}>
										Discord: contact us
									</Link>
								</div>
								<div classes={[themedCss.links, themedCss.linksLast]}>
									<div classes={themedCss.title}>{messages.versions}</div>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="https://github.com/redaktor/COVID19"
										classes={css.link}
									>
										v0.9
										<img classes={themedCss.externalLink} alt="externalLink" src={externalLink} />
									</a>


									<div classes={themedCss.title}>{messages.languages}</div>
									<a href="#" classes={css.link} onclick={ lang('en') }>
										English
									</a>
									<a href="#" classes={css.link} onclick={ lang('fr') }>
										Francais
									</a>
									<a href="#" classes={[css.link, css.inactive]} onclick={ lang('es') }>
										Español
									</a>
									<a href="#" classes={css.link} onclick={ lang('en') }>
										Deutsch
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
});
