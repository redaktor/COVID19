export interface Link {
	default: string;
	help: string;
	needshelp?: string;
	incidents?: string;
	offer?: string;
}
export interface Links {
	[k: string]: Link;
}
