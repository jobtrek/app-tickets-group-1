import * as v from "valibot";

// Search-param schemas for the paginated ticket lists.
// Every field is optional with a default, so navigating to these routes
// (e.g. from the Navbar) doesn't have to spell out pagination params, while
// loaders/components still read fully-resolved values.

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

// Accepts a single value or a repeated param and always yields a string[].
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
});

export const dashboardSearchSchema = v.object({
	page: numberField(1),
	size: numberField(20),
	sort: sortField,
	status: stringArray,
	level: stringArray,
});
