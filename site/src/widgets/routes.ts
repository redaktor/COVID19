import { RouteConfig } from '@dojo/framework/routing/interfaces';

export default [
	{
		path: 'home',
		outlet: 'home',
		defaultRoute: true
	},
	{
		path: 'blog',
		outlet: 'blog',
		children: [
			{
				path: '{path}',
				outlet: 'blog-post'
			}
		]
	},
	{
		path: 'playground',
		outlet: 'playground'
	},
	{
		path: 'playground/{example}/{type}',
		outlet: 'playground-example',
		defaultParams: {
			type: 'demo'
		}
	},
	{
		path: 'roadmap',
		outlet: 'roadmap'
	},
	{
		path: 'community',
		outlet: 'community'
	}
] as RouteConfig[];
