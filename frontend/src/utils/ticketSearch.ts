import * as v from "valibot";

const numberField = (fallback: number) =>
	v.optional(
		v.fallback(
			v.pipe(
				v.union([v.number(), v.string()]),
				v.transform(Number),
				v.number(),
			),
			fallback,
		),
		fallback,
	);

const stringArray = v.optional(
	v.fallback(
		v.pipe(
			v.union([v.array(v.string()), v.string()]),
			v.transform((value) => (Array.isArray(value) ? value : [value])),
		),
		[],
	),
	[],
);

const sortField = v.optional(v.fallback(v.string(), "desc"), "desc");

export const ticketHistorySearchSchema = v.object({
	page: numberField(1),
	size: numberField(20),
	sort: sortField,
	status: stringArray,
	search: v.optional(v.fallback(v.string(), ""), ""),
});

export const dashboardSearchSchema = v.object({
	page: numberField(1),
	size: numberField(20),
	sort: sortField,
	status: stringArray,
	level: stringArray,
	search: v.optional(v.fallback(v.string(), ""), ""),
});
