import { useState, useEffect } from "@wordpress/element";
import { getImageById, getCategoriesByIds } from "../utils/get-posts";

export function FeaturedImage({ imageId, altText }) {
	const [image, setImage] = useState(null);

	useEffect(() => {
		getImageById(imageId)
			.then((imageData) => {
				setImage(imageData.source_url);
			})
			.catch((error) => {
                console.log( error );
            });
	}, [imageId]);

	return image ? <img src={image} alt={altText} /> : null;
}

export function FeaturedCategories({ catIds }) {
	const [cats, setCats] = useState(null);

	useEffect(() => {
		getCategoriesByIds(catIds)
			.then((categories) => {
				setCats(categories);
			})
			.catch((error) => {
                console.log( error );
            });
	}, [catIds]);

	return cats?.map((cat) => (
		<a key={cat.id} href={cat.link}>{cat.name}</a>
	));
}
