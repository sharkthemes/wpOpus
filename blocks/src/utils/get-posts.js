// get all posts
export async function getAllPosts(postsPerPage = -1) {
	try {
		const data = await wp.apiFetch({
			path: "/wp/v2/posts?per_page=" + postsPerPage,
		});
		return data;
	} catch (error) {
		return error;
	}
}

// get posts by categories
export async function getPostsByCategory(categoryId, postsPerPage = -1) {
	if ( categoryId ) {
		try {
			const data = await wp.apiFetch({
				path:
					"/wp/v2/posts?categories=" + categoryId + "&per_page=" + postsPerPage,
			});
			return data;
		} catch (error) {
			return error;
		}
	}
	return null;
}

// get posts by ids
export async function getPostsByIds(postIds) {
	if ( postIds ) {
		try {
			const data = await wp.apiFetch({
				path: "/wp/v2/posts?include=" + postIds.join(","),
			});
			return data;
		} catch (error) {
			return error;
		}
	}
	return null;
}

// get all categories
export async function getAllCategories() {
	try {
		const data = await wp.apiFetch({
			path: "/wp/v2/categories/",
		});
		return data;
	} catch (error) {
		return error;
	}
}

// get categories by ids
export async function getCategoriesByIds(catIds) {
	if ( catIds ) {
		try {
			const data = await wp.apiFetch({
				path: "/wp/v2/categories?include=" + catIds.join(","),
			});
			return data;
		} catch (error) {
			return error;
		}
	}
	return null;
}

// get all pages
export async function getAllPages() {
	try {
		const data = await wp.apiFetch({
			path: "/wp/v2/pages/",
		});
		return data;
	} catch (error) {
		return error;
	}
}

// get pages by ids
export async function getPagesByIds(pageIds) {
	if ( pageIds ) {
		try {
			const data = await wp.apiFetch({
				path: "/wp/v2/pages?include=" + pageIds.join(","),
			});
			return data;
		} catch (error) {
			return error;
		}
	}
	return null;
}

// get featured image by image ids
export async function getImageById(imageId) {
	if ( imageId ) {
		try {
			const data = await wp.apiFetch({
				path: "/wp/v2/media/" + imageId,
			});
			return data;
		} catch (error) {
			return error;
		}
	}
	return null;
}
