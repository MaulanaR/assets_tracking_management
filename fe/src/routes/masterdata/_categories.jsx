import { redirect } from "react-router";
import Api from "@/utils/axios/api";
import ReactLazyWithSuspense from "@/utils/reactLazyWithSuspense";

/** @type {import('react-router').RouteObject[]} */
const routes = [
	{
		path: "categories",
		children: [
			{
				index: true,
				loader: () => redirect("/masterdata/categories/list"),
			},
			{
				path: "list",
				element: ReactLazyWithSuspense(
					async () =>
						await import("@/pages/masterdata/categories/content-categories"),
				),
				children: [
					{
						path: "filter",
						element: ReactLazyWithSuspense(
							async () =>
								await import("@/pages/masterdata/categories/filter-category"),
						),
					},
				],
			},
			{
				path: "create",
				element: ReactLazyWithSuspense(
					async () =>
						await import("@/pages/masterdata/categories/create-category"),
				),
			},
			{
				path: "edit/:id",
				element: ReactLazyWithSuspense(
					async () => await import("@/pages/masterdata/categories/edit-category"),
				),
			},
			{
				path: "detail/:id",
				element: ReactLazyWithSuspense(
					async () =>
						await import("@/pages/masterdata/categories/detail-category"),
				),
			},
			{
				path: "delete/:id",
				action: async ({ params }) => {
					const { id } = params;
					try {
						const res = await Api().delete(`/api/v1/categories/${id}`);
						return res;
					} catch (error) {
						console.error("Error deleting category:", error);
					}
				},
			},
			{
				path: "*",
				element: ReactLazyWithSuspense(() => import("@/pages/notfound")),
			},
		],
	},
];

export default routes;
