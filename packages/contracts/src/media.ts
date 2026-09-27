export type MediaVariantDTO = {
	src: string;
	width: number;
	height?: number;
};

export type MediaDTO = {
	kind: "external" | "managed";
	src: string;
	alt: string;
	width?: number;
	height?: number;
	variants?: readonly MediaVariantDTO[];
};
